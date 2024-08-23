import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {useLoading, useTimer, useUserInfo} from '@hooks/common';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import useForm from '@hooks/useForm';
import {validateAccount} from '@screens/Operations/OtherAccounts/utils';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import {RefillQuery, refillBimExecute} from '@services/Transactions';
import {getUserSavings} from '@services/User';
import {useOriginAccounts} from './useOriginAccounts';
import {storeOTP} from '@hooks/useStoreOTP';
import {ErrorResponse} from '@global/information';
import {OperationStackContext} from '@contexts/OperationStackContext';
import {BackHandler} from 'react-native';

interface ISuccessData {
  isOpen: boolean;
  data?: {
    date: string;
    datetime: string;
    email: string;
    hour: string;
    transactionId: string;
  };
}

interface Props {
  params?:
    | {
        type: 'NONE';
        from?: string;
        data?: {};
      }
    | {
        type: 'REFILL_BIM';
        amount: number;
        formatAmount: string;
        operationUId: number;
        phoneNumberBim: string;
        dateTransaction: string;
        hourTransaction: string;
        transactionId: string;
        dateTimeTransaction: string;
        email: string;
      };
}

export const useRefillBim = ({params}: Props) => {
  const route = useRoute();
  const navigation = useNavigation();
  const {user, setUserSavings} = useUserInfo();
  const {restart} = useTimer();
  const person = user?.person;
  const {displayErrorModal, setDisplayErrorModal} = useLoading();
  const operationStackContext = useContext(OperationStackContext);
  const isFromOTP = params?.type === 'REFILL_BIM';
  const [successModal, setSuccessModal] = useState<ISuccessData>(
    isFromOTP
      ? {
          isOpen: true,
          data: {
            date: params.dateTransaction,
            datetime: params.dateTimeTransaction,
            email: params.email,
            hour: params.hourTransaction,
            transactionId: params?.transactionId ?? '',
          },
        }
      : {
          isOpen: false,
          data: {
            date: '',
            datetime: '',
            email: '',
            hour: '',
            transactionId: '',
          },
        },
  );

  useEffect( () => {
    if(params?.type === 'REFILL_BIM'){
      setSuccessModal({
        isOpen: true,
        data: {
          date: params.dateTransaction,
          datetime: params.dateTimeTransaction,
          email: params?.email,
          hour: params.hourTransaction,
          transactionId: params?.transactionId ?? '',
        },
      });
      updateUserSavings();
    }
  }, [params] )


  const onCloseSuccessModal = () =>
    setSuccessModal(prev => ({...prev, isOpen: false}));

  const [step, setStep] = useState(-1);
  const [defaultOpenPicker, setDefaultOpenPicker] = useState(false);
  const [loadingFishes, setLoadingFishes] = useState(false);
  const [loading, setLoading] = useState(false);

  const timerRef = useRef<any>(null);

  const {allSavingsFilter} = useOriginAccounts();

  // Form
  const {values, ...form} = useForm({
    initialValues: {
      amount: isFromOTP ? params.amount : null,
      formatAmount: isFromOTP ? params.formatAmount : '',
      phoneNumberBim: isFromOTP ? params.phoneNumberBim : '',
      operationUId: isFromOTP
        ? params?.operationUId
        : allSavingsFilter?.[0].operationUId,
    },
    validate: _values => {
      const errors: Record<string, string> = {};
      const phoneNumberBim = _values.phoneNumberBim.split(' ').join('');

      if (phoneNumberBim.length !== 9) {
        errors.phoneNumberBim = 'El número ingresado no es correcto';
      }

      if (
        phoneNumberBim.length === 9 &&
        (phoneNumberBim[0] !== '9' || !validateAccount(phoneNumberBim))
      ) {
        errors.phoneNumberBim = 'El número ingresado no es correcto';
      }

      return errors;
    },
  });

  const [originAccountUId, setOriginAccountUId] = useState(
    allSavingsFilter?.[0].operationUId!,
  );
  const originAccount = useAccountByOperationUid({
    operationUId: isFromOTP ? params?.operationUId : originAccountUId,
  });

  const isBtnDisabled =
    Object.keys(form.touched).length === 0 ||
    Object.keys(form.errors).length !== 0 ||
    values.amount === null ||
    values.amount < 1 ||
    values.amount > 999 ||
    values?.amount > originAccount?.balance!;

  const onSetFieldInitialForm = useCallback(
    (field: any, value: any) => {
      form.setField(field, value);
    },
    [form],
  );

  const updateUserSavings = useCallback(async () => {
    await getUserSavings().then(res => setUserSavings(res));
  }, [setUserSavings]);

  const handleRefillBimQuery = async () => {
    setLoading(true);
    const payload = {
      accountNumber: originAccount?.accountCode!,
    };
    try {
      const res = await RefillQuery({
        payload,
        documentType: person?.documentTypeId,
        documentNumber: person?.documentNumber,
        screen: route.name,
      });

      setLoading(false);

      if (!res?.isWarning && !res?.isSuccess && res?.errorCode === '') {
        setDisplayErrorModal({
          errorCode: ErrorResponse.UNCONTROLLED,
          isOpen: true,
          message: {
            title: '¡Lo sentimos!',
            content:
              'Ocurrió un inconveniente. Por favor inténtalo nuevamente en unos segundos.',
          },
        });
        return;
      }

      if (res?.isWarning && !res?.isSuccess) {
        if (res.errorCode === '494') {
          setDisplayErrorModal({
            isOpen: true,
            message: {
              content: res.data.message,
              title: res.data.title,
            },
            errorCode: res.errorCode,
          });
          return;
        }
        setDisplayErrorModal({
          isOpen: true,
          message: res.data.message,
          errorCode: res.errorCode,
        });
        return;
      } else if (res?.data && res?.isSuccess) {
        setStep(prevStep => prevStep + 1);
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

  const handleRefillBimExecute = async () => {
    const token = storeOTP.getOtpState().currentToken;

    if (!token) {
      // TODO: If i came to this view without token
      return;
    }
    const phoneNumberBim = values.phoneNumberBim.split(' ').join('');

    const payload = {
      amount: values.amount || 0,
      codeVerification: String(token),
      receivingfri: `51${phoneNumberBim}`,
      accountType: originAccount?.productName!,
      accountNumber: originAccount?.accountCode!,
      documentType: person?.documentTypeId,
      documentNumber: person?.documentNumber,
    };

    try {
      setLoadingFishes(true);
      const res = await refillBimExecute(payload);

      let status = 'UNKNOWN';
      if (res?.isSuccess === true) {
        if (res?.errorCode === '100') {
          status = 'SUCCESS';
        }
      } else {
        if (res?.errorCode === '102') {
          status = 'BLOCKED';
        } else if (res?.errorCode === '101') {
          status = 'NEED_AUTHENTICATION';
        }
      }
      switch (status) {
        case 'UNKNOWN':
          const modalMessage =
            res?.data?.message?.title !== undefined &&
            res?.data?.message?.content !== undefined
              ? {
                  errorCode: ErrorResponse.UNCONTROLLED,
                  isOpen: true,
                  message: {
                    title: res.data.message.title,
                    content: res.data.message.content,
                  },
                }
              : {
                  errorCode: ErrorResponse.UNCONTROLLED,
                  isOpen: true,
                  message: {
                    title: '¡Lo sentimos!',
                    content:
                      'Ocurrió un inconveniente. Por favor inténtalo nuevamente en unos segundos.',
                  },
                };
          setDisplayErrorModal(modalMessage);
          break;
        case 'NEED_AUTHENTICATION':
          if (person !== undefined) {
            restart({
              documentNumber: person.documentNumber,
              documentType: person.documentTypeId,
            });
            navigation.dispatch(
              StackActions.push('RegisterOTP', {
                type: 'REFILL_BIM',
                documentType: person.documentTypeId,
                documentNumber: person.documentNumber,
                phoneNumberObfuscated: res?.data?.cellphone,
                channel: 'sms',
                isSensitiveInfo: true,
                stepProps: undefined,
                trackingTransaction: res?.data?.trackingTransaction,
                refillData: {
                  amount: values.amount,
                  formatAmount: values.formatAmount,
                  operationUId: values.operationUId,
                  phoneNumberBim: values.phoneNumberBim,
                },
              }),
            );
          }
          break;
        case 'BLOCKED':
          navigation.dispatch(StackActions.replace('InfoAccessBlocked'));
          break;
        case 'SUCCESS':
          setSuccessModal(prev => ({...prev, isOpen: true, data: res.data}));
          updateUserSavings();
          break;
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

  const handleGoToHome = useCallback(() => {
    operationStackContext.disableUseFocusEffect = false;
    navigation.navigate('MainScreen');
    onCloseSuccessModal();
  }, [navigation, operationStackContext]);

  const handleSubmit =
    step <= 0 ? handleRefillBimQuery : handleRefillBimExecute;

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

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return {
    step,
    loading,
    loadingFishes,
    defaultOpenPicker,
    values,
    isBtnDisabled,
    successModal,
    displayErrorModal,
    formData: {
      values,
      originAccount,
      form,
      originAccountUId,
      setOriginAccountUId,
      onSetField: onSetFieldInitialForm,
    },
    goBack,
    handleGoToHome,
    setDefaultOpenPicker,
    onCloseSuccessModal,
    handleSubmit,
  };
};
