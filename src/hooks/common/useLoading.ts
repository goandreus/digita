import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {
  isLoading as setLoading,
  isConfirmLoading as setConfirmLoading,
  isConfirmPopUp as setConfirmPopUp,
  hideTabBar,
  setCurrentOperationScreen as setCurrentOperation,
  setTargetScreen as targetScreen,
  setShowPopUp as showPopUp,
  setIsFormComplete as isFormComplete,
  setPersistSameBankData as persistSameBankData,
  setShowTokenModal as showTokenModal,
  setShowWelcomeModal as showWelcomeModal,
  setShowInteroperabilityModal as showInteroperabilityModal,
  setShowOfflineModal as showOfflineModal,
  setShowSessionStatus as showSessionStatus,
  setShowExpiredTokenSession as showExpiredTokenSession,
  setDisplayErrorModal as displayErrorModal,
  purgeLoadingState as purge,
  setLastTokenUsed as setToken,
  setLastTokenUsedOpening as setTokenOpening,
} from '@features/loading';
import {ILoading, IConfirmPopUp, IDisplayErrorModal} from '@interface/Loading';
import {useCallback} from 'react';
import {ScreenKeyName} from '@navigations/types';

export const useLoading = () => {
  const loading: ILoading = useAppSelector(state => state.loading);
  const dispatch = useAppDispatch();

  const isLoading = (payload: boolean) => dispatch(setLoading(payload));
  const isConfirmLoading = (payload: boolean) =>
    dispatch(setConfirmLoading(payload));

  const isConfirmPopUp = (payload: IConfirmPopUp) =>
    dispatch(setConfirmPopUp(payload));

  const setHideTabBar = (payload: boolean) => dispatch(hideTabBar(payload));
  const setCurrentOperationScreen = (payload: string) =>
    dispatch(setCurrentOperation(payload));

  const setTargetScreen = (payload: {
    from?: ScreenKeyName;
    screen: ScreenKeyName;
  }) => dispatch(targetScreen(payload));
  const setShowPopUp = (payload: boolean) => dispatch(showPopUp(payload));
  const setIsFormComplete = (payload: boolean) =>
    dispatch(isFormComplete(payload));

  const setPersistSameBankData = (payload: boolean) =>
    dispatch(persistSameBankData(payload));

  const setShowTokenModal = (payload: boolean) =>
    dispatch(showTokenModal(payload));

  const setShowWelcomeModal = (payload: boolean) =>
    dispatch(showWelcomeModal(payload));

  const setShowInteroperabilityModal = (payload: boolean) =>
    dispatch(showInteroperabilityModal(payload));

  const setShowOfflineModal = (payload: boolean) =>
    dispatch(showOfflineModal(payload));

  const setShowSessionStatus = (payload: boolean) =>
    dispatch(showSessionStatus(payload));

  const setShowExpiredTokenSession = useCallback(
    (payload: boolean) => dispatch(showExpiredTokenSession(payload)),
    [dispatch],
  );

  const setDisplayErrorModal = useCallback(
    (payload: IDisplayErrorModal) => dispatch(displayErrorModal(payload)),
    [dispatch],
  );

  const setLastTokenUsed = useCallback(
    (payload: number) => dispatch(setToken(payload)),
    [dispatch],
  );

  const setLastTokenUsedOpening = useCallback(
    (payload: number) => dispatch(setTokenOpening(payload)),
    [dispatch],
  );

  const purgeLoadingState = () => dispatch(purge());

  return {
    ...loading,
    isLoading,
    isConfirmLoading,
    isConfirmPopUp,
    setHideTabBar,
    setCurrentOperationScreen,
    setTargetScreen,
    setShowPopUp,
    setIsFormComplete,
    setPersistSameBankData,
    setShowTokenModal,
    setShowWelcomeModal,
    setShowInteroperabilityModal,
    setShowOfflineModal,
    setShowSessionStatus,
    setShowExpiredTokenSession,
    setDisplayErrorModal,
    setLastTokenUsed,
    setLastTokenUsedOpening,
    purgeLoadingState,
  };
};
