import {Saving} from '@features/userInfo';
import {useLoading, useUserInfo} from '@hooks/common';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import useStoreOTP from '@hooks/useStoreOTP';
import {IDisburseLine} from '@interface/Credit';
import {LineDisbursementProps} from '@navigations/types';
import {useNavigation} from '@react-navigation/native';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useAccounts} from '../hooks';

type Terms = 'ACCOUNT_OPENING' | 'LINE_CREDIT_DISBURSE';

interface IModalError {
  show: boolean;
  title: string;
  content: string[];
  btnText: string;
  loading?: boolean;
  underlined: string[] | null;
  onClose: () => void;
}

type LineDisbursementType = {
  showSuccessModal: boolean;
  step: number;
  accounts?: Saving[];
  originAccountUId?: number;
  originAccount: Saving | null;
  withCancellation: boolean;
  tokenModal: boolean;
  modalError: IModalError;
  formatedTimeToken: string | null;
  successData: IDisburseLine | null;
  terms: {
    insurance: boolean;
    nationality: boolean;
    account: boolean;
    setInsurance: React.Dispatch<React.SetStateAction<boolean>>;
    setNationality: React.Dispatch<React.SetStateAction<boolean>>;
    setAccount: React.Dispatch<React.SetStateAction<boolean>>;
  };
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setOriginAccountUId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessData: React.Dispatch<React.SetStateAction<IDisburseLine | null>>;
  updateModal: (data: Partial<IModalError>) => void;
  goTermsAndConditions: (type: Terms) => void;
  handleGoToTransfers: () => void;
  handleShowDisbursement: () => void;
};

interface ProviderProps {
  children: ReactNode;
}

const LineDisbursementContext = createContext({} as LineDisbursementType);

export const useLineDisbursementContext = () =>
  useContext(LineDisbursementContext);

export const LineDisbursementProvider = ({children}: ProviderProps) => {
  const navigation = useNavigation<LineDisbursementProps['navigation']>();
  const {userLineCredit} = useUserInfo();
  const {setTargetScreen} = useLoading();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [termsInsurance, setTermsInsurance] = useState(false);
  const [termsNationality, setTermsNationality] = useState(false);
  const [termsAccount, setTermsAccount] = useState(false);
  const [tokenModal, setTokenModal] = useState<boolean>(false);
  const [step, setStep] = useState(-1);
  const [successData, setSuccessData] = useState<IDisburseLine | null>(null);
  const [modalError, setModalError] = useState<IModalError>({
    show: false,
    title: '',
    content: [''],
    btnText: '',
    underlined: null,
    onClose: () => {},
  });

  const lineCredit = userLineCredit?.credits[0];
  const withCancellation = !lineCredit?.isFirstDisposition ?? false;

  // TO DO: Change to the correct accounts currency
  const {accounts} = useAccounts({currency: 'S/'});
  const [originAccountUId, setOriginAccountUId] = useState(
    accounts?.[0]?.operationUId,
  );

  const originAccount = useAccountByOperationUid({
    operationUId: originAccountUId!,
  });

  const goTermsAndConditions = useCallback(
    (type: Terms) => {
      navigation.navigate('TermsAndConditions', {
        type,
      });
    },
    [navigation],
  );

  const handleGoToTransfers = useCallback(() => {
    setTargetScreen({screen: 'Transfers', from: 'Operations'});
    navigation.navigate('MainTab', {
      screen: 'MainOperations',
      params: {
        screen: 'Transfers',
      },
    });
    setShowSuccessModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const handleShowDisbursement = useCallback(() => {
    if (originAccount) {
      navigation.navigate('MainTab', {
        screen: 'Main',
        params: {
          screen: 'SavingDetail',
          params: {
            from: 'Disbursement',
            title: 'Ahorros',
            accountName: originAccount?.productName,
            accountNumber: originAccount?.accountCode,
            cci: originAccount?.accountCci,
            currency: originAccount?.currency,
            operationId: originAccount?.operationUId,
            productType: originAccount?.productType,
            sAvailableBalance: originAccount?.sBalance,
          },
        },
      });
      setShowSuccessModal(false);
    }
  }, [navigation, originAccount]);

  const updateModal = (data: Partial<IModalError>) =>
    setModalError(prevData => ({...prevData, ...data}));

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

  const initialState = useMemo(
    () => ({
      showSuccessModal,
      step,
      accounts,
      originAccountUId,
      originAccount,
      tokenModal,
      modalError,
      successData,
      withCancellation,
      formatedTimeToken,
      terms: {
        insurance: termsInsurance,
        nationality: termsNationality,
        account: termsAccount,
        setInsurance: setTermsInsurance,
        setNationality: setTermsNationality,
        setAccount: setTermsAccount,
      },
      setStep,
      setOriginAccountUId,
      setTokenModal,
      setShowSuccessModal,
      setSuccessData,
      updateModal,
      goTermsAndConditions,
      handleGoToTransfers,
      handleShowDisbursement,
    }),
    [
      accounts,
      formatedTimeToken,
      goTermsAndConditions,
      handleGoToTransfers,
      handleShowDisbursement,
      modalError,
      originAccount,
      originAccountUId,
      showSuccessModal,
      step,
      successData,
      termsAccount,
      termsInsurance,
      termsNationality,
      tokenModal,
      withCancellation,
    ],
  );

  return (
    <LineDisbursementContext.Provider value={initialState}>
      {children}
    </LineDisbursementContext.Provider>
  );
};
