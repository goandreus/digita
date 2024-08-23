import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {Layout, ScreenSize} from '@theme/metrics';
import {Colors} from '@theme/colors';

interface HomeTemplateProps {
  children?: React.ReactNode;
  image: ImageSourcePropType;
}

const HomeTemplate = ({image, children}: HomeTemplateProps) => {
  const styles = getStyles();

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 360 263"
            preserveAspectRatio="none">
            <Path
              d="M360.548 0v215.5c-42.42 20.566-92.424 33.924-152.85 41.255-79.706 9.67-149.939 6.147-207.698-2.589V0h360.548z"
              fill={Colors.Primary}
            />
          </Svg>
          <View style={styles.logoContainer}>
            <Image source={image} style={styles.logo} />
          </View>
        </View>
        <View style={styles.body}>{children}</View>
      </View>
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    container: {
      backgroundColor: Colors.White,
      height: '100%',
    },
    header: {
      height: ScreenSize.height / 3,
    },
    logoContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    logo: {
      width: '100%',
      height: '50%',
      resizeMode: 'contain',
    },
    body: {
      marginVertical: Layout.ContentMarginHorizontal,
      marginHorizontal: Layout.ContentMarginHorizontal,
    },
  });

  return stylesBase;
};

export default HomeTemplate;
