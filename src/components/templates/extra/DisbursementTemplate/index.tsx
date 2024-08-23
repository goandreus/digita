import {
  View,
  ColorValue,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useCallback, useRef} from 'react';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import BoxView from '@atoms/BoxView';
import {HeaderStack} from '@molecules/extra/HeaderStack';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';

interface Props {
  headerTitle: string;
  title?: string;
  barColor?: ColorValue;
  containerFlex?: number;
  children?: React.ReactNode;
  extraTopPadding?: number;
  head?: React.ReactNode;
  footer?: React.ReactNode;
  canGoBack: boolean;
  goBack: () => void;
}

const DisbursementTemplate = ({
  headerTitle,
  title,
  barColor = COLORS.Background.Lightest,
  containerFlex,
  children,
  canGoBack,
  extraTopPadding,
  head,
  footer,
  goBack,
}: Props) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles({insets});

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
        <BoxView flex={1} background="informative-darkest">
          <View style={styles.headerBorder}>
            <HeaderStack
              canGoBack={canGoBack}
              onBack={goBack}
              title={headerTitle}
            />
          </View>
          {head}
          <KeyboardAwareScrollView
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
            enableOnAndroid={true}
            contentContainerStyle={{flexGrow: containerFlex}}>
            {extraTopPadding && <Separator size={extraTopPadding} />}
            <Separator size={SIZES.XS * 4} />
            {title && (
              <>
                <TextCustom
                  color="neutral-dark"
                  variation="h5"
                  weight="normal"
                  lineHeight="tight">
                  Paso final
                </TextCustom>
                <Separator size={SIZES.XS} />
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
          {footer && (
            <View
              style={styles.footer}
              ref={ref => {
                footerRef.current = ref;
              }}>
              {footer}
            </View>
          )}
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
      zIndex: 99,
    },
    body: {
      paddingHorizontal: SIZES.LG,
      flex: 1,
      backgroundColor: COLORS.Background.Lightest,
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
  });

  return styles;
};

export default DisbursementTemplate;
