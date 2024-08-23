import {BackHandler} from 'react-native';
import {useLoading} from '@hooks/common';
import {OtherBanksScreenProps} from '@navigations/types';
import {useFocusEffect} from '@react-navigation/native';
import {
  useCallback,
  useState,
  useContext,
  useLayoutEffect,
  useEffect,
} from 'react';
import {StackActions} from '@react-navigation/native';
import {OperationStackContext} from '@contexts/OperationStackContext';
import useStoreOTP from '@hooks/useStoreOTP';
import {useOtherAccountsContext} from '../contexts';
import {useInitialForm} from './useInitialForm';
import {useConfirmationCF} from './useConfirmationCF';
import {useConfirmationInmediate} from './useConfirmationInmediate';
import {useConfirmationDeferred} from './useConfirmationDeferred';
import {ErrorResponse} from '@global/information';

type ConfirmToExit =
  | {
      isOpen: false;
    }
  | {
      isOpen: true;
      onAccept: () => void;
    };

export const useOtherAccounts = ({navigation}: OtherBanksScreenProps) => {
  const operationStackContext = useContext(OperationStackContext);
  const [confirmToExit, setConfirmToExit] = useState<ConfirmToExit>({
    isOpen: false,
  });

  const {
    initialForm,
    step,
    setStep,
    transferType,
    tokenModal,
    setTokenModal,
    setDefaultOpenPicker,
    confirmationCF: {clear: clearConfirmationCF},
    confirmationInmediate: {clear: clearConfirmationInmediate},
    confirmationDeferred: {clear: clearConfirmationDeferred},
    createFavorite,
    setFavoritePayload,
  } = useOtherAccountsContext();

  const {
    values: {destinationAccount},
  } = initialForm;
  const {
    values: {favoriteName},
  } = createFavorite;
  const isAddedFavorite = favoriteName.length > 0 ? true : false;

  const {
    loadingInitialForm,
    isBtnInitialFormDisabled,
    handleSubmitInitialForm,
  } = useInitialForm();

  const {isBtnConfirmationCFDisabled, handleSubmitConfirmationCF} =
    useConfirmationCF();

  const {
    isBtnConfirmationInmediateDisabled,
    handleSubmitConfirmationInmediate,
  } = useConfirmationInmediate();

  const {isBtnConfirmationDeferredDisabled, handleSubmitConfirmationDeferred} =
    useConfirmationDeferred();

  const {displayErrorModal, setDisplayErrorModal} = useLoading();

  const closeConfirmToExit = () => setConfirmToExit({isOpen: false});

  const {timeUntilNextToken} = useStoreOTP();

  const formatedTimeToken = timeUntilNextToken
    ? timeUntilNextToken >= 10
      ? `${timeUntilNextToken}`
      : `0${timeUntilNextToken}`
    : null;

  const actions = {
    CF: {
      isBtnDisabled: isBtnConfirmationCFDisabled,
      handleSubmitConfirm: handleSubmitConfirmationCF,
    },
    'Inmediate-CCI': {
      isBtnDisabled: isBtnConfirmationInmediateDisabled,
      handleSubmitConfirm: handleSubmitConfirmationInmediate,
    },
    'Deferred-CCI': {
      isBtnDisabled: isBtnConfirmationDeferredDisabled,
      handleSubmitConfirm: handleSubmitConfirmationDeferred,
    },
  };

  const isBtnDisabled =
    step <= 0 ? isBtnInitialFormDisabled : actions[transferType].isBtnDisabled;

  const handleSubmit =
    step <= 0
      ? handleSubmitInitialForm
      : actions[transferType].handleSubmitConfirm;

  const errorModalBtnTitle =
    displayErrorModal.errorCode === ErrorResponse.CHANGE_ACCOUNT
      ? 'Elegir otra cuenta'
      : 'Entendido';

  const goBack = useCallback(() => {
    if (step !== 0) {
      setStep(prevStep => prevStep - 1);
      clearConfirmationCF();
      clearConfirmationInmediate();
      clearConfirmationDeferred();
      return;
    }
    operationStackContext.disableUseFocusEffect = false;
    navigation.dispatch(StackActions.pop());
  }, [
    clearConfirmationCF,
    clearConfirmationDeferred,
    clearConfirmationInmediate,
    navigation,
    operationStackContext,
    setStep,
    step,
  ]);

  const onCloseErrorModal = () => {
    if (displayErrorModal.errorCode === ErrorResponse.CHANGE_ACCOUNT) {
      setDefaultOpenPicker(true);
      if (step === 1) setStep(0);
    } else if (displayErrorModal.errorCode === ErrorResponse.UNCONTROLLED) {
      navigation.navigate('Main');
    }
    setDisplayErrorModal({
      isOpen: false,
      errorCode: '',
      message: displayErrorModal.message,
    });
  };

  useEffect(() => {
    const id = setTimeout(() => {
      setStep(0);
    }, 500);
    return () => clearTimeout(id);
  }, [setStep]);

  useEffect(() => {
    if (tokenModal && timeUntilNextToken === 0) {
      setTokenModal(false);
    }
  }, [setTokenModal, timeUntilNextToken, tokenModal]);

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
      if (e.data.action.type === 'POP') {
        e.preventDefault();
        setConfirmToExit({
          isOpen: true,
          onAccept: () => navigation.dispatch(e.data.action),
        });
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  const isBtnFavoriteDisable = favoriteName.length !== 0;

  const handleSaveFavorite = () => {
    const payload = {
      alias: favoriteName,
      operationType: 0,
      valueOperation: JSON.stringify({numberAccount: destinationAccount}),
    };
    setFavoritePayload(payload);
  };

  return {
    confirmToExit,
    formatedTimeToken,
    displayErrorModal,
    loadingInitialForm,
    isBtnDisabled,
    errorModalBtnTitle,
    isBtnFavoriteDisable,
    onCloseErrorModal,
    handleSubmit,
    handleSaveFavorite,
    setDisplayErrorModal,
    closeConfirmToExit,
    goBack,
  };
};
