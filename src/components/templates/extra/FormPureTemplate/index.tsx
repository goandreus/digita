import React, {useCallback, useRef} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';

interface FormPureTemplate {
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const FormPureTemplate = ({
  children,
  footer,
}: FormPureTemplate) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles({insets});

  const footerRef = useRef<View | null>(null);
  const setOpacityTo = useCallback((state: 'SHOW' | 'HIDE') => {
    if (footerRef.current === null) return;

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
    if (shadowed) setOpacityTo('SHOW');
    else setOpacityTo('HIDE');
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
        backgroundColor='white'
        translucent={true}
      />
      <View style={styles.boxContainer}>
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
          enableOnAndroid={true}>
          {children}
        </KeyboardAwareScrollView>
        <View
          style={styles.footer}
          ref={ref => {
            footerRef.current = ref;
          }}>
          {footer}
        </View>
      </View>
    </>
  );
};

const getStyles = ({insets}: {insets: EdgeInsets}) => {
  const stylesBase = StyleSheet.create({
    boxContainer: {
      backgroundColor: COLORS.Background.Lightest,
      flexDirection: 'column',
      justifyContent: 'space-between',
      flex: 1,
    },
    body: {
      paddingHorizontal: SIZES.LG,
      flex: 1,
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
  });

  return stylesBase;
};

export default FormPureTemplate;
