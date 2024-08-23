import React, {useState} from 'react';
import {
  // ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {FavoriteOperationsScreenProps} from '@navigations/types';
import BasicMenuTemplate from '@templates/extra/BasicMenuTemplate';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import FavoriteModal from '@molecules/extra/FavoriteModal';
import Input from '@atoms/extra/Input';
import Button from '@atoms/extra/Button';
import {
  IFavoriteModal,
  useFavoriteOperations,
} from './hooks/useFavoriteOperations';
import AlertBasic from '@molecules/extra/AlertBasic';
import {useUserInfo} from '@hooks/common';
import {editFavorite} from '@services/Favorite';
import {useRoute} from '@react-navigation/native';
import Skeleton from '@molecules/Skeleton';

interface IFavoriteInfo {
  alias: string;
  id: number;
}

const FavoriteOperationsScreen = ({
  navigation,
}: FavoriteOperationsScreenProps) => {
  const route = useRoute();
  const {user} = useUserInfo();
  const person = user?.person;

  const {
    formfavoriteEdit,
    favoriteModal,
    setFavoriteModal,
    isBtnEditFavoriteDisable,
    setLoading,
    loadFavorites,
    favoritos,
    loading,
    loadingDelete,
    onDeleteFavorite,
  } = useFavoriteOperations();

  const [selectFavoriteInfo, setSelectFavoriteInfo] = useState<IFavoriteInfo>({
    alias: '',
    id: 0,
  });

  const {
    form,
    values: {favoriteName},
    clear: clearNameFavorite,
  } = formfavoriteEdit;

  const handleDeleteFavorite = async (favoriteId: number) => {
    onDeleteFavorite(favoriteId);
  };

  const handleEditFavorite = async (favoriteId: number) => {
    const payload = {
      alias: favoriteName,
    };
    setLoading(true);
    const res = await editFavorite({
      payload,
      favoriteId,
      documentType: person?.documentTypeId,
      documentNumber: person?.documentNumber,
      screen: route.name,
    });
    if (res.type === 'SUCCESS') {
      loadFavorites();
    }
  };

  return (
    <>
      <BasicMenuTemplate
        headerTitle="Operaciones favoritas"
        canGoBack={navigation.canGoBack()}
        goBack={() => navigation.goBack()}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <BoxView>
            <TextCustom
              text="Configura tus operaciones"
              variation="h3"
              lineHeight="tight"
              weight="normal"
              color="primary-medium"
            />
            <Separator size={4} />
            <TextCustom
              text="Edita o elimina las operaciones favoritas guardadas"
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color="neutral-darkest"
            />
          </BoxView>
          <Separator size={24} />
          {!loading ? (
            favoritos.map(item => (
              <FavoriteOperation
                key={item.id}
                favoriteId={item.id}
                name={item.alias}
                service={item.operationName}
                openModal={setFavoriteModal}
                favoriteInfo={setSelectFavoriteInfo}
              />
            ))
          ) : (
            <>
              <Skeleton timing={600}>
                <BoxView style={styles.skeleton} />
                <BoxView style={styles.skeleton} />
              </Skeleton>
            </>
          )}
        </ScrollView>
      </BasicMenuTemplate>

      {/* Edit FavoriteModal */}
      <FavoriteModal
        isOpen={favoriteModal.editModal}
        closeOnTouchBackdrop
        onClose={() => {
          setFavoriteModal(prevState => ({
            ...prevState,
            editModal: false,
          }));
          clearNameFavorite();
        }}
        title="Ponle un nuevo nombre a tu operación favorita"
        description="Al guardar el cambio, vincularemos el nuevo nombre a tu operación favorita."
        body={
          <Input
            maxLength={14}
            placeholder="Ingrese un nombre"
            /* onFocus={handleFocus} */
            {...form.inputProps('favoriteName')}
          />
        }
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button
                text={'Guardar cambio'}
                type="primary"
                disabled={!isBtnEditFavoriteDisable}
                onPress={() => {
                  handleEditFavorite(selectFavoriteInfo?.id);
                  setFavoriteModal(prevState => ({
                    ...prevState,
                    editModal: false,
                  }));
                  clearNameFavorite();
                }}
              />
            ),
          },
        ]}
      />

      {/* Delete Favorite */}
      <AlertBasic
        isOpen={favoriteModal.deleteModal}
        // onClose={closeConfirmToExit}
        title={`¿Deseas eliminar de tus operaciones favoritas ${selectFavoriteInfo?.alias}?`}
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button
                disabled={loadingDelete}
                text="Sí, eliminar"
                type="primary"
                onPress={() => handleDeleteFavorite(selectFavoriteInfo?.id)}
              />
            ),
          },
          {
            id: 'button2',
            render: (
              <Button
                text="Cancelar"
                type="primary-inverted"
                haveBorder={true}
                onPress={() =>
                  setFavoriteModal(prevState => ({
                    ...prevState,
                    deleteModal: false,
                  }))
                }
              />
            ),
          },
        ]}
      />
    </>
  );
};

const FavoriteOperation = ({
  favoriteId,
  name,
  service,
  openModal,
  favoriteInfo,
}: {
  favoriteId: number;
  name: string;
  service: string;
  openModal: (i: IFavoriteModal) => void;
  favoriteInfo: (i: IFavoriteInfo) => void;
}) => {
  return (
    <BoxView
      direction="row"
      justify="space-between"
      py={24}
      align="center"
      style={{borderBottomWidth: 1, borderBottomColor: '#E3E8EF'}}>
      <BoxView>
        <TextCustom
          text={name}
          variation="h4"
          lineHeight="tight"
          weight="normal"
          color="neutral-darkest"
        />
        <Separator size={4} />
        <TextCustom
          text={service}
          variation="p4"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
      </BoxView>
      <BoxView direction="row">
        <Pressable
          onPress={() => {
            favoriteInfo({alias: name, id: favoriteId});
            openModal(prevState => ({...prevState, editModal: true}));
          }}>
          <TextCustom
            text="Editar"
            variation="h6"
            lineHeight="tight"
            weight="normal"
            color="primary-dark"
          />
        </Pressable>
        <Pressable
          onPress={() => {
            favoriteInfo({alias: name, id: favoriteId});
            openModal(prevState => ({...prevState, deleteModal: true}));
          }}>
          <TextCustom
            text="Eliminar"
            variation="h6"
            lineHeight="tight"
            weight="normal"
            color="primary-dark"
            style={{marginLeft: 24}}
          />
        </Pressable>
      </BoxView>
    </BoxView>
  );
};

export default FavoriteOperationsScreen;

const styles = StyleSheet.create({
  pressableContainer: {
    paddingVertical: 8 * 2,
  },
  skeleton: {
    alignSelf: 'center',
    width: '100%',
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E1E1E1',
    marginBottom: 16,
  },
});
