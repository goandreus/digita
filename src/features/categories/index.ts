import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICategory } from './types';

export const categories = createSlice({
    name: 'categories',
    initialState: (): ICategory[] => {
        return [];
    },
    reducers: {
        update: (state, action: PayloadAction<ICategory[]>) => {
            return action.payload;
        },
        clean: state => {
            return [];
        },
    },
});

export const { update, clean } = categories.actions;

export default categories.reducer;
