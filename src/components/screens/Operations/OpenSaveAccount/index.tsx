import React, {useState} from 'react';
import {Linking, StyleSheet} from 'react-native';
import Button from '@atoms/extra/Button';
import ModalIcon from '@molecules/ModalIcon';
import {OpenSaveAccountSreenProps} from '@navigations/types';
import TextCustom from '@atoms/extra/TextCustom';
import BoxView from '@atoms/BoxView';
import {SIZES} from '@theme/metrics';
import Separator from '@atoms/extra/Separator';
import AlertBasic from '@molecules/extra/AlertBasic';
import {InformativeCard} from './components/InformativeCard';
import GenericTemplate from '@templates/extra/GenericTemplate';
import {useSessionExpiredHandler} from '@hooks/useSessionExpiredHandler';
import NativeConfig from 'react-native-config';

export const OpenSaveAccount = ({
  navigation,
  route,
}: OpenSaveAccountSreenProps) => {
  const {showTokenIsActivated, type} = route.params;

  const {handleCloseSession} = useSessionExpiredHandler();

  const [openModal, setOpenModal] = useState(false);
  const landingPage = 'https://www.compartamos.com.pe/Peru';
  const savingsPage =
    NativeConfig.ENV === 'prod'
      ? 'https://productos.compartamos.com.pe/ahorros/wow/ahorraya'
      : 'https://landingqa.compartamos.com.pe/ahorros/wow/ahorraya';

  const openLandingPage = (url: string) => {
    setOpenModal(false);
    setTimeout(() => {
      Linking.openURL(url)
        .then(() => {
          console.log(`Se abrió la URL externa: ${url}`);
          if (type === 'savings') {
            handleCloseSession();
            navigation.navigate('Login');
          }
        })
        .catch(error => {
          console.error(`No se pudo abrir la URL externa: ${url}`, error);
        });
    }, 500);
  };

  return (
    <>
      <ModalIcon
        type="SUCCESS"
        message="Token Digital activado"
        open={showTokenIsActivated}
        onRequestClose={() => {}}
        actions={
          <>
            <Button
              onPress={() => {
                navigation.setParams({
                  showTokenIsActivated: false,
                });
              }}
              orientation="horizontal"
              type="primary"
              text="Aceptar"
            />
          </>
        }
      />

      <GenericTemplate
        headerTitle="Abre una cuenta"
        title="¡Abre tu cuenta de ahorros!"
        goBack={() => navigation.navigate('OpenSavingsAccount')}
        canGoBack={navigation.canGoBack()}
        isFlex
        footer={
          <BoxView style={styles.containerBtn}>
            <Button
              containerStyle={styles.styleBtn}
              onPress={() => setOpenModal(true)}
              loading={false}
              orientation="horizontal"
              type="primary"
              text={
                type === 'savings'
                  ? 'Abrir mi cuenta'
                  : 'Abre tu cuenta de ahorros'
              }
              disabled={false}
            />
            <Button
              onPress={() => navigation.goBack()}
              loading={false}
              orientation="horizontal"
              type="primary-inverted"
              text={'Por ahora no'}
              disabled={false}
            />
          </BoxView>
        }>
        <BoxView mt={32}>
          <TextCustom
            color="neutral-darkest"
            lineHeight="comfy"
            weight="normal"
            variation="p4"
            text={
              type === 'savings'
                ? 'Para continuar con tu operación necesitas tener una cuenta de ahorros, te recomendamos abrir:'
                : 'Necesitas tener una cuenta de ahorros para afiliarla a tu número, te recomendamos abrir:'
            }
          />
          <Separator type="medium" />
          <InformativeCard />
        </BoxView>
      </GenericTemplate>

      <AlertBasic
        closeOnTouchBackdrop
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={
          type === 'savings'
            ? 'Te estamos redirigiendo a la web\n de apertura de cuenta de ahorro'
            : 'Estas por salir de la app de\n Compartamos Financiera'
        }
        description={
          type === 'savings'
            ? '¿Estás seguro de salir de la App de\n Compartamos Financiera?'
            : 'Te estamos redirigiendo a nuestra web www.wowahorraya.com'
        }
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button
                text={type === 'savings' ? 'Sí, quiero salir' : 'Ir a la web'}
                type="primary"
                onPress={() => {
                  openLandingPage(
                    type === 'savings' ? savingsPage : landingPage,
                  );
                }}
              />
            ),
          },
          {
            id: 'button2',
            render: (
              <Button
                text={type === 'savings' ? 'Regresar' : 'Retroceder'}
                type="primary-inverted"
                haveBorder={true}
                onPress={() => setOpenModal(false)}
              />
            ),
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
  containerBtn: {
    paddingHorizontal: SIZES.LG,
  },
  styleBtn: {
    marginBottom: 10,
  },
});
