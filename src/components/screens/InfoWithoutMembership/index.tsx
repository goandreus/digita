import React from 'react';
import InfoTemplate from '@templates/InfoTemplate';
import SVGServiceWoman from '@assets/images/serviceWoman.svg';
import Button from '@atoms/Button';
import {Linking, StyleSheet, View} from 'react-native';
import Separator from '@atoms/Separator';
import {Information} from '@global/information';
import {InfoWithoutMembershipScreenProps} from '@navigations/types';

const InfoWithoutMembership = ({
  navigation,
}: InfoWithoutMembershipScreenProps) => {
  const styles = getStyles();
  return (
    <InfoTemplate
      isFlatDesign={true}
      title="Para continuar, primero debes afiliarte"
      descriptionAbove={`Acércate a una de nuestras agencias y pide asistencia a uno de nuestros asesores. También puedes afiliarte llamando a nuestra central telefónica ${Information.PhoneContactFormatted}`}
      imageSVG={SVGServiceWoman}
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

export default InfoWithoutMembership;
