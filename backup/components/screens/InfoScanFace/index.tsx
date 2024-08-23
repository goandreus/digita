import React, {useEffect, useLayoutEffect, useState} from 'react';
import InfoTemplate from '@templates/InfoTemplate';
import TextCustom from '@atoms/TextCustom';
import Button from '@atoms/Button';
import {StyleSheet, View} from 'react-native';
import {Colors} from '@theme/colors';
import Separator from '@atoms/Separator';
import {InfoScanFaceScreenProps} from '@navigations/types';

const InfoScanFace = ({navigation, route}: InfoScanFaceScreenProps) => {
  const styles = getStyles();

  const {
    gender,
    documentScanned,
    flowType,
    operationId,
    sessionId,
    documentNumber,
    documentType,
  } = route.params;

  return (
    <InfoTemplate
      animationObject={
        gender === 'M'
          ? require('@assets/images/scanFaceMan.json')
          : require('@assets/images/scanFaceWoman.json')
      }
      descriptionBelow={
        <>
          <TextCustom
            align="center"
            variation="h2"
            weight="normal"
            color={Colors.Paragraph}>
            Busca un lugar iluminado y evita usar lentes o mascarilla
          </TextCustom>
          <Separator type="x-small" />
          <TextCustom
            align="center"
            variation="p"
            weight="normal"
            color={Colors.Paragraph}>
            (Dispones de 25s para el selfie)
          </TextCustom>
        </>
      }
      footer={
        <>
          <Button
            containerStyle={styles.buttonFull}
            text="Empecemos"
            type="primary"
            orientation="horizontal"
            onPress={() => {
              navigation.navigate('ScanFace', {
                flowType,
                documentScanned,
                operationId,
                sessionId,
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

export default InfoScanFace;
