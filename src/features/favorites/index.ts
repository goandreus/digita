import {IFavorite} from '@interface/Favorite';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface FavoriteState {
  favorites: IFavorite[];
  isGetFavoritesLoading: boolean;
  isAddFavoriteLoading: boolean;
  isUpdateFavoriteLoading: boolean;
  isRemoveFavoriteLoading: boolean;
}

const initialState: FavoriteState = {
  favorites: [],
  isGetFavoritesLoading: false,
  isAddFavoriteLoading: false,
  isUpdateFavoriteLoading: false,
  isRemoveFavoriteLoading: false,
};

const favoritesSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    getFavoriteStart: state => ({
      ...state,
      isGetFavoritesLoading: true,
    }),
    getFavoriteSuccess: (state, {payload}: PayloadAction<IFavorite[]>) => ({
      ...state,
      favorites: payload,
      isGetFavoritesLoading: false,
    }),
    addFavoriteStart: state => ({
      ...state,
      isAddFavoriteLoading: true,
    }),
    addFavoriteSuccess: state => ({
      ...state,
      isAddFavoriteLoading: false,
    }),
    updateFavoriteStart: state => ({
      ...state,
      isUpdateFavoriteLoading: true,
    }),
    updateFavoriteSuccess: state => ({
      ...state,
      isUpdateFavoriteLoading: false,
    }),
    removeFavoriteStart: state => ({
      ...state,
      isRemoveFavoriteLoading: true,
    }),
    removeFavoriteSuccess: state => ({
      ...state,
      isRemoveFavoriteLoading: false,
    }),
  },
});

export const {
  getFavoriteStart,
  getFavoriteSuccess,
  addFavoriteStart,
  addFavoriteSuccess,
  updateFavoriteStart,
  updateFavoriteSuccess,
  removeFavoriteStart,
  removeFavoriteSuccess,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
