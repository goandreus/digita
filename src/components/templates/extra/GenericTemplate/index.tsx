import React, {useCallback, useRef} from 'react';
import {
  View,
  ColorValue,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import BoxView from '@atoms/BoxView';
import {HeaderStack} from '@molecules/extra/HeaderStack';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import Icon from '@atoms/Icon';

interface Props {
  headerTitle: string;
  title?: string;
  stepLabel?: string;
  barColor?: ColorValue;
  children?: React.ReactNode;
  list?: React.ReactNode;
  footer?: React.ReactNode;
  canGoBack: boolean;
  hasPayWithPhoneDisclaimer?: boolean;
  isFlex?: boolean;
  scrollEnabled?: boolean;
  hasExtraTopPadding?: boolean;
  hasPadding?: boolean;
  searchContacts?: boolean;
  goBack: () => void;
}

const GenericTemplate = ({
  headerTitle,
  title,
  stepLabel,
  children,
  list,
  canGoBack,
  footer,
  hasPayWithPhoneDisclaimer,
  isFlex,
  scrollEnabled,
  hasExtraTopPadding = true,
  hasPadding,
  searchContacts,
  goBack,
}: Props) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles({insets, hasPadding, searchContacts});

  const footerRef = useRef<View | null>(null);
  const setOpacityTo = useCallback((state: 'SHOW' | 'HIDE') => {
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
  }, []);

  const layoutHeight = useRef<number>(0);
  const contentHeight = useRef<number>(0);

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
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BoxView flex={isFlex ? 1 : undefined} background="background-lightest">
          <View style={styles.headerBorder}>
            <HeaderStack
              canGoBack={canGoBack}
              onBack={goBack}
              title={headerTitle}
            />
          </View>
          {hasPayWithPhoneDisclaimer ? (
            <BoxView
              direction="row"
              align="center"
              alignSelf="center"
              background="warning-lightest"
              p={SIZES.MD}
              style={styles.containerInfo}>
              <Icon
                name="exclamation-triangle"
                size="small"
                fill={COLORS.Warning.Medium}
              />
              <TextCustom
                style={styles.text}
                color="warning-dark"
                variation="h6"
                lineHeight="fair"
                weight="normal"
                align="left"
                text="Máximo S/ 500 por operación y hasta S/ 1,500 diarios."
              />
            </BoxView>
          ) : null}
          <KeyboardAwareScrollView
            scrollEnabled={scrollEnabled}
            enableAutomaticScroll={false}
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
            {hasExtraTopPadding && <Separator size={SIZES.XS * 4} />}
            {stepLabel ? (
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
            ) : null}
            {title && (
              <>
                <TextCustom
                  color="primary-medium"
                  variation="h2"
                  weight="normal"
                  lineHeight="tight">
                  {title}
                </TextCustom>
              </>
            )}
            {children}
          </KeyboardAwareScrollView>
          {list ? (
            <BoxView flex={15} px={SIZES.LG} background="background-lightest">
              {list}
            </BoxView>
          ) : null}
          {footer ? (
            <View
              style={styles.footer}
              ref={ref => {
                footerRef.current = ref;
              }}>
              {footer}
            </View>
          ) : null}
        </BoxView>
      </TouchableWithoutFeedback>
    </>
  );
};

const getStyles = ({
  insets,
  hasPadding = true,
  searchContacts,
}: {
  insets: EdgeInsets;
  hasPadding?: boolean;
  searchContacts?: boolean;
}) => {
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
      zIndex: 99,
    },
    body: {
      paddingHorizontal: hasPadding ? SIZES.LG : 0,
      backgroundColor: searchContacts
        ? COLORS.Background.Light
        : COLORS.Background.Lightest,
      marginBottom: searchContacts ? 24 : undefined,
    },
    footer: {
      paddingHorizontal: SIZES.LG,
      paddingTop: SIZES.MD,
      paddingBottom: insets.bottom + SIZES.XL,
      backgroundColor: COLORS.Background.Lightest,
      shadowColor: 'dark',
      shadowOffset: {width: 0, height: 1.5},
      shadowRadius: SIZES.XS / 2,
    },
    containerInfo: {
      borderRadius: SIZES.XS,
      width: Dimensions.get('screen').width,
    },
    text: {
      marginLeft: SIZES.MD,
    },
  });

  return styles;
};

export default GenericTemplate;
