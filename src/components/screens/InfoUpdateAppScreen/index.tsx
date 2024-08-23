/* eslint-disable react-native/no-inline-styles */
import React, {useCallback} from 'react';
import InfoTemplate from '@templates/InfoTemplate';
import {
  AppState,
  StyleSheet,
  View,
  Linking,
  Platform,
  BackHandler,
} from 'react-native';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import SVGBlock from '@assets/images/updateApp.svg';
import TextCustom from '@atoms/TextCustom';
import {checkIfHuaweiOS, urlAndroid, urlHuawei, urlIOS} from '@constants';
import {useFocusEffect} from '@react-navigation/native';
import RNExitApp from 'react-native-exit-app';

const InfoUpdateAppScreen = () => {
  const styles = getStyles();

  async function goToAppStore() {
    const isAndroid = Platform.OS === 'android';
    const isIOS = Platform.OS === 'ios';
    const isHuaweiOS = await checkIfHuaweiOS();
    if (isIOS) {
      Linking.openURL(urlIOS);
    } else if (isAndroid) {
      if (isHuaweiOS) {
        Linking.openURL(urlHuawei);
      } else {
        Linking.openURL(urlAndroid);
      }
    }

    if (Platform.OS === 'android') {
      RNExitApp.exitApp();
    } else {
      setTimeout(() => {
        RNExitApp.exitApp();
      }, 3000);
    }
  }

  const handleBackButton = () => {
    if (AppState.currentState === 'active') {
      AppState.currentState = 'inactive';
      BackHandler.exitApp();
    }
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => handleBackButton(),
      );

      return () => backHandler.remove();
    }, []),
  );

  return (
    <InfoTemplate
      useSafeView={true}
      title="¡Actualiza tu app Compartamos Financiera!"
      imageSVG={SVGBlock}
      footer={
        <View style={styles.footerWrapper}>
          <View style={{width: '100%'}}>
            <TextCustom
              text="Tenemos una nueva versión disponible. Actualiza tu app y disfruta de las funcionalidades más recientes."
              variation="p"
              align="center"
            />
            <Separator type="medium" />
            <TextCustom
              text="Actualizar te tomará solo 1 minuto."
              variation="p"
              align="center"
            />
          </View>
          <Separator type="large" />
          <Button
            orientation="horizontal"
            type="primary"
            text="Actualizar ahora"
            onPress={goToAppStore}
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

export default InfoUpdateAppScreen;
