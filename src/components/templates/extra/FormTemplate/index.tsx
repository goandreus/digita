import React, {ReactNode} from 'react';
import {Image, StatusBar, StyleSheet, View} from 'react-native';

import Steps, {StepsProps} from '@molecules/Steps';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {COLORS} from '@theme/colors';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';

interface FormTemplate {
  showLogo?: boolean;
  title?: string;
  description?: string | ReactNode;
  descriptionComponent?: ReactNode;
  stepsProps?: StepsProps;
  children?: React.ReactNode;
  topContent?: React.ReactNode;
}

const FormTemplate = ({
  showLogo = false,
  title,
  description,
  stepsProps,
  children,
  topContent,
}: FormTemplate) => {
  const styles = getStyles();

  const isDescriptionString = typeof description === 'string';

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.Transparent}
        translucent={true}
      />
      <KeyboardAwareScrollView
        bounces={false}
        style={styles.container}
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid={true}>
        <View style={styles.body}>
          {topContent}
          {stepsProps ? (
            <>
              <Steps
                current={stepsProps.current}
                max={stepsProps.max}
                showLabel={stepsProps.showLabel}
              />
              {showLogo ? (
                <Separator type="large" />
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
                style={styles.logo}
              />
              <Separator type="medium" />
            </>
          )}

          {title !== undefined && (
            <TextCustom
              text={title}
              variation="h2"
              weight="normal"
              align="center"
              color="primary-medium"
            />
          )}

          {description !== undefined && (
            <>
              <Separator type="medium" />
              {isDescriptionString ? (
                <TextCustom
                  text={description}
                  variation="h3"
                  align="center"
                  color="neutral-dark"
                />
              ) : (
                description
              )}
            </>
          )}
          {children && (
            <>
              <Separator type="large" />
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
    logonContainer: {
      backgroundColor: 'red',
    },
    logo: {
      width: '70%',
      height: 70,
      alignSelf: 'center',
      resizeMode: 'contain',
    },
    container: {
      backgroundColor: COLORS.Background.Lightest,
    },
    body: {
      flex: 1,
      marginBottom: SIZES.LG,
      marginHorizontal: SIZES.LG,
    },
  });

  return stylesBase;
};

export default FormTemplate;
