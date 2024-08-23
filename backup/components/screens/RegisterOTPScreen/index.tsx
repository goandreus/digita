import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {CodeActivationScreenProps} from '@navigations/types';
import {Colors} from '@theme/colors';
import Button from '@atoms/Button';
import InputCode from '@atoms/InputCode';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import FormTemplate from '@templates/FormTemplate';
import yup from '@yup';
import {Formik, FormikHelpers} from 'formik';
import FieldForm from '@molecules/FieldForm';
import {encourage, hideWithChar} from '@helpers/StringHelper';
import HeaderBackButton from '@molecules/HeaderBackButton';
import ModalInfo from '@atoms/ModalInfo';
import {
  evaluateOtpFromEmail,
  evaluateOtpFromPhone,
  evaluateOtpFromPhone_Transferency,
  sendOtpToEmail,
  sendOtpToPhone,
  sendOtpToPhone_Transference,
} from '@services/User';
import moment from 'moment';
import RNOtpVerify from 'react-native-otp-verify';
import ModalError from '@molecules/ModalError';
import { StackActions } from '@react-navigation/native';
import {useLoading, useTimer} from '@hooks/common';
import { FontSizes, FontTypes } from '@theme/fonts';

const RegisterOTPScreen = ({navigation, route}: CodeActivationScreenProps) => {

  const styles = getStyles();

  const {
    type,
    channel,
    isSensitiveInfo,
    documentType,
    documentNumber,
    stepProps,
    execRestart,
  } = route.params;

  const {setHideTabBar} = useLoading();
  const [code, setCode] = useState<string>('');
  const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(
    type === 'FORGOT_PASSWORD' && route.params.showMaxLimit ? true : false,
  );

  const [modalBeforeRemove, setModalBeforeRemove] = useState<{
    open: boolean;
    onRequestCloseScreen?: () => void;
  }>({
    open: false,
  });

  const [modalCodeActivated, setModalCodeActivated] = useState<{
    open: boolean;
  }>({
    open: false,
  });

  const {selectTimer, restart} = useTimer();
  const timer = selectTimer({documentType, documentNumber});
  /* const timer = useAppSelector(state =>
    state.timer.find(
      item =>
        item.documentType === documentType &&
        item.documentNumber === documentNumber,
    ),
  ); */

  const [now, setNow] = useState<number>(new Date().getTime());

  const listenToOtp = useCallback(() => {
    if (Platform.OS === 'android')
      RNOtpVerify.getOtp()
        .then(p => {
          RNOtpVerify.addListener((message: string) => {
            const otp: string | undefined = /(\d{6})/g.exec(message)?.[1];
            if (otp !== undefined) setCode(otp);
            RNOtpVerify.removeListener();
          });
        })
        .catch(p => console.log(p));
  }, [setCode]);

  useEffect(() => {
    listenToOtp();
  }, [code, listenToOtp]);

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date().getTime());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const remaining: number =
    timer?.startedAt !== undefined
      ? 60 - moment().diff(timer.startedAt, 's')
      : -1;

  let channelLabelHeader: string;
  let channelLabelCodeActivated: string;

  switch (channel) {
    case 'email':
      channelLabelHeader = 'Correo';
      channelLabelCodeActivated = 'Correo';
      break;
    case 'sms':
      channelLabelHeader = 'SMS';
      channelLabelCodeActivated = 'Número';
      break;
  }

  const analyzeCode = (text: string): string => {
    let analyzed: string;
    analyzed = encourage(text, 'numeric');
    return analyzed;
  };

  const handleOnSubmit = async (
    code: string,
    actions: FormikHelpers<{code: string}>,
  ) => {
    let isFishesLoading: boolean = false;
    try {
      let result: boolean = false;
      if (type === 'TRANSFERENCY_LOCAL' || type === 'TRANSFERENCY_OTHERS' || type === 'REFILL_BIM') {
        switch (channel) {
          case 'sms':{
            isFishesLoading = true;
            navigation.navigate('LoadingFishes', {
              screenId: 'Loading-' + route.key,
            });
            let res = await evaluateOtpFromPhone_Transferency(
              code,
              route.params.trackingTransaction,
              {
                documentNumber,
                documentType,
              },
              route.name,
            );

            if(res === 'UNKNOWN'){
              navigation.pop();
              actions.setFieldError(
                'code',
                'Código incorrecto, por favor intente otra vez.',
              );
            }
            else if(res === 'BLOCKED'){
              navigation.dispatch(StackActions.replace('InfoAccessBlocked'));
            }
            else {
              setHideTabBar(true);
              if (res.type === 'LOCAL' && type === 'TRANSFERENCY_LOCAL') {
                navigation.dispatch(
                  StackActions.replace('MainTab', {
                    screen: 'MainOperations',
                    params: {
                      screen: 'SuccessTransferSameBank',
                      params: {
                        ...route.params.transfer,
                        ...res.payload,
                      },
                    },
                  }),
                );
              }
              else if(res.type === 'OTHERS' && type === 'TRANSFERENCY_OTHERS'){
                navigation.dispatch(
                  StackActions.replace('MainTab', {
                    screen: 'MainOperations',
                    params: {
                      screen: 'SuccessTransferOtherBanks',
                      params: {
                        ...route.params.transfer,
                        ...res.payload,
                      },
                    },
                  }),
                );
              }
              else if(res.type === 'BIM' && type === 'REFILL_BIM'){
                navigation.dispatch(
                  StackActions.replace('MainTab', {
                    screen: 'MainOperations',
                    params: {
                      screen: 'SuccessRefillBim',
                      params: {
                        ...route.params.refillData,
                        ...res.payload,
                      },
                    },
                  }),
                );
              }
            }

            break;
          }
        }
      } else if (type === 'REGISTER') {
        switch (channel) {
          case 'email':
            result = await evaluateOtpFromEmail(
              code,
              {
                documentNumber,
                documentType,
                email: route.params.email,
                phoneNumber: route.params.phoneNumber,
                personId: route.params.personId,
              },
              route.name,
            );
            break;
          case 'sms':
            result = await evaluateOtpFromPhone(
              code,
              {
                documentNumber,
                documentType,
                email: route.params.email,
                phoneNumber: route.params.phoneNumber,
                personId: route.params.personId,
              },
              route.name,
            );
            break;
        }
      } else if (type === 'FORGOT_PASSWORD') {
        switch (channel) {
          case 'email':
            result = await evaluateOtpFromEmail(
              code,
              {
                documentNumber,
                documentType,
                email: route.params.email,
                phoneNumber: undefined,
                personId: route.params.personId,
              },
              route.name,
            );
            break;
        }
      }

      if (type !== 'TRANSFERENCY_LOCAL' && type !== 'TRANSFERENCY_OTHERS' && type !== 'REFILL_BIM') {
        if (result)
          setModalCodeActivated({
            open: true,
          });
        else
          actions.setFieldError(
            'code',
            'Código incorrecto, por favor intente otra vez.',
          );
      }
    } catch (error) {
      if (isFishesLoading) {
        navigation.pop();
      }
      console.log(error);
      actions.setFieldError(
        'code',
        'Código incorrecto, por favor intente otra vez.',
      );
    }
  };

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
        setModalBeforeRemove({
          open: true,
          onRequestCloseScreen: () => navigation.dispatch(e.data.action),
        });
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  useLayoutEffect(() => {
    switch (type) {
      case 'TRANSFERENCY_OTHERS':
      case 'TRANSFERENCY_LOCAL':
      case 'REFILL_BIM':
        navigation.setOptions({
          gestureEnabled: false,
          headerLeft: () => null
        });
        break;
      default:
        navigation.setOptions({
          gestureEnabled: false
        });
        break;
    }
  }, [navigation, type]);

  const handleOnSendOTP = async () => {
    try {
      setIsSendingOTP(true);
      if(type === 'TRANSFERENCY_LOCAL' || type === 'TRANSFERENCY_OTHERS' || type === 'REFILL_BIM'){
        switch (channel) {
          case 'sms':
            const result = await sendOtpToPhone_Transference({
              screen: route.name,
              trackingTransaction: route.params.trackingTransaction,
              user: {
                documentNumber,
                documentType,
              },
            });
            if(result === 'BLOCKED'){
              navigation.navigate('InfoAccessBlocked');
            }
            else if(result === 'ERROR'){
              setIsSendingOTP(false);
              return;
            }
            break;
        }
      }
      else if (type === 'REGISTER') {
        switch (channel) {
          case 'email': {
            const result = await sendOtpToEmail(route.params.email, route.name,`0${documentType}${documentNumber}`);
            if (result.type === 'MAX_LIMIT') {
              setIsOpenModal(true);
              setIsSendingOTP(false);
              return;
            }
            break;
          }
          case 'sms': {
            const result = await sendOtpToPhone(route.params.phoneNumber,route.name,`0${documentType}${documentNumber}`);
            if (result.type === 'MAX_LIMIT') {
              setIsOpenModal(true);
              setIsSendingOTP(false);
              return;
            }
            break;
          }
        }
      } else if (type === 'FORGOT_PASSWORD') {
        switch (channel) {
          case 'email': {
            const result = await sendOtpToEmail(route.params.email, route.name,`0${documentType}${documentNumber}`);
            if (result.type === 'MAX_LIMIT') {
              setIsOpenModal(true);
              setIsSendingOTP(false);
              return;
            }
            break;
          }
        }
      }

      setIsSendingOTP(false);
      restart({documentNumber, documentType});
    } catch (error) {
      setIsOpenModal(false);
      setIsSendingOTP(false);
      console.error(error);
    }
  };

  useEffect(() => {
    if (execRestart === true) {
      navigation.setParams({
        execRestart: undefined,
      });
      setCode('');
      handleOnSendOTP();
    }
  }, [execRestart, navigation, handleOnSendOTP, setCode]);

  let title: string = '';
  let titleModal: string = '';

  switch (type) {
    case 'REGISTER':
      title = `Código de activación vía ${channelLabelHeader}`;
      titleModal = `¡${channelLabelCodeActivated} activado!`;
      break;
    case 'FORGOT_PASSWORD':
      title = 'Validación de correo';
      titleModal = '¡Correo validado!';
      break;
    case 'REFILL_BIM':
    case 'TRANSFERENCY_OTHERS':
    case 'TRANSFERENCY_LOCAL':
      title = 'Código de seguridad vía SMS';
      break;
  }

  return (
    <>
      <FormTemplate
        title={title}
        header={(type === 'TRANSFERENCY_LOCAL' || type === 'TRANSFERENCY_OTHERS' || type === 'REFILL_BIM') ? <Separator size={33 + 8 * 4} /> : undefined}
        stepsProps={stepProps}
        description={
          <>
            {(type === 'TRANSFERENCY_LOCAL' || type === 'TRANSFERENCY_OTHERS' || type === 'REFILL_BIM') && (
              <>
                {channel === 'sms' && (
                  <TextCustom variation="p">
                    Para realizar esta operación ingresa el código de seguridad que te enviamos por mensaje de texto al{' '}
                    <TextCustom variation="p" weight="bold">
                      {route.params.phoneNumberObfuscated}.
                    </TextCustom>
                  </TextCustom>
                )}
              </>
            )}
            {type === 'REGISTER' && (
              <>
                {channel === 'sms' && (
                  <TextCustom variation="p">
                    El código de activación ha sido enviado al número{' '}
                    <TextCustom variation="p" weight="bold">
                      {isSensitiveInfo
                        ? hideWithChar('phone', route.params.phoneNumber)
                        : route.params.phoneNumber}
                    </TextCustom>
                    , por favor espere unos minutos.
                  </TextCustom>
                )}
                {channel === 'email' && (
                  <TextCustom variation="p">
                    El código de activación ha sido enviado a{' '}
                    <TextCustom variation="p" weight="bold">
                      {isSensitiveInfo ? hideWithChar('email', route.params.email) : route.params.email}
                    </TextCustom>
                    , por favor espere unos minutos.
                  </TextCustom>
                )}
              </>
            )}
            {type === 'FORGOT_PASSWORD' && (
              <>
                {channel === 'email' && (
                  <TextCustom variation="p">
                    Enviaremos un código de activación al correo{' '}
                    <TextCustom variation="p" weight="bold">
                      {isSensitiveInfo ? hideWithChar('email', route.params.email) : route.params.email}
                    </TextCustom>
                    . Asegúrate de ingresar el código correcto.
                  </TextCustom>
                )}
              </>
            )}
          </>
        }>
        <Formik
          validateOnMount={true}
          enableReinitialize={true}
          initialValues={{
            code: code,
          }}
          validationSchema={yup.object({
            code: yup
              .string()
              .length(6, 'El código debe tener 6 dígitos.')
              .required('Es obligatorio completar este dato.'),
          })}
          onSubmit={async (values, actions) => {
            await handleOnSubmit(values.code, actions);
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
                variation="p"
                weight="bold"
                text={(type === 'TRANSFERENCY_LOCAL' || type === 'TRANSFERENCY_OTHERS' || type === 'REFILL_BIM') ? "Ingresa el código de seguridad" : "Ingresa el código de activación"}
              />
              <Separator type="x-small" />
              <FieldForm
                message={errors.code?.toString()}
                messageType="error"
                showMessage={
                  errors.code !== undefined && touched.code !== undefined
                }>
                <InputCode
                  quantity={6}
                  value={values.code}
                  haveError={
                    errors.code !== undefined && touched.code !== undefined
                  }
                  onChangeText={text => {
                    const textAnalyzed = analyzeCode(text);
                    setCode(textAnalyzed);
                  }}
                  onBlur={handleBlur('code')}
                />
              </FieldForm>
              {(type === 'TRANSFERENCY_LOCAL' || type === 'TRANSFERENCY_OTHERS' || type === 'REFILL_BIM') && (
                <>
                  {errors.code !== undefined && touched.code !== undefined && (
                    <>
                      <Separator size={8} />
                      <Text style={styles.errorText}>
                        Recuerda que sólo está permitido 3 intentos máximos por
                        hora.
                      </Text>
                    </>
                  )}
                </>
              )}
              <Separator type="medium" />
              <Button
                onPress={handleSubmit}
                loading={isSubmitting}
                orientation="horizontal"
                type="primary"
                text="Enviar"
                disabled={!isValid}
              />
              <Separator type="medium" />
              {remaining > 0 ? (
                <>
                  <View style={styles.resendContainer}>
                    <TextCustom
                      variation="p"
                      weight="bold"
                      color={Colors.Primary}>
                      Reenviar otra vez en:
                    </TextCustom>
                    <Separator type="x-small" />
                    <TextCustom variation="p">
                      {remaining} {remaining > 1 ? 'segundos' : 'segundo'}
                    </TextCustom>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.resendContainer}>
                    {isSendingOTP ? (
                      <ActivityIndicator size="small" color={Colors.Primary} />
                    ) : (
                      <>
                        <TextCustom variation="p">
                          ¿No has recibido el código?
                        </TextCustom>
                        <Separator type="x-small" />
                        <TextCustom
                          variation="link"
                          onPress={() => {
                            handleOnSendOTP();
                          }}>
                          Reenviar código
                        </TextCustom>
                      </>
                    )}
                  </View>
                </>
              )}
            </>
          )}
        </Formik>
      </FormTemplate>
      <ModalInfo
        title="¿Seguro que quieres volver?"
        message="Si vuelves a la pantalla anterior, perderás tu código actual y tendrás que enviar uno nuevo."
        open={modalBeforeRemove.open}
        onRequestClose={() => {}}
        actions={
          <>
            <Button
              onPress={() => setModalBeforeRemove({open: false})}
              orientation="horizontal"
              type="primary"
              text="Esperar"
            />
            <Separator type="medium" />
            <TextCustom
              variation="link"
              align="center"
              color={Colors.Paragraph}
              onPress={() => {
                if (modalBeforeRemove.onRequestCloseScreen !== undefined)
                  modalBeforeRemove.onRequestCloseScreen();
              }}>
              Sí, quiero volver
            </TextCustom>
          </>
        }
      />
      <ModalInfo
        title={titleModal}
        message="Por este medio te informaremos todo lo relacionado con la app."
        open={modalCodeActivated.open}
        onRequestClose={() => {}}
        actions={
          <>
            <Button
              onPress={() => {
                setModalCodeActivated({open: false});
                if (type === 'REGISTER') {
                  switch (route.params.stage) {
                    case 'AGENCY':
                      navigation.navigate('RegisterPasswordInfo', {
                        stage: route.params.stage,
                        documentNumber,
                        documentType,
                        email: route.params.email,
                        stepProps:
                          stepProps !== undefined &&
                          stepProps.current !== undefined
                            ? {
                                max: stepProps.max,
                                current: stepProps.current + 1,
                              }
                            : undefined,
                        firstName: route.params.firstName,
                        firstSurname: route.params.firstSurname,
                        secondSurname: route.params.secondSurname,
                        secondName: route.params.secondName,
                      });
                      break;
                    case 'ONBOARDING':
                      navigation.navigate('RegisterIdentityInfo', {
                        flowType: 'REGISTER',
                        gender: route.params.gender,
                        stage: route.params.stage,
                        documentNumber,
                        documentType,
                        email: route.params.email,
                        stepProps:
                          stepProps !== undefined &&
                          stepProps.current !== undefined
                            ? {
                                max: stepProps.max,
                                current: stepProps.current + 1,
                              }
                            : undefined,
                        firstName: route.params.firstName,
                        secondName: route.params.secondName,
                        firstSurname: route.params.firstSurname,
                        secondSurname: route.params.secondSurname,
                      });
                      break;
                  }
                } else if (type === 'FORGOT_PASSWORD') {
                  navigation.navigate('RegisterIdentityInfo', {
                    flowType: 'FORGOT_PASSWORD',
                    email: route.params.email,
                    documentNumber,
                    documentType,
                    stepProps:
                      stepProps !== undefined && stepProps.current !== undefined
                        ? {
                            max: stepProps.max,
                            current: stepProps.current + 1,
                          }
                        : undefined,
                    gender: route.params.gender,
                    firstName: route.params.firstName,
                    firstSurname: route.params.firstSurname,
                    secondSurname: route.params.secondSurname,
                    secondName: route.params.secondName,
                  });
                }
              }}
              orientation="horizontal"
              type="primary"
              text="Aceptar"
            />
          </>
        }
      />
      <ModalError
        isOpen={isOpenModal}
        title="Límite superado"
        content="Ha superado el límite de envío de código permitido. Por favor intente luego nuevamente."
        close={() => setIsOpenModal(false)}
        titleButton="Aceptar"
      />
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    resendContainer: {
      alignItems: 'center',
    },
    errorText: {
      fontFamily: FontTypes.AmorSansPro,
      fontSize: FontSizes.Small,
      color: Colors.Primary,
    }
  });
  return stylesBase;
};

export default RegisterOTPScreen;
