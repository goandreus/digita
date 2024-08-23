import InfoTemplate from '@templates/InfoTemplate';
import React, {useEffect, useLayoutEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import SVGRobotDNIBlock from '@assets/images/robotDNIBlock.svg';
import {CommonActions} from '@react-navigation/native';
import {InfoFaceBlockedScreenProps} from '@navigations/types';

const InfoFaceBlocked = ({navigation, route}: InfoFaceBlockedScreenProps) => {
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
      title="Lo sentimos, tenemos inconvenientes al validar tu identidad"
      imageSVG={SVGRobotDNIBlock}
      descriptionBelow="Por tu seguridad bloquearemos tu acceso a la banca digital. Si esto es un error, por favor, acércate a una de nuestras agencias para continuar tu proceso de registro a la banca digital."
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

export default InfoFaceBlocked;
