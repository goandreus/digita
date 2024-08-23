import type {MutableRefObject} from 'react';
import {Platform, View} from 'react-native';
import {captureRef} from 'react-native-view-shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

export const shareScreenshot = async (
  viewRef: MutableRefObject<View | null>,
) => {
  console.log('SHARE');

  try {
    const res = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
      fileName: 'ConstanciaCF_',
    });

    await Share.open({
      filename: 'ConstanciaCF_',
      url: res,
      activityItemSources: [
        {
          placeholderItem: {
            type: 'url',
            content: 'https://awesome.contents.com/',
          },
          item: {},
          linkMetadata: {title: ''},
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
};

export const saveScreenshot = async (
  viewRef: MutableRefObject<View | null>,
) => {
  const nameFile = '/ConstanciaCF_.png';
  const pathAndroid = RNFS.DownloadDirectoryPath + nameFile;
  const pathIos = RNFS.LibraryDirectoryPath + nameFile;
  const path = Platform.OS === 'android' ? pathAndroid : pathIos;

  try {
    const res = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
      fileName: 'ConstanciaCF_',
      result: Platform.OS === 'ios' ? 'base64' : 'tmpfile',
    });

    await RNFS.writeFile(path, res, Platform.OS === 'ios' ? 'base64' : '')
      .then(() => {
        if (Platform.OS === 'android') {
          RNFS.readFile(RNFS.DownloadDirectoryPath + nameFile)
            .then(file => {
              CameraRoll.save(file);
            })
            .catch(e => console.log(e));
        } else if (Platform.OS === 'ios') {
          RNFS.readFile(RNFS.LibraryDirectoryPath + nameFile, 'base64')
            .then(file => {
              const newFile = 'data:image/png;base64,' + file;
              CameraRoll.save(newFile);
            })
            .catch(err => console.log('Read File Error', err));
        }
      })
      .catch(err => console.log('Write File Error =>', err));

    return true;
  } catch (err) {
    console.log('err', err);
    return false;
  }
};
