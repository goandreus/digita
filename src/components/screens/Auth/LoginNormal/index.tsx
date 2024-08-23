import {Formik} from 'formik';
import React, { useState } from 'react';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import Button from '@atoms/extra/Button';
import FieldForm from '@molecules/extra/FieldForm';
import * as _ from 'lodash';
import {LoginNormalScreenProps} from '@navigations/types';
import InputIcon from '@molecules/extra/InputIcon';
import Input from '@atoms/extra/Input';
import ModalError from '@molecules/ModalError';
import {useLoginNormal} from './hook';
import {SIZES} from '@theme/metrics';
import AlertBasic from '@molecules/extra/AlertBasic';
import { Information } from '@global/information';
import { Image, Linking, StatusBar, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { COLORS } from '@theme/colors';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS } from '@theme/fonts';

export const LoginNormalScreen = ({
  navigation,
  route,
}: LoginNormalScreenProps) => {
  const {
    initialValues,
    validationSchema,
    openModal,
    titleModal,
    contentModal,
    closeModal,
    analyzeText,
    getPlaceholderByKey,
    handleKeyboardType,
    handleMaxLength,
    handleOnSubmit,
    setShowNormalErrorAlert,
    setShowOpenSessionModal,
    showNormalErrorAlert,
    showOpenSessionModal,
    openSessionInfo,
  } = useLoginNormal({route, navigation});

  const insets = useSafeAreaInsets();
  const styles = getStyles();
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
        contentContainerStyle={{minHeight: '100%'}}
        enableOnAndroid={true}>
        <Image
          source={require('@assets/images/logo-red.png')}
          style={styles.logo}
        />
        <Separator size={SIZES.XS * 5.5} />
        <Formik
          validateOnMount={true}
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            await handleOnSubmit(
              {
                documentTypeFormatted: values.documentType,
                documentNumber: values[values.documentType],
                password: values.password,
              },
              () => {
                setTimeout(() => {
                  actions.resetForm();
                }, 1000);
              },
            );
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            values,
            errors,
            touched,
            isValid,
            isSubmitting,
          }) => (
            <>
              <View style={{marginHorizontal: SIZES.LG}}>
                <TextCustom
                  lineHeight="tight"
                  text="Número de documento (DNI)"
                  variation="h4"
                  weight="normal"
                  color={
                    errors[values.documentType] !== undefined &&
                    touched[values.documentType] !== undefined
                      ? 'error-medium'
                      : 'neutral-darkest'
                  }
                />
                <Separator size={SIZES.XS} />
                <Input
                  value={values[values.documentType]}
                  haveError={
                    errors[values.documentType] !== undefined &&
                    touched[values.documentType] !== undefined
                  }
                  errorMessage={errors[values.documentType]?.toString()}
                  onChange={text => {
                    const textAnalyzed: string = analyzeText(
                      values.documentType,
                      text,
                    );
                    setFieldValue(values.documentType, textAnalyzed, true);
                  }}
                  onBlur={handleBlur(values.documentType)}
                  keyboardType={handleKeyboardType(values.documentType)}
                  maxLength={handleMaxLength(values.documentType)}
                  placeholder={getPlaceholderByKey(values.documentType)}
                />
                <Separator size={SIZES.XS * 5} />
                <TextCustom
                  lineHeight="tight"
                  text="Clave digital"
                  variation="h4"
                  weight="normal"
                  color={
                    errors.password !== undefined &&
                    touched.password !== undefined
                      ? 'error-medium'
                      : 'neutral-darkest'
                  }
                />
                <Separator size={SIZES.XS} />
                <InputIcon
                  placeholder='Ingresa tu clave digital'
                  actionName={
                    values.showPassword
                      ? 'Ocultar contraseña'
                      : 'Mostar contraseña'
                  }
                  value={values.password}
                  iconRightName={values.showPassword ? 'icon_eye_on' : 'icon_eye_off'}
                  secureTextEntry={values.showPassword === false}
                  contextMenuHidden={true}
                  haveError={
                    errors.password !== undefined && touched.password === true
                  }
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  onClickIconRight={() =>
                    setFieldValue('showPassword', !values.showPassword)
                  }
                />
                {errors.password !== undefined &&
                  touched.password === true &&
                  <>
                    <Separator size={SIZES.XS} />
                    <TextCustom
                      variation="p5"
                      color="error-medium"
                      lineHeight="tight">
                      {errors.password?.toString()}
                    </TextCustom>
                  </>}
                <Separator size={SIZES.XS * 2} />
                <TextCustom
                  variation="h4"
                  color='neutral-darkest'
                  weight="normal">
                  ¿Primera vez en la app?{' '}
                  <TextCustom
                    variation="h4"
                    color='primary-medium'
                    onPress={() => {
                      navigation.navigate('RegisterUserDocument');
                    }}>
                    Regístrate aquí
                  </TextCustom>
                </TextCustom>
                <Separator size={SIZES.XS * 5} />
                <View style={{marginHorizontal: SIZES.LG}}>
                  <Button
                    onPress={handleSubmit}
                    loading={isSubmitting}
                    orientation="horizontal"
                    type="primary"
                    text="Ingresar"
                    disabled={!isValid}
                  />
                </View>
                <Separator size={SIZES.XS * 2} />
                <TouchableWithoutFeedback
                  onPress={() => {
                    AH.track("CF App - Clave Olvidada", {
                      'Fase de Inicio de Sesión': 'Usuario y Contraseña',
                      'Etapa': 'Inicio'
                    });
                    navigation.navigate('RecoverPassword');
                  }}>
                  <View style={{
                    paddingVertical: 12,
                    alignItems: 'center',
                    marginHorizontal: SIZES.LG,
                  }}>
                    <TextCustom
                      variation="p4"
                      color='primary-medium'
                      weight='bold'>
                      Olvidé mi clave
                    </TextCustom>
                  </View>
                </TouchableWithoutFeedback>
                <Separator size={21} />
                <Text style={{
                  fontFamily: FONTS.AmorSansPro,
                  color: COLORS.Neutral.Dark,
                  fontSize: 10,
                  textAlign: 'center'
                }}>
                  COMPARTAMOS FINANCIERA S.A. - RUC: 20369155360
                </Text>
                <Separator size={21} />
              </View>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
      <ModalError
        isOpen={openModal}
        close={closeModal}
        title={titleModal}
        content={contentModal}
        titleButton="Aceptar"
      />
      <AlertBasic
        isOpen={showNormalErrorAlert}
        closeOnTouchBackdrop={true}
        onClose={() => setShowNormalErrorAlert(false)}
        title={`Lo sentimos, para continuar debes\nacercarte a una agencia`}
        description={`Para más información contáctanos al\n${Information.PhoneContactFormattedPretty}.`}
        actions={utils => [
          {
            id: 'button1',
            render: (
              <Button
                text="Entiendo"
                type="primary"
                onPress={() => utils.close()}
              />
            ),
          },
          {
            id: 'button2',
            render: (
              <Button
                text="Contáctanos"
                type="primary-inverted"
                haveBorder
                onPress={() => {
                  utils.close();
                  Linking.openURL(`tel:${Information.PhoneContact}`);
                }}
              />
            ),
          }
        ]}
      />
      <AlertBasic
        isOpen={showOpenSessionModal}
        onClose={() => setShowOpenSessionModal(false)}
        title={openSessionInfo.title}
        description={openSessionInfo.content}
        actions={utils => [
          {
            id: 'button1',
            render: (
              <Button
                text={openSessionInfo.button}
                type="primary"
                onPress={() => utils.close()}
              />
            ),
          }
        ]}
      />
    </>
  );
};


const getStyles = () => {
  const stylesBase = StyleSheet.create({
    container: {
      backgroundColor: COLORS.Background.Lightest,
    },
    logo: {
      height: SIZES.XS * 9,
      alignSelf: 'center',
      resizeMode: 'contain',
    },
  });

  return stylesBase;
};