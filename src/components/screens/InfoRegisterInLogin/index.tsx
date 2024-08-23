import React from 'react';
import InfoTemplate from '@templates/InfoTemplate';
import SVGManHandPhone from '@assets/images/ManHandPhone.svg';
import Button from '@atoms/Button';
import {Linking, StyleSheet, View} from 'react-native';
import Separator from '@atoms/Separator';
import {Information} from '@global/information';
import {InfoRegisterInLoginScreenProps} from '@navigations/types';

const InfoRegisterInLogin = ({
  navigation,
  route,
}: InfoRegisterInLoginScreenProps) => {
  const styles = getStyles();

  return (
    <InfoTemplate
      isFlatDesign={true}
      title={`¡Regístrate!`}
      descriptionAbove={`Usando tu teléfono desde tu casa o en cualquier lugar. Solo sigue 4 pasos muy sencillos y listo.`}
      imageSVG={SVGManHandPhone}
      footer={
        <View style={styles.footerWrapper}>
          <Button
            orientation="horizontal"
            type="primary"
            text="Regístrate"
            onPress={() => {
              navigation.reset({
                index: 1,
                routes: [
                  {name: 'Home'},
                  {name: 'RegisterUserDocument'},
                ],
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

export default InfoRegisterInLogin;
