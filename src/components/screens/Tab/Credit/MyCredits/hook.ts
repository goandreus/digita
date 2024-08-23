/* eslint-disable react-hooks/exhaustive-deps */
import {useLastUser, useToken, useUserInfo} from '@hooks/common';
import {useCreditAdvice} from '@hooks/common/useCreditAdvice';
import {MyCreditsScreenProps, RootStackParamList} from '@navigations/types';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {
  haveCreditPending,
  haveGroupCreditPending,
} from '@services/Disbursements';
import {ListLineCredit} from '@services/CreditLine';
import {getRemoteValue} from '@utils/firebase';
import {useEffect, useCallback, useState, useRef, useMemo} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {validatePaymentOperation} from '@services/User';
import {getSchedulesTextFormat} from '@utils/getSchedules';

interface Props {
  route: RouteProp<RootStackParamList, 'MyCredits'>;
}

interface IModalInfo {
  show: boolean;
  icon: 'info-insurance' | 'info-insurance2';
  title: string;
  content: string | null;
  btnText1: string;
  btnText2: string;
  onPress1: () => void;
  onPress2: () => void;
}

interface IModalError {
  show: boolean;
  title: string;
  content: string[];
  btnText: string;
  underlined: string[] | null;
  onClose: () => void;
}

export const useMyCredits = ({route}: Props) => {
  const navigation = useNavigation<MyCreditsScreenProps['navigation']>();
  const isFocused = useIsFocused();
  const {updateAmountCreditAdvice, updateBanners} = useCreditAdvice();
  const {lastUser} = useLastUser();
  const {setBackButton} = useToken();
  const {
    user,
    userCredits,
    userCreditToDisburt,
    userGroupCreditToDisburt,
    userLineCredit,
    setUserCreditToDisburt,
    setUserGroupCreditToDisburt,
    setUserLineCredit,
  } = useUserInfo();
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [showInfo, setShowInfo] = useState<IModalInfo>({
    show: false,
    icon: 'info-insurance',
    title: '',
    content: null,
    btnText1: '',
    btnText2: '',
    onPress1: () => {},
    onPress2: () => {},
  });

  const [modalError, setModalError] = useState<IModalError>(
    route?.params?.modalError
      ? {
          show: true,
          title: route.params.modalError.title,
          content: route.params.modalError.content,
          btnText: route.params.modalError.btnText,
          underlined: route.params.modalError.underlined,
          onClose: () => updateModal({show: false, underlined: null}),
        }
      : {
          show: false,
          title: '',
          content: [],
          btnText: '',
          underlined: null,
          onClose: () => {},
        },
  );

  const lineCredit = userLineCredit?.credits[0];

  const updateInfoModal = (data: Partial<IModalInfo>) =>
    setShowInfo(prevData => ({...prevData, ...data}));

  const closeInfoModal = (nav?: boolean) => {
    updateInfoModal({show: false});
    setLoadingButton(false);
    if (nav)
      navigation.navigate('OperationsStack', {
        screen: 'LineSimulation',
      });
  };

  const updateModal = (data: Partial<IModalError>) =>
    setModalError(prevData => ({...prevData, ...data}));

  const [canDisburseCI, isCreditLineActived, canDisburseLC] = useMemo(() => {
    return [
      getRemoteValue('trx_dsbrmnt_ci').asBoolean(),
      getRemoteValue('trx_credit_line').asBoolean(),
      getRemoteValue('trx_credit_line_disbursement').asBoolean(),
    ];
  }, []);

  let timerRef = useRef<any>(null);

  const hasCredits =
    userCredits &&
    (userCredits?.individualCredits?.length > 0 ||
      userCredits?.groupCredits?.length > 0);

  const hasLineCredit = true;

  const goDisbursment = async () => {
    if (!canDisburseLC) return;
    setLoadingButton(true);
    const token = lastUser.secret;

    if (
      lastUser.hasActiveToken === false ||
      lastUser.tokenIsInCurrentDevice === false ||
      !token
    ) {
      setBackButton(true);
      setLoadingButton(false);
      return navigation.navigate('InfoActivateToken', {
        redirectTo: 'CREDITS',
      });
    }

    // Validat Schedule
    const validateSchedule = await validatePaymentOperation({
      typeOperation: 'DL',
      user: `0${user?.person?.documentTypeId}${user?.person?.documentNumber}`,
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
      setLoadingButton(false);
      return;
    }

    if (lineCredit && lineCredit.availableCreditLineAmount < 1000) {
      updateModal({
        show: true,
        title: '¡Uy por ahora no puedes disponer de tu Linea de Crédito!',
        underlined: ['S/ 1,000.00.'],
        content: [
          'Para disponer es necesario que tengas un monto mayor o igual a ',
          'S/ 1,000.00.',
        ],
        btnText: 'Entendido',
        onClose: () => {
          updateModal({show: false, underlined: null});
        },
      });
      setLoadingButton(false);
      return;
    }

    if (lineCredit && lineCredit.quantityProvisions >= 2) {
      updateModal({
        show: true,
        title:
          '¡Uy, por ahora no puedes disponer de tu Línea de Crédito por el app!',
        content: [
          'Por el momento, te sugerimos acercarte a agencia para hacer otra disposición de tu línea de crédito.',
        ],
        btnText: 'Entendido',
        onClose: () => {
          updateModal({show: false, underlined: null});
        },
      });
      setLoadingButton(false);
      return;
    }

    updateInfoModal({
      show: true,
      icon: 'info-insurance',
      title: '¿Solicitaste un seguro optativo?',
      content: null,
      btnText1: 'No solicité un seguro',
      btnText2: 'Sí, solicité un seguro',
      onPress1: () => closeInfoModal(true),
      onPress2: () =>
        updateInfoModal({
          title: '¿Deseas desembolsar con tu seguro optativo solicitado?',
          icon: 'info-insurance2',
          content:
            'Por ahora, tus desembolsos por la app no tendrán el seguro optativo que solicitaste a tu asesor. Para obtenerlo desembolsa tu crédito en agencia.',
          btnText1: 'Continuar sin seguro',
          btnText2: 'Desembolsaré en agencia',
          onPress1: () => closeInfoModal(true),
          onPress2: () => closeInfoModal(),
        }),
    });
  };

  const requestCredits = useCallback(async () => {
    try {
      setLoading(true);

      const groupRequest = haveGroupCreditPending({
        documentNumber: lastUser.document?.number,
        documentType: lastUser.document?.type,
      });

      const individualRequest = haveCreditPending({
        documentNumber: lastUser.document?.number,
        documentType: lastUser.document?.type,
      });

      const lineCreditRequest = await ListLineCredit({
        documentNumber: lastUser.document?.number,
        documentType: lastUser.document?.type,
      }).catch(() => {});

      if (
        lineCreditRequest &&
        lineCreditRequest.data &&
        lineCreditRequest.isSuccess
      )
        setUserLineCredit(lineCreditRequest.data);

      await Promise.all([groupRequest, individualRequest]).then(
        async ([groupCredits, individualCredits]) => {
          if (groupCredits.data && groupCredits.isSuccess) {
            setUserGroupCreditToDisburt(groupCredits.data);
            updateBanners({CG: true});
          }

          if (individualCredits.data && individualCredits.isSuccess) {
            if (individualCredits.data.module === 117) {
              if (isCreditLineActived) {
                setUserCreditToDisburt(individualCredits.data);
                updateAmountCreditAdvice(individualCredits.data.sCreditFormat1);
                updateBanners({LC: true});
              }
              return;
            } else if (canDisburseCI) {
              setUserCreditToDisburt(individualCredits.data);
              updateAmountCreditAdvice(individualCredits.data.sCreditFormat1);
              updateBanners({CI: true});
              return;
            }
          }
        },
      );
    } catch (error) {
      console.log('error', error);
    } finally {
      timerRef.current = setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [
    canDisburseCI,
    lastUser.document?.number,
    lastUser.document?.type,
    setUserCreditToDisburt,
    setUserGroupCreditToDisburt,
    updateAmountCreditAdvice,
    updateBanners,
  ]);

  useEffect(() => {
    requestCredits();
  }, [requestCredits]);

  // Clear the interval when the component unmounts
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (userGroupCreditToDisburt && isFocused) {
      navigation.navigate('StartGroupCredit', {
        showTokenIsActivated: false,
      });
      return;
    }
    if (userCreditToDisburt && isFocused) {
      // check if has Line credit or CI
      if (userCreditToDisburt.module === 117) {
        navigation.navigate('LineCreditContract', {
          showTokenIsActivated: false,
        });
      } else {
        navigation.navigate('StartDisbursement', {
          showTokenIsActivated: false,
        });
      }
    }
  }, [navigation, userCreditToDisburt, userGroupCreditToDisburt]);

  return {
    hasCredits,
    hasLineCredit,
    loading,
    loadingButton,
    showInfo,
    modalError,
    setShowInfo,
    goDisbursment,
  };
};
