import {useUserInfo} from '@hooks/common';
import useStoreOTP from '@hooks/useStoreOTP';
import {IContractedCredit} from '@interface/Credit';
import {GroupCreditContractScreenProps} from '@navigations/types';
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

type Terms = 'GROUP_CREDIT_SHORT' | 'GROUP_CREDIT_LONG' | 'GROUP_INSURANCE';

type GroupCreditContractContextType = {
  step: number;
  showSuccessModal: boolean;
  tokenModal: boolean;
  modalError: IModalError;
  successData: IContractedCredit | null;
  hasInsurance: boolean;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateModal: (data: Partial<IModalError>) => void;
  setSuccessData: React.Dispatch<
    React.SetStateAction<IContractedCredit | null>
  >;
  formatedTimeToken: string | null;
  terms: {
    degravamen: boolean;
    insurance: boolean;
    setDegravamen: React.Dispatch<React.SetStateAction<boolean>>;
    setInsurance: React.Dispatch<React.SetStateAction<boolean>>;
  };
  onCloseErrorModal: () => void;
  goHome: () => void;
  goTermsAndConditions: (type: Terms) => void;
};
interface IModalError {
  show: boolean;
  title: string;
  content: string;
  btnText: string;
  loading?: boolean;
  onClose: () => void;
}

interface ProviderProps {
  children: ReactNode;
}

const GroupCreditContractContext = createContext(
  {} as GroupCreditContractContextType,
);

export const useGroupCreditContractContext = () =>
  useContext(GroupCreditContractContext);

export const GroupCreditContractProvider = ({children}: ProviderProps) => {
  const navigation =
    useNavigation<GroupCreditContractScreenProps['navigation']>();
  const {userGroupCreditToDisburt, setUserGroupCreditToDisburt} = useUserInfo();
  const [step, setStep] = useState(-1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [termsDegravamen, setTermsDegravamen] = useState(false);
  const [termsInsurance, setTermsInsurance] = useState(false);
  const [tokenModal, setTokenModal] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<IContractedCredit | null>(
    null,
  );
  const [modalError, setModalError] = useState<IModalError>({
    show: false,
    title: '',
    content: '',
    btnText: '',
    onClose: () => {},
  });

  const hasInsurance = userGroupCreditToDisburt?.hasInsuranceGroup !== 'S';

  const goHome = useCallback(() => {
    setShowSuccessModal(false);
    setUserGroupCreditToDisburt(null);
    navigation.navigate('MainTab', {
      screen: 'Main',
      params: {
        screen: 'MainScreen',
      },
    });
  }, [navigation, setUserGroupCreditToDisburt]);

  const goTermsAndConditions = useCallback(
    (type: Terms) => {
      navigation.navigate('TermsAndConditions', {
        type,
      });
    },
    [navigation],
  );

  const updateModal = (data: Partial<IModalError>) =>
    setModalError(prevData => ({...prevData, ...data}));

  const {timeUntilNextToken} = useStoreOTP();

  const formatedTimeToken = timeUntilNextToken
    ? timeUntilNextToken >= 10
      ? `${timeUntilNextToken}`
      : `0${timeUntilNextToken}`
    : null;

  const onCloseErrorModal = useCallback(() => {
    updateModal({show: false});
    navigation.navigate('MainTab', {
      screen: 'Main',
      params: {
        screen: 'MainScreen',
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (tokenModal && timeUntilNextToken === 0) {
      setTokenModal(false);
    }
  }, [setTokenModal, timeUntilNextToken, tokenModal]);

  const initialState: GroupCreditContractContextType = useMemo(
    () => ({
      step,
      showSuccessModal,
      tokenModal,
      modalError,
      successData,
      hasInsurance,
      setStep,
      setShowSuccessModal,
      setTokenModal,
      updateModal,
      setSuccessData,
      formatedTimeToken,
      terms: {
        degravamen: termsDegravamen,
        insurance: termsInsurance,
        setDegravamen: setTermsDegravamen,
        setInsurance: setTermsInsurance,
      },
      goHome,
      goTermsAndConditions,
      onCloseErrorModal,
    }),
    [
      step,
      showSuccessModal,
      tokenModal,
      modalError,
      successData,
      hasInsurance,
      formatedTimeToken,
      termsDegravamen,
      termsInsurance,
      goHome,
      goTermsAndConditions,
      onCloseErrorModal,
    ],
  );

  return (
    <GroupCreditContractContext.Provider value={initialState}>
      {children}
    </GroupCreditContractContext.Provider>
  );
};
