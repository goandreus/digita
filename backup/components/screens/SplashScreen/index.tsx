import React, {useEffect, useState} from 'react';
import {random} from 'lodash';
import Svg, {Path, Defs, ClipPath, Image as ImageSVG} from 'react-native-svg';
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {ScreenSize} from '@theme/metrics';
import {Colors} from '@theme/colors';
import {SplashScreenProps} from '@navigations/types';
import * as deviceInfo from 'react-native-device-info';
import {storage} from '@utils/secure-storage';
import NativeConfig from 'react-native-config';
import RNOtpVerify from 'react-native-otp-verify';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {Dynatrace} from '@dynatrace/react-native-plugin';
import {getRemoteValue} from '@utils/firebase';

const images = [
  require('@assets/images/people01.png'),
  require('@assets/images/people02.png'),
  require('@assets/images/people03.png'),
  require('@assets/images/people04.png'),
];

const SplashScreen = ({navigation}: SplashScreenProps) => {
  const [isTimeout, setIsTimeout] = useState(false);
  const [index, setIndex] = useState(random(3));
  const nextIndex = index + 1 <= 3 ? index + 1 : 0;

  useEffect(() => {
    Dynatrace.identifyUser(`${deviceInfo.getUniqueId()}-01`);
  }, []);

  useEffect(() => {
    analytics().setUserProperty('UUID', deviceInfo.getUniqueId());
    crashlytics().setAttribute('UUID', deviceInfo.getUniqueId());
    const printDeviceInfo = async () => {
      const userString = storage.getString('lastUser');
      console.log('UUID', deviceInfo.getUniqueId());
      const mandatory_update = getRemoteValue('mandatory_update').asBoolean();
      Alert.alert(
        "* Device's info",
        JSON.stringify(
          {
            version: deviceInfo.getVersion(),
            hashOTP:
              Platform.OS === 'ios' ? 'unknown' : await RNOtpVerify.getHash(),
            packageId: deviceInfo.getBundleId(),
            env: NativeConfig.ENV,
            base_url: NativeConfig.LASE_URL,
            uuid: deviceInfo.getUniqueId(),
            mandatory_update,
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
    )
      printDeviceInfo();
  }, []);
  useEffect(() => {
    const id = setTimeout(() => {
      setIsTimeout(true);
    }, 1500);

    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      navigation.dispatch(StackActions.replace('Home'));
    }, 3000);

    return () => clearTimeout(id);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />

      <Svg
        viewBox="0 0 360 757"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <Path
          d="M360 0L359.995 611.5C274.073 701.183 153.26 757 19.446 757C12.9323 757 0 756.606 0 756.606L0.997458 0.000156403L360 0Z"
          fill={Colors.Primary}
        />
      </Svg>

      <Svg
        width="100%"
        height={ScreenSize.width * 0.71}
        viewBox="0 0 361 263"
        preserveAspectRatio="none">
        <Defs>
          <ClipPath id="clip">
            <Path d="M360.548 7.75404e-05V215.5C318.128 236.066 268.124 249.424 207.698 256.755C127.992 266.425 57.759 262.902 0 254.166L5.46041e-06 0L360.548 7.75404e-05Z" />
          </ClipPath>
        </Defs>
        <ImageSVG
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          href={images[index]}
          clipPath="url(#clip)"
        />

        <ImageSVG
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          href={images[nextIndex]}
          clipPath="url(#clip)"
          opacity={isTimeout ? 1 : 0}
        />
      </Svg>

      <View style={styles.containerLogo}>
        <Image
          source={require('@assets/images/logo.png')}
          style={styles.logo}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PrimaryHover,
  },
  containerLogo: {
    flex: 1,
  },
  logo: {
    position: 'absolute',
    top: '25%',
    width: '100%',
    height: '30%',
    resizeMode: 'contain',
  },
});

export default SplashScreen;
