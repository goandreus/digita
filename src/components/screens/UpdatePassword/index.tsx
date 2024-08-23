import FieldMessage, {FieldMessageType} from '@atoms/FieldMessage';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {encourage} from '@helpers/StringHelper';
import FieldForm from '@molecules/FieldForm';
import InputIcon from '@molecules/InputIcon';
import Tag from '@molecules/Tag';
import MenuTemplate from '@templates/MenuTemplate';
import yup from '@yup';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {Alert, Platform, StyleSheet, Text, View} from 'react-native';
import Button from '@atoms/Button';
import {Colors} from '@theme/colors';
import Icon from '@atoms/Icon';
import {UpdatePasswordScreenProps} from '@navigations/types';
import {storeOTP} from '@hooks/useStoreOTP';
import {updatePassword} from '@services/User';
import ModalInfo from '@atoms/ModalInfo';
import SVGVectorShutdown from '@assets/icons/vector_shutdown.svg';
import {useLoading, useTerms, useUserInfo} from '@hooks/common';

const UpdatePassword = ({navigation, route}: UpdatePasswordScreenProps) => {
  const styles = getStyles();
  const {purgeLoadingState} = useLoading();
  const {purgeUserState} = useUserInfo();
  const {setTerms} = useTerms();

  const [showError, setShowError] = useState<boolean>(false);

  const [tagOneState, setTagOneState] = useState<{
    expanded: boolean;
    disabled: boolean;
  }>({expanded: true, disabled: false});

  const [tagTwoState, setTagTwoState] = useState<{
    expanded: boolean;
    disabled: boolean;
  }>({expanded: false, disabled: true});

  const getFieldMessageType = (
    isTouched: boolean,
    hasError: boolean,
  ): FieldMessageType => {
    if (isTouched === false) return 'neutral';
    else if (hasError) return 'error';
    else return 'success';
  };

  const purgeApp = () => {
    purgeLoadingState();
    purgeUserState();
    setTerms(false);
  };

  const validateIndicatorPasswordA = (value: string) =>
    yup
      .string()
      .min(8)
      .max(20)
      .required()
      .isValidSync(value, {abortEarly: true, strict: true});

  const validateIndicatorPasswordB = (value: string) =>
    yup
      .string()
      .matches(/(?=.*[a-zñ])(?=.*[A-ZÑ])[a-zA-ZñÑ]/)
      .required()
      .isValidSync(value, {abortEarly: true, strict: true});

  const validateIndicatorPasswordC = (value: string) =>
    yup
      .string()
      .matches(/(?=.*[0-9])/)
      .required()
      .isValidSync(value, {abortEarly: true, strict: true});

  const analyzeText = (text: string): string => {
    return encourage(text, 'password');
  };

  const handleOnSubmit = async (values: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const token = storeOTP.getOtpState().currentToken;
      if (token === null || token === undefined) {
        throw new Error('CodeVerification isn t exist.');
        return;
      }
      const result = await updatePassword({
        codeVerification: String(token),
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },route.name);

      switch (result.type) {
        case 'SUCCESS':
          navigation.navigate('Main', {
            screen: 'MainScreen',
            params: {
              showTokenIsActivated: false,
              showPasswordUpdated: true,
            },
          });
          break;
        case 'USER_IS_BLOCKED':
          throw new Error('User is blocked.');
          break;
      }
    } catch (error: any) {
      setShowError(true);
    }
  };

  return (
    <>
      <Formik
        validateOnMount={true}
        enableReinitialize={true}
        initialValues={{
          currentPassword: '',
          password: '',
          passwordRepeated: '',
          showCurrentPassword: false,
          showPassword: false,
          showPasswordRepeated: false,
          showSubmitButton: false,
        }}
        validationSchema={yup.object({
          currentPassword: yup
            .string()
            .required('Es obligatorio completar este dato.'),
          password: yup
            .string()
            .min(8)
            .max(20)
            .matches(/(?=.*[a-zñ])(?=.*[A-ZÑ])[a-zA-ZñÑ]/)
            .matches(/(?=.*[0-9])/)
            .required(),
          passwordRepeated: yup
            .string()
            .oneOf([yup.ref('password')], 'La clave ingresada no es la misma.')
            .required('Es obligatorio completar este dato.'),
        })}
        onSubmit={async (values, actions) => {
          await handleOnSubmit({
            currentPassword: values.currentPassword,
            newPassword: values.password,
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
          <MenuTemplate
            title="Cambiar clave"
            containerStyle={styles.container}
            footer={
              <>
                {values.showSubmitButton ? (
                  <>
                    <Separator size={8 * 4} />
                    <View style={styles.tagCustom}>
                      <Icon
                        iconName="icon_token_fill"
                        color={Colors.Paragraph}
                        size={20}
                        style={styles.tagIcon}
                      />
                      <TextCustom
                        variation="p"
                        weight="bold"
                        size={14}
                        style={styles.tagText}>
                        Validaremos esta acción con tu Token Digital
                      </TextCustom>
                    </View>
                    <Separator size={8 * 4} />
                    <View style={styles.buttonsWrapper}>
                      <Button
                        disabled={!isValid}
                        onPress={handleSubmit}
                        loading={isSubmitting}
                        orientation="horizontal"
                        type="primary"
                        text="Cambiar"
                      />
                      <Separator size={8 * 4} />
                    </View>
                  </>
                ) : (
                  <View style={styles.buttonsWrapper}>
                    <Separator size={8 * 4} />
                    <Button
                      disabled={values.currentPassword === ''}
                      onPress={() => {
                        setTagOneState({
                          expanded: false,
                          disabled: false,
                        });
                        setTagTwoState({
                          expanded: true,
                          disabled: false,
                        });
                        setFieldValue('showSubmitButton', true);
                      }}
                      orientation="horizontal"
                      type="primary"
                      text="Continuar"
                    />
                    <Separator size={25} />
                    <TextCustom
                      variation="link"
                      align="center"
                      color={Colors.Paragraph}
                      style={styles.buttonLink}
                      onPress={() => {
                        if (navigation.canGoBack()) navigation.goBack();
                      }}>
                      Cancelar
                    </TextCustom>
                    <Separator size={8 * 4} />
                  </View>
                )}
              </>
            }>
            <View>
              <Tag
                title="1. Escribe la clave que actualmente usas"
                disabled={tagOneState.disabled}
                expanded={tagOneState.expanded}
                onPress={() => {
                  setTagOneState(prevState => ({
                    expanded: !prevState.expanded,
                    disabled: false,
                  }));
                }}
              />
              {tagOneState.expanded && !tagOneState.disabled && (
                <>
                  <Separator size={16} />
                  <TextCustom
                    text="Clave actual"
                    variation="p"
                    size={16}
                    weight="bold"
                  />
                  <Separator size={8} />
                  <FieldForm
                    message={errors.currentPassword?.toString()}
                    messageType="error"
                    showMessage={
                      errors.currentPassword !== undefined &&
                      touched.currentPassword === true
                    }>
                    <InputIcon
                      value={values.currentPassword}
                      placeholder="Ingresa tu clave"
                      iconRight={
                        values.showCurrentPassword ? 'eye-on' : 'eye-off'
                      }
                      secureTextEntry={values.showCurrentPassword === false}
                      contextMenuHidden={true}
                      haveError={
                        errors.currentPassword !== undefined &&
                        touched.currentPassword === true
                      }
                      onChange={handleChange('currentPassword')}
                      onBlur={handleBlur('currentPassword')}
                      onClickIconRight={() =>
                        setFieldValue(
                          'showCurrentPassword',
                          !values.showCurrentPassword,
                        )
                      }
                    />
                  </FieldForm>
                </>
              )}
              <Separator size={16} />
              <Tag
                title="2. Crea una nueva clave"
                disabled={tagTwoState.disabled}
                expanded={tagTwoState.expanded}
                onPress={() => {
                  setTagTwoState(prevState => ({
                    expanded: !prevState.expanded,
                    disabled: false,
                  }));
                }}
              />
              {tagTwoState.expanded && !tagTwoState.disabled && (
                <>
                  <Separator size={16} />
                  <TextCustom
                    text="Nueva clave"
                    size={16}
                    variation="p"
                    weight="bold"
                  />
                  <Separator size={8} />
                  <InputIcon
                    value={values.password}
                    maxLength={20}
                    placeholder="Ingresa una nueva clave"
                    keyboardType={
                      values.showPassword === false
                        ? undefined
                        : Platform.OS === 'ios'
                        ? 'ascii-capable'
                        : 'visible-password'
                    }
                    iconRight={values.showPassword ? 'eye-on' : 'eye-off'}
                    secureTextEntry={values.showPassword === false}
                    contextMenuHidden={true}
                    haveError={
                      errors.password !== undefined &&
                      (touched.password === true || values.password !== '')
                    }
                    onChange={text => {
                      const textAnalyzed: string = analyzeText(text);
                      setFieldValue('password', textAnalyzed, true);
                    }}
                    onBlur={handleBlur('password')}
                    onClickIconRight={() =>
                      setFieldValue('showPassword', !values.showPassword)
                    }
                  />
                  <Separator size={8} />
                  <FieldMessage
                    type={getFieldMessageType(
                      touched.password === true || values.password !== '',
                      validateIndicatorPasswordA(values.password) === false,
                    )}
                    text="Mínimo 8 caracteres"
                  />
                  <Separator size={4} />
                  <FieldMessage
                    type={getFieldMessageType(
                      touched.password === true || values.password !== '',
                      validateIndicatorPasswordB(values.password) === false,
                    )}
                    text="Usa letras mayúsculas y minúsculas"
                  />
                  <Separator size={4} />
                  <FieldMessage
                    type={getFieldMessageType(
                      touched.password === true || values.password !== '',
                      validateIndicatorPasswordC(values.password) === false,
                    )}
                    text="Usa al menos un número"
                  />
                  <Separator size={24} />
                  <TextCustom
                    text="Repite la nueva clave"
                    size={16}
                    variation="p"
                    weight="bold"
                  />
                  <Separator size={8} />
                  <FieldForm
                    message={errors.passwordRepeated?.toString()}
                    messageType="error"
                    showMessage={
                      errors.passwordRepeated !== undefined &&
                      touched.passwordRepeated !== undefined
                    }>
                    <InputIcon
                      value={values.passwordRepeated}
                      placeholder="Ingresa otra vez tu nueva clave"
                      keyboardType={
                        values.showPasswordRepeated === false
                          ? undefined
                          : Platform.OS === 'ios'
                          ? 'ascii-capable'
                          : 'visible-password'
                      }
                      iconRight={
                        values.showPasswordRepeated ? 'eye-on' : 'eye-off'
                      }
                      secureTextEntry={values.showPasswordRepeated === false}
                      maxLength={20}
                      contextMenuHidden={true}
                      haveError={
                        errors.passwordRepeated !== undefined &&
                        touched.passwordRepeated !== undefined
                      }
                      onChange={text => {
                        const textAnalyzed: string = analyzeText(text);
                        setFieldValue('passwordRepeated', textAnalyzed, true);
                      }}
                      onBlur={handleBlur('passwordRepeated')}
                      onClickIconRight={() =>
                        setFieldValue(
                          'showPasswordRepeated',
                          !values.showPasswordRepeated,
                        )
                      }
                    />
                  </FieldForm>
                </>
              )}
            </View>
          </MenuTemplate>
        )}
      </Formik>
      {showError && (
        <ModalInfo
          titleImage={<SVGVectorShutdown width="100%" />}
          title="Uy! ocurrió algo inesperado"
          message="No hemos podido procesar tu solicitud, por favor vuelve a intentarlo."
          open={showError}
          onRequestClose={() => {}}
          actions={
            <>
              <Button
                onPress={() => {
                  setShowError(false);
                  setTimeout(() => {
                    purgeUserState();
                    setTerms(false);
                    navigation.reset({
                      index: 1,
                      routes: [{name: 'Home'}, {name: 'Login'}],
                    });
                  });
                }}
                orientation="horizontal"
                type="primary"
                text="Entiendo"
              />
            </>
          }
        />
      )}
    </>
  );
};

const getStyles = () => {
  return StyleSheet.create({
    container: {},
    buttonsWrapper: {
      marginHorizontal: 8 * 4,
    },
    tagCustom: {
      backgroundColor: Colors.GrayBackground,
      borderRadius: 5,
      padding: 8 * 1.5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    tagText: {
      flexShrink: 1,
    },
    tagIcon: {marginRight: 8},
    buttonLink: {
      alignSelf: 'center',
    },
  });
};

export default UpdatePassword;
