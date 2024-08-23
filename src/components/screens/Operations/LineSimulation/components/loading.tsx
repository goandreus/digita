import React from 'react';
import BoxView from '@atoms/BoxView';
import AnimatedLottieView from 'lottie-react-native';
import {loadStyles as styles} from '../styles';

export const Loading = () => {
  return (
    <BoxView style={styles.container} justify="center" align="center">
      <AnimatedLottieView
        style={styles.lottieView}
        source={require('@assets/images/simulatorLoading.json')}
        autoPlay
        loop
      />
    </BoxView>
  );
};
