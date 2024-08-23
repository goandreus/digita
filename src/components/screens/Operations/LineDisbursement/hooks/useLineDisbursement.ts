import {storeOTP} from '@hooks/useStoreOTP';
import {useLastUser, useLoading, useUserInfo} from '@hooks/common';
import {LineDisbursementProps} from '@navigations/types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {BackHandler} from 'react-native';
import {useLineDisbursementContext} from '../context';
import {DisburseLineCredit, ListLineCredit} from '@services/CreditLine';
import {UserSavings} from '@features/userInfo';
import {getUserSavings, getUserCredits} from '@services/User';
import {getSchedulesTextFormat} from '@utils/getSchedules';

type ConfirmToExit =
  | {
      isOpen: false;
    }
  | {
      isOpen: true;
      onAccept: () => void;
    };

interface Props {
  hasSavings: boolean;
}

export const useLineDisbursement = ({hasSavings}: Props) => {
  const navigation = useNavigation<LineDisbursementProps['navigation']>();
  const route = useNavigation<LineDisbursementProps['route']>();
  const {
    step,
    setShowSuccessModal,
    terms,
    setStep,
    setTokenModal,
    updateModal,
    originAccount,
    setOriginAccountUId,
    setSuccessData,
  } = useLineDisbursementContext();
  const timerRef = useRef<any>(null);
  const {setLastTokenUsed, lastTokenUsed} = useLoading();
  const {lastUser} = useLastUser();
  const {user, setUserSavings, setUserCredits, setUserLineCredit} =
    useUserInfo();
  const [loadingFishes, setLoadingFishes] = useState(false);
  const [confirmToExit, setConfirmToExit] = useState<ConfirmToExit>({
    isOpen: false,
  });

  const closeConfirmToExit = () => setConfirmToExit({isOpen: false});

  const goBack = useCallback(() => {
    if (step > 0) return setStep(0);
    navigation.goBack();
  }, [navigation, setStep, step]);

  const isDisabled = hasSavings
    ? !terms.insurance
    : step !== 1
    ? !terms.account || !terms.nationality
    : !terms.insurance;

  const updateUserSavings = async (accountCode: string) => {
    const userSavings: UserSavings = await getUserSavings();

    // if origin account doesn't exist, look for it in updated user savings data
    if (!originAccount) {
      const newOriginAccount = [
        ...(userSavings?.savings.savings ?? []),
        ...(userSavings?.compensations.savings ?? []),
      ].find(accs => accs.accountCode === accountCode);

      if (newOriginAccount) setOriginAccountUId(newOriginAccount.operationUId);
    }
    setUserSavings(userSavings);
  };

  const updatedCredits = async () => {
    await getUserCredits().then(res => setUserCredits(res));
    await ListLineCredit({
      documentNumber: lastUser.document?.number,
      documentType: lastUser.document?.type,
    }).then(res => {
      if (res.data && res.isSuccess) setUserLineCredit(res.data);
    });
  };

  const handleSubmit = async () => {
    if (step <= 0 && !hasSavings) return setStep(1);

    try {
      // Verify if token was already used
      const tokenOTP = storeOTP.getOtpState().currentToken;
      if (lastTokenUsed === tokenOTP) {
        setTokenModal(true);
        return;
      }

      // set token expired
      setLastTokenUsed(tokenOTP!);

      // TODO: Modificar el payload para la posterior integracion
      const payload = {
        codeVerification: String(tokenOTP),
        dispositionAccount: originAccount?.accountCode ?? '',
      };

      setLoadingFishes(true);
      const res = await DisburseLineCredit({
        documentType: user?.person.documentTypeId,
        documentNumber: user?.person.documentNumber,
        screen: route.name,
        payload,
      });

      if (res?.isSuccess && res.data) {
        const data = res?.data;
        setSuccessData(data);
        setShowSuccessModal(true);
        updateUserSavings(res.data.dispositionAccount);
        updatedCredits();
      } else if (!res?.isSuccess && res?.data?.title) {
        if (res.data.content) {
          const validate = res.data;
          const {schedules, content} = getSchedulesTextFormat(validate.content);
          updateModal({
            show: true,
            title: validate.title,
            underlined: schedules,
            content,
            btnText: 'Entendido',
            onClose: () => {
              updateModal({show: false, underlined: null});
            },
          });
        } else {
          updateModal({
            show: true,
            title: res.data.title,
            content: [res.data.message],
            btnText: 'Entendido',
            onClose: () => updateModal({show: false, underlined: null}),
          });
        }
      } else {
        updateModal({
          show: true,
          title: '¡Uy, ocurrió un problema!',
          content: [
            'Por favor vuelve a intentarlo una vez más. Si el problema continúa te recomendamos intentarlo en unos minutos.',
          ],
          btnText: 'Entendido',
          onClose: () => updateModal({show: false, underlined: null}),
        });
      }
    } catch (error) {
      updateModal({
        show: true,
        title: '¡Uy, ocurrió un problema!',
        content: [
          'Por favor vuelve a intentarlo una vez más. Si el problema continúa te recomendamos intentarlo en unos minutos.',
        ],
        btnText: 'Entendido',
        onClose: () => updateModal({show: false, underlined: null}),
      });
    } finally {
      timerRef.current = setTimeout(() => {
        setLoadingFishes(false);
      }, 1000);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          goBack();
          return true;
        },
      );

      return () => backHandler.remove();
    }, [goBack]),
  );

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (/* hasSavings &&  */ e.data.action.type === 'GO_BACK') {
        e.preventDefault();
        setConfirmToExit({
          isOpen: true,
          onAccept: () => navigation.dispatch(e.data.action),
        });
      }
    });
    return () => unsubscribe();
  }, [navigation, hasSavings]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (!hasSavings) {
      id = setTimeout(() => {
        setStep(hasSavings ? 1 : 0);
      }, 500);
    }
    return () => clearTimeout(id);
  }, [hasSavings, setStep]);

  // Clear the interval when the component unmounts
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return {
    loadingFishes,
    confirmToExit,
    isDisabled,
    goBack,
    handleSubmit,
    closeConfirmToExit,
  };
};
