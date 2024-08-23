import React, {ReactNode} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import SVGBackgroundFullScreen from '@assets/images/backgroundFullScreen.svg';
import {Colors} from '@theme/colors';
import {Layout} from '@theme/metrics';

interface ImpactTemplateProps {
  children?: ReactNode;
}

const ImpactTemplate = ({children}: ImpactTemplateProps) => {
  const styles = getStyles();
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />
      <View style={styles.container}>
        <SVGBackgroundFullScreen
          fill={Colors.Primary}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        />
        <View style={styles.content}>
          <View style={styles.box}>{children}</View>
        </View>
      </View>
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    container: {
      backgroundColor: Colors.PrimaryHover,
    },
    content: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      padding: Layout.ContentMarginHorizontal,
    },
    box: {
      alignItems: 'center',
    },
  });

  return stylesBase;
};

export default ImpactTemplate;
