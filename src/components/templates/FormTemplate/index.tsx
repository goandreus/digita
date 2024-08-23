import React, {ReactNode} from 'react';
import {Image, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {Colors} from '@theme/colors';
import {Layout, SEPARATOR_BASE} from '@theme/metrics';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import Steps, {StepsProps} from '@molecules/Steps';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
interface FormTemplate {
  showLogo?: boolean;
  logo?: boolean;
  title?: string;
  description?: string | ReactNode;
  descriptionComponent?: ReactNode;
  stepsProps?: StepsProps;
  children?: React.ReactNode;
  header?: React.ReactNode;
}

const FormTemplate = ({
  showLogo = false,
  logo,
  title,
  description,
  stepsProps,
  children,
  header,
}: FormTemplate) => {
  const styles = getStyles();

  const isDescriptionString = typeof description === 'string';

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />
      <KeyboardAwareScrollView
        bounces={false}
        style={styles.container}
        extraHeight={SEPARATOR_BASE * 16}
        enableOnAndroid={true}>
        <View style={styles.body}>
          {header}
          {stepsProps ? (
            <>
              <Steps
                current={stepsProps.current}
                max={stepsProps.max}
                showLabel={stepsProps.showLabel}
              />
              {showLogo ? (
                <Separator size={SEPARATOR_BASE * 3} />
              ) : (
                <Separator type="x-large" />
              )}
            </>
          ) : (
            <Separator type="medium" />
          )}

          {showLogo && (
            <>
              <Image
                source={require('@assets/images/logo-red.png')}
                style={{
                  aspectRatio: 433 / 166,
                  width: '65%',
                  alignSelf: 'center',
                  height: undefined,
                }}
              />
              <Separator size={SEPARATOR_BASE * 2} />
            </>
          )}

          {logo && (
            <View style={styles.logo}>
              <Image
                source={require('../../../assets/icons/logo-compartamos.png')}
              />
            </View>
          )}

          {title !== undefined && (
            <TextCustom
              text={title}
              variation="h1"
              weight="normal"
              align="center"
            />
          )}

          {description !== undefined && (
            <>
              <Separator type="medium" />
              {isDescriptionString ? (
                <TextCustom text={description} variation="p" align="left" />
              ) : (
                description
              )}
            </>
          )}
          {children && (
            <>
              <Separator size={SEPARATOR_BASE * 4} />
              {children}
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    logo: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: Colors.White,
    },
    body: {
      marginBottom: Layout.ContentMarginHorizontal,
      marginHorizontal: Layout.ContentMarginHorizontal,
      // backgroundColor: 'yellow',
    },
  });

  return stylesBase;
};

export default FormTemplate;
