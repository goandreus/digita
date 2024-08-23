import React, {useCallback, useEffect, useState} from 'react';
import { BackHandler, Linking, NativeModules, StyleSheet, View} from 'react-native';
import {Information} from '@global/information';
import {HomeScreenProps} from '@navigations/types';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import HomeTemplate from '@templates/HomeTemplate';
import { useFocusEffect } from '@react-navigation/native';
import ModalError from '@molecules/ModalError';
import { activateRemoteConfig, getRemoteValue } from '@utils/firebase';
import FastImage from 'react-native-fast-image'

const {FingerprintModule} = NativeModules;


const HomeScreen = ({navigation}: HomeScreenProps) => {
  useEffect(() => {
    FastImage.preload([
      {uri: url_banner}
    ])
  }, [])
  
  const url_banner = getRemoteValue('url_banner').asString()

  const [wasFired, setWasFired] = useState<boolean>(false);
  const active_channel = getRemoteValue('active_channel').asBoolean()
  const styles = getStyles();

  const mandatory_update = getRemoteValue('mandatory_update').asBoolean()
  const disabled_channel_title = getRemoteValue('disabled_channel_title').asString()
  const disabled_channel_content = getRemoteValue('disabled_channel_content').asString()

  const login = async () => {
    await activateRemoteConfig()
    if(mandatory_update) {
      navigation.navigate('InfoUpdateAppScreen')
    } else {
      if(wasFired === false){
        setWasFired(true);
        navigation.navigate('Login');
      }
    }
  }

  const signUp = async() => {
    await activateRemoteConfig()
    if(mandatory_update) {
      navigation.navigate('InfoUpdateAppScreen')
    } else {
      navigation.navigate('RegisterUserDocument')
    }
  }

  useFocusEffect(useCallback(() => {
    setWasFired(false);
  }, []));

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    FingerprintModule.getFingerprint();
  },[]);

  return (
    <HomeTemplate image={require('@assets/images/logo.png')}>
      <TextCustom
        text="¿Eres nuevo en la App?"
        variation="p"
        weight="bold"
        style={styles.title}
      />
      <Separator type="medium" />
      <View style={styles.buttonsContainer}>
        <Button
          text="Regístrate aquí"
          icon="play-arrow"
          type="secondary"
          orientation="horizontal"
          iconSize="tiny"
          onPress={signUp}
        />
        <Separator text="o" showLine={true} type="small" />
        <Button
          text="Inicia sesión"
          type="primary"
          orientation="horizontal"
          onPress={login}
        />
      </View>
      <Separator type="medium" />
      <TextCustom
        text="¿Necesitas ayuda?"
        variation="p"
        weight="bold"
        style={styles.title}
      />
      <Separator type="medium" />
      <View style={styles.buttonsHelpContainer}>
        <Button
          text="Ubícanos"
          disabled={true}
          icon="place"
          iconSize="normal"
          orientation="vertical"
          type="primary-inverted"
          onPress={() => {
            navigation.navigate('Location');
          }}
        />
        <Button
          text="Llámanos"
          icon="call"
          iconSize="normal"
          orientation="vertical"
          type="primary-inverted"
          onPress={() => {
            Linking.openURL(`tel:${Information.PhoneContact}`);
          }}
        />
      </View>
      {!active_channel ? 
        <ModalError
          title= {disabled_channel_title || 'Lo sentimos, hubo un error en la aplicación'}
          content= {disabled_channel_content || 'Por favor volver a ingresar más tarde'}
          errorCode='activeChannel'
          isOpen={true}
        /> :
        null
      }
    </HomeTemplate>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    logoContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    title: {
      alignSelf: 'center',
    },
    buttonsContainer: {},
    buttonsHelpContainer: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
    },
  });

  return stylesBase;
};

export default HomeScreen;
