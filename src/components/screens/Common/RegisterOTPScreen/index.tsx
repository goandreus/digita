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
    Linking,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
  } from 'react-native';
  import {CodeActivationScreenProps} from '@navigations/types';
  import {COLORS, Colors} from '@theme/colors';
  import Button from '@atoms/Button';
  import ButtonNew from '@atoms/extra/Button';
  import TextCustomNew from '@atoms/extra/TextCustom';
  import SeparatorNew from '@atoms/extra/Separator';

  import InputCode from '@atoms/extra/InputCode';
  import Separator from '@atoms/Separator';
  import TextCustom from '@atoms/TextCustom';
  import FormTemplate from '@templates/FormTemplate';
  import yup from '@yup';
  import {Formik, FormikHelpers} from 'formik';
  import FieldForm from '@molecules/FieldForm';
  import {encourage, formatString, hideWithChar} from '@helpers/StringHelper';
  import HeaderBackButton from '@molecules/HeaderBackButton';
  import ModalInfo from '@atoms/ModalInfo';
  import {
    evaluateOtpFromEmail,
    evaluateOtpFromPhone,
    evaluateOtp_Authentication,
    evaluateOtpFromPhone_Transferency,
    sendOtpToEmail,
    sendOtpToPhone,
    sendOtp_Authentication,
    sendOtpToPhone_Transference,
    evaluateOtpFromPhone_Payment,
    sendOtpToPhone_Payment,
    evaluateOtpFromEmail_FORGOT_PASSWORD,
    sendOtpToEmail_ForgotPassword,
  } from '@services/User';
  import moment from 'moment';
  import RNOtpVerify from 'react-native-otp-verify';
  import ModalError from '@molecules/ModalError';
  import { CommonActions, StackActions } from '@react-navigation/native';
  import {useLoading, useTimer} from '@hooks/common';
  import { FontSizes, FontTypes } from '@theme/fonts';
import FormPureTemplate from '@templates/extra/FormPureTemplate';
import { SIZES } from '@theme/metrics';
import AlertBasic from '@molecules/extra/AlertBasic';
import ModalBottom from '@atoms/ModalBottom';
import Toggle from '@molecules/extra/Toggle';
import { Information } from '@global/information';
import useUser from '@hooks/useUser';
import AlertBared from '@molecules/extra/AlertBared';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';
import { useModalManager } from '@hooks/useModalManager';
  
  const RegisterOTPScreen = ({navigation, route}: CodeActivationScreenProps) => {
    const modalHandler = useModalManager(['BEFORE_BACK']);

    const styles = getStyles();
    const {actions: actionsUser} = useUser();
    const {
      type,
      channel,
      isSensitiveInfo,
      documentType,
      documentNumber,
      stepProps,
      execRestart,
    } = route.params;
    const [showSelectChannel, setShowSelectChannel] = useState<boolean>(false);
    const [channelCustom, setChannelCustom] = useState<'email' | 'sms'>(channel);
    const {setHideTabBar} = useLoading();
    const [code, setCode] = useState<string>('');
    const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(
      ((type === 'FORGOT_PASSWORD' || type === 'REGISTER') && route.params.showMaxLimit) ? true : false,
    );
  
    const [modalBeforeRemove, setModalBeforeRemove] = useState<{
      onRequestCloseScreen?: () => void;
    }>({});
  
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
        if (type === 'TRANSFERENCY_LOCAL' || type === 'TRANSFERENCY_OTHERS' || type === 'REFILL_BIM' || type === 'INTEROPERABILITY') {
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
                  'El código que ingresaste no coincide con el enviado. Intenta nuevamente',
                );
              }
              else if(res === 'BLOCKED'){
                navigation.dispatch(StackActions.replace('InfoAccessBlocked'));
              }
              else {
                if (res.type === 'LOCAL' && type === 'TRANSFERENCY_LOCAL') {
                  navigation.dispatch(
                    StackActions.replace('OperationsStack', {
                      screen: 'OtherBanks',
                      params: {
                        type: 'TRANSFERENCY_LOCAL',
                        ...route.params.transfer,
                        ...res.payload,
                      },
                      initial: false,
                    })
                  )
                }
                else if(res.type === 'OTHERS' && type === 'TRANSFERENCY_OTHERS'){
                  navigation.dispatch(
                    StackActions.replace('OperationsStack', {
                      screen: 'OtherBanks',
                      params: {
                        type: 'TRANSFERENCY_OTHERS',
                        ...route.params.transfer,
                        ...res.payload,
                      },
                    })
                  );
                }
                else if(res.type === 'BIM' && type === 'REFILL_BIM'){
                  navigation.dispatch(
                    StackActions.replace('OperationsStack', {
                      screen: 'RefillBim',
                      params: {
                        type: 'REFILL_BIM',
                        ...route.params.refillData,
                        ...res.payload,
                      },
                    }),
                  );
                }
                else if(res.type === 'INTEROPERABILITY' && type === 'INTEROPERABILITY'){
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'PayWithPhoneForm',
                      merge: true,
                      params: {
                        executeSuccess: {
                          isOpen: true,
                          payloadModal: res.payload,
                          contactSelected: route.params.payload?.contactSelected,
                          payloadRecentContacts: route.params.payload?.payloadRecentContacts
                        }
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
            case 'email':{
              let result = await evaluateOtpFromEmail(
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
              if (result)
                setModalCodeActivated({
                  open: true,
                });
              else
                actions.setFieldError(
                  'code',
                  'El código que ingresaste no coincide con el enviado. Intenta nuevamente',
                );
              break;
            }
            case 'sms':{
              let result = await evaluateOtpFromPhone(
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
              switch (result) {
                case 'SUCCESS': {
                  setModalCodeActivated({
                    open: true,
                  });
                  break;
                }
                case 'MAX_LIMIT':{
                  setIsOpenModal(true);
                  break;
                }
                case 'UNKNOWN_ERROR':{
                  actions.setFieldError(
                    'code',
                    'El código que ingresaste no coincide con el enviado. Intenta nuevamente',
                  );
                  break;
                }
              }
              break;
            }
          }
        } else if (type === 'FORGOT_PASSWORD') {
          switch (channel) {
            case 'email':{
              let result = await evaluateOtpFromEmail_FORGOT_PASSWORD(
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
              if (result) {
                AH.track("CF App - Clave Olvidada", {
                  'Número de Documento': AH.autoGenerate('Número de Documento'),
                  'Fase de Inicio de Sesión': AH.autoGenerate('Fase de Inicio de Sesión'),
                  'Etapa': 'Código de Activación'
                });
                setModalCodeActivated({
                  open: true,
                });
              }
              else
                actions.setFieldError(
                  'code',
                  'El código que ingresaste no coincide con el enviado. Intenta nuevamente',
                );
              break;
            }
          }
        }
        else if(type === 'LOGIN'){
          let result = await evaluateOtp_Authentication(
            code,
            route.params.trackingLogin,
            {
              documentNumber,
              documentType,
            },
            route.name,
            channel
          );
          switch (result.type) {
            case 'SUCCESS': {
              await actionsUser.populateUserData({
                documentNumber,
                documentType,
                firstName: result.firstName,
                gender: result.gender,
                token: result.token,
                tokenIsInCurrentDevice: result.tokenIsInCurrentDevice,
                hasActiveToken: result.hasActiveToken,
              });
              navigation.reset({
                index: 0,
                routes: [{name: 'MainTab'}],
              });
              break;
            }
            case 'MAX_LIMIT':{
              setIsOpenModal(true);
              break;
            }
            case 'UNKNOWN_ERROR':{
              actions.setFieldError(
                'code',
                'El código que ingresaste no coincide con el enviado. Intenta nuevamente',
              );
              break;
            }
          }
        }
        else if(type === 'PAYMENT'){
          isFishesLoading = true;
          navigation.navigate('LoadingFishes', {
            screenId: 'Loading-' + route.key,
          });

          let result = await evaluateOtpFromPhone_Payment(
            code,
            route.params.trackingTransaction,
            {
              documentNumber,
              documentType,
            },
            route.name
          );
          switch (result.type) {
            case 'SUCCESS': {
              navigation.dispatch(
                StackActions.replace('PayConstancy', {
                  ...route.params.payload,
                  operationNumber: result.payload.tracePayment,
                  operationIdentifier: result.payload.operationNumber,
                  userEmail: result.payload.email,
                  operationDate: result.payload.datetime,
                  hasGlosa: result.payload.hasGlosa,
                  glosaText: result.payload.gloss,
                }),
              );
              break;
            }
            case 'BLOCKED':{
              navigation.dispatch(StackActions.replace('InfoAccessBlocked', {
                description: 'Se detectó una actividad inusual al intentar realizar el pago del servicio y por seguridad bloqueamos tu acceso.'
              }));
              break;
            }
            case 'ERROR':{
              navigation.pop();
              actions.setFieldError(
                'code',
                'El código que ingresaste no coincide con el enviado. Intenta nuevamente',
              );
              break;
            }
          }
        }
      } catch (error) {
        if (isFishesLoading) {
          navigation.pop();
        }
        console.log(error);
        actions.setFieldError(
          'code',
          'El código que ingresaste no coincide con el enviado. Intenta nuevamente',
        );
      }
    };
  
    useLayoutEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', e => {
        if (e.data.action.type === 'GO_BACK') {
          e.preventDefault();
          modalHandler.actions.open('BEFORE_BACK');
          setModalBeforeRemove({
            onRequestCloseScreen: () => navigation.dispatch(e.data.action),
          });
        }
      });
      return () => unsubscribe();
    }, [navigation, modalHandler]);
  
    useLayoutEffect(() => {
      switch (type) {
        case 'INTEROPERABILITY':
        case 'TRANSFERENCY_OTHERS':
        case 'TRANSFERENCY_LOCAL':
        case 'REFILL_BIM':
          navigation.setOptions({
            gestureEnabled: false,
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
        if(type === 'TRANSFERENCY_LOCAL' || type === 'TRANSFERENCY_OTHERS' || type === 'REFILL_BIM' || type === 'INTEROPERABILITY'){
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
              const result = await sendOtpToEmail(route.params.email, route.name, {
                documentNumber: documentNumber,
                documentType: documentType
              });
              if (result.type === 'MAX_LIMIT') {
                setIsOpenModal(true);
                setIsSendingOTP(false);
                return;
              }
              break;
            }
            case 'sms': {
              const result = await sendOtpToPhone(route.params.phoneNumber, route.name, {
                documentNumber: documentNumber,
                documentType: documentType
              });
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
              const result = await sendOtpToEmail_ForgotPassword(route.params.email, route.name, {
                documentNumber: documentNumber,
                documentType: documentType
              });
              if (result.type === 'MAX_LIMIT') {
                setIsOpenModal(true);
                setIsSendingOTP(false);
                return;
              }
              break;
            }
          }
        } else if (type === 'LOGIN') {
          const result = await sendOtp_Authentication({
            screen: route.name,
            trackingLogin: route.params.trackingLogin,
            user: {
              documentNumber,
              documentType,
            },
            channelType: channel
          });
          if(result === 'MAX_LIMIT'){
            setIsOpenModal(true);
            setIsSendingOTP(false);
            return;
          }
          else if(result === 'ERROR'){
            setIsSendingOTP(false);
            return;
          }
        }
        else if(type === 'PAYMENT'){
          const result = await sendOtpToPhone_Payment({
            screen: route.name,
            trackingTransaction: route.params.trackingTransaction,
            user: {
              documentNumber,
              documentType,
            },
          });
          if (result.type === 'ERROR') {
            setIsSendingOTP(false);
            return;
          }
          else if (result.type === 'BLOCKED') {
            navigation.navigate('InfoAccessBlocked', {
              description: 'Se detectó una actividad inusual al intentar realizar el pago del servicio y por seguridad bloqueamos tu acceso.'
            });
          }
        };
  
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

    useEffect(() => {
      navigation.setParams({
        channel: channelCustom
      })
    }, [channelCustom]);
  
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
      case 'INTEROPERABILITY':
      case 'TRANSFERENCY_OTHERS':
      case 'TRANSFERENCY_LOCAL':
        title = 'Código de seguridad vía SMS';
        break;
    }
    return (
      <>
        <Formik
          validateOnMount={true}
          enableReinitialize={true}
          initialValues={{
            code: code,
          }}
          validationSchema={yup.object({
            code: yup
              .string()
              .length(6, 'El código debe tener 6 dígitos')
              .required('Es obligatorio completar este dato'),
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
            <FormPureTemplate
              footer={
                <ButtonNew
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  orientation="horizontal"
                  type="primary"
                  text="Aceptar"
                  disabled={!isValid}
                />
              }>
              <SeparatorNew size={SIZES.XS * 6} />
              <TextCustomNew
                variation="h2"
                color="primary-medium"
                lineHeight="tight"
                align="center">
                Valida el código
              </TextCustomNew>
              <SeparatorNew size={SIZES.XL} />
              {(type === 'TRANSFERENCY_LOCAL' ||
                type === 'TRANSFERENCY_OTHERS' ||
                type === 'INTEROPERABILITY' ||
                type === 'REFILL_BIM' ||
                type === 'PAYMENT') && (
                <>
                  {channel === 'sms' && (
                    <TextCustomNew
                      color="neutral-darkest"
                      variation="p0"
                      lineHeight="comfy"
                      align="center">
                      Se enviará un código de activación al{'\n'}siguiente
                      número{' '}
                      <TextCustomNew
                        weight="bold"
                        color="neutral-darkest"
                        variation="p0"
                        lineHeight="comfy"
                        align="center">
                        {formatString(
                          'phone',
                          route.params.phoneNumberObfuscated,
                          isSensitiveInfo,
                          true
                        )}
                        .
                      </TextCustomNew>
                    </TextCustomNew>
                  )}
                </>
              )}
              {type === 'LOGIN' && (
                <>
                  {channel === 'sms' && (
                    <TextCustomNew
                      color="neutral-darkest"
                      variation="p0"
                      lineHeight="comfy"
                      align="center">
                      Se enviará un código de activación al{'\n'}siguiente
                      número{' '}
                      <TextCustomNew
                        weight="bold"
                        color="neutral-darkest"
                        variation="p0"
                        lineHeight="comfy"
                        align="center">
                        {formatString(
                          'phone',
                          route.params.phoneNumberObfuscated,
                          isSensitiveInfo,
                          true
                        )}
                        .
                      </TextCustomNew>
                    </TextCustomNew>
                  )}
                  {channel === 'email' && (
                    <TextCustomNew
                      color="neutral-darkest"
                      variation="p0"
                      lineHeight="comfy"
                      align="center">
                      Se enviará un código de activación al{'\n'}siguiente
                      correo{' '}
                      <TextCustomNew
                        weight="bold"
                        color="neutral-darkest"
                        variation="p0"
                        lineHeight="comfy"
                        align="center">
                        {formatString(
                          'email',
                          route.params.emailObfuscated,
                          isSensitiveInfo,
                          true
                        )}
                        .
                      </TextCustomNew>
                    </TextCustomNew>
                  )}
                </>
              )}
              {type === 'REGISTER' && (
                <>
                  {channel === 'sms' && (
                    <TextCustomNew
                      color="neutral-darkest"
                      variation="p0"
                      lineHeight="comfy"
                      align="center">
                      Se enviará un código de activación al{'\n'}siguiente
                      número{' '}
                      <TextCustomNew
                        weight="bold"
                        color="neutral-darkest"
                        variation="p0"
                        lineHeight="comfy"
                        align="center">
                        {formatString(
                          'phone',
                          route.params.phoneNumber,
                          isSensitiveInfo,
                          true
                        )}
                        .
                      </TextCustomNew>
                    </TextCustomNew>
                  )}
                  {channel === 'email' && (
                    <TextCustomNew
                      color="neutral-darkest"
                      variation="p0"
                      lineHeight="comfy"
                      align="center">
                      Se enviará un código de activación al{'\n'}siguiente
                      correo{' '}
                      <TextCustomNew
                        weight="bold"
                        color="neutral-darkest"
                        variation="p0"
                        lineHeight="comfy"
                        align="center">
                        {formatString(
                          'email',
                          route.params.email,
                          isSensitiveInfo,
                          true
                        )}
                        .
                      </TextCustomNew>
                    </TextCustomNew>
                  )}
                </>
              )}
              {type === 'FORGOT_PASSWORD' && (
                <>
                  {channel === 'email' && (
                    <TextCustomNew
                      color="neutral-darkest"
                      variation="p0"
                      lineHeight="comfy"
                      align="center">
                      Se enviará un código de activación al{'\n'}siguiente
                      correo{' '}
                      <TextCustomNew
                        weight="bold"
                        color="neutral-darkest"
                        variation="p0"
                        lineHeight="comfy"
                        align="center">
                        {formatString(
                          'email',
                          route.params.email,
                          isSensitiveInfo,
                          true
                        )}
                        .
                      </TextCustomNew>
                    </TextCustomNew>
                  )}
                </>
              )}
              {(type === 'REGISTER' || type === 'LOGIN') && (
                <>
                  <SeparatorNew size={SIZES.LG} />
                  <ButtonNew
                    disabled={remaining > 0}
                    text="Elegir otra opción"
                    type="link"
                    containerStyle={{
                      alignSelf: 'center',
                    }}
                    onPress={() => setShowSelectChannel(true)}
                  />
                </>
              )}
              <SeparatorNew size={SIZES.XS * 5 - 8} />
              <View style={{alignSelf: 'center', width: 6 * 44}}>
                <InputCode
                  quantity={6}
                  value={values.code}
                  errorMessage={errors.code?.toString()}
                  haveError={
                    errors.code !== undefined && touched.code !== undefined
                  }
                  onChangeText={text => {
                    const textAnalyzed = analyzeCode(text);
                    setCode(textAnalyzed);
                  }}
                  onBlur={handleBlur('code')}
                />
                {((type === 'REGISTER') ||
                  type === 'REFILL_BIM') &&
                  errors.code !== undefined &&
                  touched.code !== undefined && (
                    <>
                      {channel === 'sms' && (
                        <>
                          <SeparatorNew size={SIZES.XS} />
                          <TextCustomNew
                            variation="p5"
                            color="error-medium"
                            lineHeight="tight">
                          Recuerda que sólo esta permitido 3 intentos máximo por
                          hora
                        </TextCustomNew>
                      </>
                    )}
                  </>
                )}
              </View>
              <SeparatorNew size={SIZES.XS * 5} />
              {remaining > 0 ? (
                <>
                  <View style={styles.resendContainer}>
                    <TextCustomNew
                      variation="p4"
                      lineHeight="comfy"
                      color="neutral-dark"
                      align="center">
                      Solicita un nuevo código en{'\n'}
                      {remaining} {remaining > 1 ? 'segundos' : 'segundo'}
                    </TextCustomNew>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.resendContainer}>
                    {isSendingOTP ? (
                      <ActivityIndicator size="small" color={Colors.Primary} />
                    ) : (
                      <>
                        <TextCustomNew
                          variation="p4"
                          lineHeight="tight"
                          color="neutral-dark">
                          ¿No has recibido el código?
                        </TextCustomNew>
                        <SeparatorNew size={SIZES.LG} />
                        <ButtonNew
                          text="Reenviar código"
                          type="link"
                          onPress={handleOnSendOTP}
                        />
                      </>
                    )}
                  </View>
                </>
              )}
              <SeparatorNew size={SIZES.XL} />
            </FormPureTemplate>
          )}
        </Formik>
        <AlertBasic
          ref={modalHandler.handlers.handleRef}
          isOpen={modalHandler.current === 'BEFORE_BACK'}
          title="¿Seguro que deseas retroceder?"
          description="Si vuelves a la pantalla anterior, perderás tu código actual y tendrás que enviar uno nuevo."
          actions={utils => [
            {
              id: 'button1',
              render: (
                <ButtonNew
                  text="Esperar"
                  type="primary"
                  onPress={modalHandler.actions.close}
                />
              ),
            },
            {
              id: 'button2',
              render: (
                <ButtonNew
                  text="Volver"
                  type="primary-inverted"
                  haveBorder={true}
                  onPress={() => {
                    modalHandler.actions.close(() => {
                      if (type === 'PAYMENT') {
                          navigation.reset({
                            index: 1,
                            routes: [
                              { name: 'MainTab' },
                              { name: 'PayServicesRootStack' }
                            ],
                          });
                      } else {
                        if (modalBeforeRemove.onRequestCloseScreen !== undefined)
                          modalBeforeRemove.onRequestCloseScreen();
                      }
                    });
                  }}
                />
              ),
            },
          ]}
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
                        stepProps !== undefined &&
                        stepProps.current !== undefined
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
        <AlertBasic
          closeOnTouchBackdrop={true}
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          title="Excediste el número de intentos"
          description={`Por tu seguridad podrás enviar un nuevo${'\n'}código de activación en 60 minutos.`}
          actions={utils => [
            {
              id: 'button1',
              render: (
                <ButtonNew
                  text="Entiendo"
                  type="primary"
                  onPress={() => utils.close()}
                />
              ),
            },
          ]}
        />
        {(type === 'REGISTER' || type === 'LOGIN') && (
          <AlertBared
            closeOnTouchBackdrop={true}
            isOpen={showSelectChannel}
            onClose={() => setShowSelectChannel(false)}
            content={(utils) => (
              <React.Fragment>
                <TextCustomNew
                  color="primary-medium"
                  lineHeight="fair"
                  variation="h3"
                  weight="normal"
                  align="center">
                  ¿Dónde quieres recibir tu{'\n'}código de activación?
                </TextCustomNew>
                <SeparatorNew size={SIZES.XL} />
                <Toggle
                  actionName="Seleccionar canal Correo electrónico"
                  icon="email"
                  title={(() => {
                    switch (type) {
                      case 'REGISTER':
                        return formatString(
                          'email',
                          route.params.email,
                          isSensitiveInfo,
                        );
                      case 'LOGIN':
                        return formatString(
                          'email',
                          route.params.emailObfuscated,
                          isSensitiveInfo,
                        );
                    }
                  })()}
                  description="Correo electrónico"
                  selected={channelCustom === 'email'}
                  onToggle={() => {
                    setChannelCustom('email');
                    utils.close();
                  }}
                />
                <SeparatorNew size={SIZES.MD} />
                <Toggle
                  actionName="Seleccionar canal Número de teléfono"
                  icon="sms"
                  title={(() => {
                    switch (type) {
                      case 'REGISTER':
                        return formatString(
                          'phone',
                          route.params.phoneNumber,
                          isSensitiveInfo,
                        );
                      case 'LOGIN':
                        return formatString(
                          'phone',
                          route.params.phoneNumberObfuscated,
                          isSensitiveInfo,
                        );
                    }
                  })()}
                  description="Número de teléfono"
                  selected={channelCustom === 'sms'}
                  onToggle={() => {
                    setChannelCustom('sms');
                    utils.close();
                  }}
                />
              </React.Fragment>
            )}
          />
        )}
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
  