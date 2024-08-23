import {BackHandler} from 'react-native';
import {useCallback, useEffect, useRef, useState} from 'react';
import {IQuotaItem, QUOTAS_LIST} from '@global/lists';
import {useLastUser, useUserInfo} from '@hooks/common';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import {getSchedulesTextFormat} from '@utils/getSchedules';
import {logout, validatePaymentOperation} from '@services/User';
import {Saving, purgeUserState} from '@features/userInfo';
import {StartDisbursementProps} from '@navigations/types';
import {DisbursCredit} from '@services/Disbursements';
import moment from 'moment';
import {useAccounts} from './useAccounts';
import {IDisbursCredit} from '@interface/Credit';
import {setTerms} from '@features/terms';
import {
  setShowExpiredTokenSession,
  setShowSessionStatus,
} from '@features/loading';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {setSessionModal} from '@features/modal';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useCreditAdvice} from '@hooks/common/useCreditAdvice';

interface IModalError {
  show: boolean;
  title: string;
  content: string[];
  btnText: string;
  underlined: string[] | null;
  errors?: string[];
  onClose: () => void;
}
interface IModalInfo {
  show: boolean;
  title: string;
  body: 'OpenAccount' | 'UpdateAmount';
  btnText1: string;
  btnText2: string;
  onPressBtn1: () => void;
  onPressBtn2: () => void;
}

interface IHookStartDisbursement {
  accounts?: Saving[];
  originAccountUId?: number;
  originAccount: Saving | null;
  selectedQuota?: IQuotaItem;
  updatedCredit: IDisbursCredit | null;
  loading: boolean;
  modalError: IModalError;
  modalInfo: IModalInfo;
  defaultOpenPicker: boolean;
  hasSavings: boolean;
  hasInsurance: boolean;
  isPreApproved: boolean;
  isDisableButton: boolean;
  setOriginAccountUId: React.Dispatch<React.SetStateAction<number | undefined>>;
  updateSelectedQuota: (quota: IQuotaItem) => void;
  validateAccount: (accountCode: string) => Promise<boolean>;
  setDefaultOpenPicker: React.Dispatch<React.SetStateAction<boolean>>;
  goHome: () => void;
  goConfirmation: () => void;
  closeSession: () => void;
}

export const useStartDisbursement = ({
  navigation,
  route,
}: StartDisbursementProps): IHookStartDisbursement => {
  const {lastUser} = useLastUser();
  const {showDisbursement} = useCreditAdvice();

  const dispatch = useAppDispatch();

  const {user, userCreditToDisburt, setUserCreditToDisburt} = useUserInfo();
  const creditPending = userCreditToDisburt;
  const person = user?.person;

  const [modalError, setModalError] = useState<IModalError>({
    show: false,
    title: '',
    content: [],
    btnText: '',
    underlined: null,
    onClose: () => {},
  });
  const [modalInfo, setModalInfo] = useState<IModalInfo>({
    show: false,
    title: '',
    body: 'OpenAccount',
    btnText1: '',
    btnText2: '',
    onPressBtn1: () => {},
    onPressBtn2: () => {},
  });
  const [loading, setLoading] = useState(false);
  const jointlys = useRef(new Set<string>());

  const getQuotaItemByDay = (day: string) => {
    const quota = QUOTAS_LIST.find(e => e.value === day);
    return quota;
  };

  const [defaultOpenPicker, setDefaultOpenPicker] = useState(false);
  const [updatedCredit, setUpdatedCredit] = useState<IDisbursCredit | null>(
    null,
  );
  const [selectedQuota, setSelectedQuota] = useState<IQuotaItem | undefined>(
    creditPending?.payDay
      ? getQuotaItemByDay(creditPending?.payDay)
      : undefined,
  );

  const updateSelectedQuota = (quota: IQuotaItem) => {
    setUserCreditToDisburt({
      ...userCreditToDisburt!,
      payDay: quota?.value,
    });
    setSelectedQuota(quota);
  };

  const updateModal = (data: Partial<IModalError>) =>
    setModalError(prevData => ({...prevData, ...data}));
  const updateModalInfo = (data: Partial<IModalInfo>) =>
    setModalInfo(prevData => ({...prevData, ...data}));

  const {accounts, allSavings} = useAccounts(creditPending);

  const hasSavings = accounts ? accounts?.length > 0 : false;
  const hasActiveProducts = allSavings?.length > 0;
  const isPreApproved = creditPending?.module === 103;
  const hasInsurance = creditPending?.insurance !== '';

  const [originAccountUId, setOriginAccountUId] = useState(
    accounts?.[0]?.operationUId,
  );

  const originAccount = useAccountByOperationUid({
    operationUId: originAccountUId!,
  });

  const closeSession = () => {
    if (lastUser.document !== undefined) {
      logout(
        {
          documentNumber: lastUser.document.number,
          documentType: lastUser.document.type,
        },
        route.name,
      );
      purgeUserState();
      setTerms(false);
      setShowSessionStatus(false);
      setShowExpiredTokenSession(false);
      dispatch(setSessionModal({show: false}));
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Home'}, {name: 'Login'}],
        }),
      );
    }
  };

  const isDisableButton = !selectedQuota;

  const goToDisbursementScreen = (data: IDisbursCredit | null) =>
    navigation.navigate('OperationsStack', {
      screen: 'Disbursement',
      params: {
        disburseCredit: data,
        hasSavings: hasSavings && !(accounts?.length === jointlys.current.size),
        hasActiveProducts: hasActiveProducts,
        originAccount,
        hasInsurance,
      },
    });

  const validateAccount = async (accountCode: string) => {
    try {
      const validate = await validatePaymentOperation({
        accountCode: accountCode,
        typeOperation: 'DC',
        user: `0${person?.documentTypeId}${person?.documentNumber}`,
        screen: route.name,
      });

      if (validate && validate.jointlySaving) {
        jointlys.current.add(accountCode);
        if (jointlys.current.size === accounts?.length)
          updateModalInfo({
            show: true,
            title:
              '¡Uy! Necesitas una nueva cuenta \n de ahorros Emprendedores',
            body: 'OpenAccount',
            btnText1: 'Quiero abrir una cuenta',
            btnText2: 'Cerrar',
            onPressBtn1: () => {
              updateModalInfo({show: false});
              handleDisburseCredit();
            },
            onPressBtn2: () => {
              updateModalInfo({show: false});
            },
          });
        else
          updateModal({
            show: true,
            title: '¡Uy! Elige una cuenta \n de ahorros diferente',
            content: [
              'La cuenta elegida es mancomunada. \n Para obtener tu crédito debes elegir una \n cuenta dónde solo tú seas el titular.',
            ],
            btnText: 'Elegir otra cuenta',
            underlined: null,
            onClose: () => {
              setDefaultOpenPicker(true);
              updateModal({show: false});
            },
          });
        return false;
      }
      if (validate && validate.content) {
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
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleDisburseCredit = async () => {
    setLoading(true);
    const payload = {
      requestCode: creditPending?.requestCode ?? 0,
      disbursementDate: `${moment(new Date()).format('yyyy-MM-DD')}`,
      payDay: Number(selectedQuota?.value) ?? 0,
      customerAccount: creditPending?.account ?? 0,
      isPreApproved: isPreApproved ? 'S' : 'N',
      timeEntered: Number(creditPending?.payments) ?? 0,
      insuranceCoverageDeduction: creditPending?.insuranceAmount ?? 0,
      insuranceCode: creditPending?.insuranceCode ?? 0,
      currency: creditPending ? (creditPending?.currency === 'S/' ? 1 : 2) : 1,
      insuranceRequest: creditPending?.insuranceRequestCode ?? 0,
      financingType: creditPending?.insuranceTypeFinancing ?? '',
      installments: Number(creditPending?.payments) ?? 0,
      amountDisbursed: creditPending?.credit ?? 0,
    };

    const disburseCredit = await DisbursCredit({
      documentType: user?.person.documentTypeId,
      documentNumber: user?.person.documentNumber,
      screen: route.name,
      payload,
    });

    if (!disburseCredit) return setLoading(false);

    if (disburseCredit.isWarning && !disburseCredit.isSuccess) {
      const {content, title, messageButton, MessageBRMS} =
        disburseCredit.data as any;
      if (content) {
        updateModal({
          show: true,
          title: title,
          content: [content],
          btnText: messageButton ?? 'Entendido',
          underlined: null,
          errors: MessageBRMS ?? undefined,
          onClose: () => {
            updateModal({show: false, errors: undefined});
          },
        });
      } else {
        updateModal({
          show: true,
          title: '¡Lo sentimos!',
          content: [
            'Ocurrió un inconveniente con el desembolso de tu crédito. Por favor comunícate con tu asesor.',
          ],
          btnText: 'Entendido',
          underlined: null,
          onClose: () => {
            updateModal({show: false});
          },
        });
      }
      setLoading(false);
      return;
    } else if (disburseCredit.isSuccess && disburseCredit.data) {
      if (
        disburseCredit.data.paymentMonth !== creditPending?.paymentMonth ||
        disburseCredit.data.amountInsurance !== creditPending.insuranceAmount
      ) {
        setUpdatedCredit(disburseCredit.data);
        const newCreditDisburse = {
          ...creditPending!,
          sCreditDeposit: disburseCredit.data.sAmountDisbursed,
          insuranceAmount: disburseCredit.data.amountInsurance,
          sInsuranceAmount: disburseCredit.data.sAmountInsurance,
          paymentMonth: disburseCredit.data.paymentMonth,
          sPaymentMonth: disburseCredit.data.sPaymentMonth,
          tea: disburseCredit.data.stea,
          tcea: disburseCredit.data.stcea,
        };
        updateModalInfo({
          show: true,
          title: '¡Actualizamos tu cuota!',
          body: 'UpdateAmount',
          btnText1: 'Continuar con mi desembolso',
          btnText2: 'Editar desembolso',
          onPressBtn1: () => {
            setUserCreditToDisburt(newCreditDisburse);
            goToDisbursementScreen(disburseCredit.data);
            updateModalInfo({show: false});
          },
          onPressBtn2: () => {
            setUserCreditToDisburt(newCreditDisburse);
            updateModalInfo({show: false});
          },
        });
      } else goToDisbursementScreen(disburseCredit.data);
    }
    setLoading(false);
  };

  const goBack = useCallback(() => {
    navigation.navigate('MainTab', {
      screen: 'Main',
      params: {
        screen: 'MainScreen',
      },
    });
  }, [navigation]);

  const goHome = () => {
    /* showCreditAdvice(false); */
    /* updateAmountCreditAdvice(''); */
    goBack();
  };

  const goConfirmation = async () => {
    setLoading(true);
    const token = lastUser.secret;

    if (
      lastUser.hasActiveToken === false ||
      lastUser.tokenIsInCurrentDevice === false ||
      !token
    ) {
      setLoading(false);
      return navigation.navigate('InfoActivateToken', {
        redirectTo: 'DISBURSEMENT',
      });
    }

    // Validate account and schedule
    const validate = await validateAccount(originAccount?.accountCode ?? '');
    if (!validate) {
      setLoading(false);
      return;
    }

    // Disburse Credit
    await handleDisburseCredit();
    setLoading(false);
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

  // set auto navigate from MainScreen to false
  useEffect(() => {
    showDisbursement(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    accounts,
    selectedQuota,
    updatedCredit,
    originAccountUId,
    originAccount,
    loading,
    modalError,
    modalInfo,
    defaultOpenPicker,
    hasSavings,
    hasInsurance,
    isPreApproved,
    isDisableButton,
    setOriginAccountUId,
    updateSelectedQuota,
    validateAccount,
    setDefaultOpenPicker,
    goHome,
    goConfirmation,
    closeSession,
  };
};
