import {BackHandler} from 'react-native';
import {useCreditAdvice, useLoading, useUserInfo} from '@hooks/common';
import {storeOTP} from '@hooks/useStoreOTP';
import {GroupCreditContractScreenProps} from '@navigations/types';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {ContractGroupCredit} from '@services/Disbursements';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useGroupCreditContractContext} from './context';

export const useGroupCreditContract = () => {
  const navigation =
    useNavigation<GroupCreditContractScreenProps['navigation']>();
  const route = useRoute<GroupCreditContractScreenProps['route']>();
  const {
    step,
    setStep,
    showSuccessModal,
    setShowSuccessModal,
    setTokenModal,
    setSuccessData,
    updateModal,
    onCloseErrorModal,
  } = useGroupCreditContractContext();
  const {setLastTokenUsed, lastTokenUsed} = useLoading();
  const {user} = useUserInfo();
  const {updateBanners} = useCreditAdvice();
  const [loadingFishes, setLoadingFishes] = useState(false);
  const timerRef = useRef<any>(null);

  const handleSubmit = async () => {
    try {
      if (step <= 0) {
        setStep(prevStep => prevStep + 1);
        return;
      }

      // Verify if token was already used
      const tokenOTP = storeOTP.getOtpState().currentToken;
      if (lastTokenUsed === tokenOTP) {
        setTokenModal(true);
        return;
      }

      // set token expired
      setLastTokenUsed(tokenOTP!);

      const payload = {
        codeVerification: String(tokenOTP),
      };

      setLoadingFishes(true);
      const res = await ContractGroupCredit({
        documentType: user?.person.documentTypeId,
        documentNumber: user?.person.documentNumber,
        screen: route.name,
        payload,
      });

      if (res?.isSuccess && res.data) {
        const data = res?.data;
        setSuccessData(data);
        setShowSuccessModal(true);
        updateBanners({CG: false});
        /* updateUserSavings(res.data.disburseAccount);
        updateUserCredits(); */
      } else if (!res?.isSuccess && res?.data?.title) {
        updateModal({
          show: true,
          title: res.data.title,
          content: res.data.message,
          btnText: 'Entendido',
          onClose: onCloseErrorModal,
        });
      } else {
        updateModal({
          show: true,
          title: '¡Uy, ocurrió un problema!',
          content:
            'Por favor vuelve a intentarlo una vez más. Si el problema continúa te recomendamos intentarlo en unos minutos.',
          btnText: 'Entendido',
          onClose: onCloseErrorModal,
        });
      }
    } catch (error) {
      updateModal({
        show: true,
        title: '¡Uy, ocurrió un problema!',
        content:
          'Por favor vuelve a intentarlo una vez más. Si el problema continúa te recomendamos intentarlo en unos minutos.',
        btnText: 'Entendido',
        onClose: onCloseErrorModal,
      });
    } finally {
      timerRef.current = setTimeout(() => {
        setLoadingFishes(false);
      }, 2000);
    }
  };

  const goBack = useCallback(() => {
    if (step !== 0) {
      setStep(prevStep => prevStep - 1);
      return;
    }
    navigation.dispatch(StackActions.pop());
  }, [navigation, setStep, step]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (!showSuccessModal) goBack();
          return true;
        },
      );

      return () => backHandler.remove();
    }, [goBack, showSuccessModal]),
  );

  useEffect(() => {
    const id = setTimeout(() => {
      setStep(0);
    }, 500);
    return () => clearTimeout(id);
  }, [setStep]);

  // Clear the interval when the component unmounts
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return {
    loadingFishes,
    goBack,
    handleSubmit,
  };
};
