import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {BackHandler} from 'react-native';
import {useLoading, useUserInfo} from '@hooks/common';
import {IOriginsHook, useOrigins} from './useOrigins';
import {ErrorResponse} from '@global/information';
import {ownAccountsExecute, ownAccountsQuery} from '@services/Transactions';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {getUserSavings} from '@services/User';
import {OperationStackContext} from '@contexts/OperationStackContext';
import useStoreOTP, {storeOTP} from '@hooks/useStoreOTP';
export interface IFormData extends IOriginsHook {
  amountValue: number | null;
  amountValueText: string;
  setAmountValue: (amountValue: number | null) => void;
  setAmountValueText: (amountValueText: string) => void;
}

export interface ISuccessData {
  isOpen: boolean;
  data?: {
    movementId: string;
    dateTransaction: string;
    hourTransaction: string;
    email: string;
    dateTimeTransaction: string;
  };
}

interface IOwnAccountsHook {
  loading: boolean;
  loadingFishes: boolean;
  step: number;
  isBtnDisabled: boolean;
  formData: IFormData;
  successModal: ISuccessData;
  formatedTimeToken: string | null;
  tokenModal: boolean;
  setTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
  goBack: () => void;
  handleSubmit: () => Promise<void>;
  onCloseSuccessModal: () => void;
  handleGoToHome: () => void;
}

export const useOwnAccounts = (): IOwnAccountsHook => {
  const route = useRoute();
  const navigation = useNavigation();
  const {user, setUserSavings} = useUserInfo();
  const person = user?.person;
  const {lastTokenUsed, setDisplayErrorModal, setLastTokenUsed} = useLoading();
  const {
    originAccount,
    destinationSavings,
    destinationAccount,
    ...originsData
  } = useOrigins();

  const operationStackContext = useContext(OperationStackContext);
  const timerRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingFishes, setLoadingFishes] = useState(false);

  const [step, setStep] = useState(-1);
  const [amountValue, setAmountValue] = useState<number | null>(null);
  const [amountValueText, setAmountValueText] = useState<string>('');
  const [successModal, setSuccessModal] = useState<ISuccessData>({
    isOpen: false,
  });
  const [tokenModal, setTokenModal] = useState<boolean>(false);

  const isBtnDisabled =
    loading ||
    (amountValue &&
      originAccount?.balance &&
      amountValue > originAccount?.balance) ||
    !(
      destinationSavings?.length! > 0 &&
      amountValue &&
      amountValue >= 1 &&
      ((amountValue <= 10000 && originAccount?.currency === 'S/') ||
        (amountValue <= 3000 && originAccount?.currency === '$'))
    );

  const {timeUntilNextToken} = useStoreOTP();

  const formatedTimeToken = timeUntilNextToken
    ? timeUntilNextToken >= 10
      ? `${timeUntilNextToken}`
      : `0${timeUntilNextToken}`
    : null;

  useEffect(() => {
    if (tokenModal && timeUntilNextToken === 0) {
      setTokenModal(false);
    }
  }, [setTokenModal, timeUntilNextToken, tokenModal]);

  const updateUserSavings = useCallback(async () => {
    await getUserSavings().then(res => setUserSavings(res));
  }, [setUserSavings]);

  const onCloseSuccessModal = () =>
    setSuccessModal(prev => ({...prev, isOpen: false}));

  const handleQuery = async () => {
    setLoading(true);
    const payload = {
      concept: '',
      movementAmount: amountValue,
      originAccount: originAccount?.accountCode!,
      destinationAccount: destinationAccount?.accountCode!,
      movementCurrency: originAccount?.currency === 'S/' ? 1 : 2,
    };

    try {
      const res = await ownAccountsQuery({
        payload,
        documentType: person?.documentTypeId,
        documentNumber: person?.documentNumber,
        screen: route.name,
      });
      if (!res.isSuccess && res?.data?.message && res?.data?.title) {
        setDisplayErrorModal({
          isOpen: true,
          message: {
            title: res.data.title,
            content: res.data.message,
          },
          errorCode: res.errorCode,
        });
      } else if (
        !res.isSuccess &&
        res.isWarning &&
        res?.data?.message?.title &&
        res?.data?.message?.content
      ) {
        setDisplayErrorModal({
          isOpen: true,
          message: {
            title: res.data.message.title,
            content: res.data.message.content,
          },
          errorCode: res.errorCode,
        });
      } else if (res?.data && res?.isSuccess) {
        setStep(prevStep => prevStep + 1);
      } else {
        setDisplayErrorModal({
          isOpen: true,
          errorCode: ErrorResponse.UNCONTROLLED,
          message: {
            title: '¡Lo sentimos!',
            content:
              'Ocurrió un inconveniente. Por favor inténtalo nuevamente en unos segundos.',
          },
        });
      }
    } catch (error) {
      setDisplayErrorModal({
        isOpen: true,
        errorCode: ErrorResponse.UNCONTROLLED,
        message: {
          title: '¡Lo sentimos!',
          content:
            'Ocurrió un inconveniente. Por favor inténtalo nuevamente en unos segundos.',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    // Verify if token already used
    if (lastTokenUsed === storeOTP.getOtpState().currentToken) {
      setTokenModal(true);
      return;
    }
    const payload = {
      concept: '',
      destinationAccount: destinationAccount?.accountCode!,
      movementAmount: amountValue,
      movementCurrency: originAccount?.currency! === 'S/' ? 1 : 2,
      originAccount: originAccount?.accountCode!,
      typeDestinationAccount: destinationAccount?.productName!,
      typeOriginAccount: originAccount?.productName!,
    };
    try {
      setLoadingFishes(true);
      const res = await ownAccountsExecute({
        payload,
        documentType: person?.documentTypeId,
        documentNumber: person?.documentNumber,
        screen: route.name,
      });

      if (!res.isSuccess && res?.data?.message && res?.data?.title) {
        setDisplayErrorModal({
          isOpen: true,
          message: {
            title: res.data.title,
            content: res.data.message,
          },
          errorCode: res.errorCode,
        });
      } else if (
        !res.isSuccess &&
        res.isWarning &&
        res?.data?.message?.title &&
        res?.data?.message?.content
      ) {
        setDisplayErrorModal({
          isOpen: true,
          message: {
            title: res.data.message.title,
            content: res.data.message.content,
          },
          errorCode: res.errorCode,
        });
      } else if (res?.data && res?.isSuccess) {
        setLastTokenUsed(storeOTP.getOtpState().currentToken!);
        setSuccessModal(prev => ({...prev, isOpen: true, data: res.data}));
      } else {
        setDisplayErrorModal({
          isOpen: true,
          errorCode: ErrorResponse.UNCONTROLLED,
          message: {
            title: '¡Lo sentimos!',
            content:
              'Ocurrió un inconveniente. Por favor inténtalo nuevamente en unos segundos.',
          },
        });
      }
    } catch (error) {
      setDisplayErrorModal({
        isOpen: true,
        errorCode: ErrorResponse.UNCONTROLLED,
        message: {
          title: '¡Lo sentimos!',
          content:
            'Ocurrió un inconveniente. Por favor inténtalo nuevamente en unos segundos.',
        },
      });
    } finally {
      timerRef.current = setTimeout(() => {
        setLoadingFishes(false);
      }, 1000);
    }
  };

  const goBack = useCallback(() => {
    if (step !== 0) {
      setStep(prevStep => prevStep - 1);
      return;
    }
    operationStackContext.disableUseFocusEffect = false;
    navigation.dispatch(StackActions.pop());
  }, [navigation, operationStackContext, setStep, step]);

  const handleSubmit = step <= 0 ? handleQuery : handleTransfer;

  const handleGoToHome = useCallback(async () => {
    await updateUserSavings();
    operationStackContext.disableUseFocusEffect = false;
    navigation.navigate('MainScreen');
    onCloseSuccessModal();
  }, [navigation, operationStackContext, updateUserSavings]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (!loadingFishes) {
            goBack();
            return true;
          }
        },
      );
      return () => backHandler.remove();
    }, [goBack, loadingFishes]),
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
    loading,
    loadingFishes,
    step,
    isBtnDisabled,
    formData: {
      amountValue,
      amountValueText,
      originAccount,
      destinationAccount,
      destinationSavings,
      setAmountValue,
      setAmountValueText,
      ...originsData,
    },
    successModal,
    formatedTimeToken,
    tokenModal,
    setTokenModal,
    goBack,
    onCloseSuccessModal,
    handleSubmit,
    handleGoToHome,
  };
};
