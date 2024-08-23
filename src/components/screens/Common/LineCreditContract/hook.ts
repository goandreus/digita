import {useCallback, useEffect, useRef, useState} from 'react';
import {useLineCreditContractContext} from './context';
import useStoreOTP, {storeOTP} from '@hooks/useStoreOTP';
import {
  useCreditAdvice,
  useLastUser,
  useLoading,
  useToken,
  useUserInfo,
} from '@hooks/common';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {BackHandler} from 'react-native';
import {ContractLineCredit} from '@services/CreditLine';
import {validatePaymentOperation} from '@services/User';
import {getSchedulesTextFormat} from '@utils/getSchedules';

interface IModalError {
  show: boolean;
  title: string;
  content: string[];
  btnText: string;
  underlined: string[] | null;
  errors?: string[];
  onClose: () => void;
}

export const useLineCreditContract = () => {
  const route = useRoute();
  const {updateBanners} = useCreditAdvice();
  const {setShowSuccessModal, setSuccessData} = useLineCreditContractContext();
  const [loading, setLoading] = useState(false);
  const [loadingFishes, setLoadingFishes] = useState(false);
  const timerRef = useRef<any>(null);
  const {user, userCreditToDisburt: lineCredit} = useUserInfo();
  const {lastUser} = useLastUser();
  const {setBackButton} = useToken();
  const {setLastTokenUsed, lastTokenUsed} = useLoading();
  const [tokenModal, setTokenModal] = useState<boolean>(false);
  const navigation = useNavigation();

  const [modalError, setModalError] = useState<IModalError>({
    show: false,
    title: '',
    content: [],
    btnText: '',
    underlined: null,
    onClose: () => {},
  });

  const updateModal = (data: Partial<IModalError>) =>
    setModalError(prevData => ({...prevData, ...data}));

  const {timeUntilNextToken} = useStoreOTP();

  const formatedTimeToken = timeUntilNextToken
    ? timeUntilNextToken >= 10
      ? `${timeUntilNextToken}`
      : `0${timeUntilNextToken}`
    : null;

  const handleSubmit = async () => {
    const token = lastUser.secret;
    setLoading(true);

    if (
      lastUser.hasActiveToken === false ||
      lastUser.tokenIsInCurrentDevice === false ||
      !token
    ) {
      setBackButton(true);
      setLoading(false);
      return navigation.navigate('InfoActivateToken', {
        redirectTo: 'LINECREDIT',
      });
    }

    // Verify if operation token was already used
    const tokenOTP = storeOTP.getOtpState().currentToken;
    if (lastTokenUsed === tokenOTP) {
      setTokenModal(true);
      setLoading(false);
      return;
    }

    // Validate schedule

    const validateSchedule = await validatePaymentOperation({
      typeOperation: 'LC',
      user: `0${user?.person.documentTypeId}${user?.person.documentNumber}`,
      screen: route.name,
    });

    if (validateSchedule && validateSchedule.content) {
      const {schedules, content} = getSchedulesTextFormat(
        validateSchedule.content,
      );
      updateModal({
        show: true,
        title: validateSchedule.title,
        underlined: schedules,
        content,
        btnText: 'Entendido',
        onClose: () => {
          updateModal({show: false, underlined: null});
        },
      });
      setLoading(false);
      return;
    }

    // set token expired
    setLastTokenUsed(tokenOTP!);

    // contract line credit
    const payload = {
      codeVerification: String(tokenOTP),
      requestCode: lineCredit?.requestCode ?? 0,
      credit: lineCredit!.credit,
      payDay: Number(lineCredit!.payDay),
    };

    try {
      setLoadingFishes(true);

      const res = await ContractLineCredit({
        documentType: user?.person.documentTypeId,
        documentNumber: user?.person.documentNumber,
        screen: route.name,
        payload,
      });

      if (res?.isSuccess && res.data) {
        setSuccessData(res.data);
        setShowSuccessModal(true);
        updateBanners({LC: false});
      } else if (!res.isSuccess && res.data?.content) {
        const {content, title, messageButton, MessageBRMS} = res.data as any;
        updateModal({
          show: true,
          title: title,
          content: [content],
          btnText: messageButton ?? 'Entendido',
          errors: MessageBRMS ?? undefined,
          onClose: () => updateModal({show: false, errors: undefined}),
        });
      } else {
        updateModal({
          show: true,
          title: '¡Uy, ocurrió un problema!',
          content: [
            'Por favor vuelve a intentarlo una vez más. Si el problema continúa te recomendamos intentarlo en unos minutos.',
          ],
          btnText: 'Entendido',
          underlined: null,
          onClose: () => updateModal({show: false}),
        });
      }
    } catch (error) {
      updateModal({
        show: true,
        title: '¡Lo sentimos!',
        content: [
          'Ocurrió un inconveniente con el desembolso de tu crédito. Por favor comunícate con tu asesor.',
        ],
        btnText: 'Entendido',
        onClose: () => updateModal({show: false}),
      });
    } finally {
      timerRef.current = setTimeout(() => {
        setLoading(false);
        setLoadingFishes(false);
      }, 1000);
    }
  };

  const goBack = useCallback(() => {
    navigation.navigate('MainTab', {
      screen: 'Main',
      params: {
        screen: 'MainScreen',
      },
    });
  }, [navigation]);

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

  useEffect(() => {
    if (tokenModal && timeUntilNextToken === 0) {
      setTokenModal(false);
    }
  }, [setTokenModal, timeUntilNextToken, tokenModal]);

  // Clear the interval when the component unmounts
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return {
    loading,
    loadingFishes,
    formatedTimeToken,
    tokenModal,
    modalError,
    handleSubmit,
    goBack,
  };
};
