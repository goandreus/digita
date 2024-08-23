/**
 * @format
 */
import 'react-native-get-random-values'; // don't move from here. It's first.
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import jail from 'jail-monkey';
import RNExitApp from 'react-native-exit-app';
import {CHECK_ROOT} from './src/constants';
import {initBackgroundMessageHandler} from '@utils/firebase';

if (CHECK_ROOT && !__DEV__ && jail.isJailBroken()) {
  RNExitApp.exitApp();
}

initBackgroundMessageHandler();

AppRegistry.registerComponent(appName, () => App);
