import {Formik} from 'formik';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import FormTemplate from '@templates/FormTemplate';
import yup from '@yup';
import Button from '@atoms/Button';
import FieldForm from '@molecules/FieldForm';
import * as _ from 'lodash';
import {LoginSecureScreenProps} from '@navigations/types';
import InputIcon from '@molecules/InputIcon';
import {Colors} from '@theme/colors';
import {StackActions} from '@react-navigation/native';
import {useLastUser, useUserInfo} from '@hooks/common';
import ModalInfo from '@atoms/ModalInfo';
import useUser from '@hooks/useUser';
import {
  disaffiliation,
  getIsAllowedToAttempt,
  registerEvent,
} from '@services/User';
import ModalError from '@molecules/ModalError';
import { Dynatrace } from '@dynatrace/react-native-plugin';
import { padStart } from 'lodash';
import {SEPARATOR_BASE} from '@theme/metrics';
import { activateRemoteConfig, getRemoteValue } from '@utils/firebase';
import { capitalizeFull } from '@helpers/StringHelper';

const LoginSecureScreen = ({navigation, route}: LoginSecureScreenProps) => {
  const {actions} = useUser();

  const {purgeUserState} = useUserInfo();
  const {cleanLastUser} = useLastUser();

  const styles = getStyles();
  const {firstName, documentNumber, documentType} = route.params;

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [titleModal, setTitleModal] = useState<string>('');
  const [contentModal, setContentModal] = useState<string>('');
  
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const handleOnSubmit = async (values: {password: string}, resetForm: () => void) => {
    await activateRemoteConfig()
    const mandatory_update = getRemoteValue('mandatory_update').asBoolean()
    if(mandatory_update) {
      navigation.navigate('InfoUpdateAppScreen')
      return
    }

    try {
      Dynatrace.identifyUser(`${padStart(documentType.toString(), 2, '0')}${documentNumber}-Login`);

      navigation.navigate('LoadingScreen');

      const resultLogin = await actions.login(
        documentType,
        documentNumber,
        values.password,
      );

      if (resultLogin.type === 'SUCCESS') {
        navigation.navigate('MainTab');
      } else if (resultLogin.type === 'DEVICE_IS_NOT_SECURE') {
        const personId = await registerEvent(
          documentType,
          documentNumber,
          '000000000',
          'LoginSecureScreen-index.tsx',
        );
        const getIsAllowedToAttemptResult = await getIsAllowedToAttempt(
          personId,
          `0${documentType}${documentNumber}`,
          route.name,
        );
        if (getIsAllowedToAttemptResult.isSuccess === false)
          if (getIsAllowedToAttemptResult.error !== undefined)
            switch (getIsAllowedToAttemptResult.error.type) {
              case 'LIMIT_ATTEMPTS':
                navigation.dispatch(
                  StackActions.replace('InfoDNINotRecognizedMaxAttempt'),
                );
                break;
              case 'UNKNOWN':
              case 'OTHER':
                throw new Error('Ocurrió un error desconocido.');
                break;
            }
          else throw new Error('Ocurrió un error desconocido.');
        else {
          navigation.dispatch(
            StackActions.replace('RegisterIdentityInfo', {
              flowType: 'LOGIN',
              password: values.password,
              documentNumber: documentNumber,
              documentType: documentType,
              gender: resultLogin.person.gender,
              stepProps: {
                max: 3,
                showLabel: false,
              },
            }),
          );
        }
      } else if (resultLogin.type === 'MAX_ATTEMPTS') {
        navigation.navigate('InfoMaxAttemps');
      } else if (resultLogin.type === 'INVALID_SESSION') {
        setOpenModal(true);
        setTitleModal(resultLogin.title);
        setContentModal(resultLogin.content);
        navigation.pop();
      } else if(resultLogin.type === 'ACCESS_BLOCKED'){
        navigation.navigate('InfoAccessBlocked');
      } else if (resultLogin.type === 'IS_NOT_AN_MEMBER_AND_DOESNT_HAVE_ACTIVE_PRODUCTS') {
        resetForm();
        navigation.replace('InfoWithoutActiveProduct', {
          gender: resultLogin.gender
        });
      } else if (resultLogin.type === 'IS_NOT_AN_MEMBER_AND_HAS_ACTIVE_PRODUCTS') {
        navigation.replace('InfoRegisterInLogin');
      }
    } catch (error: any) {
      navigation.pop();
      // Alert.alert('Error', error?.message || 'No se reconoce el error.');
    }
  };
  return (
    <>
      <FormTemplate showLogo={true} header={<Separator size={SEPARATOR_BASE * 4} />}>
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
              .required('Es obligatorio completar este dato.'),
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
              <View style={styles.blocksWrapper}>
                <View style={styles.blockA}>
                  <TextCustom
                    variation="h1"
                    color={Colors.Paragraph}
                    weight="normal">
                    Hola,
                  </TextCustom>
                  <TextCustom
                    variation="h1"
                    color={Colors.Paragraph}
                    weight="normal">
                    {capitalizeFull(_.toLower(firstName))}
                  </TextCustom>
                </View>
                <View style={styles.blockB}>
                  <TextCustom
                    actionName="Cambiar usuario"
                    variation="small"
                    color={Colors.Paragraph}
                    weight="bold"
                    align="right"
                    onPress={() => setShowConfirmation(true)}>
                    {`Cambiar\nusuario`}
                  </TextCustom>
                </View>
              </View>
              <Separator size={SEPARATOR_BASE * 6} />
              <TextCustom text="Clave digital" variation="p" weight="bold" />
              <Separator size={SEPARATOR_BASE} />
              <FieldForm
                message={errors.password?.toString()}
                messageType="error"
                showMessage={
                  errors.password !== undefined && touched.password === true
                }>
                <InputIcon
                  actionName={
                    values.showPassword
                      ? 'Ocultar contraseña'
                      : 'Mostar contraseña'
                  }
                  value={values.password}
                  iconRight={values.showPassword ? 'eye-on' : 'eye-off'}
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
              </FieldForm>
              <Separator size={SEPARATOR_BASE * 6} />
              <Button
                onPress={handleSubmit}
                loading={isSubmitting}
                orientation="horizontal"
                type="primary"
                text="Ingresar"
                disabled={!isValid}
              />
              <Separator size={SEPARATOR_BASE * 3} />
              <View style={styles.linkButton}>
                <TextCustom
                  variation="link"
                  onPress={() => navigation.navigate('RecoverPassword')}>
                  Olvidé mi clave
                </TextCustom>
              </View>
            </>
          )}
        </Formik>
      </FormTemplate>
      <ModalInfo
        title="¿Seguro que quieres cambiar de usuario?"
        message="Para cambiar de usuario es necesario que desconectes tu cuenta de Compartamos Financiera de este dispositivo. Tu acceso automático dejará de estar disponible."
        open={showConfirmation === true}
        onRequestClose={() => {}}
        actions={
          <>
            <Button
              onPress={() => {
                try {
                  disaffiliation({
                    screen: route.name,
                    documentType,
                    documentNumber,
                  });
                  setShowConfirmation(false);
                  cleanLastUser();
                  purgeUserState();
                  navigation.reset({
                    index: 1,
                    routes: [{name: 'Home'}, {name: 'LoginNormal'}],
                  });
                } catch (err: any) {
                  throw new Error(err);
                }
              }}
              orientation="horizontal"
              type="primary"
              text="Desconectar"
            />
            <Separator size={SEPARATOR_BASE * 2} />
            <TextCustom
              style={styles.buttonLink}
              variation="link"
              align="center"
              color={Colors.Paragraph}
              onPress={() => {
                setShowConfirmation(false);
              }}>
              Cancelar
            </TextCustom>
          </>
        }
      />
      <ModalError
        isOpen={openModal}
        close={() => setOpenModal(false)}
        title={titleModal}
        content={contentModal}
        titleButton="Aceptar"
      />
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    blocksWrapper: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
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

export default LoginSecureScreen;
