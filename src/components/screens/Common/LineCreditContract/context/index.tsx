import {useUserInfo} from '@hooks/common';
import {ILineCredit} from '@interface/Credit';
import {LineCreditContractScreenProps} from '@navigations/types';
import {useNavigation} from '@react-navigation/native';
import {ListLineCredit} from '@services/CreditLine';
import {getRemoteValue} from '@utils/firebase';
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

type Terms = 'LINE_CREDIT_CONTRACT';

type LineCreditContractType = {
  step: number;
  terms: boolean;
  showSuccessModal: boolean;
  loadNavigation: boolean;
  successData: ILineCredit | null;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setTerms: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessData: React.Dispatch<React.SetStateAction<ILineCredit | null>>;
  goTermsAndConditions: (type: Terms) => void;
  goKnowMore: () => void;
  goHome: () => void;
  goSimulation: () => void;
};

interface ProviderProps {
  children: ReactNode;
}

const LineCreditContractContext = createContext({} as LineCreditContractType);

export const useLineCreditContractContext = () =>
  useContext(LineCreditContractContext);

export const LineCreditContractProvider = ({children}: ProviderProps) => {
  const navigation =
    useNavigation<LineCreditContractScreenProps['navigation']>();
  const {setUserCreditToDisburt, setUserLineCredit} = useUserInfo();
  const [step, setStep] = useState(-1);
  const [terms, setTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<ILineCredit | null>(null);
  const [loadNavigation, setLoadNavigation] = useState(false);
  const naveTo = useRef<string | null>(null);

  const canDisburseLC = getRemoteValue(
    'trx_credit_line_disbursement',
  ).asBoolean();

  const goTermsAndConditions = useCallback(
    (type: Terms) => {
      navigation.navigate('TermsAndConditions', {
        type,
      });
    },
    [navigation],
  );

  const goKnowMore = useCallback(() => {
    navigation.navigate('KnowMoreLineCredit', {
      amount: 1000,
    });
  }, [navigation]);

  const getLineCredit = useCallback(async () => {
    const lineCredit = await ListLineCredit({});
    if (lineCredit.data && lineCredit.isSuccess)
      setUserLineCredit(lineCredit.data);
  }, [setUserLineCredit]);

  const goSimulation = useCallback(() => {
    if (!canDisburseLC) return;
    setLoadNavigation(true);
    getLineCredit();
    setShowSuccessModal(false);
    setUserCreditToDisburt(null);
    naveTo.current = 'lineSimulation';
  }, [canDisburseLC, getLineCredit, setUserCreditToDisburt]);

  const goHome = useCallback(() => {
    getLineCredit();
    setShowSuccessModal(false);
    setUserCreditToDisburt(null);
    naveTo.current = 'home';
  }, [getLineCredit, setUserCreditToDisburt]);

  useEffect(() => {
    if (!showSuccessModal && naveTo.current) {
      setLoadNavigation(false);
      if (naveTo.current === 'home')
        navigation.navigate('MainTab', {
          screen: 'MainCredits',
          params: {
            screen: 'MyCredits',
          },
        });
      else
        navigation.navigate('OperationsStack', {
          screen: 'LineSimulation',
        });
    }
  }, [navigation, showSuccessModal]);

  const initialState = useMemo(
    () => ({
      step,
      terms,
      showSuccessModal,
      loadNavigation,
      successData,
      setStep,
      setTerms,
      setSuccessData,
      setShowSuccessModal,
      goTermsAndConditions,
      goKnowMore,
      goHome,
      goSimulation,
    }),
    [
      step,
      terms,
      showSuccessModal,
      loadNavigation,
      successData,
      goTermsAndConditions,
      goKnowMore,
      goHome,
      goSimulation,
    ],
  );

  return (
    <LineCreditContractContext.Provider value={initialState}>
      {children}
    </LineCreditContractContext.Provider>
  );
};
