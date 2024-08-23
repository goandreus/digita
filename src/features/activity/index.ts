import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IActivity {
    isIdle: boolean;
    isNetworkOffline: boolean;
    isTokenExpired: boolean;
}

export const activity = createSlice({
    name: 'activity',
    initialState: (): IActivity => {
        return {
            isIdle: false,
            isNetworkOffline: false,
            isTokenExpired: false,
        };
    },
    reducers: {
        update: (state, action: PayloadAction<{
            isIdle?: boolean;
            isNetworkOffline?: boolean;
            isTokenExpired?: boolean;
        }>) => {
            return { ...state, ...action.payload };
        }
    },
});

export const { update } = activity.actions;

export default activity.reducer;
