import {
  View,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  ColorValue,
  Dimensions,
  Pressable,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS, ColorType} from '@theme/colors';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import Separator from '@atoms/extra/Separator';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Steps, {StepsProps} from '@molecules/extra/Steps';
import {HeaderStack} from '@molecules/extra/HeaderStack';
import Icon, {IconName} from '@atoms/Icon';
import {getRemoteValue} from '@utils/firebase';

interface TransfersTemplateProps {
  headerTitle: string;
  title: string;
  subtitle?: string;
  stepsProps?: StepsProps;
  stepLabel?: string;
  barColor?: ColorValue;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  canGoBack: boolean;
  extraTopSpace?: boolean;
  topDisclaimer?: {
    text: string;
    icon: IconName;
    background: ColorType;
  };
  goBack: () => void;
  hasDisclaimer?: boolean;
  hasScrollButton?: boolean;
}

const TransfersTemplate = ({
  headerTitle,
  title,
  subtitle,
  stepsProps,
  stepLabel,
  barColor = COLORS.Background.Lightest,
  children,
  canGoBack,
  extraTopSpace: extraSpace = true,
  topDisclaimer,
  footer,
  goBack,
  hasDisclaimer,
  hasScrollButton,
}: TransfersTemplateProps) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles({insets});
  const footerRef = useRef<View | null>(null);
  const layoutHeight = useRef<number>(0);
  const contentHeight = useRef<number>(0);

  const setOpacityTo = useCallback(
    (state: 'SHOW' | 'HIDE') => {
      if (footerRef.current === null) {
        return;
      }

      switch (Platform.OS) {
        case 'ios':
          footerRef.current.setNativeProps({
            shadowOpacity: state === 'SHOW' ? 0.15 : 0,
          });
          break;
        case 'android':
          footerRef.current.setNativeProps({
            elevation: state === 'SHOW' ? SIZES.XS : 0,
          });
          break;
      }
    },
    [footerRef],
  );

  const updateFooterShadow = (shadowed: boolean) => {
    if (shadowed) {
      setOpacityTo('SHOW');
    } else {
      setOpacityTo('HIDE');
    }
  };

  const processShadow = () => {
    const shadowed =
      Math.round(contentHeight.current) > Math.round(layoutHeight.current);
    updateFooterShadow(shadowed);
  };

  const trx_others_disclaimer_show = getRemoteValue(
    'trx_others_disclaimer_show',
  ).asBoolean();

  const scrollViewRef = useRef<any>(null);

  const [scrolling, setScrolling] = useState<boolean>(false);
  const [iconName, setIconName] = useState<IconName>('icon_scroll-down');

  const handleScroll = () => {
    if (!scrolling) {
      scrollViewRef.current.scrollToEnd({animated: true});
      setIconName('icon_scroll-up');
      setScrolling(true);
    } else {
      scrollViewRef.current.scrollToPosition(0, 0, true);
      setIconName('icon_scroll-down');
      setScrolling(false);
    }
  };

  return (
    <>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor={barColor}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BoxView flex={1}>
          <BoxView
            background="background-lightest"
            style={stepsProps === undefined ? styles.headerBorder : undefined}>
            <HeaderStack
              canGoBack={canGoBack}
              onBack={goBack}
              title={headerTitle}
            />
          </BoxView>
          {stepsProps !== undefined && (
            <Steps
              max={stepsProps.max}
              current={stepsProps.current}
              started={stepsProps.started}
            />
          )}
          {topDisclaimer && (
            <BoxView
              direction="row"
              align="center"
              justify="center"
              background={topDisclaimer.background}
              py={SIZES.MD}>
              <Icon
                name={topDisclaimer.icon}
                size="x-small"
                fill={COLORS.Warning.Medium}
              />
              <TextCustom
                style={styles.text}
                color="warning-dark"
                variation="h6"
                lineHeight="fair"
                weight="normal"
                align="left"
                text={topDisclaimer.text}
              />
            </BoxView>
          )}
          <KeyboardAwareScrollView
            ref={scrollViewRef}
            extraHeight={SIZES.XS * 16}
            onContentSizeChange={(width, height) => {
              contentHeight.current = height;
              processShadow();
            }}
            onLayout={event => {
              layoutHeight.current = event.nativeEvent.layout.height;
              processShadow();
            }}
            style={styles.body}
            onScroll={({nativeEvent}) => {
              const shadowed =
                Math.round(
                  nativeEvent.layoutMeasurement.height +
                    nativeEvent.contentOffset.y,
                ) < Math.round(nativeEvent.contentSize.height);

              updateFooterShadow(shadowed);
            }}
            bounces={false}
            enableOnAndroid={true}>
            {trx_others_disclaimer_show &&
            stepsProps?.current === 0 &&
            hasDisclaimer ? (
              <BoxView
                direction="row"
                align="center"
                alignSelf="center"
                background="informative-lightest"
                p={SIZES.MD}
                style={styles.containerInfo}>
                <Icon
                  name="exclamation-circle-inverted"
                  size="normal"
                  fill={COLORS.Informative.Medium}
                />
                <TextCustom
                  style={styles.text}
                  color="informative-dark"
                  variation="h6"
                  lineHeight="fair"
                  weight="normal"
                  align="left"
                  text={
                    'Si se cobró la comisión por transferencias interbancarias\ninmediatas menor o igual a S/500 o $140, esta será\ndevuelta al día siguiente hábil de realizada la operación.'
                  }
                />
              </BoxView>
            ) : null}
            <Separator size={SIZES.XS * 4} />
            <View style={{paddingHorizontal: SIZES.LG}}>
              {stepsProps !== undefined && stepsProps.current !== undefined && (
                <>
                  <TextCustom
                    color="neutral-dark"
                    variation="h5"
                    weight="normal"
                    lineHeight="tight">
                    Paso {stepsProps.current + 1} de {stepsProps.max}
                  </TextCustom>
                  <Separator size={SIZES.XS} />
                </>
              )}
              {stepLabel && (
                <>
                  <TextCustom
                    text={stepLabel}
                    color="neutral-medium"
                    variation="h5"
                    weight="normal"
                    lineHeight="tight"
                  />
                  <Separator size={SIZES.XS} />
                </>
              )}
              <TextCustom
                color="primary-medium"
                variation="h2"
                weight="normal"
                lineHeight="tight">
                {title}
              </TextCustom>
              {subtitle ? (
                <TextCustom
                  color="neutral-darkest"
                  lineHeight="comfy"
                  weight="normal"
                  variation="h4"
                  text={subtitle}
                />
              ) : null}
              {extraSpace && <Separator size={30} />}
              {children}
            </View>
          </KeyboardAwareScrollView>
          {hasScrollButton ? (
            <Pressable onPressIn={handleScroll}>
              <Icon
                style={{
                  bottom: 8,
                  right: 8,
                  position: 'absolute',
                  elevation: 36,
                  shadowColor: '#222D42',
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                }}
                size={40}
                name={iconName}
              />
            </Pressable>
          ) : null}
          <View
            style={styles.footer}
            ref={ref => {
              footerRef.current = ref;
            }}>
            {footer}
          </View>
        </BoxView>
      </TouchableWithoutFeedback>
    </>
  );
};

const getStyles = ({insets}: {insets: EdgeInsets}) => {
  const styles = StyleSheet.create({
    headerBorder: {
      borderTopWidth: 1.5,
      borderColor: 'rgba(0,0,0,0.01)',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 12,
      zIndex: 1,
    },
    body: {
      flex: 1,
      backgroundColor: COLORS.Background.Lightest,
    },
    footer: {
      paddingHorizontal: SIZES.XS * 6,
      paddingTop: SIZES.MD,
      paddingBottom: insets.bottom + SIZES.XL,
      backgroundColor: COLORS.Background.Lightest,
      shadowColor: 'dark',
      shadowOffset: {width: 0, height: 1.5},
      shadowRadius: SIZES.XS / 2,
    },
    text: {
      marginLeft: SIZES.MD,
    },
    containerInfo: {
      borderRadius: SIZES.XS,
      width: Dimensions.get('screen').width,
    },
  });

  return styles;
};

export default TransfersTemplate;
