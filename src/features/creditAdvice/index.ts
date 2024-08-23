import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CreditAdviceType, ICreditAdvice} from '@interface/CreditAdvice';

const initialState: ICreditAdvice = {
  showAdvice: false,
  showDisbursement: false,
  amount: '',
  banners: {
    CI: false,
    CG: false,
    LC: false,
  },
};

export const creditAdviceSlide = createSlice({
  name: 'creditAdvice',
  initialState,
  reducers: {
    setShowCreditAdvice: (state, action) => {
      state.showAdvice = action.payload;
    },
    setAmountCreditAdvice: (state, action) => {
      state.amount = action.payload;
    },
    setShowDisbursement: (state, action) => {
      state.showDisbursement = action.payload;
    },
    setBanners: (
      state,
      action: PayloadAction<{[key in CreditAdviceType]?: boolean}>,
    ) => {
      state.banners = {...state.banners, ...action.payload};
    },
    purgeState: state => (state = initialState),
  },
});

export const {
  setShowCreditAdvice,
  setAmountCreditAdvice,
  setShowDisbursement,
  setBanners,
  purgeState,
} = creditAdviceSlide.actions;

export default creditAdviceSlide.reducer;
