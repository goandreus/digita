import Button from '@atoms/Button';
import FieldMessage, {FieldMessageType} from '@atoms/FieldMessage';
import ModalInfo from '@atoms/ModalInfo';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {useLastUser} from '@hooks/common';
import {Information} from '@global/information';
import {encourage} from '@helpers/StringHelper';
import CheckboxLabel from '@molecules/CheckboxLabel';
import FieldForm from '@molecules/FieldForm';
import InputIcon from '@molecules/InputIcon';
import {RegisterPasswordScreenProps} from '@navigations/types';
import {
  disaffiliation,
  sendNotificationSuccess,
  updatePassword_ForgotPasswordFlow,
} from '@services/User';
import FormTemplate from '@templates/FormTemplate';
import {FontSizes} from '@theme/fonts';
import yup from '@yup';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';

const RegisterPassword = ({navigation, route}: RegisterPasswordScreenProps) => {
  const {updateLastUser} = useLastUser();
  const {
    flowType,
    stepProps,
    showTerms,
    documentNumber,
    documentType,
    email,
    firstName,
    firstSurname,
    secondSurname,
    secondName,
  } = route.params;

  const [modalPasswordCreated, setModalPasswordCreated] = useState<{
    open: boolean;
    onAccept?: () => void;
  }>({
    open: false,
  });

  const [modalReattempt, setModalReattempt] = useState<{
    open: boolean;
  }>({
    open: false,
  });

  const getFieldMessageType = (
    isTouched: boolean,
    hasError: boolean,
  ): FieldMessageType => {
    if (isTouched === false) return 'neutral';
    else if (hasError) return 'error';
    else return 'success';
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

  const handleOnSubmit = async (values: {password: string}) => {
    try {
      let showRegisterTokenFlow: boolean = true;

      switch (flowType) {
        case 'REGISTER': {
          try {
            await disaffiliation({
              screen:route.name,
              documentType,
              documentNumber,
            });
            await sendNotificationSuccess({
              password: values.password,
            },route.name,documentType,documentNumber);
          } catch (error) {
            setModalReattempt({
              open: true,
            });
            return;
          }
          break;
        }
        case 'FORGOT_PASSWORD': {
          const result = await updatePassword_ForgotPasswordFlow({
            password: values.password,
          },route.name,documentType,documentNumber);
          if (result.isSecure === true && result.hasToken === false)
            showRegisterTokenFlow = true;
          else showRegisterTokenFlow = false;
          break;
        }
      }

      updateLastUser({
        document: {
          number: documentNumber,
          type: documentType,
        },
        firstName,
      });

      setModalPasswordCreated({
        open: true,
        onAccept: () => {
          if (showRegisterTokenFlow === true)
            navigation.reset({
              index: 1,
              routes: [
                {name: 'Home'},
                {
                  name: 'InfoRegisterToken',
                  params: {
                    flowType,
                    documentNumber,
                    documentType,
                    password: values.password,
                    email: email,
                    firstName: firstName,
                    secondName: secondName,
                    firstSurname: firstSurname,
                    secondSurname: secondSurname,
                  },
                },
              ],
            });
          else
            navigation.reset({
              index: 1,
              routes: [
                {name: 'Home'},
                {
                  name: 'InfoRegisterSuccess',
                  params: {
                    title: '¡Listo!',
                    description:
                      'Tu clave digital ha sido actualizada. Usa tu clave digital para ingresar a la app.',
                  },
                },
              ],
            });
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const analyzeText = (text: string): string => {
    return encourage(text, 'password');
  };

  return (
    <>
      <FormTemplate title="Crea tu clave digital" stepsProps={stepProps}>
        <Formik
          validateOnMount={true}
          enableReinitialize={true}
          initialValues={{
            password: '',
            passwordRepeated: '',
            showPassword: false,
            showPasswordRepeated: false,
            termsAreAccepted: true,
            deviceIsSafety: true,
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
                'La clave ingresada no es la misma.',
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
            await handleOnSubmit(values);
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
              <TextCustom text="Crea una clave" variation="p" weight="bold" />
              <Separator size={8} />
              <InputIcon
                actionName={
                  values.showPassword
                    ? 'Ocultar contraseña'
                    : 'Mostar contraseña'
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
              <Separator size={values.showTerms ? 16 : 32} />
              <TextCustom text="Repite tu clave" variation="p" weight="bold" />
              <Separator size={8} />
              <FieldForm
                message={errors.passwordRepeated?.toString()}
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
                  value={values.passwordRepeated}
                  keyboardType={
                    values.showPasswordRepeated === false
                      ? undefined
                      : Platform.OS === 'ios'
                      ? 'ascii-capable'
                      : 'visible-password'
                  }
                  iconRight={values.showPasswordRepeated ? 'eye-on' : 'eye-off'}
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
              <Separator size={values.showTerms ? 16 : 48} />
              {values.showTerms && (
                <>
                  <CheckboxLabel
                    actionName={
                      values.termsAreAccepted
                        ? 'No acepto la Afiliación a la banca digital'
                        : 'Acepto la Afiliación a la banca digital'
                    }
                    pressWithLabel={true}
                    value={values.termsAreAccepted}
                    style={styles.checkbox}
                    textComponent={
                      <TextCustom variation="small">
                        <TextCustom variation="small" weight="bold">
                          Acepto
                        </TextCustom>{' '}
                        la afiliación a la banca digital. Previsualiza la{' '}
                        <TextCustom
                          size={FontSizes.Small}
                          variation="link"
                          onPress={() => {
                            Linking.openURL(Information.AffiliationTerms);
                          }}>
                          constancia de afiliación
                        </TextCustom>{' '}
                        que te enviaremos a tu correo.
                      </TextCustom>
                    }
                    onChange={value => {
                      setFieldValue('termsAreAccepted', value, true);
                    }}
                  />
                  <Separator size={16} />
                </>
              )}
              <CheckboxLabel
                actionName={
                  values.deviceIsSafety
                    ? 'No acepto que es Teléfono de confianza'
                    : 'Acepto que es Teléfono de confianza'
                }
                pressWithLabel={true}
                value={values.deviceIsSafety}
                style={styles.checkbox}
                textComponent={
                  <TextCustom variation="small">
                    <TextCustom variation="small" weight="bold">
                      Acepto
                    </TextCustom>{' '}
                    que este{' '}
                    <TextCustom variation="small" weight="bold">
                      teléfono es de confianza
                    </TextCustom>{' '}
                    y quiero usarlo para iniciar sesión de forma rápida.
                  </TextCustom>
                }
                onChange={value => {
                  setFieldValue('deviceIsSafety', value, true);
                }}
              />
              <Separator size={values.showTerms ? 40 : 56} />
              <Button
                onPress={handleSubmit}
                loading={isSubmitting}
                orientation="horizontal"
                type="primary"
                text="Crear"
                disabled={!isValid}
              />
            </>
          )}
        </Formik>
      </FormTemplate>
      <ModalInfo
        title="¡Clave digital creada!"
        message="No compartas tu clave con nadie, si necesitas apuntarlo, hazlo en un lugar seguro."
        open={modalPasswordCreated.open}
        onRequestClose={() => {}}
        actions={
          <>
            <Button
              onPress={() => {
                if (modalPasswordCreated.onAccept !== undefined)
                  modalPasswordCreated.onAccept();

                setModalPasswordCreated({open: false});
              }}
              orientation="horizontal"
              type="primary"
              text="Aceptar"
            />
          </>
        }
      />
      <ModalInfo
        title="¡Ups, hubo un problema!"
        message="No hemos podido cargar tu información, por favor intenta en unos segundos o vuelve a ingresar."
        open={modalReattempt.open}
        showCloseButton={true}
        onRequestClose={() => {}}
        onCloseButton={() => setModalReattempt({open: false})}
        actions={
          <>
            <Button
              onPress={() => {
                setModalReattempt({open: false});
              }}
              orientation="horizontal"
              type="primary"
              text="Volver a intentar"
            />
          </>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'flex-start',
  },
});

export default RegisterPassword;
