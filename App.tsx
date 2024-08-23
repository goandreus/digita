import React, {useEffect, useRef} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import Navigation from './src/navigations';
import CatalogueProvider from './src/providers/CatalogueProvider';
import {Provider} from 'react-redux';
import {store} from '@store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {initializeMMKVFlipper} from 'react-native-mmkv-flipper-plugin';
import {storage} from '@utils/secure-storage';
import {
  Dynatrace,
  DataCollectionLevel,
  UserPrivacyOptions,
} from '@dynatrace/react-native-plugin';
import OperationStackProvider from '@providers/OperationStackProvider';
import {
  initForegroundMessageHandler,
  requestUserPermission,
} from '@utils/firebase';
import SplashScreen from 'react-native-splash-screen';
import {Platform} from 'react-native';
import {getFormattedScreenName} from '@managers/AmplitudeManager/ScreenMap';
import {AH} from '@managers/AmplitudeManager/AmplitudeHandler';
import {ActivityHandler} from '@managers/ActivityHandler';
import messaging from '@react-native-firebase/messaging';

if (__DEV__) {
  initializeMMKVFlipper({default: storage});
}

let privacyConfig = new UserPrivacyOptions(
  DataCollectionLevel.UserBehavior,
  true,
);
Dynatrace.applyUserPrivacyOptions(privacyConfig);

const App = () => {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    requestUserPermission();
    initForegroundMessageHandler();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);

  useEffect(() => {
    messaging()
      .getToken()
      .then((token: string) => {
        storage.set('fcmToken', token);
      });
  }, []);

  return (
    <Provider store={store}>
      <OperationStackProvider>
        <ActivityHandler navigationRef={navigationRef}>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              routeNameRef.current = navigationRef.getCurrentRoute()?.name;
            }}
            onStateChange={async () => {
              const previousRouteName = routeNameRef.current;
              const currentRouteName = navigationRef.getCurrentRoute()?.name;
              const currentRouteProps = navigationRef.getCurrentRoute()?.params;

              if (previousRouteName !== currentRouteName) {
                if (currentRouteName === 'LoadingScreen') return;
                routeNameRef.current = currentRouteName;

                const screenName = getFormattedScreenName(currentRouteName);
                AH.pushPayload({
                  screenName: currentRouteName,
                  screenNameFormatted: screenName,
                  screenProps: currentRouteProps,
                });
                AH.track('CF App - Vista Activa', {
                  'Nombre de la Vista': `Vista ${screenName || 'Desconocida'}`,
                });
              }
            }}>
            <CatalogueProvider>
              <SafeAreaProvider>
                <Navigation />
              </SafeAreaProvider>
            </CatalogueProvider>
          </NavigationContainer>
        </ActivityHandler>
      </OperationStackProvider>
    </Provider>
  );
};

export default App;
