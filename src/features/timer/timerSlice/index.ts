import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface TimerState {
  documentNumber: string;
  documentType: number;
  startedAt: number;
}

const initialState: TimerState[] = [];

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    restart: (
      state,
      action: PayloadAction<{
        documentNumber: string;
        documentType: number;
      }>,
    ) => {
      const now = new Date().getTime();
      const elementIndex = state.findIndex(
        item =>
          item.documentNumber === action.payload.documentNumber &&
          item.documentType === action.payload.documentType,
      );

      if (elementIndex === -1)
        state.push({
          documentType: action.payload.documentType,
          documentNumber: action.payload.documentNumber,
          startedAt: now,
        });
      else state[elementIndex].startedAt = now;
    },
  },
});

export const {restart} = timerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.timer.value;

export default timerSlice.reducer;
