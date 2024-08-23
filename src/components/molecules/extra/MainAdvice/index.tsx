import React, {useState} from 'react';
import {View, StyleSheet, Pressable, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import Skeleton from '@molecules/Skeleton';
import {useNavigation} from '@react-navigation/native';
import {getRemoteValue} from '@utils/firebase';

const MainAdvice = () => {
  const navigation = useNavigation();
  const url_banner = getRemoteValue('url_banner').asString();
  const [isBannerLoading, setIsBannerLoading] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          navigation.navigate('OperationsStack', {
            screen: 'OpenSavingsAccount',
          });
        }}>
        {isBannerLoading ? (
          <Skeleton timing={600}>
            <View style={styles.skeleton} />
          </Skeleton>
        ) : (
          <FastImage
            style={styles.image}
            source={{
              uri: url_banner,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
            onLoadEnd={() => setIsBannerLoading(false)}
          />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    alignSelf: 'center',
    bottom: -20.5,
  },
  image: {
    width: Dimensions.get('window').width,
    height: 100,
  },
  skeleton: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    backgroundColor: '#E1E1E1',
  },
});

export default MainAdvice;
