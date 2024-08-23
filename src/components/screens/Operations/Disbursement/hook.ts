import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import useStoreOTP, {storeOTP} from '@hooks/useStoreOTP';
import {useCreditAdvice, useLoading, useUserInfo} from '@hooks/common';
import {
  DisbursCreditExecute,
  DisbursedCreditData,
} from '@services/Disbursements';
import {Saving, UserSavings} from '@features/userInfo';
import {IDisbursCredit} from '@interface/Credit';
import {BackHandler, Platform} from 'react-native';
import {getUserSavings, getUserCredits} from '@services/User';
import {DisbursementProps} from '@navigations/types';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {setSessionModal} from '@features/modal';

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
  hasActiveProducts: boolean;
  originAccount: Saving | null;
  disburseCredit: IDisbursCredit;
}
interface IModalError {
  show: boolean;
  title: string;
  content: string[];
  btnText: string;
  underlined: string[] | null;
  loading?: boolean;
  errors?: string[];
  onClose: () => void;
}

export const useDisbursement = ({
  hasSavings,
  hasActiveProducts,
  originAccount,
  disburseCredit,
}: Props) => {
  const route = useRoute();
  const navigation = useNavigation<DisbursementProps['navigation']>();
  const dispatch = useAppDispatch();
  const {user, setUserSavings, setUserCredits, userCreditToDisburt} =
    useUserInfo();
  const creditPending = userCreditToDisburt;
  const {updateBanners} = useCreditAdvice();
  const [termsDegravamen, setTermsDegravamen] = useState(false);
  const [termsEntrepreneur, setTermsEntrepreneur] = useState(false);
  const [termsInsurance, setTermsInsurance] = useState(false);
  const [declaration, setDeclaration] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<DisbursedCreditData>({});
  const [tokenModal, setTokenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState(-1);
  const [modalError, setModalError] = useState<IModalError>({
    show: false,
    title: '',
    content: [],
    btnText: '',
    underlined: null,
    onClose: () => {},
  });
  const timerRef = useRef<any>(null);

  const updateModal = (data: Partial<IModalError>) =>
    setModalError(prevData => ({...prevData, ...data}));

  const {timeUntilNextToken} = useStoreOTP();
  const {setLastTokenUsed, lastTokenUsed} = useLoading();

  const formatedTimeToken = timeUntilNextToken
    ? timeUntilNextToken >= 10
      ? `${timeUntilNextToken}`
      : `0${timeUntilNextToken}`
    : null;

  const goBack = useCallback(() => {
    if (step !== 0) {
      setStep(0);
      return;
    }
    navigation.goBack();
  }, [navigation, step]);

  const showModalandUpdateSavings = useCallback(async () => {
    updateModal({loading: true});

    await getUserSavings().then(res => {
      setUserSavings(res);
      const savings = [
        ...(res?.savings.savings ?? []),
        ...(res?.investments.savings ?? []),
        ...(res?.compensations.savings ?? []),
      ];
      if (savings.length === 0) {
        dispatch(setSessionModal({show: true}));
      }
    });
  }, [dispatch, setUserSavings]);

  const onCloseErrorModal = () => {
    updateModal({show: false, errors: undefined});
    navigation.navigate('MainTab');
    showModalandUpdateSavings();
  };

  useEffect(() => {
    if (tokenModal && timeUntilNextToken === 0) {
      setTokenModal(false);
    }
  }, [setTokenModal, timeUntilNextToken, tokenModal]);

  const [confirmToExit, setConfirmToExit] = useState<ConfirmToExit>({
    isOpen: false,
  });
  const closeConfirmToExit = () => setConfirmToExit({isOpen: false});

  const updateUserSavings = useCallback(
    async (accountCode: string) => {
      const userSavings: UserSavings = await getUserSavings();

      // if origin account doesn't exist, look for it in updated user savings data
      if (!originAccount) {
        const newOriginAccount = [
          ...(userSavings?.savings.savings ?? []),
          ...(userSavings?.compensations.savings ?? []),
        ].find(accs => accs.accountCode === accountCode);

        if (newOriginAccount)
          navigation.setParams({
            originAccount: newOriginAccount,
          });
      }
      setUserSavings(userSavings);
    },
    [navigation, originAccount, setUserSavings],
  );

  const updateUserCredits = useCallback(async () => {
    await getUserCredits().then(res => setUserCredits(res));
  }, [setUserCredits]);

  const sendTermsAndConditions = async () => {
    let detail = [
      {
        acceptanceType: 1,
        value: termsDegravamen,
      },
    ];

    if (creditPending?.insurance !== '')
      detail.push({
        acceptanceType: 2,
        value: termsInsurance,
      });

    if (!hasSavings) {
      detail.push({
        acceptanceType: 3,
        value: termsEntrepreneur,
      });
    }
  };

  const handleSubmit = async () => {
    if (step <= 0 && !hasSavings) {
      return setStep(1);
    } else {
      // Verify if token was already used
      const tokenOTP = storeOTP.getOtpState().currentToken;
      if (lastTokenUsed === tokenOTP) {
        setTokenModal(true);
        return;
      }

      const payload = {
        requestCode: creditPending?.requestCode ?? 0,
        payDay: Number(creditPending?.payDay),
        codeVerification: String(tokenOTP),
        sendStatement: 'S',
        advancedPayment: 'C',
        disburseAccount: originAccount?.accountCode ?? '',
        insuranceRequest: creditPending?.insuranceRequestCode!,
        currency: hasSavings ? (originAccount?.currency === 'S/' ? 1 : 2) : 1,
        financingType: creditPending?.insuranceTypeFinancing!,
        insuranceCode: creditPending?.insuranceCode!,
        installments: Number(creditPending?.payments),
        office: creditPending?.agency!,
        accountNumber: creditPending?.account!,
        module: creditPending?.module!,
        amountCredit: creditPending?.credit!,
        typeCredit: creditPending?.product!,
        amountMounth: creditPending?.paymentMonth!,
        tea: disburseCredit?.tea!,
        tcea: disburseCredit?.tcea!,
        payDate: disburseCredit.dateFirstPayment,
        amountInsurance: creditPending?.insuranceAmount!,
      };

      // set token expired
      setLastTokenUsed(tokenOTP!);

      try {
        setLoading(true);
        const res = await DisbursCreditExecute({
          documentType: user?.person.documentTypeId,
          documentNumber: user?.person.documentNumber,
          screen: route.name,
          payload,
        });

        if (!res.isSuccess && res.errorCode === '-2')
          return updateModal({
            show: true,
            title: 'La fecha y hora del dispositivo es incorrecta',
            content: [
              'Ingresa a la opción de ',
              Platform.select({
                android: 'Ajustes > Administración general > Fecha y hora.',
                ios: 'Configuraciones > General > Fecha y hora.',
              }) ?? '',
              ' Activa la opción de fecha y hora automática. Luego, vuelve a intentarlo',
            ],
            btnText: 'Entendido',
            underlined:
              Platform.select({
                android: ['Ajustes > Administración general > Fecha y hora.'],
                ios: ['Configuraciones > General > Fecha y hora.'],
              }) ?? null,
            errors: undefined,
            onClose: () => {
              updateModal({show: false, errors: undefined});
            },
          });

        if (res.isWarning && !res.isSuccess) {
          const {content, title, messageButton, MessageBRMS} = res.data as any;
          if (content) {
            updateModal({
              show: true,
              title: title,
              content: [content],
              btnText: messageButton ?? 'Entendido',
              errors: MessageBRMS ?? undefined,
              onClose: onCloseErrorModal,
            });
          } else {
            updateModal({
              show: true,
              title: '¡Lo sentimos!',
              content: [
                'Ocurrió un inconveniente con el desembolso de tu crédito. Por favor comunícate con tu asesor.',
              ],
              btnText: 'Entendido',
              onClose: onCloseErrorModal,
            });
          }
        } else if (res?.isSuccess && res.data) {
          if (step === 0 && !hasSavings) return setStep(1);
          const data = res?.data!;
          setSuccessData(data);
          setShowSuccessModal(true);
          updateBanners({CI: false});
          sendTermsAndConditions();
          updateUserSavings(res.data.disburseAccount);
          updateUserCredits();
        } else {
          updateModal({
            show: true,
            title: '¡Lo sentimos!',
            content: [
              'Ocurrió un inconveniente con el desembolso de tu crédito. Por favor comunícate con tu asesor.',
            ],
            btnText: 'Entendido',
            onClose: onCloseErrorModal,
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
          onClose: onCloseErrorModal,
        });
      } finally {
        timerRef.current = setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
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
      if (hasSavings && e.data.action.type === 'GO_BACK') {
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
    step,
    loading,
    tokenModal,
    formatedTimeToken,
    successData,
    modalError,
    terms: {
      termsDegravamen,
      termsEntrepreneur,
      termsInsurance,
      setTermsDegravamen,
      setTermsEntrepreneur,
      setTermsInsurance,
      declaration,
      setDeclaration,
    },
    confirmToExit,
    showSuccessModal,
    showLogoutModal,
    setShowLogoutModal,
    setShowSuccessModal,
    closeConfirmToExit,
    goBack,
    handleSubmit,
  };
};
