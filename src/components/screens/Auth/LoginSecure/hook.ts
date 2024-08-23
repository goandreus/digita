import { useEffect, useState } from 'react';
import { useLastUser, useTimer, useUserInfo } from '@hooks/common';
import useUser from '@hooks/useUser';
import { activateRemoteConfig, getRemoteValue } from '@utils/firebase';
import { Dynatrace } from '@dynatrace/react-native-plugin';
import {
  disaffiliation,
  getIsAllowedToAttempt,
  registerEvent,
} from '@services/User';
import { padStart } from 'lodash';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import { LoginSecureScreenProps } from '@navigations/types';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';
import { ERROR_MAP } from '@managers/AmplitudeManager/ErrorMap';

export const useLoginSecure = ({ navigation, route }: LoginSecureScreenProps) => {
  const { actions } = useUser();
  const { restart } = useTimer();

  const { purgeUserState } = useUserInfo();
  const { cleanLastUser } = useLastUser();


  const { documentNumber, documentType } = route.params;

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [titleModal, setTitleModal] = useState<string>('');
  const [contentModal, setContentModal] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showOpenSessionModal, setShowOpenSessionModal] =
    useState<boolean>(false);
  const [openSessionInfo, setOpenSessionInfo] = useState({
    title: "",
    content: "",
    button: ""
  });

  const hideModal = () => setOpenModal(false);
  const showConfirmationModal = () => {
    AH.track("CF App - Cambio de Usuario", {
      'Número de Documento': AH.autoGenerate('documentNumber'),
      'Etapa': 'Inicio'
    })
    setShowConfirmation(true);
  }
  const hideConfirmationModal = () => {
    AH.track("CF App - Clic en Botones", {
      'Nombre de la Vista': AH.autoGenerate('Nombre de la Vista'),
      'Nombre del Botón': "Cancelar",
      'Proceso Consultado': "General - Cambio de Usuario",
    });
    setShowConfirmation(false)
  };
  const [showNormalErrorAlert, setShowNormalErrorAlert] =
    useState<boolean>(false);

  const onPressDisconect = () => {
    try {
      AH.track("CF App - Cambio de Usuario", {
        'Número de Documento': AH.autoGenerate('documentNumber'),
        'Etapa': 'Confirmación'
      })
      disaffiliation({
        screen: route.name,
        documentType,
        documentNumber,
      });
      setShowConfirmation(false);
      cleanLastUser();
      purgeUserState();
      setTimeout(() => {
        navigation.reset({
          index: 1,
          routes: [{ name: 'Home' }, { name: 'LoginNormal' }],
        });
      }, 300);
    } catch (err: any) {
      throw new Error(err);
    }
  };

  const handleOnSubmit = async (
    values: { password: string },
    resetForm: () => void,
  ) => {
    await activateRemoteConfig();
    const mandatory_update = getRemoteValue('mandatory_update').asBoolean();
    if (mandatory_update) {
      navigation.navigate('InfoUpdateAppScreen');
      return;
    }

    try {
      AH.identifyUser(`${padStart(documentType.toString(), 2, '0')}11111111`);
      Dynatrace.identifyUser(
        `${padStart(documentType.toString(), 2, '0')}${documentNumber}-Login`,
      );

      navigation.navigate('LoadingScreen');

      const resultLogin = await actions.login(
        documentType,
        documentNumber,
        values.password,
      );
      console.log(new Date().toString());
      console.log("LOADING... - " + resultLogin.type)


      if (resultLogin.type === 'SUCCESS') {
        navigation.navigate('MainTab');
      } else if (resultLogin.type === 'DEVICE_IS_NOT_SECURE') {
        const personId = await registerEvent(
          documentType,
          documentNumber,
          '000000000',
          'LoginSecureScreen-index.tsx',
        );
        const getIsAllowedToAttemptResult = await getIsAllowedToAttempt(
          personId,
          `0${documentType}${documentNumber}`,
          route.name,
        );
        if (getIsAllowedToAttemptResult.isSuccess === false) {
          if (getIsAllowedToAttemptResult.error !== undefined) {
            switch (getIsAllowedToAttemptResult.error.type) {
              case 'LIMIT_ATTEMPTS':
                AH.track("CF App - Error Encontrado", {
                  "Nombre de la Vista": AH.autoGenerate('Nombre de la Vista'),
                  "Nombre del Error": ERROR_MAP['LOGIN']['DEVICE_IS_NOT_SECURE_LIMIT_ATTEMPTS'],
                  "Fuente del Error": 'Proceso interno'
                });
                navigation.dispatch(
                  StackActions.replace('InfoDNINotRecognizedMaxAttempt'),
                );
                break;
              case 'UNKNOWN':
              case 'OTHER':
                AH.track("CF App - Error Encontrado", {
                  "Nombre de la Vista": AH.autoGenerate('Nombre de la Vista'),
                  "Nombre del Error": ERROR_MAP['LOGIN']['DEVICE_IS_NOT_SECURE_UNKNOWN_ERROR'],
                  "Fuente del Error": 'Proceso interno'
                });
                navigation.pop();
            }
          } else {
            AH.track("CF App - Error Encontrado", {
              "Nombre de la Vista": AH.autoGenerate('Nombre de la Vista'),
              "Nombre del Error": ERROR_MAP['LOGIN']['DEVICE_IS_NOT_SECURE_UNKNOWN_ERROR'],
              "Fuente del Error": 'Proceso interno'
            });
            navigation.pop();
          }
        } else {
          navigation.dispatch(
            StackActions.replace('RegisterIdentityInfo', {
              flowType: 'LOGIN',
              password: values.password,
              documentNumber: documentNumber,
              documentType: documentType,
              gender: resultLogin.person.gender,
              stepProps: {
                max: 2,
                current: 0,
              },
            }),
          );
        }
      } else if (resultLogin.type === 'MAX_ATTEMPTS') {
        navigation.navigate('InfoMaxAttemps');
      } else if (resultLogin.type === 'INVALID_SESSION') {
        setOpenModal(true);
        setTitleModal(resultLogin.title);
        setContentModal(resultLogin.content);
        navigation.pop();
      } else if (resultLogin.type === 'SESSION_ACTIVE_ANOTHER_DEVICE') {
        setShowOpenSessionModal(true);
        setOpenSessionInfo({
          title: resultLogin.title,
          content: resultLogin.content,
          button: resultLogin.button
        });
        navigation.pop();
      } else if (resultLogin.type === 'ACCESS_BLOCKED') {
        navigation.navigate('InfoAccessBlocked');
      } else if (
        resultLogin.type === 'IS_NOT_AN_MEMBER_AND_DOESNT_HAVE_ACTIVE_PRODUCTS'
      ) {
        resetForm();
        navigation.replace('InfoWithoutActiveProduct', {
          gender: resultLogin.gender,
        });
      } else if (
        resultLogin.type === 'IS_NOT_AN_MEMBER_AND_HAS_ACTIVE_PRODUCTS'
      ) {
        navigation.replace('InfoRegisterInLogin');
      } else if (resultLogin.type === 'ACCESS_BLOCKED_BY_MP') {
        setShowNormalErrorAlert(true);
        navigation.pop();
      } else if (resultLogin.type === 'UNKNOWN_ERROR_BY_MP') {
        navigation.pop();
      } else if (resultLogin.type === 'NEED_AUTHENTICATION_BY_MP') {
        restart({ documentNumber, documentType });
        navigation.dispatch(
          StackActions.replace('RegisterOTP', {
            type: 'LOGIN',
            showMaxLimit: false,
            documentType: documentType,
            documentNumber: documentNumber,
            password: values.password,
            phoneNumberObfuscated: resultLogin.phoneOfuscated,
            emailObfuscated: resultLogin.emailOfuscated,
            channel: 'sms',
            stepProps: undefined,
            isSensitiveInfo: true,
            execRestart: false,
            trackingLogin: resultLogin.trackingLogin,
          }),
        );
      }
    } catch (error: any) {
      AH.track("CF App - Error Encontrado", {
        "Nombre de la Vista": AH.autoGenerate('Nombre de la Vista'),
        "Nombre del Error": ERROR_MAP['LOGIN']['OTHERS'],
        "Fuente del Error": 'Proceso interno'
      });
      navigation.pop();
      // Alert.alert('Error', error?.message || 'No se reconoce el error.');
    }
  };

  return {
    openModal,
    titleModal,
    contentModal,
    showConfirmation,
    hideModal,
    showConfirmationModal,
    hideConfirmationModal,
    onPressDisconect,
    handleOnSubmit,
    setShowNormalErrorAlert,
    setShowOpenSessionModal,
    showNormalErrorAlert,
    showOpenSessionModal,
    openSessionInfo,
  };
};
