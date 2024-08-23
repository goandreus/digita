import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Linking,
  NativeModules,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Information } from '@global/information';
import { HomeScreenProps } from '@navigations/types';
import Button from '@atoms/extra/Button';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import { useFocusEffect } from '@react-navigation/native';
import ModalError from '@molecules/ModalError';
import { activateRemoteConfig, getRemoteValue } from '@utils/firebase';
import { SIZES } from '@theme/metrics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@theme/colors';
import Svg, { Path } from 'react-native-svg';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';
import { useLastUser } from '@hooks/common';
import { getLocation } from '@helpers/getLocation';

const { FingerprintModule } = NativeModules;

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const styles = getStyles();

  const insets = useSafeAreaInsets();

  const { lastUser } = useLastUser();

  const [disabled, setDisabled] = useState(true);

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const wasFired = useRef(false);
  const active_channel = getRemoteValue('active_channel').asBoolean();

  const mandatory_update = getRemoteValue('mandatory_update').asBoolean();
  const disabled_channel_title = getRemoteValue(
    'disabled_channel_title',
  ).asString();
  const disabled_channel_content = getRemoteValue(
    'disabled_channel_content',
  ).asString();
  const active_visitor_qr = getRemoteValue(
    'active_visitor_qr',
  ).asBoolean();

  const login = async () => {
    AH.track("CF App - Clic en Botones", {
      'Nombre de la Vista': AH.autoGenerate('Nombre de la Vista'),
      'Nombre del Botón': "Iniciar sesión",
      'Proceso Consultado': "General",
    });
    setLoadingLogin(true);
    await activateRemoteConfig();
    if (mandatory_update) {
      navigation.navigate('InfoUpdateAppScreen');
    } else {
      if (wasFired.current === false) {
        wasFired.current = true;
        // navigation.navigate('ChooseCredit');
        navigation.navigate('Login');
      }
    }
    setLoadingLogin(false);
  };

  const signUp = async () => {
    AH.track("CF App - Clic en Botones", {
      'Nombre de la Vista': AH.autoGenerate('Nombre de la Vista'),
      'Nombre del Botón': "Regístrate aquí",
      'Proceso Consultado': "General",
    });
    setLoadingSignUp(true);
    await activateRemoteConfig();
    if (mandatory_update) {
      navigation.navigate('InfoUpdateAppScreen');
    } else {
      navigation.navigate('RegisterUserDocument');
    }
    setLoadingSignUp(false);
  };

  useFocusEffect(
    useCallback(() => {
      wasFired.current = false;
    }, []),
  );

  useEffect(() => {
    FingerprintModule.getFingerprint();
  }, []);

  useEffect(() => {
    if (active_visitor_qr && lastUser && lastUser.personId) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, []);


  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.Transparent}
        translucent={true}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Svg
            width="100%"
            height="35"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 99,
            }}
            viewBox="0 0 278.461 35"
            preserveAspectRatio="none">
            <Path
              fill="white"
              d="M96.9,529.406c156.87,30.574,278.461-25.871,278.461-25.871v35.278L96.9,538.578Z"
              transform="translate(-96.897 -503.535)"
            />
          </Svg>
          <Image
            source={require('@assets/images/people01.png')}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />
        </View>
        <View style={styles.body}>
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingHorizontal: SIZES.XS * 6,
              paddingVertical: SIZES.XL,
            }}>
            <TextCustom
              align="center"
              text="¿Eres nuevo en la App?"
              variation="h4"
              weight="normal"
              color="neutral-darkest"
            />
            <Separator size={SIZES.XS} />
            <Button
              text="Regístrate aquí"
              type="primary"
              onPress={signUp}
              loading={loadingSignUp}
            />
            <Separator size={SIZES.XL} />
            <TextCustom
              align="center"
              text="¿Estás registrado?"
              variation="h4"
              weight="normal"
              color="neutral-darkest"
            />
            <Separator size={SIZES.XS} />
            <Button
              text="Iniciar sesión"
              type="primary-inverted"
              haveBorder
              orientation="horizontal"
              loading={loadingLogin}
              onPress={login}
            />
          </View>

          <View
            style={{
              paddingBottom: insets.bottom,
              flexDirection: 'row',
              backgroundColor: COLORS.Background.Light,
            }}>
            <Button
              text="Llámanos"
              icon="call"
              iconSize={SIZES.MD}
              orientation="horizontal-reverse"
              type="tertiary"
              containerStyle={{ flex: 1 }}
              onPress={() => {
                Linking.openURL(`tel:${Information.PhoneContact}`);
              }}
            />
            <Button
              text="Visita"
              iconSize={SIZES.MD}
              icon="vector"
              disabled={disabled}
              orientation="horizontal-reverse"
              type="tertiary"
              containerStyle={{ flex: 1 }}
              onPress={() => {
                navigation.navigate('VisitRegistration');
              }}
            />
          </View>
          {!active_channel ? (
            <ModalError
              title={
                disabled_channel_title ||
                'Lo sentimos, hubo un error en la aplicación'
              }
              content={
                disabled_channel_content ||
                'Por favor volver a ingresar más tarde'
              }
              errorCode="activeChannel"
              isOpen={true}
            />
          ) : null}
        </View>
      </View>
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      flex: 1,
      flexDirection: 'column',
    },
    header: {
      flexGrow: 1,
      flexShrink: 1,
      maxHeight: '50%',
    },
    body: {
      flexShrink: 0,
      flexGrow: 1,

      flexDirection: 'column',
      justifyContent: 'center',
    },
  });

  return stylesBase;
};
