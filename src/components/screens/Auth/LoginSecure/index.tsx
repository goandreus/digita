import {Formik} from 'formik';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Linking,
  NativeModules,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import yup from '@yup';
import Button from '@atoms/extra/Button';
import FieldForm from '@molecules/extra/FieldForm';
import * as _ from 'lodash';
import {LoginSecureScreenProps} from '@navigations/types';
import InputIcon from '@molecules/extra/InputIcon';
import ModalInfo from '@atoms/ModalInfo';
import ModalError from '@molecules/ModalError';
import {useLoginSecure} from './hook';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import {Information} from '@global/information';
import {COLORS} from '@theme/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {capitalizeFull} from '@helpers/StringHelper';
import {useFocusEffect} from '@react-navigation/native';
import AlertBasic from '@molecules/extra/AlertBasic';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {setSessionModal} from '@features/modal';
import {getRemoteValue} from '@utils/firebase';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';
import { FONTS } from '@theme/fonts';
import {useLastUser} from '@hooks/common';
import { getLocation } from '@helpers/getLocation';

const {FingerprintModule} = NativeModules;

export const LoginSecureScreen = ({
  navigation,
  route,
}: LoginSecureScreenProps) => {
  const insets = useSafeAreaInsets();

  const styles = getStyles();

  const {lastUser} = useLastUser();
  
  const [disabled, setDisabled] = useState(true);

  const active_channel = getRemoteValue('active_channel').asBoolean();
  const disabled_channel_title = getRemoteValue(
    'disabled_channel_title',
  ).asString();
  const disabled_channel_content = getRemoteValue(
    'disabled_channel_content',
  ).asString();
  const active_visitor_qr = getRemoteValue(
    'active_visitor_qr',
  ).asBoolean();

  const {firstName} = route.params;
  const {
    openModal,
    showConfirmation,
    titleModal,
    contentModal,
    onPressDisconect,
    hideModal,
    showConfirmationModal,
    hideConfirmationModal,
    handleOnSubmit,
    setShowNormalErrorAlert,
    setShowOpenSessionModal,
    showNormalErrorAlert,
    showOpenSessionModal,
    openSessionInfo,
  } = useLoginSecure({route, navigation});

  useEffect(() => {
    FingerprintModule.getFingerprint();
  }, []);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(setSessionModal({show: false}));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (active_visitor_qr && lastUser && lastUser.personId) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, []);

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
        <Separator size={SIZES.XS * 8 + insets.top} />
        <Image
          source={require('@assets/images/logo-red.png')}
          style={styles.logo}
        />
        <Separator size={SIZES.XS * 5.5} />
        <Formik
          validateOnMount={true}
          enableReinitialize={true}
          initialValues={{
            password: '',
            showPassword: false,
          }}
          validationSchema={yup.object({
            password: yup
              .string()
              .required('Es obligatorio completar este dato'),
          })}
          onSubmit={async (values, actions) => {
            await handleOnSubmit(values, () => {
              setTimeout(() => {
                actions.resetForm();
              }, 1000);
            });
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
                <BoxView direction="row" align="center" justify="space-between">
                  <View style={styles.blockA}>
                    <TextCustom
                      lineHeight="fair"
                      variation="h3"
                      color={'neutral-darkest'}
                      weight="normal">
                      {`Hola,\n${capitalizeFull(_.toLower(firstName))}`}
                    </TextCustom>
                  </View>
                  <View style={styles.blockB}>
                    <TextCustom
                      lineHeight="tight"
                      actionName="Cambiar usuario"
                      variation="p4"
                      color={'primary-dark'}
                      weight="bold"
                      align="center"
                      onPress={showConfirmationModal}>
                      {'Cambiar\nusuario'}
                    </TextCustom>
                  </View>
                </BoxView>
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
                <Separator size={SIZES.XXL} />
                <TextCustom
                  lineHeight="tight"
                  variation="p4"
                  color={'primary-dark'}
                  weight="bold"
                  align="center"
                  onPress={() => {
                    AH.track("CF App - Clave Olvidada", {
                      'Fase de Inicio de Sesión': 'Usuario Identificado',
                      'Etapa': 'Inicio'
                    });
                    navigation.navigate('RecoverPassword');
                  }}>
                  ¿Olvidaste tu clave?
                </TextCustom>
                <Separator size={SIZES.XS * 5} />
                <View style={{marginHorizontal: SIZES.LG}}>
                  <Button
                    onPress={handleSubmit}
                    loading={isSubmitting}
                    orientation="horizontal"
                    type="primary"
                    text="Iniciar sesión"
                    disabled={!isValid}
                  />
                </View>
                <Separator size={47} />
                <Text style={{
                  fontFamily: FONTS.AmorSansPro,
                  color: COLORS.Neutral.Dark,
                  fontSize: 10,
                  textAlign: 'center'
                }}>
                  COMPARTAMOS FINANCIERA S.A. - RUC: 20369155360
                </Text>
              </View>
              <Separator size={47} />
              <View
                style={{
                  paddingBottom: insets.bottom,
                  marginTop: 'auto',
                  flexDirection: 'row',
                  backgroundColor: COLORS.Background.Light,
                }}>
                <Button
                  text="Llámanos"
                  icon="call"
                  iconSize={SIZES.MD}
                  orientation="horizontal-reverse"
                  type="tertiary"
                  containerStyle={{flex: 1}}
                  onPress={() => {
                    Linking.openURL(`tel:${Information.PhoneContact}`);
                  }}
                />
                <Button
                  text="Visita"
                  iconSize={SIZES.MD}
                  icon="vector"
                  disabled={disabled}
                  orientation="horizontal-reverse"
                  type="tertiary"
                  containerStyle={{flex: 1}}
                  onPress={() => {
                    navigation.navigate('VisitRegistration');
                  }}
                />
              </View>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
      <ModalInfo
        title="¿Seguro que quieres cambiar de usuario?"
        message="Para cambiar de usuario es necesario que desconectes tu cuenta de Compartamos Financiera de este dispositivo. Tu acceso automático dejará de estar disponible."
        open={showConfirmation === true}
        onRequestClose={() => {}}
        actions={
          <>
            <Button
              onPress={onPressDisconect}
              orientation="horizontal"
              type="primary"
              text="Desconectar"
            />
            <Separator type="small" />
            <TextCustom
              style={styles.buttonLink}
              variation="h4"
              align="center"
              color={'neutral-dark'}
              onPress={hideConfirmationModal}>
              Cancelar
            </TextCustom>
          </>
        }
      />
      <ModalError
        isOpen={openModal}
        close={hideModal}
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

      {!active_channel ? (
        <ModalError
          title={
            disabled_channel_title ||
            'Lo sentimos, hubo un error en la aplicación'
          }
          content={
            disabled_channel_content || 'Por favor volver a ingresar más tarde'
          }
          errorCode="activeChannel"
          isOpen={true}
        />
      ) : null}
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
    blocksWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    blockA: {},
    blockB: {},
    linkButton: {alignSelf: 'center'},
    buttonLink: {
      alignSelf: 'center',
    },
  });

  return stylesBase;
};
