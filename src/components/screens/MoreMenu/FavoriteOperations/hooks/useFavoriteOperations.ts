import {useUserInfo} from '@hooks/common';
import useForm from '@hooks/useForm';
import {useRoute} from '@react-navigation/native';
import {
  deleteFavorite,
  getFavoritesOperations,
  IFavoriteItem,
} from '@services/Favorite';
import {useEffect, useState} from 'react';

export interface IFavoriteModal {
  editModal: boolean;
  deleteModal: boolean;
}

export const useFavoriteOperations = () => {
  const [favoriteModal, setFavoriteModal] = useState<IFavoriteModal>({
    editModal: false,
    deleteModal: false,
  });

  const {user} = useUserInfo();
  const person = user?.person;
  const route = useRoute();

  // const {displayErrorModal, setDisplayErrorModal} = useLoading();

  // const closeEditModal = () => setEditModal(false);
  // const openEditModal = () => setEditModal(true);

  // ConfirmationCF

  const {
    values: valuesFavoriteNameEdited,
    clear: clearFavoriteNameEdited,
    ...formFavoriteNameEdited
  } = useForm({
    initialValues: {
      favoriteName: '',
    },
    // validate: rawValues => {
    //   const newErrors: FormError<{concept: string}> = {};

    //   if (!isEmpty(rawValues.concept) && !validateConcept(rawValues.concept)) {
    //     newErrors.concept = 'Valor ingresado invalido.';
    //   }

    //   return newErrors;
    // },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [favoritos, setFavoritos] = useState<IFavoriteItem[]>([]);

  const loadFavorites = async () => {
    setLoading(true);
    const response = await getFavoritesOperations(
      'Operations',
      person?.documentTypeId,
      person?.documentNumber,
    );
    setFavoritos(response);
    setLoading(false);
    setFavoriteModal(prevState => ({...prevState, editModal: false}));
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const isBtnEditFavoriteDisable =
    valuesFavoriteNameEdited?.favoriteName.length !== 0;

  const onDeleteFavorite = async (favoriteId: number) => {
    setLoadingDelete(true);
    const res = await deleteFavorite({
      favoriteId,
      documentType: person?.documentTypeId,
      documentNumber: person?.documentNumber,
      screen: route.name,
    });
    if (res.type === 'SUCCESS') {
      loadFavorites();
      setFavoriteModal(prevState => ({...prevState, deleteModal: false}));
    }
    setLoadingDelete(false);
  };

  return {
    favoriteModal,
    setFavoriteModal,
    // editModal,
    // closeEditModal,
    // openEditModal,
    formfavoriteEdit: {
      values: valuesFavoriteNameEdited,
      form: formFavoriteNameEdited,
      clear: clearFavoriteNameEdited,
    },
    isBtnEditFavoriteDisable,
    favoritos,
    loading,
    loadingDelete,
    setLoading,
    loadFavorites,
    onDeleteFavorite,
  };
};
