import React, {useLayoutEffect} from 'react';
import InfoTemplate from '@templates/InfoTemplate';
import SVGUserExists from '@assets/images/userExists.svg';
import Button from '@atoms/Button';
import {Linking, StyleSheet, View} from 'react-native';
import Separator from '@atoms/Separator';
import {Information} from '@global/information';
import {InfoUserExistsScreenProps} from '@navigations/types';
import TextCustom from '@atoms/TextCustom';

const InfoUserExists = ({navigation}: InfoUserExistsScreenProps) => {
  const styles = getStyles();

  return (
    <InfoTemplate
      isFlatDesign={true}
      title="Lo sentimos, tenemos inconvenientes para ingresar"
      descriptionAbove={
        <TextCustom variation="p">
          Para ingresar a la App de Compartamos Financiera debes{' '}
          <TextCustom variation="p" weight="bold">
            Iniciar sesión
          </TextCustom>
          . Si crees que esto es un error, por favor, llama nuestra central
          telefónica {Information.PhoneContactFormatted}
        </TextCustom>
      }
      imageSVG={SVGUserExists}
      footer={
        <View style={styles.footerWrapper}>
          <Button
            orientation="horizontal"
            type="primary"
            text="Inicia sesión"
            onPress={() => {
              navigation.reset({
                index: 1,
                routes: [{name: 'Home'}, {name: 'Login'}],
              });
            }}
          />
          <Separator type="x-small" />
          <Button
            orientation="horizontal"
            type="secondary"
            text="Llámanos"
            onPress={() => {
              Linking.openURL(`tel:${Information.PhoneContact}`);
            }}
          />
        </View>
      }
    />
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    footerWrapper: {
      width: '100%',
    },
  });

  return stylesBase;
};

export default InfoUserExists;
