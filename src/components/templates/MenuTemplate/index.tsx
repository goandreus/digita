import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '@theme/colors';
import React from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, {Path} from 'react-native-svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface MenuTemplateProps {
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  containerStyle?: ViewStyle;
}

const MenuTemplate = ({
  title,
  children,
  containerStyle,
  footer,
}: MenuTemplateProps) => {
  const navigation = useNavigation();

  const styles = getStyles();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top', 'right', 'left']} style={styles.safeArea}>
        <KeyboardAwareScrollView
          bounces={false}
          extraHeight={8 * 16}
          enableOnAndroid={true}
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 360 112"
              preserveAspectRatio="none">
              <Path
                d="M359.998 -88.9999V75.9809C317.642 91.7253 267.715 101.952 207.381 107.565C127.797 114.968 57.6709 112.27 0 105.583L5.45208e-06 -89L359.998 -88.9999Z"
                fill={Colors.Primary}
              />
            </Svg>
            <View style={styles.titleContainer}>
              <View style={styles.titleWrapper}>
                {navigation.canGoBack() && (
                  <Button
                    icon="arrow-left"
                    iconSize="tiny"
                    type="primary-inverted"
                    orientation="horizontal"
                    containerStyle={styles.containerButtonBack}
                    onPress={navigation.goBack}
                  />
                )}
                <TextCustom
                  variation="p"
                  weight="bold"
                  size={24}
                  color={Colors.White}>
                  {title}
                </TextCustom>
              </View>
            </View>
          </View>
          <Separator size={8 * 4} />
          <View style={{...styles.body, ...containerStyle}}>{children}</View>
          {footer !== undefined && <View style={styles.footer}>{footer}</View>}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    safeArea: {
      backgroundColor: Colors.Primary,
      flex: 1,
    },
    container: {
      backgroundColor: Colors.White,
    },
    contentContainer: {
      flexGrow: 1,
    },
    header: {
      height: 100,
    },
    titleContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'flex-start',
      height: '100%',
      marginHorizontal: `${8 / 2}%`,
    },
    containerButtonBack: {
      paddingHorizontal: 8,
      paddingVertical: 8,
      minHeight: 0,
    },
    titleWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    body: {
      marginHorizontal: `${8 / 2}%`,
    },
    footer: {
      marginHorizontal: `${8 / 2}%`,
      flex: 1,
      justifyContent: 'flex-end',
    },
  });

  return stylesBase;
};

export default MenuTemplate;
