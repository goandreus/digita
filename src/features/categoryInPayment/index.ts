import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ICategory, IDebts} from './types';

export const categoryInPayment = createSlice({
  name: 'categoryInPayment',
  initialState: (): ICategory | null => {
    return null;
  },
  reducers: {
    updateDebts: (state, action: PayloadAction<IDebts>) => {
      if (state !== null) {
        state.debts = action.payload;
      }
    },
    update: (state, action: PayloadAction<ICategory>) => {
      return action.payload;
    },
    clean: state => {
      return null;
    },
  },
});

export const {update, clean, updateDebts} = categoryInPayment.actions;

export default categoryInPayment.reducer;
