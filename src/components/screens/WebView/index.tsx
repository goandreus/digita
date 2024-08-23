import {useUserInfo} from '@hooks/common';
import {RootStackParamList, WebViewScreenProps} from '@navigations/types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getUserCredits} from '@services/User';
import {Colors} from '@theme/colors';
import React, {useCallback, useEffect, useRef} from 'react';
import {StatusBar, StyleSheet, Platform, BackHandler} from 'react-native';
import WebView from 'react-native-webview';

export default function WebViewScreen({route}: WebViewScreenProps) {
  const {url} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {setUserCredits} = useUserInfo();

  const updateUserCredits = useCallback(async () => {
    await getUserCredits().then(res => setUserCredits(res));
  }, [setUserCredits]);

  const onMessage = async (event: any) => {
    if (event.nativeEvent.data === 'goHome') {
      await updateUserCredits();
      navigation.navigate('MainScreen' as any);
    } else {
      navigation.goBack();
    }
  };

  const webViewRef = useRef<WebView>(null);

  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onAndroidBackPress,
        );
      };
    }
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />
      <WebView
        source={{
          uri: url,
        }}
        ref={webViewRef}
        style={styles.constainer}
        onMessage={onMessage}
        scalesPageToFit={false}
        allowsBackForwardNavigationGestures={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 50 : 25,
  },
});
