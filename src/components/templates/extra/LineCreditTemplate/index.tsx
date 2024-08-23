import {View, StatusBar, StyleSheet, ImageBackground} from 'react-native';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Separator from '@atoms/extra/Separator';
import {COLORS} from '@theme/colors';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import HeaderBackButton from '@molecules/extra/HeaderBackButton';
import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';
import {useLastUser} from '@hooks/common';

interface Props {
  amount?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  canGoBack: boolean;
  goBack: () => void;
}

const LineCreditTemplate = ({
  children,
  amount,
  footer,
  canGoBack,
  goBack,
}: Props) => {
  const {lastUser} = useLastUser();
  const insets = useSafeAreaInsets();
  const styles = getStyles({insets});
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={'transparent'}
        translucent
      />

      <KeyboardAwareScrollView
        bounces={false}
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="always">
        <BoxView background="primary-medium" pt={insets.top} />
        <ImageBackground
          resizeMode="stretch"
          style={styles.imageContainer}
          source={require('@assets/images/background_contratacion_2.png')}>
          <Separator size={SIZES.MD} />
          <View style={styles.backContainer}>
            <HeaderBackButton
              canGoBack={canGoBack}
              color={COLORS.Neutral.Lightest}
              onPress={goBack}
            />
          </View>
          <Separator size={SIZES.MD} />
          <BoxView alignSelf="flex-start" px={SIZES.LG}>
            <TextCustom
              text={`${lastUser?.firstName},`}
              variation="h1"
              color={'neutral-lightest'}
              weight="normal"
              lineHeight="tight"
            />
            <Separator type="xx-small" />
            <TextCustom
              text=" Es momento de crear tu Línea de Crédito"
              variation="h0"
              color={'neutral-lightest'}
              weight="normal"
              lineHeight="fair"
            />
          </BoxView>
          <Separator type="small" />
          <BoxView
            mx={SIZES.LG}
            background="primary-dark"
            py={SIZES.LG}
            px={SIZES.XL}
            style={styles.amountContainer}>
            <TextCustom
              text="Monto de Línea de Crédito"
              variation="h4"
              color={'neutral-lightest'}
              weight="normal"
              lineHeight="tight"
            />
            <Separator type="xx-small" />
            <TextCustom
              text={amount}
              variation="h4"
              color={'neutral-lightest'}
              weight="normal"
              size={40}
              lineHeight="tight"
            />
          </BoxView>
          <Icon name="money-yellow" size={75} style={styles.icon} />
          {/* <Separator type='medium' /> */}
        </ImageBackground>

        <View style={styles.body}>{children}</View>
        {footer && <View style={styles.footer}>{footer}</View>}
      </KeyboardAwareScrollView>
    </>
  );
};

const getStyles = ({insets}: {insets: EdgeInsets}) => {
  const styles = StyleSheet.create({
    scrollContainer: {
      flex: 1,
      backgroundColor: COLORS.Error.Lightest,
    },
    imageContainer: {
      /* aspectRatio: 360 / 288, */
      height: 320,
      width: '100%',
    },
    backContainer: {
      left: 0,
    },
    amountContainer: {
      alignItems: 'center',
      borderRadius: SIZES.XS,
    },
    icon: {
      position: 'absolute',
      bottom: 29,
      right: 6,
    },
    body: {
      paddingHorizontal: SIZES.LG,
    },
    footer: {
      paddingHorizontal: SIZES.LG,
      paddingTop: SIZES.MD,
      paddingBottom: insets.bottom + SIZES.XL,
    },
  });
  return styles;
};

export default LineCreditTemplate;
