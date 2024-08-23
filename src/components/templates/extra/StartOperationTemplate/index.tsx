import {View, Image, StatusBar, StyleSheet} from 'react-native';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {SIZES} from '@theme/metrics';
import Separator from '@atoms/extra/Separator';
import HeaderBackButton from '@molecules/extra/HeaderBackButton';
import {COLORS} from '@theme/colors';

const StartOperationTemplate = ({
  children,
  footer,
  canGoBack,
  goBack,
}: {
  children?: React.ReactNode;
  footer?: React.ReactNode;
  canGoBack: boolean;
  goBack: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const styles = getStylesFromTemplate({insets});

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={true}
        style={styles.scrollContainer}
        bounces={false}
        enableOnAndroid={true}>
        <Separator size={insets.top} />
        <View style={{...styles.imageBackground, marginTop: insets.top}}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require('@assets/images/fishes-logo-header.png')}
          />
        </View>
        <Separator size={SIZES.XL} />
        <View style={styles.backContainer}>
          <HeaderBackButton
            canGoBack={canGoBack}
            color={COLORS.Neutral.Lightest}
            onPress={goBack}
          />
        </View>
        <Separator size={SIZES.MD} />
        <View style={styles.body}>{children}</View>
        <View style={{flex: 1}} />
        <View style={styles.footer}>{footer}</View>
      </KeyboardAwareScrollView>
    </>
  );
};

const getStylesFromTemplate = ({insets}: {insets: EdgeInsets}) => {
  const stylesBase = StyleSheet.create({
    boxContainer: {},
    imageBackground: {
      position: 'absolute',
      right: 10,
      overflow: 'visible',
      zIndex: 99,
    },
    logo: {
      width: 222,
      height: 69,
    },
    backContainer: {
      left: 0,
    },
    scrollContainer: {
      flex: 1,
      backgroundColor: COLORS.Primary.Medium,
    },
    body: {
      paddingHorizontal: SIZES.LG,
    },
    footer: {
      paddingHorizontal: SIZES.LG,
      paddingTop: SIZES.MD,
      paddingBottom: insets.bottom + SIZES.XL,
      backgroundColor: COLORS.Primary.Medium,
      shadowColor: 'dark',
      shadowOffset: {width: 0, height: 1.5},
      shadowRadius: SIZES.XS / 2,
    },
  });

  return stylesBase;
};

export default StartOperationTemplate;
