import {Formik} from 'formik';
import React from 'react';
import {Alert, StatusBar} from 'react-native';
import {RegisterUserInfoScreenProps} from '@navigations/types';
import {Colors} from '@theme/colors';
import FormTemplate from '@templates/FormTemplate';
import yup from '@yup';
import TextCustom from '@atoms/TextCustom';
import Separator from '@atoms/Separator';
import FieldForm from '@molecules/FieldForm';
import Input from '@atoms/Input';
import Button from '@atoms/Button';
import {encourage} from '@helpers/StringHelper';
import {getIsEmailSpam, getIsUserInfoValid} from '@services/User';

const RegisterUserInfoScreen = ({
  navigation,
  route,
}: RegisterUserInfoScreenProps) => {
  const {
    personId,
    stepProps,
    documentNumber,
    documentType,
    gender,
    firstName,
    firstSurname,
    secondName,
    secondSurname,
  } = route.params;

  const handleOnSubmit = async (phoneNumber: string, email: string) => {
    try {
      const isUserInfoValid = await getIsUserInfoValid({
        phone: phoneNumber,
        email: email,
        user: (documentType && documentNumber) ? `0${documentType}${documentNumber}` : '0000000000',
        screen: route.name
      });
      const isPhoneNumberValid = isUserInfoValid.phoneIsValid;
      const isEmailValid = isUserInfoValid.emailIsValid;

      if (!isPhoneNumberValid)
        return navigation.navigate('InfoDataUsed', {
          phoneNumber: phoneNumber,
          isSensitiveInfo: false,
        });

      if (!isEmailValid)
        return navigation.navigate('InfoDataUsed', {
          email: email,
          isSensitiveInfo: false,
        });

      // const isEmailSpam = await getIsEmailSpam(email);
      // if (!isEmailSpam) return navigation.navigate('InfoSpam');

      return navigation.navigate('RegisterUserChannel', {
        personId,
        gender,
        stage: 'ONBOARDING',
        documentType,
        documentNumber,
        isSensitiveInfo: false,
        phoneNumber: phoneNumber,
        email: email,
        stepProps:
          stepProps !== undefined && stepProps.current !== undefined
            ? {
                max: stepProps.max,
                current: stepProps.current + 1,
              }
            : undefined,
        firstName,
        firstSurname,
        secondName,
        secondSurname,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FormTemplate
        title="Ingresa tus datos de contacto"
        stepsProps={stepProps}>
        <Formik
          validateOnMount={true}
          initialValues={{phoneNumber: '', email: ''}}
          validationSchema={yup.object({
            phoneNumber: yup
              .string()
              .startsWith('9', 'El número de teléfono debe empezar con 9.')
              .length(9, 'El número de teléfono debe tener 9 dígitos.')
              .required('Es obligatorio completar este dato.'),
            email: yup
              .string()
              .email('Debes ingresar un correo válido.')
              .required('Es obligatorio completar este dato.'),
          })}
          onSubmit={async (values, actions) => {
            await handleOnSubmit(values.phoneNumber, values.email);
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
              <TextCustom
                text="Número de teléfono"
                variation="p"
                weight="bold"
              />
              <Separator type="x-small" />
              <FieldForm
                message={errors.phoneNumber?.toString()}
                messageType="error"
                showMessage={
                  errors.phoneNumber !== undefined &&
                  touched.phoneNumber !== undefined
                }>
                <Input
                  value={values.phoneNumber}
                  haveError={
                    errors.phoneNumber !== undefined &&
                    touched.phoneNumber !== undefined
                  }
                  onChange={text => {
                    const textAnalyzed: string = encourage(text, 'numeric');
                    setFieldValue('phoneNumber', textAnalyzed, true);
                  }}
                  onBlur={handleBlur('phoneNumber')}
                  keyboardType="numeric"
                  maxLength={9}
                  placeholder="Escribe tu número..."
                />
              </FieldForm>
              <Separator type="small" />
              <TextCustom
                text="Correo electrónico"
                variation="p"
                weight="bold"
              />
              <Separator type="x-small" />
              <FieldForm
                message={errors.email?.toString()}
                messageType="error"
                showMessage={
                  errors.email !== undefined && touched.email !== undefined
                }>
                <Input
                  autoCapitalize="none"
                  value={values.email}
                  haveError={
                    errors.email !== undefined && touched.email !== undefined
                  }
                  onChange={text => {
                    const textAnalyzed: string = encourage(text, 'email');
                    setFieldValue('email', textAnalyzed, true);
                  }}
                  onBlur={handleBlur('email')}
                  placeholder="Escribe tu correo..."
                />
              </FieldForm>
              <Separator type="medium" />
              <Button
                onPress={handleSubmit}
                loading={isSubmitting}
                orientation="horizontal"
                type="primary"
                text="Siguiente"
                disabled={!isValid}
              />
            </>
          )}
        </Formik>
      </FormTemplate>
    </>
  );
};

export default RegisterUserInfoScreen;
