import {ILoading} from '@interface/Loading';
import {ScreenKeyName} from '@navigations/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: ILoading = {
  loading: false,
  confirmLoading: false,
  confirmPopUp: {
    isVisible: false,
    message: '',
  },
  hideTabBar: false,
  currentOperationScreen: '',
  targetScreen: {},
  showPopUp: false,
  isFormComplete: false,
  lastTokenUsed: null,
  lastTokenUsedOpening: null,
  persistSameBankData: false,
  showTokenModal: false,
  showWelcomeModal: false,
  showInteroperabilityModal: false,
  displayErrorModal: {
    isOpen: false,
    errorCode: '',
    message: {
      title: '',
      content: '',
    },
  },
  showOfflineModal: false,
  showSessionStatus: false,
  showExpiredSessionToken: false,
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    isLoading: (state, action) => {
      state.loading = action.payload;
    },
    isConfirmLoading: (state, action) => {
      state.confirmLoading = action.payload;
    },
    isConfirmPopUp: (state, action) => {
      state.confirmPopUp = action.payload;
    },
    hideTabBar: (state, action) => {
      state.hideTabBar = action.payload;
    },
    setCurrentOperationScreen: (state, action) => {
      state.currentOperationScreen = action.payload;
    },
    setTargetScreen: (
      state,
      action: PayloadAction<{from?: ScreenKeyName; screen: ScreenKeyName}>,
    ) => {
      const {from, screen} = action.payload;
      state.targetScreen = {
        ...state.targetScreen,
        [screen]: from,
      };
    },
    setShowPopUp: (state, action) => {
      state.showPopUp = action.payload;
    },
    setIsFormComplete: (state, action) => {
      state.isFormComplete = action.payload;
    },
    setPersistSameBankData: (state, action) => {
      state.persistSameBankData = action.payload;
    },
    setShowTokenModal: (state, action) => {
      state.showTokenModal = action.payload;
    },
    setShowWelcomeModal: (state, action) => {
      state.showWelcomeModal = action.payload;
    },
    setShowInteroperabilityModal: (state, action) => {
      state.showInteroperabilityModal = action.payload;
    },
    setShowOfflineModal: (state, action) => {
      state.showOfflineModal = action.payload;
    },
    setShowSessionStatus: (state, action) => {
      state.showSessionStatus = action.payload;
    },
    setShowExpiredTokenSession: (state, action) => {
      state.showExpiredSessionToken = action.payload;
    },
    setDisplayErrorModal: (state, action) => {
      state.displayErrorModal = action.payload;
    },
    setLastTokenUsed: (state, action) => {
      state.lastTokenUsed = action.payload;
    },
    setLastTokenUsedOpening: (state, action) => {
      state.lastTokenUsedOpening = action.payload;
    },
    purgeLoadingState: state => {
      // TODO: Return to initialState
      // state = initialState;
      state.showWelcomeModal = true;
    },
  },
});

export const {
  purgeLoadingState,
  setShowWelcomeModal,
  setShowInteroperabilityModal,
  setShowOfflineModal,
  setShowSessionStatus,
  setShowTokenModal,
  isLoading,
  isConfirmLoading,
  isConfirmPopUp,
  hideTabBar,
  setCurrentOperationScreen,
  setShowPopUp,
  setTargetScreen,
  setIsFormComplete,
  setPersistSameBankData,
  setDisplayErrorModal,
  setLastTokenUsed,
  setLastTokenUsedOpening,
  setShowExpiredTokenSession,
} = loadingSlice.actions;

export default loadingSlice.reducer;
