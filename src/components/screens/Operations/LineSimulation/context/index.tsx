import {IQuotaItem, QUOTAS_LIST} from '@global/lists';
import {useUserInfo} from '@hooks/common';
import {LineSimulationProps} from '@navigations/types';
import {
  IListLineCreditDetail,
  IRequestLineCredit,
  ISimulationLine,
} from '@interface/Credit';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {BackHandler} from 'react-native';
import {useAccounts} from '../hooks/useAccounts';

interface IModalError {
  show: boolean;
  title: string;
  content: string;
  btnText: string;
  errors?: string[];
  onClose: () => void;
}

type LineSimulationType = {
  amountValue: number | null;
  amountValueText: string;
  payDay: IQuotaItem | undefined;
  showModal: boolean;
  loading: boolean;
  simulationData: ISimulationLine | null;
  modalError: IModalError;
  selectedQuota: number | null;
  lineCredit: IListLineCreditDetail | undefined;
  limits: {
    isMaxDeadline: boolean;
    minQuota: number;
    maxQuota: number;
    minAmount: number;
    maxAmount: number;
  };
  withCancellation: boolean;
  setAmountValue: React.Dispatch<React.SetStateAction<number | null>>;
  setAmountValueText: React.Dispatch<React.SetStateAction<string>>;
  setPayDay: React.Dispatch<React.SetStateAction<IQuotaItem | undefined>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSimulationData: React.Dispatch<
    React.SetStateAction<ISimulationLine | null>
  >;
  setSelectedQuota: React.Dispatch<React.SetStateAction<number | null>>;
  updateModal: (data: Partial<IModalError>) => void;
  goCredits: () => void;
  goDisbursment: (data: IRequestLineCredit) => void;
};

interface ProviderProps {
  children: ReactNode;
}

const LineSimulationContext = createContext({} as LineSimulationType);

export const useLineSimulationContext = () => useContext(LineSimulationContext);

export const LineSimulationProvider = ({children}: ProviderProps) => {
  const {accounts} = useAccounts({currency: 'S/'});
  const navigation = useNavigation<LineSimulationProps['navigation']>();
  const {userLineCredit} = useUserInfo();
  const [amountValue, setAmountValue] = useState<number | null>(null);
  const [amountValueText, setAmountValueText] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [simulationData, setSimulationData] = useState<ISimulationLine | null>(
    null,
  );
  const [modalError, setModalError] = useState<IModalError>({
    show: false,
    title: '',
    content: '',
    btnText: '',
    onClose: () => {},
  });

  const lineCredit = userLineCredit?.credits[0];

  const updateModal = (data: Partial<IModalError>) =>
    setModalError(prevData => ({...prevData, ...data}));

  const withCancellation = !lineCredit?.isFirstDisposition ?? false;

  const getQuotaItemByDay = (day: string) => {
    const quota = QUOTAS_LIST.find(e => e.value === day);
    return quota;
  };

  const [payDay, setPayDay] = useState<IQuotaItem | undefined>(
    lineCredit?.paymentDay
      ? getQuotaItemByDay(String(lineCredit?.paymentDay))
      : undefined,
  );

  const goCredits = useCallback(() => {
    navigation.navigate('MainTab', {
      screen: 'MainCredits',
      params: {
        screen: 'MyCredits',
      },
    });
  }, [navigation]);

  const goDisbursment = useCallback(
    (data: IRequestLineCredit) => {
      setShowModal(false);
      navigation.navigate('OperationsStack', {
        screen: 'LineDisbursement',
        params: {
          hasSavings: accounts ? accounts.length > 0 : false,
          ...data,
        },
      });
    },
    [accounts, navigation],
  );

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          goCredits();
          return true;
        },
      );

      return () => backHandler.remove();
    }, [goCredits]),
  );

  const limits = useMemo(() => {
    const quotas: number[] | undefined = userLineCredit?.limitAmounts.map(
      item => Number(item.value),
    );
    const amounts: number[] | undefined = userLineCredit?.deadlines.map(item =>
      Number(item.value),
    );

    const maxAmount = Math.max(...(amounts ?? []));
    const isMaxDeadline =
      maxAmount < (lineCredit?.availableCreditLineAmount ?? 0);

    return {
      isMaxDeadline,
      minQuota: Math.min(...(quotas ?? [])),
      maxQuota: Math.max(...(quotas ?? [])),
      minAmount: Math.min(...(amounts ?? [])),
      maxAmount: isMaxDeadline
        ? maxAmount
        : lineCredit?.availableCreditLineAmount ?? 0,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineCredit?.availableCreditLineAmount]);

  const initialState = useMemo(
    () => ({
      amountValue,
      amountValueText,
      showModal,
      loading,
      modalError,
      simulationData,
      lineCredit,
      payDay,
      selectedQuota,
      limits,
      withCancellation,
      setAmountValue,
      setAmountValueText,
      setPayDay,
      setSelectedQuota,
      setShowModal,
      setLoading,
      setSimulationData,
      updateModal,
      goCredits,
      goDisbursment,
    }),
    [
      amountValue,
      amountValueText,
      showModal,
      loading,
      modalError,
      simulationData,
      lineCredit,
      payDay,
      selectedQuota,
      limits,
      withCancellation,
      goCredits,
      goDisbursment,
    ],
  );

  return (
    <LineSimulationContext.Provider value={initialState}>
      {children}
    </LineSimulationContext.Provider>
  );
};
