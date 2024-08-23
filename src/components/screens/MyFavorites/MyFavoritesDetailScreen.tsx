import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {MyFavoritesDetailScreenProps} from '@navigations/types';
import MenuTemplate from '@templates/MenuTemplate';
import {Colors} from '@theme/colors';
import TextCustom from '@atoms/TextCustom';
import ModalInfo from '@atoms/ModalInfo';
import Button from '@atoms/Button';
import Input from '@atoms/Input';
import Separator from '@atoms/Separator';
import {useFavorites, useLoading} from '@hooks/common';
import {useNavigation} from '@react-navigation/native';
import useToggle from '@hooks/useToggle';
import {isEmpty} from '@utils/isEmpty';
import ModalError from '@molecules/ModalError';
import {useValidToOperation} from '@hooks/useValidToOperation';
import PopUpSection from './popUpSection';

const MyFavoritesDetailScreen = ({route}: MyFavoritesDetailScreenProps) => {
  const favorite = route.params.favorite;
  const navigation = useNavigation();
  const {displayErrorModal} = useLoading();
  const {removeFavorite, updateFavorite, cleanErrorModal} = useFavorites();

  const {
    showModal,
    showModalToken,
    showRefillModal,
    closeModal,
    closeRefillModal,
    closeModalToken,
    onActivateToken,
    handleSameBank,
    handleOthersBank,
  } = useValidToOperation();

  const [removeModal, setRemoveModal] = useState(false);
  const {isOpen, onToggle} = useToggle();
  const [error, setError] = useState('');
  const [accountName, setAccountName] = useState(favorite.concept ?? '');

  const handleToggle = () => {
    onToggle();
    setError('');
  };

  const handleChangeText = (text: string) => {
    setAccountName(text);
    setError(isEmpty(text) ? 'Este campo es obligatorio' : '');
  };

  const onConfirmRemove = () => {
    removeFavorite(favorite.registryId);
    navigation.goBack();
  };

  const onConfirmUpdate = () => {
    if (isEmpty(error)) {
      if (accountName !== favorite.concept) {
        updateFavorite({
          concept: accountName,
          isLocal: favorite.isLocal,
          ownAccount: favorite.ownAccount,
          registryId: favorite.registryId,
          compartamosBeneficiaryAccount:
            favorite.ctaProCom ?? favorite.destinationCCI,
        });
      }
      onToggle();
    }
  };

  const onPressTransfer = () =>
    favorite.isLocal
      ? handleSameBank({
          destinationAccount: favorite.ctaProCom,
        })
      : handleOthersBank();

  return (
    <>
      <MenuTemplate title="Mis Favoritos" containerStyle={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.sub_container}>
            {isOpen ? (
              <>
                <View style={styles.edit_text_container}>
                  <TextCustom
                    size={16}
                    weight="bold"
                    variation="p"
                    color="#83786F"
                    style={styles.margin_item}
                    text="Editar Alias"
                  />
                  <TextCustom
                    size={16}
                    weight="bold"
                    variation="link"
                    color="#83786F"
                    style={styles.margin_item}
                    text="Guardar"
                    onPress={onConfirmUpdate}
                  />
                </View>
                <Input
                  placeholder="Ingresa el nombre de tu favorito"
                  value={accountName}
                  errorMessage={error}
                  style={styles.margin_item}
                  onChange={handleChangeText}
                  haveError={!isEmpty(error)}
                />
              </>
            ) : (
              <TextCustom
                size={16}
                variation="h2"
                weight="normal"
                color={Colors.GrayDark}
                style={styles.label_title}>
                {accountName}
              </TextCustom>
            )}

            <View style={styles.border_bottom} />

            <TextCustom
              size={16}
              variation="h2"
              weight="normal"
              color={Colors.GrayDark}
              style={styles.label_account}>
              Número de cuenta
            </TextCustom>
            <TextCustom
              size={16}
              variation="h2"
              weight="normal"
              color={Colors.GrayDark}
              style={styles.accountNumber}>
              ****{favorite?.ctaProCom.slice(12, 16)}
            </TextCustom>
          </View>

          {!isOpen && (
            <View style={styles.btn_container}>
              <Pressable
                onPress={handleToggle}
                style={getStyles(true).btnAction}>
                <TextCustom
                  size={15}
                  variation="h1"
                  weight="normal"
                  color={Colors.White}
                  style={styles.text_btn}>
                  Editar
                </TextCustom>
                <View style={styles.btn_border_bottom} />
              </Pressable>
              <Pressable
                style={getStyles(false).btnAction}
                onPress={() => setRemoveModal(true)}>
                <TextCustom
                  size={15}
                  variation="h1"
                  weight="normal"
                  color={Colors.White}
                  style={styles.text_btn}>
                  Eliminar
                </TextCustom>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.btn_section_container}>
          <Button
            text="Transferir"
            textSize={18}
            type="primary"
            orientation="vertical"
            onPress={onPressTransfer}
          />
        </View>

        {/* <View style={styles.border_bottom} /> */}

        {/* <TextCustom
            size={16}
            variation="h2"
            weight="normal"
            color={Colors.GrayDark}
            style={styles.label_lastMovement}>
            Últimos movimientos
          </TextCustom>

          {favorite?.lastMovements.map(movement => (
            <React.Fragment key={movement.id}>
              <View style={styles.lastMovement}>
                <TextCustom
                  size={14}
                  variation="h2"
                  weight="normal"
                  color={Colors.GrayDark}>
                  {movement.date}
                </TextCustom>
                <TextCustom
                  size={16}
                  variation="h2"
                  weight="normal"
                  color={Colors.GrayDark}>
                  {movement.currency} {movement.fAmount}
                </TextCustom>
              </View>
              <View style={styles.border_bottom} />
            </React.Fragment>
          ))} */}

        <ModalInfo
          open={removeModal}
          onRequestClose={() => {}}
          title="Eliminar"
          message="¿Estás por eliminar este favorito, estás seguro ?"
          actions={
            <>
              <Button
                type="primary"
                text="Sí, eliminar"
                orientation="vertical"
                onPress={onConfirmRemove}
              />
              <Separator type="small" />
              <TextCustom
                variation="link"
                align="center"
                color={Colors.Paragraph}
                onPress={() => setRemoveModal(false)}>
                Cancelar
              </TextCustom>
            </>
          }
        />

        <ModalError
          isOpen={displayErrorModal.isOpen}
          errorCode={displayErrorModal.errorCode}
          title={displayErrorModal.message.title}
          content={displayErrorModal.message.content}
          close={() => cleanErrorModal()}
        />

        <PopUpSection
          showModal={showModal}
          showRefillModal={showRefillModal}
          showModalToken={showModalToken}
          closeModal={closeModal}
          closeModalToken={closeModalToken}
          closeRefillModal={closeRefillModal}
          onActivateToken={onActivateToken}
        />
      </MenuTemplate>
    </>
  );
};

export default MyFavoritesDetailScreen;

const getStyles = (isTop: boolean) => {
  return StyleSheet.create({
    btnAction: {
      backgroundColor: Colors.Border,
      width: '80%',
      paddingLeft: '20%',
      ...(isTop
        ? {borderTopLeftRadius: 10, borderTopRightRadius: 10}
        : {borderBottomLeftRadius: 10, borderBottomRightRadius: 10}),
    },
  });
};

const styles = StyleSheet.create({
  edit_text_container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  label_title: {
    marginBottom: 15,
  },
  label_account: {
    marginTop: 15,
    marginBottom: 7,
  },
  label_lastMovement: {
    marginTop: 21,
    marginBottom: 32,
  },
  lastMovement: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountNumber: {
    marginBottom: 41,
  },
  margin_item: {
    marginBottom: 10,
  },
  border_bottom: {
    borderBottomColor: Colors.GrayBackground,
    borderBottomWidth: 2,
  },
  container: {
    flexDirection: 'row',
  },
  sub_container: {
    flex: 1,
  },
  btn_container: {
    width: '45%',
    borderRadius: 20,
  },
  text_btn: {
    marginVertical: '10%',
  },
  btn_border_bottom: {
    borderBottomColor: Colors.White,
    borderBottomWidth: 1,
    width: '70%',
  },
  btn_section_container: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: '80%',
    paddingBottom: 40,
  },
});
