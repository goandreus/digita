import React from 'react';
import {Linking, Platform} from 'react-native';
import {RegisterPasswordScreenProps} from '@navigations/types';
import yup from '@yup';
import {Formik} from 'formik';
import TransfersTemplate from '@templates/extra/TransfersTemplate';
import {StepsProps} from '@molecules/extra/Steps';
import Button from '@atoms/extra/Button';
import {useRegisterPassword} from './hook';
import {CommonActions} from '@react-navigation/native';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import FieldMessage from '@atoms/extra/FieldMessage';
import BoxView from '@atoms/BoxView';
import Checkbox from '@atoms/extra/Checkbox';
import Icon from '@atoms/Icon';
import InputIcon from '@molecules/extra/InputIcon';
import FieldForm from '@molecules/extra/FieldForm';
import AlertBasic from '@molecules/extra/AlertBasic';
import {Information} from '@global/information';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {styles} from './styles';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';

export const RegisterPassword = ({
  navigation,
  route,
}: RegisterPasswordScreenProps) => {
  const {flowType, stepProps, showTerms, from} = route.params;

  const {
    modalPasswordCreated,
    modalReattempt,
    setModalPasswordCreated,
    setModalReattempt,
    getFieldMessageType,
    analyzeText,
    validateIndicatorPasswordA,
    validateIndicatorPasswordB,
    validateIndicatorPasswordC,
    handleOnSubmit,
  } = useRegisterPassword({route, navigation});

  const getTitle = () => {
    switch (flowType) {
      case 'REGISTER':
        return 'Regístrate';
      case 'FORGOT_PASSWORD':
        return 'Olvidé mi clave';
    }
  };

  const goBack = () => {
    if (from === 'RegisterIdentityInfo' && stepProps) {
      return navigation.dispatch(
        CommonActions.navigate({
          name: 'RegisterIdentityInfo',
          merge: true,
          params: {
            stepProps: {
              ...stepProps,
              current: stepProps.current - 1,
            },
          },
        }),
      );
    }
    navigation.goBack();
  };

  return (
    <>
      <Formik
        validateOnMount={true}
        enableReinitialize={true}
        initialValues={{
          password: '',
          passwordRepeated: '',
          showPassword: false,
          showPasswordRepeated: false,
          termsAreAccepted: false,
          deviceIsSafety: false,
          showTerms: showTerms,
        }}
        validationSchema={yup.object({
          password: yup
            .string()
            .min(8)
            .max(20)
            .matches(/(?=.*[a-zñ])(?=.*[A-ZÑ])[a-zA-ZñÑ]/)
            .matches(/(?=.*[0-9])/)
            .required(),
          passwordRepeated: yup
            .string()
            .oneOf(
              [yup.ref('password')],
              'La clave secreta ingresada no es la misma',
            )
            .required('Es obligatorio completar este dato.'),
          termsAreAccepted: yup.boolean().when('showTerms', {
            is: true,
            then: yup
              .boolean()
              .oneOf([true], 'Es obligatorio completar este dato.')
              .required('Es obligatorio completar este dato.'),
            otherwise: yup.boolean(),
          }),
          deviceIsSafety: yup
            .boolean()
            .oneOf([true], 'Es obligatorio completar este dato.')
            .required('Es obligatorio completar este dato.'),
        })}
        onSubmit={async (values, actions) => {
          AH.pushPayload(values);
          await handleOnSubmit(values);
          actions.resetForm();
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
          <TransfersTemplate
            headerTitle={getTitle()}
            title="Crea tu clave digital"
            stepsProps={stepProps as StepsProps}
            canGoBack={navigation.canGoBack()}
            goBack={goBack}
            footer={
              <Button
                onPress={() => {
                  handleSubmit();
                }}
                loading={isSubmitting}
                orientation="horizontal"
                type="primary"
                text="Crear clave digital"
                disabled={!isValid}
              />
            }>
            <BoxView
              flex={1}
              direction="row"
              align="center"
              background="warning-lightest"
              p={SIZES.MD}
              style={styles.containerInfo}>
              <Icon
                name="exclamation-triangle"
                size="small"
                fill={COLORS.Secondary.Dark}
                style={styles.icon}
              />
              <TextCustom
                style={styles.text}
                color="secondary-darkest"
                variation="h6"
                lineHeight="fair"
                weight="normal"
                text={
                  'No debes incluir tus nombres, apellidos, correo electrónico ni claves usadas anteriormente.'
                }
              />
            </BoxView>
            <Separator type="large" />
            <TextCustom
              text="Crea una clave secreta"
              variation="h4"
              weight="normal"
              color={
                getFieldMessageType(
                  touched.password === true || values.password !== '',
                  validateIndicatorPasswordA(values.password) === false,
                ) === 'error'
                  ? 'error-medium'
                  : 'neutral-darkest'
              }
            />
            <Separator size={8} />
            <InputIcon
              placeholder="Ingresa tu clave digital"
              actionName={
                values.showPassword ? 'Ocultar contraseña' : 'Mostar contraseña'
              }
              value={values.password}
              maxLength={20}
              keyboardType={
                values.showPassword === false
                  ? undefined
                  : Platform.OS === 'ios'
                  ? 'ascii-capable'
                  : 'visible-password'
              }
              iconRightName={
                values.showPassword ? 'icon_eye_on' : 'icon_eye_off'
              }
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
            <Separator type="small" />
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
            <Separator size={values.showTerms ? 16 : 32} />
            <TextCustom
              text="Repite tu clave secreta"
              variation="h4"
              weight="normal"
              color={
                getFieldMessageType(
                  touched.passwordRepeated === true ||
                    values.passwordRepeated !== '',
                  validateIndicatorPasswordA(values.passwordRepeated) === false,
                ) === 'error'
                  ? 'error-medium'
                  : 'neutral-darkest'
              }
            />
            <Separator size={8} />
            <FieldForm
              hideIconLeft
              message={errors.passwordRepeated}
              messageType="error"
              showMessage={
                errors.passwordRepeated !== undefined &&
                touched.passwordRepeated !== undefined
              }>
              <InputIcon
                actionName={
                  values.showPasswordRepeated
                    ? 'Ocultar contraseña repetida'
                    : 'Mostar contraseña repetida'
                }
                placeholder="Ingresa tu clave digital"
                value={values.passwordRepeated}
                keyboardType={
                  values.showPasswordRepeated === false
                    ? undefined
                    : Platform.OS === 'ios'
                    ? 'ascii-capable'
                    : 'visible-password'
                }
                iconRightName={
                  values.showPasswordRepeated ? 'icon_eye_on' : 'icon_eye_off'
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
            <Separator type="medium" />
            <BoxView direction="row" align="flex-start" mb={SIZES.XS}>
              <Checkbox
                type="primary"
                size="small"
                value={values.termsAreAccepted}
                onChange={value => {
                  setFieldValue('termsAreAccepted', value, true);
                }}
              />
              <BoxView flex={1} ml={SIZES.XS} alignSelf="center">
                <TextCustom
                  weight="normal"
                  variation="h5"
                  color="neutral-darkest"
                  lineHeight="tight">
                  Acepto la afiliación
                  <TextCustom
                    color="primary-medium"
                    text=" a la banca digital."
                    onPress={() => {
                      Linking.openURL(Information.AffiliationTerms);
                    }}
                  />
                </TextCustom>
              </BoxView>
            </BoxView>
            <BoxView direction="row" align="flex-start" mb={SIZES.LG}>
              <Checkbox
                type="primary"
                size="small"
                value={values.deviceIsSafety}
                onChange={value => {
                  setFieldValue('deviceIsSafety', value, true);
                }}
              />
              <BoxView flex={1} ml={SIZES.XS}>
                <TextCustom
                  text="Acepto que este teléfono es de confianza y voy a usarlo para iniciar sesión de forma rápida."
                  weight="normal"
                  variation="h5"
                  color="neutral-darkest"
                  lineHeight="tight"
                />
              </BoxView>
            </BoxView>

            <BoxView
              direction="row"
              align="center"
              background="informative-lightest"
              p={SIZES.MD}
              style={styles.containerInfo}>
              <Icon
                name="icon_mail-blue"
                size="normal"
                fill={COLORS.Informative.Medium}
                style={styles.icon}
              />
              <TextCustom
                style={styles.text}
                color="informative-dark"
                variation="h6"
                lineHeight="fair"
                weight="normal"
                text="Te enviaremos la constancia de afiliación a tu correo registrado."
              />
            </BoxView>
            <Separator type="medium" />
          </TransfersTemplate>
        )}
      </Formik>
      <AlertBasic
        isOpen={modalPasswordCreated.open}
        onClose={() => {}}
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button
                text="Aceptar"
                type="primary"
                onPress={() => {
                  if (modalPasswordCreated.onAccept !== undefined) {
                    modalPasswordCreated.onAccept();
                  }
                  setModalPasswordCreated({open: false});
                }}
              />
            ),
          },
        ]}
        title="¡Clave digital creada!"
        description="No compartas tu clave con nadie, si necesitas apuntarlo, hazlo en un lugar seguro."
      />
      <AlertBasic
        isOpen={modalReattempt.open}
        onClose={() => {}}
        actions={() => [
          {
            id: 'button2',
            render: (
              <Button
                text={modalReattempt.button ?? ''}
                type="primary"
                onPress={() => {
                  setModalReattempt({open: false});
                }}
              />
            ),
          },
        ]}
        title={modalReattempt.title ?? ''}
        description={modalReattempt.content ?? ''}
      />
    </>
  );
};
