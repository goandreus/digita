import {has, storage} from '@utils/secure-storage';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface BalanceVisibilityState {
  balanceVisibility: boolean | undefined;
}

const initialBalanceVisibility = has('balanceVisibility')
  ? storage.getBoolean('balanceVisibility')
  : true;

const initialState: BalanceVisibilityState = {
  balanceVisibility: has('balanceVisibility') ? initialBalanceVisibility : true,
};

const balanceVisibilitySlice = createSlice({
  name: 'balanceVisibility',
  initialState,
  reducers: {
    setBalanceVisibility: (state, action: PayloadAction<boolean>) => {
      state.balanceVisibility = action.payload;
      storage.set('balanceVisibility', action.payload);
    },
  },
});

export const {setBalanceVisibility} = balanceVisibilitySlice.actions;

export default balanceVisibilitySlice.reducer;
