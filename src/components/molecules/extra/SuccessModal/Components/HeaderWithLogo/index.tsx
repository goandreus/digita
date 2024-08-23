import React from 'react';
import {StyleSheet} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import Icon from '@atoms/Icon';

const HeaderWithLogo = () => {
  return (
    <>
      <Svg
        style={styles.svgContainer}
        width="100%"
        height="500"
        viewBox="15 24 360 112"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          scaleX={1.1}
          d="M359.998 -88.9999V75.9809C317.642 91.7253 267.715 101.952 207.381 107.565C127.797 114.968 57.6709 112.27 0 105.583L5.45208e-06 -89L359.998 -88.9999Z"
          fill="#CA005D"
        />
      </Svg>
      <Icon style={styles.logo} name="success-banner" size={160} />
    </>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    alignSelf: 'center',
    position: 'absolute',
    top: 12,
  },
});

export default HeaderWithLogo;
