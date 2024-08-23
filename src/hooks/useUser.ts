import {useCallback} from 'react';
import {login as loginService} from '@services/User';
import {useLastUser} from './common/useLastUser';
import {PersonGender} from '@navigations/types';
import {TokenRegister} from '@utils/TokenRegister';
import {useRoute} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {useUserInfo, useUserInfoPre} from './common';
//import {storage} from '@utils/secure-storage';
import {
  IInteroperabilityInfo,
  getInteroperabilityInfo,
} from '@services/Interoperability';
import {update as updateActivity} from '@features/activity';
import _ from 'lodash';
import { GetCategories } from '@services/Transactions';
import { useAppDispatch } from './useAppDispatch';
import { update } from '@features/categories';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';
import { ERROR_MAP } from '@managers/AmplitudeManager/ErrorMap';

const useUser = () => {
  const {updateLastUser} = useLastUser();
  const {setUser, setUserInteroperabilityInfo} =
    useUserInfoPre();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const screen = route.name;


  const populateUserData = useCallback(
    async (props: {
      token: string;
      firstName: string;
      cellphoneNumber: string;
      hasActiveToken: boolean;
      tokenIsInCurrentDevice: boolean;
      gender: PersonGender;
      documentNumber: string;
      documentType: number;
      personId: string;
    }): Promise<'SUCCESS'> => {
      crashlytics().log('User signed in.');
      dispatch(updateActivity({isTokenExpired: false}));
      TokenRegister.updateToken('LOGIN', props.token);

      try {
        const categories = await GetCategories({
          documentType: props.documentType,
          documentNumber: props.documentNumber,
          screenName: screen,
        });
        if (Array.isArray(categories.data) && categories.isSuccess === true)
          dispatch(update(categories.data));
      } catch (error) {}

      updateLastUser({
        document: {
          type: props.documentType,
          number: props.documentNumber,
        },
        token: props.token,
        firstName: props.firstName,
        hasActiveToken: props.hasActiveToken,
        tokenIsInCurrentDevice: props.tokenIsInCurrentDevice,
        cellphoneNumber: props.cellphoneNumber,
        personId: props.personId,
      });

      const userInteropInfo = getInteroperabilityInfo({
        user: `0${props.documentType}${props.documentNumber}`,
        screen: route.name,
      });

      let productosActivos: {[key: string]: boolean} = {};
      let creditosActivos: {[key: string]: boolean} = {};
      await Promise.all([userInteropInfo]).then(async ([interopInfo]) => {
        Object.keys(interopInfo?.data ?? {}).length !== 0
          ? setUserInteroperabilityInfo(
              interopInfo.data as IInteroperabilityInfo,
            )
          : setUserInteroperabilityInfo(null);
      });

      setUser({
        person: {
          documentNumber: props.documentNumber,
          documentTypeId: props.documentType,
          names: props.firstName,
          gender: props.gender,
        },
      });

      AH.track("CF App - Usuario Logueado", {
        "Número de Documento": props.documentNumber,
        "Tipo de Documento": "DNI",
        "Nombre": props.firstName,
        "Género": props.gender,
        "Productos Activos": Object.keys(productosActivos).map(_.upperCase),
        "Créditos Activos": Object.keys(creditosActivos).map(_.upperCase),
      });

      return 'SUCCESS';
    },
    [],
  );

  const login = useCallback(
    async (
      documentType: number,
      documentNumber: string,
      password: string,
    ):
      | Promise<
          | {
              type: 'DEVICE_IS_NOT_SECURE';
              deviceIsSecure: false;
              person: {
                gender: PersonGender;
              };
            }
          | {
              type: 'SUCCESS';
            }
          | {
              type: 'SUCCESS_DISBURSE';
            }
          | {
              type: 'SESSION_ACTIVE_ANOTHER_DEVICE';
              title: string;
              content: string;
              button: string;
            }
          | {
              type: 'INVALID_SESSION';
              title: string;
              content: string;
            }
          | {
              type: 'SESSION_ACTIVE_ANOTHER_DEVICE';
              title: string;
              content: string;
              button: string;
            }
          | {
              type: 'MAX_ATTEMPTS';
              title: string;
              content: string;
            }
          | {
              type: 'ACCESS_BLOCKED';
            }
          | {
              type: 'IS_NOT_AN_MEMBER_AND_DOESNT_HAVE_ACTIVE_PRODUCTS';
              gender: 'F' | 'M';
            }
          | {
              type: 'IS_NOT_AN_MEMBER_AND_HAS_ACTIVE_PRODUCTS';
            }
          | {
              type: 'NEED_AUTHENTICATION_BY_MP';
              emailOfuscated: string;
              phoneOfuscated: string;
              trackingLogin: string;
            }
          | {
              type: 'ACCESS_BLOCKED_BY_MP';
            }
          | {
              type: 'UNKNOWN_ERROR_BY_MP';
            }
        >
      | never => {
      analytics().setUserId(`${documentType}-${documentNumber}`)
      crashlytics().setUserId(
        `${documentType}-${documentNumber}` || 'annonymous user',
      );
      const resultLogin = await loginService(
        documentType,
        documentNumber,
        password,
        screen,
      );

      if (resultLogin.type === 'DEVICE_IS_NOT_SECURE') {
        return {
          type: 'DEVICE_IS_NOT_SECURE',
          deviceIsSecure: false,
          person: {
            gender: 'F',
          },
        };
      } else if (resultLogin.type === 'SESSION_ACTIVE_ANOTHER_DEVICE') {
        return {
          type: 'SESSION_ACTIVE_ANOTHER_DEVICE',
          title: resultLogin.title,
          content: resultLogin.content,
          button: resultLogin.button,
        };
      } else if (resultLogin.type === 'INVALID_SESSION') {
        return {
          type: 'INVALID_SESSION',
          title: resultLogin.title,
          content: resultLogin.content,
        };
      } else if (resultLogin.type === 'MAX_ATTEMPTS') {
        return {
          type: 'MAX_ATTEMPTS',
          title: resultLogin.title,
          content: resultLogin.content,
        };
      } else if (resultLogin.type === 'ACCESS_BLOCKED') {
        return {
          type: 'ACCESS_BLOCKED',
        };
      } else if (
        resultLogin.type === 'IS_NOT_AN_MEMBER_AND_DOESNT_HAVE_ACTIVE_PRODUCTS'
      ) {
        return {
          type: 'IS_NOT_AN_MEMBER_AND_DOESNT_HAVE_ACTIVE_PRODUCTS',
          gender: resultLogin.gender,
        };
      } else if (
        resultLogin.type === 'IS_NOT_AN_MEMBER_AND_HAS_ACTIVE_PRODUCTS'
      ) {
        return {
          type: 'IS_NOT_AN_MEMBER_AND_HAS_ACTIVE_PRODUCTS',
        };
      } else if (resultLogin.type === 'ACCESS_BLOCKED_BY_MP') {
        return {
          type: 'ACCESS_BLOCKED_BY_MP',
        };
      } else if (resultLogin.type === 'UNKNOWN_ERROR_BY_MP') {
        return {
          type: 'UNKNOWN_ERROR_BY_MP',
        };
      } else if (resultLogin.type === 'NEED_AUTHENTICATION_BY_MP') {
        return {
          type: 'NEED_AUTHENTICATION_BY_MP',
          phoneOfuscated: resultLogin.phoneOfuscated,
          trackingLogin: resultLogin.trackingLogin,
          emailOfuscated: resultLogin.emailOfuscated,
        };
      } else {
        const type = await populateUserData({
          documentNumber,
          documentType,
          firstName: resultLogin.firstName,
          cellphoneNumber: resultLogin.cellphoneNumber,
          gender: resultLogin.gender,
          hasActiveToken: resultLogin.hasActiveToken,
          token: resultLogin.token,
          tokenIsInCurrentDevice: resultLogin.tokenIsInCurrentDevice,
          personId: resultLogin.personId,
        });
        
        return {type};
      }
    },
    /*[canShowSavings, canShowCredits]*/[],
  );

  return {actions: {login, populateUserData}};
};

export default useUser;
