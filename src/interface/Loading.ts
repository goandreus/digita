import {RootStackParamList, ScreenKeyName} from '@navigations/types';

export interface ILoading {
  loading: boolean;
  confirmLoading: boolean;
  confirmPopUp: IConfirmPopUp;
  hideTabBar: boolean;
  currentOperationScreen: string;
  targetScreen: {
    [key in keyof RootStackParamList]: ScreenKeyName;
  };

  showPopUp: boolean;
  isFormComplete: boolean;
  lastTokenUsed: number | null;
  lastTokenUsedOpening: number | null;
  persistSameBankData: boolean;
  showTokenModal: boolean;
  showWelcomeModal: boolean;
  showInteroperabilityModal: boolean;
  displayErrorModal: IDisplayErrorModal;
  showOfflineModal: boolean;
  showSessionStatus: boolean;
  showExpiredSessionToken: boolean;
}

export interface IConfirmPopUp {
  isVisible: boolean;
  message: string;
}

export interface IDisplayErrorModal {
  isOpen: boolean;
  errorCode?: string;
  message: IMessage;
}

export interface IMessage {
  title: string;
  content: string;
}
