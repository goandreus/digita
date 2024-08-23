import {useCallback, useContext, useEffect, useState} from 'react';
import {useAccounts} from './useAccounts';
import {useLastUser, useLoading, useUserInfo} from '@hooks/common';
import {useNavigation, useRoute} from '@react-navigation/native';
import {OperationStackContext} from '@contexts/OperationStackContext';
import {
  IAffiliateInterop,
  IAffilliatePayload,
  IDataError,
  IInteroperabilityInfo,
  affiliateInteroperability,
  disaffiliation,
  getInteroperabilityInfo,
  updateAffiliation,
} from '@services/Interoperability';
import {hasContactsAccessPermissions} from '@utils/permissions';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {operationType} from '../components/successAffiliation';
import useStoreOTP, {storeOTP} from '@hooks/useStoreOTP';

export const useAffiliatePhone = ({
  operationName,
}: {
  operationName: operationType;
}) => {
  const {accounts} = useAccounts();
  const lastUser = useLastUser();
  const navigation = useNavigation<NativeStackNavigationProp<{route: {}}>>();
  const {
    userInteroperabilityInfo,
    setUserEntrepreneurAccount,
    setUserInteroperabilityInfo,
    user,
  } = useUserInfo();
  const route = useRoute();
  const person = user?.person;
  const operationStackContext = useContext(OperationStackContext);
  const cellphoneNumber = lastUser.lastUser.cellphoneNumber;
  const [defaultOpenPicker, setDefaultOpenPicker] = useState(false);
  const currentAccountSaving =
    accounts?.find(
      item =>
        item?.operationUId?.toString() ===
        userInteroperabilityInfo?.operationUId,
    ) ?? accounts?.[0];

  const [originAccount, setOriginAccount] = useState(
    operationName === 'updateAffiliation'
      ? null
      : userInteroperabilityInfo
      ? currentAccountSaving
      : accounts?.[0],
  );

  const hasSavings = accounts ? accounts?.length > 0 : false;
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(-1);
  const [successModal, setSuccessModal] = useState<
    IAffiliateInterop & {isOpen: boolean}
  >({
    isOpen: false,
    accountSaving: '',
    accountSavingName: '',
    cellPhone: '',
    dateFormatted: '',
    email: '',
    hourFormatted: '',
  });
  const [showConfirmButton, setShowConfirmButton] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<IDataError & {isOpen: boolean}>({
    isOpen: false,
    title: '',
    content: '',
    button: '',
  });

  const closeErrorModal = () => {
    setErrorModal({
      isOpen: false,
      title: '',
      content: '',
      button: '',
    });
  };

  const [tokenModal, setTokenModal] = useState<boolean>(false);
  const {timeUntilNextToken} = useStoreOTP();
  const {setLastTokenUsed, lastTokenUsed} = useLoading();

  const formatedTimeToken = timeUntilNextToken
    ? timeUntilNextToken >= 10
      ? `${timeUntilNextToken}`
      : `0${timeUntilNextToken}`
    : null;

  useEffect(() => {
    if (tokenModal && timeUntilNextToken === 0) {
      setTokenModal(false);
    }
  }, [tokenModal, timeUntilNextToken, setTokenModal]);

  const handleGoToHome = useCallback(
    async (typeOperation: operationType) => {
      operationStackContext.disableUseFocusEffect = true;
      if (typeOperation !== 'disaffiliation') {
        const userInteropInfo = await getInteroperabilityInfo({
          user: `0${person?.documentTypeId}${person?.documentNumber}`,
          screen: route.name,
        });
        if (userInteropInfo.isSuccess === true) {
          Object.keys(userInteropInfo?.data ?? {}).length !== 0 &&
            setUserInteroperabilityInfo(
              userInteropInfo.data as IInteroperabilityInfo,
            );
        }
      } else {
        setUserInteroperabilityInfo(null);
      }
      navigation.navigate('MainScreen');
      closeErrorModal();
    },
    [navigation, operationStackContext],
  );

  const handleGoToPay = useCallback(async () => {
    try {
      const contactsAccessPermission = await hasContactsAccessPermissions();
      operationStackContext.disableUseFocusEffect = true;
      setSuccessModal({
        isOpen: false,
        accountSaving: '',
        accountSavingName: '',
        cellPhone: '',
        dateFormatted: '',
        email: '',
        hourFormatted: '',
      });
      navigation.navigate('OperationsStack', {
        screen: 'PayWithPhone',
        params: {
          disablePhoneAlert: {
            isOpen: false,
            title: '',
            content: '',
            button: '',
          },
          showTokenIsActivated: false,
          contactsAccessPermission,
          from: 'affiliatePhone',
        },
      });
      closeErrorModal();
      const userInteropInfo = await getInteroperabilityInfo({
        user: `0${person?.documentTypeId}${person?.documentNumber}`,
        screen: route.name,
      });
      if (userInteropInfo.isSuccess === true) {
        Object.keys(userInteropInfo?.data ?? {}).length !== 0 &&
          setUserInteroperabilityInfo(
            userInteropInfo.data as IInteroperabilityInfo,
          );
      }
    } catch (error) {
      console.log(error);
    }
  }, [navigation, operationStackContext]);

  const handleAffiliation = async () => {
    if (lastTokenUsed === storeOTP.getOtpState().currentToken) {
      setTokenModal(true);
      return;
    }

    const payload: IAffilliatePayload = {
      accountSavingName: originAccount?.productName as string,
      accountSaving: originAccount?.accountCode as string,
      cci: originAccount?.accountCci as string,
      operationUId: originAccount?.operationUId?.toString() as string,
    };

    try {
      setLoading(true);
      const response = await affiliateInteroperability({
        payload,
        user: `0${person?.documentTypeId}${person?.documentNumber}`,
        screen: route.name,
      });
      if (!response.isSuccess) {
        const {title, content, button} = response.data;
        setErrorModal({
          isOpen: true,
          title,
          content,
          button,
        });
      } else {
        const data = response.data;
        setSuccessModal({isOpen: true, ...data});
        setLastTokenUsed(storeOTP.getOtpState().currentToken!);
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: '¡Uy, ocurrió un problema!',
        content:
          'Estamos trabajando para solucionarlo. Si persiste contáctanos al (01) 313 5000.',
        button: 'Aceptar',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAffiliation = async () => {
    if (originAccount === null) {
      setErrorModal({
        isOpen: true,
        title: 'Esta cuenta ya está afiliada',
        content:
          'Si deseas puedes cambiar la cuenta de\nahorros afiliada a tu celular',
        button: 'Entiendo',
      });
    } else {
      const payload: IAffilliatePayload = {
        accountSavingName: originAccount.productName as string,
        accountSaving: originAccount.accountCode as string,
        currentAccountSaving: currentAccountSaving.accountCode as string,
        cci: originAccount.accountCci as string,
        operationUId: originAccount.operationUId?.toString() as string,
      };

      if (lastTokenUsed === storeOTP.getOtpState().currentToken) {
        setTokenModal(true);
        return;
      }

      try {
        setLoading(true);
        const response = await updateAffiliation({
          payload,
          user: `0${person?.documentTypeId}${person?.documentNumber}`,
          screen: route.name,
        });
        if (!response.isSuccess) {
          const {title, content, button} = response.data;
          setErrorModal({
            isOpen: true,
            title,
            content,
            button,
          });
        } else {
          const data = response.data;
          setSuccessModal({isOpen: true, ...data});
          setLastTokenUsed(storeOTP.getOtpState().currentToken!);
        }
      } catch (error) {
        setErrorModal({
          isOpen: true,
          title: '¡Uy, ocurrió un problema!',
          content:
            'Estamos trabajando para solucionarlo. Si persiste contáctanos al (01) 313 5000.',
          button: 'Aceptar',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDisaffiliation = async () => {
    if (lastTokenUsed === storeOTP.getOtpState().currentToken) {
      setTokenModal(true);
      return;
    }

    const payload = {
      accountSavingName: userInteroperabilityInfo?.accountSavingName as string,
      accountSaving: userInteroperabilityInfo?.accountSaving as string,
    };
    setShowConfirmButton(false);

    try {
      setLoading(true);
      const response = await disaffiliation({
        payload,
        user: `0${person?.documentTypeId}${person?.documentNumber}`,
        screen: route.name,
      });
      if (!response.isSuccess) {
        const {title, content, button} = response.data;
        setErrorModal({
          isOpen: true,
          title,
          content,
          button,
        });
      } else {
        const data = response.data;
        navigation.setParams({
          operationType: 'disaffiliation',
        });
        setUserEntrepreneurAccount({
          isCreated: false,
        });
        setSuccessModal({isOpen: true, ...data});

        setLastTokenUsed(storeOTP.getOtpState().currentToken!);
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: '¡Uy, ocurrió un problema!',
        content:
          'Estamos trabajando para solucionarlo. Si persiste contáctanos al (01) 313 5000.',
        button: 'Aceptar',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    defaultOpenPicker,
    hasSavings,
    cellphoneNumber,
    step,
    loading,
    successModal,
    showConfirmButton,
    errorModal,
    tokenModal,
    formatedTimeToken,
    formData: {
      originAccount,
      setOriginAccount,
    },
    setDefaultOpenPicker,
    setStep,
    handleAffiliation,
    handleUpdateAffiliation,
    handleDisaffiliation,
    handleGoToHome,
    handleGoToPay,
    setShowConfirmButton,
    closeErrorModal,
  };
};
