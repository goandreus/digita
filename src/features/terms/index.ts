import {createSlice} from '@reduxjs/toolkit';

interface InitialState {
  terms: boolean;
}

const initialState: InitialState = {
  terms: false,
};

export const termsSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setTerms: (state, action) => {
      state.terms = action.payload;
    },
  },
});

export const {setTerms} = termsSlice.actions;

export default termsSlice.reducer;
