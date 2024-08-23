import React, {ReactNode, useEffect, useLayoutEffect} from 'react';
import {StyleSheet, ScrollView, View, Text, StatusBar} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {Layout} from '@theme/metrics';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {Colors} from '@theme/colors';
import {AnimationObject} from 'lottie-react-native';
import LottieView from 'lottie-react-native';
import SVGSeparatorLine from '@assets/images/separatorLine.svg';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface InfoTemplateProps {
  title?: string | ReactNode;
  descriptionAbove?: string | ReactNode;
  descriptionBelow?: string | ReactNode;
  imageSVG?: React.FC<SvgProps>;
  animationObject?: AnimationObject;
  footer?: React.ReactNode;
  isFlatDesign?: boolean;
  useSafeView?: boolean;
}

const InfoTemplate = ({
  title,
  descriptionAbove,
  descriptionBelow,
  imageSVG: ImageSVG,
  animationObject,
  footer,
  isFlatDesign = false,
  useSafeView = false,
}: InfoTemplateProps) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (navigation !== undefined)
      navigation.setOptions({
        headerShadowVisible: isFlatDesign ? false : true,
      });
  }, [navigation, isFlatDesign]);

  const styles = getStyles(isFlatDesign);

  const isDescriptionAboveString = typeof descriptionAbove === 'string';
  const isDescriptionBelowString = typeof descriptionBelow === 'string';
  const titleIsString = typeof title === 'string';

  const ViewWrapper = useSafeView ? SafeAreaView : View;

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />
      <ScrollView bounces={false} style={styles.container}>
        <ViewWrapper style={styles.body}>
          {title !== undefined && (
            <>
              {titleIsString ? (
                <TextCustom
                  text={title}
                  variation="h1"
                  weight="normal"
                  align="center"
                />
              ) : (
                title
              )}
              <Separator type="small" />
              <SVGSeparatorLine fill={Colors.Border} width="100%" />
            </>
          )}
          {descriptionAbove && (
            <>
              {title !== undefined && <Separator type="medium" />}
              <View style={styles.descriptionWrapper}>
                {isDescriptionAboveString ? (
                  <TextCustom
                    text={descriptionAbove}
                    variation="p"
                    align="left"
                  />
                ) : (
                  descriptionAbove
                )}
              </View>
            </>
          )}
          {animationObject !== undefined && (
            <>
              {(title !== undefined || descriptionAbove !== undefined) && (
                <Separator type="medium" />
              )}
              <LottieView
                style={{width: '100%'}}
                source={animationObject}
                autoPlay
                loop
              />
            </>
          )}
          {ImageSVG !== undefined && (
            <>
              {(title !== undefined || descriptionAbove !== undefined) && (
                <Separator type="medium" />
              )}
              <ImageSVG width="100%" />
            </>
          )}
          {descriptionBelow && (
            <>
              <Separator type="medium" />
              <View style={styles.descriptionWrapper}>
                {isDescriptionBelowString ? (
                  <TextCustom
                    text={descriptionBelow}
                    variation="p"
                    align="left"
                  />
                ) : (
                  descriptionBelow
                )}
              </View>
            </>
          )}
          {footer && (
            <>
              <Separator type="medium" />
              {footer}
            </>
          )}
        </ViewWrapper>
      </ScrollView>
    </>
  );
};

const getStyles = (isFlatDesign: boolean) => {
  const stylesBase = StyleSheet.create({
    container: {
      backgroundColor: Colors.White,
    },
    body: {
      marginTop: isFlatDesign ? 5 : Layout.ContentMarginHorizontal,
      marginBottom: Layout.ContentMarginHorizontal,
      marginHorizontal: Layout.ContentMarginHorizontal,
      alignItems: 'center',
    },
    descriptionWrapper: {
      width: '100%',
    },
  });

  return stylesBase;
};

export default InfoTemplate;
