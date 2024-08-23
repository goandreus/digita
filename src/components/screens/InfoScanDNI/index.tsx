import React from 'react';
import InfoTemplate from '@templates/InfoTemplate';
import TextCustom from '@atoms/TextCustom';
import Button from '@atoms/Button';
import {StyleSheet, View} from 'react-native';
import {Colors} from '@theme/colors';
import Separator from '@atoms/Separator';
import {InfoScanDNIScreenProps} from '@navigations/types';

const InfoScanDNI = ({navigation, route}: InfoScanDNIScreenProps) => {
  const styles = getStyles();

  const {gender, flowType, documentNumber, documentType} = route.params;

  return (
    <InfoTemplate
      animationObject={
        gender === 'M'
          ? require('@assets/images/scanDNIMan.json')
          : require('@assets/images/scanDNIWoman.json')
      }
      descriptionBelow={
        <TextCustom
          align="center"
          variation="h2"
          weight="normal"
          color={Colors.Paragraph}>
          Ubica tu DNI dentro del recuadro hasta que se tome la foto
        </TextCustom>
      }
      footer={
        <>
          <Button
            containerStyle={styles.buttonFull}
            text="Empecemos"
            type="primary"
            orientation="horizontal"
            onPress={() => {
              navigation.navigate('ScanDocument', {
                flowType,
                gender,
                documentNumber,
                documentType,
              });
            }}
          />
          <Separator type="medium" />
          <TextCustom
            variation="link"
            align="center"
            color={Colors.Paragraph}
            onPress={() => {
              if (navigation.canGoBack()) navigation.goBack();
            }}>
            Cancelar
          </TextCustom>
        </>
      }
    />
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    buttonFull: {
      width: '100%',
    },
  });

  return stylesBase;
};

export default InfoScanDNI;
