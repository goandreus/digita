import { TokenManager } from '@managers/TokenManager';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export const authBiometry = createSlice({
  name: 'authBiometry',
  initialState: (): IAuthBiometry => {
    return {
      extraData: undefined
    };
  },
  reducers: {
    update: (state, action: PayloadAction<IAuthBiometry>) => {
      if(action.payload.extraData !== undefined){
        TokenManager.getInstance().updateToken(
          'TOKEN_TRACKING',
          action.payload.extraData,
        );
      }
      return action.payload;
    },
    reset: state => {
      return {
        extraData: undefined
      };
    },
  },
});

export const {update, reset} = authBiometry.actions;

export default authBiometry.reducer;
