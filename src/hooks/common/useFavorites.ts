import {
  getFavoriteStart,
  getFavoriteSuccess,
  addFavoriteStart,
  addFavoriteSuccess,
  updateFavoriteStart,
  updateFavoriteSuccess,
  removeFavoriteStart,
  removeFavoriteSuccess,
} from '@features/favorites';
import {IFavoriteDTO, IFavorite, IFavoriteUpdate} from '@interface/Favorite';
import {retrieveFavorites} from '@services/Transactions';
import {useCallback} from 'react';
import {useAppSelector} from '../useAppSelector';
import {useAppDispatch} from '../useAppDispatch';
import {
  addFavorite as add,
  removeFavorite as remove,
  updateFavorite as update,
} from '@services/Transactions';
import {useLoading} from './useLoading';

interface IFavoriteHook {
  favorites: IFavorite[];
  isGetFavoritesLoading: boolean;
  getFavorites: () => Promise<void>;
  addFavorite: (data: IFavoriteDTO) => Promise<void>;
  updateFavorite: (data: IFavoriteUpdate) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  cleanErrorModal: () => void;
}

export const useFavorites = (): IFavoriteHook => {
  const dispatch = useAppDispatch();
  const {setDisplayErrorModal} = useLoading();
  const {favorites, isGetFavoritesLoading} = useAppSelector(
    state => state.favorites,
  );

  const cleanErrorModal = () =>
    setDisplayErrorModal({
      isOpen: false,
      errorCode: '',
      message: {
        title: '',
        content: '',
      },
    });

  const getFavorites = useCallback(async () => {
    dispatch(getFavoriteStart());
    const data = await retrieveFavorites();
    if (data) {
      dispatch(getFavoriteSuccess(data.favorites));
    }
  }, [dispatch]);

  const addFavorite = useCallback(
    async (data: IFavoriteDTO) => {
      dispatch(addFavoriteStart());
      const res = await add(data);
      if (res) {
        dispatch(addFavoriteSuccess());
        getFavorites();
      }
    },
    [dispatch, getFavorites],
  );

  const updateFavorite = useCallback(
    async (data: IFavoriteUpdate) => {
      dispatch(updateFavoriteStart());
      const res = await update(data);
      if (res) {
        dispatch(updateFavoriteSuccess());
        getFavorites();
        return;
      }
      setDisplayErrorModal({
        isOpen: true,
        message: {
          title: '¡Ups, hubo un problema!',
          content:
            'No hemos podido cargar tu información, por favor intenta en unos segundos o vuelve a ingresar.',
        },
      });
    },
    [dispatch, getFavorites, setDisplayErrorModal],
  );

  const removeFavorite = useCallback(
    async (id: number) => {
      dispatch(removeFavoriteStart());
      const res = await remove(id);
      if (res) {
        dispatch(removeFavoriteSuccess());
        getFavorites();
      }
    },
    [dispatch, getFavorites],
  );

  return {
    favorites,
    isGetFavoritesLoading,
    getFavorites,
    addFavorite,
    updateFavorite,
    removeFavorite,
    cleanErrorModal,
  };
};
