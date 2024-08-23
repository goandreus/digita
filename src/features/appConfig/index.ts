import {createSlice} from '@reduxjs/toolkit';

interface appConfig {
  operationTypes: {
    canTransactToOwnAccounts: boolean;
    canTransactToSameBanks: boolean;
    canTransactToOtherBanks: boolean;
  };
  productTypes: {
    canShowSavings: boolean;
    canShowCredits: boolean;
  };
  showNeedSavingModal: boolean;
  showCreditPunishedModal: boolean;
  showScheduleModal: boolean;
}

const initialState: appConfig = {
  operationTypes: {
    canTransactToOwnAccounts: true,
    canTransactToSameBanks: true,
    canTransactToOtherBanks: true,
  },
  productTypes: {
    canShowSavings: true,
    canShowCredits: true,
  },
  showNeedSavingModal: false,
  showCreditPunishedModal: false,
  showScheduleModal: false,
};

export const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    setOperationTypes: (state, action) => {
      state.operationTypes = action.payload;
    },
    setProductTypes: (state, action) => {
      state.productTypes = action.payload;
    },
    setShowNeedSavingModal: (state, action) => {
      state.showNeedSavingModal = action.payload;
    },
    setShowCreditPunishedModal: (state, action) => {
      state.showCreditPunishedModal = action.payload;
    },
    setShowScheduleModal: (state, action) => {
      state.showScheduleModal = action.payload;
    },
  },
});

export const {
  setOperationTypes,
  setProductTypes,
  setShowNeedSavingModal,
  setShowCreditPunishedModal,
  setShowScheduleModal,
} = appConfigSlice.actions;

export default appConfigSlice.reducer;
