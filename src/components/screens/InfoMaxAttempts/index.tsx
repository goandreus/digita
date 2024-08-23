import InfoTemplate from '@templates/InfoTemplate';
import React, { useLayoutEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import SVGBlock from '@assets/images/maxAttemptsBlock.svg';
import {InfoMaxAttempsScreenProps} from '@navigations/types';

const InfoMaxAttemps = ({navigation, route}: InfoMaxAttempsScreenProps) => {
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
      imageSVG={SVGBlock}
      descriptionBelow="Por tu seguridad bloquearemos tu acceso a la App de Compartamos Financiera. Por favor, acércate a cualquier oficina de nuestra red de agencias a nivel nacional o ingresa a olvidé mi clave para crear una nueva."
      footer={
        <View style={styles.footerWrapper}>
          <Separator type="x-small" />
          <Button
            orientation="horizontal"
            type="primary"
            text="Olvidé mi clave"
            onPress={() => navigation.navigate('RecoverPassword')}
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

export default InfoMaxAttemps;
