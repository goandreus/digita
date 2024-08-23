import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {COLORS} from '@theme/colors';
import {SplashScreenProps} from '@navigations/types';
import * as deviceInfo from 'react-native-device-info';
import {storage} from '@utils/secure-storage';
import NativeConfig from 'react-native-config';
import RNOtpVerify from 'react-native-otp-verify';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {Dynatrace} from '@dynatrace/react-native-plugin';
import {getRemoteValue} from '@utils/firebase';
import { useLastUser } from '@hooks/common';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';
import {BASE_URL} from '@constants';

export const SplashScreen = ({navigation}: SplashScreenProps) => {
  const {lastUser} = useLastUser();
  useEffect(() => {
    AH.start();
    Dynatrace.identifyUser(`${deviceInfo.getUniqueId()}-01`);
  }, []);

  useEffect(() => {
    analytics().setUserProperty('UUID', deviceInfo.getUniqueId());
    crashlytics().setAttribute('UUID', deviceInfo.getUniqueId());
    const printDeviceInfo = async () => {
      const userString = storage.getString('lastUser');
      console.log('UUID', deviceInfo.getUniqueId());
      const mandatory_update = getRemoteValue('mandatory_update').asBoolean();
      const fcmToken = storage.getString('fcmToken');
      Alert.alert(
        "* Device's info",
        JSON.stringify(
          {
            version: deviceInfo.getVersion(),
            hashOTP:
              Platform.OS === 'ios' ? 'unknown' : await RNOtpVerify.getHash(),
            packageId: deviceInfo.getBundleId(),
            env: NativeConfig.ENV,
            base_url: BASE_URL[NativeConfig.ENV],
            uuid: deviceInfo.getUniqueId(),
            mandatory_update,
            fcmToken: fcmToken || '',
            storage: {
              lastUser: userString !== undefined ? JSON.parse(userString) : {},
            },
          },
          null,
          3,
        ),
      );
    };

    if (
      NativeConfig.ENV === 'dev' ||
      NativeConfig.ENV === 'qas' ||
      NativeConfig.ENV === 'qa'
    ) {
      printDeviceInfo();
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      if (
        lastUser === undefined ||
        lastUser.firstName === undefined ||
        lastUser.document === undefined
      )
        navigation.dispatch(StackActions.replace('Home'));
      else {
        navigation.dispatch(
          StackActions.replace('LoginSecure', {
            firstName: lastUser.firstName,
            documentType: lastUser.document.type,
            documentNumber: lastUser.document.number,
          }),
        );
      }
    }, 3000);

    return () => clearTimeout(id);
  }, [lastUser]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.Transparent}
        translucent={true}
      />
      <Image source={require('@assets/images/logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Primary.Medium,
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
  },
});
