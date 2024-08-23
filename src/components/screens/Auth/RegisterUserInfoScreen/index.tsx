import {Formik} from 'formik';
import React, {useLayoutEffect, useState} from 'react';
import {RegisterUserInfoScreenProps} from '@navigations/types';
import yup from '@yup';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import Input from '@atoms/extra/Input';
import Button from '@atoms/extra/Button';
import {encourage} from '@helpers/StringHelper';
import {getIsUserInfoValid, sendOtpToPhone} from '@services/User';
import {SIZES} from '@theme/metrics';
import FormBasicTemplate from '@templates/extra/FormBasicTemplate';
import {StepsProps} from '@molecules/extra/Steps';
import AlertBasic from '@molecules/extra/AlertBasic';
import { useTimer } from '@hooks/common';
import moment from 'moment';
import { Information } from '@global/information';
import { Linking } from 'react-native';

export const RegisterUserInfoScreen = ({
  navigation,
  route,
}: RegisterUserInfoScreenProps) => {
  const {restart, timers} = useTimer();


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
  const [showNormalErrorAlert, setShowNormalErrorAlert] = useState<boolean>(false);
  const [showBlockedErrorAlert, setShowBlockedErrorAlert] = useState<boolean>(false);

  const [confirmToExit, setConfirmToExit] = useState<
    | {
        isOpen: false;
      }
    | {
        isOpen: true;
        onAccept: () => void;
      }
  >({isOpen: false});

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
        setConfirmToExit({
          isOpen: true,
          onAccept: () => navigation.dispatch(e.data.action),
        });
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  const handleOnSubmit = async (phoneNumber: string, email: string) => {
    try {
      const userInfo = await getIsUserInfoValid({
        phone: phoneNumber,
        email: email,
        user: (documentType && documentNumber) ? `0${documentType}${documentNumber}` : '0000000000',
        userInfo: {
          documentType: documentType,
          documentNumber: documentNumber
        },
        screen: route.name
      });

      switch (userInfo.type) {
        case 'SUCCESS': {
          const isPhoneNumberValid = userInfo.phoneIsValid;
          const isEmailValid = userInfo.emailIsValid;
          if (!isPhoneNumberValid) {
            setShowNormalErrorAlert(true);
            return;
          }
          if (!isEmailValid) {
            setShowNormalErrorAlert(true);
            return;
          }
          break;
        }
        case 'BLOCKED':
        case 'UNKNOWN_ERROR':{
          setShowBlockedErrorAlert(true);
          return;
        }
      }
      
      

      // const isEmailSpam = await getIsEmailSpam(email);
      // if (!isEmailSpam) return navigation.navigate('InfoSpam');

      const timer = timers.find(
        item =>
          item.documentType === documentType &&
          item.documentNumber === documentNumber,
      );
      const remaining: number =
        timer?.startedAt !== undefined
          ? 60 - moment().diff(timer.startedAt, 's')
          : -1;

      let showMaxLimit: boolean = false;
      if (remaining <= 0) {
        const result = await sendOtpToPhone(phoneNumber, route.name, {
          documentNumber: documentNumber,
          documentType: documentType
        });
        if (result.type === 'MAX_LIMIT') showMaxLimit = true;
        restart({documentNumber, documentType});
      }
      return navigation.navigate('RegisterOTP', {
        type: 'REGISTER',
        showMaxLimit: showMaxLimit,
        personId,
        stage: 'ONBOARDING',
        gender,
        documentNumber,
        documentType,
        isSensitiveInfo: false,
        channel: 'sms',
        email,
        phoneNumber,
        stepProps:
          stepProps !== undefined && stepProps.current !== undefined
            ? {
                max: stepProps.max,
                current: stepProps.current,
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
      <Formik
        validateOnMount={true}
        initialValues={{phoneNumber: '', email: ''}}
        validationSchema={yup.object({
          phoneNumber: yup
            .string()
            .startsWith('9', 'El número de celular debe empezar con 9')
            .length(9, 'El número de celular debe tener 9 dígitos')
            .required('Es obligatorio completar este dato'),
          email: yup
            .string()
            .email('Debes ingresar un correo válido')
            .required('Es obligatorio completar este dato'),
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
          <FormBasicTemplate
            title="Ingresa tus datos"
            stepsProps={stepProps as StepsProps}
            footer={
              <Button
                onPress={handleSubmit}
                loading={isSubmitting}
                orientation="horizontal"
                type="primary"
                text="Siguiente"
                disabled={!isValid}
              />
            }>
            <>
              <TextCustom
                variation="h4"
                color={
                  errors.phoneNumber !== undefined &&
                  touched.phoneNumber !== undefined
                    ? 'error-medium'
                    : 'neutral-darkest'
                }
                lineHeight="tight">
                Número de celular
              </TextCustom>
              <Separator size={SIZES.XS} />
              <Input
                keyboardType="numeric"
                maxLength={9}
                placeholder="999999999"
                value={values.phoneNumber}
                haveError={
                  errors.phoneNumber !== undefined &&
                  touched.phoneNumber !== undefined
                }
                errorMessage={errors.phoneNumber?.toString()}
                onBlur={handleBlur('phoneNumber')}
                onChange={text => {
                  const textAnalyzed: string = encourage(text, 'numeric');
                  setFieldValue('phoneNumber', textAnalyzed, true);
                }}
              />
              <Separator size={SIZES.LG} />
              <TextCustom
                variation="h4"
                color={
                  errors.email !== undefined && touched.email !== undefined
                    ? 'error-medium'
                    : 'neutral-darkest'
                }
                lineHeight="tight">
                Correo electrónico
              </TextCustom>
              <Separator size={SIZES.XS} />
              <Input
                autoCapitalize='none'
                placeholder="@micorreo.com"
                value={values.email}
                haveError={
                  errors.email !== undefined && touched.email !== undefined
                }
                errorMessage={errors.email?.toString()}
                onBlur={handleBlur('email')}
                onChange={text => {
                  const textAnalyzed: string = encourage(text, 'email');
                  setFieldValue('email', textAnalyzed, true);
                }}
              />
            </>
          </FormBasicTemplate>
        )}
      </Formik>
      <AlertBasic
        isOpen={confirmToExit.isOpen}
        onClose={() => setConfirmToExit({isOpen: false})}
        title="¿Seguro que deseas retroceder?"
        description="Recuerda que perderás tus datos y tendrás que volver a completarlos."
        actions={utils => [
          {
            id: 'button1',
            render: (
              <Button
                text="Permanecer"
                type="primary"
                onPress={() => utils.close()}
              />
            ),
          },
          {
            id: 'button2',
            render: (
              <Button
                text="Salir"
                type="primary-inverted"
                haveBorder={true}
                onPress={() => {
                  if (confirmToExit.isOpen === true) confirmToExit.onAccept();
                  else utils.close();
                }}
              />
            ),
          },
        ]}
      />
      <AlertBasic
        isOpen={showNormalErrorAlert}
        closeOnTouchBackdrop={true}
        onClose={() => setShowNormalErrorAlert(false)}
        title={`Lo sentimos, el correo o celular\nya ha sido registrado`}
        description={`El correo o celular registrado está siendo\nusado por otro cliente. Si el problema\npersiste contáctanos al ${Information.PhoneContactFormattedPretty}.`}
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
        isOpen={showBlockedErrorAlert}
        closeOnTouchBackdrop={true}
        onClose={() => setShowBlockedErrorAlert(false)}
        title={`Lo sentimos, tenemos\ninconvenientes al ingresar`}
        description={`Estamos trabajando para solucionarlo.\nSi el problema persiste contáctanos al\n${Information.PhoneContactFormattedPretty}.`}
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
        ]}
      />
    </>
  );
};
