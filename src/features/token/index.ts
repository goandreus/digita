import {createSlice} from '@reduxjs/toolkit';

interface InitialState {
  backButton: boolean;
}

const initialState: InitialState = {
  backButton: false,
};

export const tokenSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setBackButton: (state, action) => {
      state.backButton = action.payload;
    },
  },
});

export const {setBackButton} = tokenSlice.actions;

export default tokenSlice.reducer;
