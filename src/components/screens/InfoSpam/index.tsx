import React from 'react';
import InfoTemplate from '@templates/InfoTemplate';
import SVGHackerMan from '@assets/images/hackerMan.svg';
import Button from '@atoms/Button';
import {Linking, StyleSheet, View} from 'react-native';
import Separator from '@atoms/Separator';
import {Information} from '@global/information';
import {InfoEmailSpamScreenProps} from '@navigations/types';

const InfoSpam = ({navigation}: InfoEmailSpamScreenProps) => {
  const styles = getStyles();
  return (
    <InfoTemplate
      isFlatDesign={true}
      title="Cuidado, el correo ingresado es considerado spam"
      descriptionBelow={`Si esto es un error, por favor, acércate a una de nuestras agencias o comunícate con nosotros llamando a nuestra central telefónica ${Information.PhoneContactFormatted}`}
      imageSVG={SVGHackerMan}
      footer={
        <View style={styles.footerWrapper}>
          <Button
            orientation="horizontal"
            type="primary"
            text="Ubícanos"
            disabled
            onPress={() => {
              navigation.navigate('Location');
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

export default InfoSpam;
