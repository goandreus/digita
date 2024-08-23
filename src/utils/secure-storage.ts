import {MMKV} from 'react-native-mmkv';
import * as fs from 'react-native-fs';
import { Platform } from 'react-native';
import NativeConfig from 'react-native-config';
import {BUNDLE_ID} from '@constants';

type TypeValue = 'int' | 'bool' | 'str';
type ReturnTypeValue<T> = T extends 'int' ? number : T extends 'bool' ? boolean : string;

// interface User {
//   email: string;
//   username: string;
//   password: string;
// }

const KEY = 'AIzaSyDfycbFwEnVecFUSd22F';

const mmkvPath =
  Platform.OS === 'ios'
    ? `${fs.LibraryDirectoryPath}/Application Support/${BUNDLE_ID[NativeConfig.ENV]}`
    : `${fs.DocumentDirectoryPath}/mmkv`;
export const storage = new MMKV({
  id: 'secure-storagev4',
  encryptionKey: KEY,
  path: mmkvPath
});

if (Platform.OS === 'ios') {
  fs.exists(fs.DocumentDirectoryPath + '/mmkv').then(hasFolder => {
    if (hasFolder) fs.unlink(fs.DocumentDirectoryPath + '/mmkv');
  });
};
// export const publicStorage = new MMKV({id: 'public-storagev1'});

export const encryptData = () => storage.recrypt(KEY);
export const removeEncryption = () => storage.recrypt(undefined);

export const has = (key: string) => storage.contains(key);
export const set = (key: string, value: string | number | boolean) => storage.set(key, value);
export const get = <T extends TypeValue>(key: string, type: T) => {
  if (type === 'int') return storage.getNumber(key) as ReturnTypeValue<T>;
  if (type === 'str') return storage.getString(key) as ReturnTypeValue<T>;
  if (type === 'bool') return storage.getBoolean(key) as ReturnTypeValue<T>;
};


// export const setUser = (user: User) => set('@User', JSON.stringify(user));
// export const getUser = (): User | null => has('@User') ? JSON.parse(get('@User', 'str')!) : null;

// export const getLastConnection = () => {
//   // timestamp
//   return publicStorage.getNumber('@LastConn');
// }
