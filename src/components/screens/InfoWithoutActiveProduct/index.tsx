import React from 'react';
import InfoTemplate from '@templates/InfoTemplate';
import SVGServiceMan from '@assets/images/serviceMan.svg';
import SVGServiceWoman from '@assets/images/serviceWoman.svg';
import Button from '@atoms/Button';
import {Linking, StyleSheet, View} from 'react-native';
import Separator from '@atoms/Separator';
import {Information} from '@global/information';
import {InfoWithoutActiveProductScreenProps} from '@navigations/types';
import {SvgProps} from 'react-native-svg';

const InfoWithoutActiveProduct = ({
  navigation,
  route,
}: InfoWithoutActiveProductScreenProps) => {
  const styles = getStyles();
  const {name, gender} = route.params;

  let imageSVG: React.FC<SvgProps>;
  switch (gender) {
    default:
    case 'F':
      imageSVG = SVGServiceWoman;
      break;
    case 'M':
      imageSVG = SVGServiceMan;
      break;
  }

  return (
    <InfoTemplate
      isFlatDesign={true}
      title={`${name !== undefined ? `Hola, ${name}.\n` : ''}Actualmente todos tus productos están inactivos`}
      descriptionAbove={`Acércate a una de nuestras agencias y pide asistencia a uno de nuestros asesores. También puedes afiliarte llamando a nuestra central telefónica ${Information.PhoneContactFormatted}`}
      imageSVG={imageSVG}
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

export default InfoWithoutActiveProduct;
