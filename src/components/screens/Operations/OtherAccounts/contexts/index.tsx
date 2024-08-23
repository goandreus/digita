import {OperationStackContext} from '@contexts/OperationStackContext';
import {Saving} from '@features/userInfo';
import {useUserInfo} from '@hooks/common';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import useForm, {FormError} from '@hooks/useForm';
import useToggle from '@hooks/useToggle';
import {useNavigation} from '@react-navigation/native';
import {getBankCodes} from '@services/BankCode';
import {IFavoriteItem} from '@services/Favorite';
import {getUserSavings} from '@services/User';
import {isEmpty} from '@utils/isEmpty';
import {validateConcept} from '@utils/validateConcept';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {containsOnlyZeros, validateAccount} from '../utils';
import {
  IConfirmationCF,
  InitialForm,
  ISuccessModal,
  IQueryInfo,
  TransferParams,
  IConfirmationInmediate,
  IConfirmationDeferred,
  IScheduleModal,
  IForm,
  ICreateFavoriteCF,
  IFavoriteModal,
  IFavorite,
} from './types';

type TransferType = 'CF' | 'Inmediate-CCI' | 'Deferred-CCI';
interface ProviderProps {
  children: ReactNode;
  params?: TransferParams;
  isFavoriteOperation?: boolean;
  favorite?: IFavoriteItem;
}

type OtherAccountsContextType = {
  step: number;
  loadingFishes: boolean;
  transferType: TransferType;
  successModal: ISuccessModal;
  originSavings: Saving[];
  originAccount: Saving | null;
  originProductName: string;
  defaultOpenPicker: boolean;
  initialForm: IForm<InitialForm>;
  confirmationCF: IForm<IConfirmationCF>;
  confirmationInmediate: IForm<IConfirmationInmediate>;
  confirmationDeferred: IForm<IConfirmationDeferred>;
  createFavorite: IForm<ICreateFavoriteCF>;
  favoriteModalUtils: IFavoriteModal;
  queryInfo: IQueryInfo;
  tokenModal: boolean;
  scheduleModal: IScheduleModal;
  bankCodes: React.MutableRefObject<Map<number, string> | null>;
  favoritePayload: IFavorite | undefined;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setDefaultOpenPicker: React.Dispatch<React.SetStateAction<boolean>>;
  setTransferType: React.Dispatch<React.SetStateAction<TransferType>>;
  setTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingFishes: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessModal: React.Dispatch<React.SetStateAction<ISuccessModal>>;
  setQueryInfoData: (payload: Partial<IQueryInfo>) => void;
  handleGoToHome: () => void;
  updateUserSavings: () => void;
  setFavoritePayload: React.Dispatch<
    React.SetStateAction<IFavorite | undefined>
  >;
  favorite: IFavoriteItem | undefined;
  showFavoriteOperation: boolean;
};

const OtherAccountsContext = createContext({} as OtherAccountsContextType);
export const useOtherAccountsContext = () => useContext(OtherAccountsContext);

export const OtherAccountsProvider = ({
  params,
  children,
  favorite: favoriteItem,
  isFavoriteOperation,
}: ProviderProps) => {
  const navigation = useNavigation();
  const operationStackContext = useContext(OperationStackContext);
  const {userSavings, setUserSavings} = useUserInfo();
  const [step, setStep] = useState(-1);
  const [tokenModal, setTokenModal] = useState<boolean>(false);
  const scheduleModal = useToggle();
  const [defaultOpenPicker, setDefaultOpenPicker] = useState(false);
  const [loadingFishes, setLoadingFishes] = useState<boolean>(
    params ? true : false,
  );
  const [showFavoriteOperation] = useState<boolean>(
    isFavoriteOperation ?? false,
  );
  const [favorite] = useState<IFavoriteItem | undefined>(favoriteItem);
  const [showFavoriteModal, setShowFavoriteModal] = useState<boolean>(false);
  const [showFavoriteDisclaimer, setShowFavoriteDisclaimer] =
    useState<boolean>(false);
  const [favoritePayload, setFavoritePayload] = useState<IFavorite | undefined>(
    undefined,
  );

  const closeFavoriteModal = useCallback(
    () => setShowFavoriteModal(false),
    [setShowFavoriteModal],
  );
  const openFavoriteModal = useCallback(
    () => setShowFavoriteModal(true),
    [setShowFavoriteModal],
  );

  const isTransferyLocal = params?.type === 'TRANSFERENCY_LOCAL';
  const [transferType, setTransferType] = useState<TransferType>(
    params
      ? isTransferyLocal
        ? 'CF'
        : params.transactionType === 'I'
        ? 'Inmediate-CCI'
        : 'Deferred-CCI'
      : 'CF',
  );

  const [successModal, setSuccessModal] = useState<ISuccessModal>(
    params
      ? {
          isOpen: true,
          data: {
            itfTax: params.itfTax,
            dateTransaction: params.dateTransaction,
            hourTransaction: params.hourTransaction,
            movementId: params.movementId,
            ownerFullName: params.destinationAccountName,
            email: params.email,
            dateTimeTransaction: params.dateTimeTransaction,
            ...(!isTransferyLocal && {
              originCommission: params.originCommission,
              destinationCommission: params.destinationCommission,
            }),
          },
        }
      : {isOpen: false},
  );

  const bankCodes = useRef<Map<number, string> | null>(null);

  const [queryInfo, setQueryInfo] = useState<IQueryInfo>(
    isTransferyLocal
      ? {
          itfTax: params?.itfTax ?? 0,
          destinationAccountName: params?.destinationAccountName,
          destinationAccountNumber: params?.destinationAccountNumber,
        }
      : {
          itfTax: params?.itfTax ?? 0,
          destinationAccountName:
            params?.destinationAccountName || params?.beneficiaryFullName,
          destinationAccountNumber: params?.destinationAccountNumber,
          originCommission: params?.originCommission ?? 0,
          destinationCommission: params?.destinationCommission ?? 0,
        },
  );

  const setQueryInfoData = (payload: Partial<IQueryInfo>) => {
    setQueryInfo(prevConfirmInfo => ({
      ...prevConfirmInfo,
      ...payload,
    }));
  };

  const originSavings = useMemo(
    () =>
      [
        ...(userSavings?.savings.savings ?? []),
        ...(userSavings?.compensations.savings ?? []),
      ]
        .filter(e => e.canTransact && e.balance > 0)
        .map(e => ({
          ...e,
          title: e.productName,
          subtitle: e.accountCode,
          value: `${e.currency} ${e.sBalance}`,
        }))
        .sort((a, b) => {
          if (a.currency === 'S/' && b.currency !== 'S/') {
            return -1;
          }
          if (a.currency !== 'S/' && b.currency === 'S/') {
            return 1;
          }
          return b.balance - a.balance;
        }),
    [userSavings?.savings.savings, userSavings?.compensations.savings],
  );

  const {
    values: valuesInitialForm,
    clear: clearInitialForm,
    ...initialForm
  } = useForm({
    initialValues: {
      amount: params?.amount ?? null,
      formatAmount: params?.formatAmount ?? '',
      destinationAccount:
        params?.destinationAccountNumber ??
        favorite?.valueOperationFormatted.numberAccount ??
        '',
      operationUId: params?.operationUId ?? originSavings[0]?.operationUId,
    },
    validate: rawValues => {
      const errors: FormError<InitialForm> = {};
      const errorMessage = 'Ingresa un número de cuenta correcto.';

      if (
        rawValues.destinationAccount.trim().length !== 14 &&
        rawValues.destinationAccount.trim().length !== 20 &&
        rawValues.destinationAccount.trim().length !== 0
      ) {
        errors.destinationAccount = errorMessage;
      }
      if (!validateAccount(rawValues.destinationAccount)) {
        errors.destinationAccount = errorMessage;
      }

      if (
        rawValues.destinationAccount.trim().length === 14 &&
        containsOnlyZeros(rawValues.destinationAccount)
      ) {
        errors.destinationAccount = errorMessage;
      }

      if (
        rawValues.destinationAccount.trim().length === 20 &&
        isNaN(+rawValues.destinationAccount)
      ) {
        errors.destinationAccount = errorMessage;
      }

      if (
        rawValues.destinationAccount.length === 20 &&
        !isNaN(+rawValues.destinationAccount) &&
        !isEmpty(rawValues.destinationAccount)
      ) {
        const code = parseInt(rawValues.destinationAccount.slice(0, 3));

        if (!bankCodes?.current?.has(code) || code === 91) {
          errors.destinationAccount = errorMessage;
        }
      }
      return errors;
    },
  });

  const onSetFieldInitialForm = useCallback(
    (field: keyof InitialForm, value: any) => {
      initialForm.setField(field, value);
    },
    [initialForm],
  );

  // ConfirmationCF

  const {
    values: valuesConfirmationCF,
    clear: clearConfirmationCF,
    ...formConfirmationCF
  } = useForm({
    initialValues: {
      concept: params?.concept ?? '',
    },
    validate: rawValues => {
      const newErrors: FormError<{concept: string}> = {};

      if (!isEmpty(rawValues.concept) && !validateConcept(rawValues.concept)) {
        newErrors.concept = 'Valor ingresado invalido.';
      }

      return newErrors;
    },
  });

  const onSetFieldConfirmationCF = useCallback(
    (field: keyof IConfirmationCF, value: any) => {
      formConfirmationCF.setField(field, value);
    },
    [formConfirmationCF],
  );

  // confirmationInmediate

  const {
    values: valuesConfirmationInmediate,
    clear: clearConfirmationInmediate,
    ...formConfirmationInmediate
  } = useForm({
    initialValues: {
      concept: params?.concept ?? '',
      termsAreAccepted: false,
    },
    validate: rawValues => {
      const newErrors: FormError<{concept: string}> = {};

      if (!isEmpty(rawValues.concept) && !validateConcept(rawValues.concept)) {
        newErrors.concept = 'Valor ingresado invalido.';
      }

      return newErrors;
    },
  });

  const onSetFieldConfirmationInmmediate = useCallback(
    (field: keyof IConfirmationInmediate, value: any) => {
      formConfirmationInmediate.setField(field, value);
    },
    [formConfirmationInmediate],
  );

  // confirmationDeferred

  const {
    values: valuesConfirmationDeferred,
    clear: clearConfirmationDeferred,
    ...formConfirmationDeferred
  } = useForm({
    initialValues: {
      concept: params?.concept ?? '',
      termsAreAccepted: false,
      isHolder: !isTransferyLocal ? params?.sameHeadLine : false,
    },
    validate: rawValues => {
      const newErrors: FormError<{concept: string}> = {};

      if (!isEmpty(rawValues.concept) && !validateConcept(rawValues.concept)) {
        newErrors.concept = 'Valor ingresado invalido.';
      }

      return newErrors;
    },
  });

  const onSetFieldConfirmationDeferred = useCallback(
    (field: keyof IConfirmationDeferred, value: any) => {
      formConfirmationDeferred.setField(field, value);
    },
    [formConfirmationDeferred],
  );

  // Favorite

  const {
    values: valuesFavoriteCF,
    clear: clearFavoriteCF,
    ...formFavoriteCF
  } = useForm({
    initialValues: {
      favoriteName: params?.favoriteName ?? '',
    },
  });

  const originAccount = useAccountByOperationUid({
    operationUId: valuesInitialForm.operationUId,
  });

  const originProductName = useMemo(() => {
    return originSavings
      .filter(item => item.operationUId === valuesInitialForm.operationUId)
      .map(item => item.title)[0];
  }, [originSavings, valuesInitialForm.operationUId]);

  const updateUserSavings = useCallback(async () => {
    await getUserSavings().then(res => setUserSavings(res));
  }, [setUserSavings]);

  const handleGoToHome = useCallback(() => {
    operationStackContext.disableUseFocusEffect = false;
    navigation.navigate('MainScreen');
    setSuccessModal(prev => ({...prev, isOpen: false}));
  }, [navigation, operationStackContext]);

  useEffect(() => {
    getBankCodes().then(res => {
      bankCodes.current = res;
    });
  }, []);

  const initialState: OtherAccountsContextType = useMemo(
    () => ({
      step,
      loadingFishes,
      successModal,
      originSavings,
      originAccount,
      originProductName,
      tokenModal,
      scheduleModal,
      transferType,
      defaultOpenPicker,
      showFavoriteOperation,
      favorite,
      initialForm: {
        values: valuesInitialForm,
        form: initialForm,
        clear: clearInitialForm,
        onSetField: onSetFieldInitialForm,
      },
      confirmationCF: {
        values: valuesConfirmationCF,
        form: formConfirmationCF,
        clear: clearConfirmationCF,
        onSetField: onSetFieldConfirmationCF,
      },
      confirmationInmediate: {
        values: valuesConfirmationInmediate,
        form: formConfirmationInmediate,
        clear: clearConfirmationInmediate,
        onSetField: onSetFieldConfirmationInmmediate,
      },
      confirmationDeferred: {
        values: valuesConfirmationDeferred,
        form: formConfirmationDeferred,
        clear: clearConfirmationDeferred,
        onSetField: onSetFieldConfirmationDeferred,
      },
      createFavorite: {
        values: valuesFavoriteCF,
        form: formFavoriteCF,
        clear: clearFavoriteCF,
      },
      favoriteModalUtils: {
        isOpen: showFavoriteModal,
        onClose: closeFavoriteModal,
        onOpen: openFavoriteModal,
        isOpenFavDisclaimer: showFavoriteDisclaimer,
        setFavDisclaimer: setShowFavoriteDisclaimer,
      },
      queryInfo,
      bankCodes,
      favoritePayload,
      setStep,
      handleGoToHome,
      updateUserSavings,
      setTokenModal,
      setDefaultOpenPicker,
      setSuccessModal,
      setLoadingFishes,
      setQueryInfoData,
      setTransferType,
      setFavoritePayload,
    }),
    [
      step,
      loadingFishes,
      successModal,
      originSavings,
      originAccount,
      originProductName,
      tokenModal,
      scheduleModal,
      transferType,
      defaultOpenPicker,
      valuesInitialForm,
      initialForm,
      clearInitialForm,
      onSetFieldInitialForm,
      valuesConfirmationCF,
      formConfirmationCF,
      clearConfirmationCF,
      onSetFieldConfirmationCF,
      valuesConfirmationInmediate,
      formConfirmationInmediate,
      clearConfirmationInmediate,
      onSetFieldConfirmationInmmediate,
      valuesConfirmationDeferred,
      formConfirmationDeferred,
      clearConfirmationDeferred,
      onSetFieldConfirmationDeferred,
      valuesFavoriteCF,
      formFavoriteCF,
      clearFavoriteCF,
      showFavoriteModal,
      closeFavoriteModal,
      openFavoriteModal,
      queryInfo,
      handleGoToHome,
      updateUserSavings,
      favoritePayload,
      showFavoriteDisclaimer,
      showFavoriteOperation,
      favorite,
    ],
  );

  return (
    <OtherAccountsContext.Provider value={initialState}>
      {children}
    </OtherAccountsContext.Provider>
  );
};
