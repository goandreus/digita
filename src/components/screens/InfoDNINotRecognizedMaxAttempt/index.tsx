import InfoTemplate from '@templates/InfoTemplate';
import React, {useEffect, useLayoutEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import SVGRobotDNIFaceBlock from '@assets/images/robotDNIFaceBlock.svg';
import {InfoDNINotRecognizedMaxAttemptScreenProps} from '@navigations/types';
import {CommonActions} from '@react-navigation/native';

const InfoDNINotRecognizedMaxAttempt = ({
  navigation,
  route,
}: InfoDNINotRecognizedMaxAttemptScreenProps) => {
  const styles = getStyles();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK') e.preventDefault();
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <InfoTemplate
      useSafeView={true}
      title="Superaste los intentos permitidos"
      imageSVG={SVGRobotDNIFaceBlock}
      descriptionBelow="Lo sentimos, no fue posible procesar la información de tu DNI. Por favor acércate a una de nuestras agencias para continuar tu proceso de registro a la banca digital."
      footer={
        <View style={styles.footerWrapper}>
          <Button
            orientation="horizontal"
            type="primary"
            text="Ubícanos"
            disabled
            onPress={() => {
              navigation.reset({
                index: 1,
                routes: [{name: 'Home'}, {name: 'Location'}],
              });
            }}
          />
          <Separator type="x-small" />
          <Button
            orientation="horizontal"
            type="secondary"
            text="Volver a Inicio"
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              });
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

export default InfoDNINotRecognizedMaxAttempt;
