import {PermissionsAndroid, Platform} from 'react-native';
import Contacts from 'react-native-contacts';

export const checkWriteAndroidPermission = async () => {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
};

export const checkReadContactsAndroidPermission = async () => {
  const permission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  console.log('status', status);
  return status === 'granted';
};

export const checkReadContactsIosPermission = async () => {
  const hasPermission = await Contacts.checkPermission();
  if (hasPermission === 'authorized') {
    return true;
  }
  const status = await Contacts.requestPermission();
  console.log('status', status);
  return status === 'authorized';
};

export const hasContactsAccessPermissions = () =>
  Platform.OS === 'android'
    ? checkReadContactsAndroidPermission()
    : checkReadContactsIosPermission();

