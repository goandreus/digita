/* eslint-disable react-native/no-inline-styles */
import {Formik} from 'formik';
import React, {FC, useEffect, useLayoutEffect, useMemo, useState} from 'react';
import yup from '@yup';
import Button from '@atoms/extra/Button';
import FormBasicTemplate from '@templates/extra/FormBasicTemplate';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';
import Separator from '@atoms/Separator';
import {FONTS} from '@theme/fonts';
import Input from '@atoms/extra/Input';
import BoxView from '@atoms/BoxView';
import {SIZES} from '@theme/metrics';
import Icon from '@atoms/Icon';
import TextCustom from '@atoms/extra/TextCustom';
import {COLORS} from '@theme/colors';
import _ from 'lodash';
import {PayServiceConfirmationScreenProps} from '@navigations/types';
import {useAppSelector} from '@hooks/useAppSelector';
import {PayDebt} from '@services/Transactions';
import {useModalManager} from '@hooks/useModalManager';
import AlertBasic from '@molecules/extra/AlertBasic';
import {capitalizeFull} from '@helpers/StringHelper';
import moment from 'moment';
import {convertToCurrency} from '@utils/convertCurrency';
import { storeOTP } from '@hooks/useStoreOTP';

export const ConfirmationScreen = ({
  navigation,
  route,
}: PayServiceConfirmationScreenProps) => {
  const modalHandler = useModalManager(['PAY_WITH_ERROR']);

  const [errorState, setErrorState] = useState<{
    title: string;
    message: string;
  }>({
    title: '',
    message: '',
  });

  const userDocumentNumber = useAppSelector(
    state => state.user?.user?.person?.documentNumber,
  );
  const userDocumentType = useAppSelector(
    state => state.user?.user?.person?.documentTypeId,
  );

  const screenName = route.name;

  const {
    totalAmount,
    companyName,
    serviceType,
    serviceName,
    serviceCode,
    serviceAmount,
    serviceArrears,
    serviceFee,
    completeName,
    accountName,
    accountNumber,
    operationNumber,
    stepsProps,
    title,
    stage,
  } = route.params;

  useEffect(() => {
    if (title) {
      navigation.setOptions({title});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnSubmit = async () => {
    const token = storeOTP.getOtpState().currentToken;
    if (
      accountNumber === null ||
      accountNumber === undefined ||
      serviceAmount === null ||
      serviceAmount === undefined ||
      operationNumber === null ||
      operationNumber === undefined ||
      serviceCode === null ||
      serviceCode === undefined ||
      token === null ||
      token === undefined
    ) {
      return;
    }
    if (userDocumentType === undefined || userDocumentNumber === undefined)
      return;
    try {
      navigation.navigate('LoadingFishes', {
        screenId: 'LoadingFishesX',
      });
      const result = await PayDebt({
        user: {
          documentType: userDocumentType,
          documentNumber: userDocumentNumber,
        },
        screeName: screenName,
        payload: {
          accountType: accountName,
          accountNumber: accountNumber,
          amount: serviceAmount,
          invoiceNumber: operationNumber,
          supplyNumber: serviceCode,
          codeVerification: String(token)
        },
      });

      const props: any = {
        accountNumber: accountNumber,
        accountTitle: accountName,
        userFullName: completeName,
        amountArrears: serviceArrears,
        amountComissions: serviceFee,
        amountTotalWithoutFees: serviceAmount,
        amountTotal: totalAmount,
        companyName: companyName,
        serviceCodeValue: serviceCode,
        serviceType: serviceType,
        serviceName: serviceName,
        serviceReceiptNumber: operationNumber,
        stage: stage,
      };
      switch (result.type) {
        case 'SUCCESS':
          navigation.navigate('PayConstancy', {
            ...props,
            operationNumber: result.payload.tracePayment,
            operationIdentifier: result.payload.operationNumber,
            userEmail: result.payload.email,
            operationDate: result.payload.datetime,
            hasGlosa: result.payload.hasGlosa,
            glosaText: result.payload.gloss,
          });
          break;
        case 'BLOCKED_BY_MP':
          navigation.navigate('InfoAccessBlocked', {
            description: 'Se detectó una actividad inusual al intentar realizar el pago del servicio y por seguridad bloqueamos tu acceso.'
          });
          break;
        case 'NEED_AUTHENTICATION_BY_MP':
          navigation.replace('RegisterOTP', {
            type: 'PAYMENT',
            payload: props,
            stepProps: undefined,
            channel: 'sms',
            documentNumber: userDocumentNumber,
            documentType: userDocumentType,
            isSensitiveInfo: true,
            trackingTransaction: result.payload.trackingTransaction,
            phoneNumberObfuscated: result.payload.phoneOfuscated,
          })
          break;
        case 'UNKNOWN_ERROR':
          navigation.pop();
          setErrorState({
            title: 'Lo sentimos',
            message:
              'No hemos podido procesar el pago del servicio de esta empresa. Por favor, inténtalo más tarde.',
          });
          modalHandler.actions.open('PAY_WITH_ERROR');
          break;
      }
    } catch (error) {
      navigation.pop();
      setErrorState({
        title: 'Lo sentimos',
        message:
          'No hemos podido procesar el pago del servicio de esta empresa. Por favor, inténtalo más tarde.',
      });
      modalHandler.actions.open('PAY_WITH_ERROR');
    }
  };

  const getStringChunks = (message: string) => {
    const coincidencias = message.match(
      /\b(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]\b/g,
    );

    if (coincidencias === null)
      return (
        <TextCustom
          color="neutral-darkest"
          lineHeight="comfy"
          variation="p4"
          weight="normal"
          align="center">
          {message}
        </TextCustom>
      );
    else {
      let toDisplay = [];
      let idxPrev = 0;
      for (let index = 0; index < coincidencias.length; index++) {
        const time = coincidencias[index];
        const idxOfTime = message.indexOf(time, idxPrev);
        let partString = message.slice(idxPrev, idxOfTime);
        idxPrev = idxOfTime + time.length;
        let elem1 = (
          <React.Fragment key={`string-${index}`}>{partString}</React.Fragment>
        );
        let elem2 = (
          <Text
            key={`time-${index}`}
            style={{fontFamily: FONTS.AmorSansProBold}}>
            {moment(time, 'HH:mm').format('h:mm a')}
          </Text>
        );
        toDisplay.push(elem1);
        toDisplay.push(elem2);
      }
      let finalString = message.slice(idxPrev);
      let elem = (
        <React.Fragment key={`string-final`}>{finalString}</React.Fragment>
      );
      toDisplay.push(elem);
      return (
        <TextCustom
          color="neutral-darkest"
          lineHeight="comfy"
          variation="p4"
          weight="normal"
          align="center">
          {toDisplay}
        </TextCustom>
      );
    }
  };

  return (
    <>
      <Formik
        validateOnMount={true}
        initialValues={{message: ''}}
        validationSchema={yup.object({
          message: yup.string(),
        })}
        onSubmit={async () => {
          await handleOnSubmit();
        }}>
        {({
          setFieldTouched,
          setFieldValue,
          handleSubmit,
          values,
          isValid,
          isSubmitting,
        }) => (
          <FormBasicTemplate
            title="Confirmación de Pago"
            stepsProps={stepsProps}
            footer={
              <Button
                onPress={() => {
                  handleSubmit();
                }}
                loading={isSubmitting}
                orientation="horizontal"
                type="primary"
                text="Pagar servicio"
                disabled={!isValid}
              />
            }>
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.Bree,
                    fontSize: 16,
                    fontWeight: '500',
                    color: '#222D42',
                  }}>
                  Monto total a pagar
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.Bree,
                    fontSize: 32,
                    fontWeight: '500',
                    marginTop: 4,
                    color: '#222D42',
                  }}>
                  S/ {convertToCurrency(totalAmount)}
                </Text>
              </View>
              {/* Rows */}
              <View style={{marginTop: 16}}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Pagar a</Text>
                  <Text style={styles.rowValue}>
                    {_.capitalize(companyName)}
                  </Text>
                </View>
                <Separator showLine type="small" color="#EFEFEF" />

                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Servicio de</Text>
                  <Text style={styles.rowValue}>
                    {_.capitalize(serviceType)}
                  </Text>
                </View>
                <Separator showLine type="small" color="#EFEFEF" />

                <View style={styles.row}>
                  <Text style={styles.rowLabel}>
                    {_.capitalize(serviceName)}
                  </Text>
                  <Text style={styles.rowValue}>{serviceCode}</Text>
                </View>
                <Separator showLine type="small" color="#EFEFEF" />

                {operationNumber &&
                (stage === 'PAY_SERVICES_TOTAL' ||
                  stage === 'PAY_SERVICES_PARCIAL') ? (
                  <View>
                    <View style={styles.row}>
                      <Text style={styles.rowLabel}>Nro de Recibo</Text>
                      <Text style={styles.rowValue}>{operationNumber}</Text>
                    </View>
                    <Separator showLine type="small" color="#EFEFEF" />
                  </View>
                ) : null}

                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Titular</Text>
                  <Text style={styles.rowValue}>
                    {capitalizeFull(_.toLower(completeName))}
                  </Text>
                </View>
                <Separator showLine type="small" color="#EFEFEF" />

                <View style={styles.row}>
                  <Text
                    style={styles.rowLabel}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    Monto de servicio a pagar
                  </Text>
                  <Text style={styles.rowValue}>
                    S/ {convertToCurrency(serviceAmount)}
                  </Text>
                </View>
                <Separator showLine type="small" color="#EFEFEF" />

                {serviceFee ? (
                  <View>
                    <View style={styles.row}>
                      <Text
                        style={styles.rowLabel}
                        numberOfLines={2}
                        ellipsizeMode="tail">
                        Comisión
                      </Text>
                      <Text style={styles.rowValue}>
                        S/ {serviceFee.toFixed(2)}
                      </Text>
                    </View>
                    <Separator showLine type="small" color="#EFEFEF" />
                  </View>
                ) : null}

                {serviceArrears ? (
                  <View>
                    <View style={styles.row}>
                      <Text
                        style={styles.rowLabel}
                        numberOfLines={2}
                        ellipsizeMode="tail">
                        Mora
                      </Text>
                      <Text style={styles.rowValue}>
                        S/ {serviceArrears.toFixed(2)}
                      </Text>
                    </View>
                    <Separator showLine type="small" color="#EFEFEF" />
                  </View>
                ) : null}

                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Pagarás con</Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                    }}>
                    <Text style={styles.rowValue}>{accountName}</Text>
                    <Text style={{...styles.rowValue, color: '#697385'}}>
                      {accountNumber}
                    </Text>
                  </View>
                </View>
                <Separator showLine type="small" color="#EFEFEF" />

                {/*            <View style={{marginTop: 20}}>
                  <Input
                    maxLength={60}
                    placeholder="Agregar mensaje (opcional)"
                    hasCounter
                    value={values.message}
                    onChange={e => {
                      setFieldValue('message', e);
                      setFieldTouched('message');
                    }}
                    onBlur={() => {
                      setFieldTouched('message');
                    }}
                  />
                </View> */}

                <BoxView
                  direction="row"
                  align="center"
                  background="informative-lightest"
                  p={SIZES.MD}
                  style={styles.containerInfo}>
                  <Icon
                    name="protected"
                    size="small"
                    fill={COLORS.Informative.Medium}
                  />
                  <TextCustom
                    style={styles.text}
                    color="informative-dark"
                    variation="h6"
                    lineHeight="fair"
                    weight="normal"
                    text={'Esta operación se validará con tu Token Digital'}
                  />
                </BoxView>
              </View>
            </View>
            <AlertBasic
              ref={modalHandler.handlers.handleRef}
              onTouchBackdrop={() => {
                modalHandler.actions.close(() => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'MainTab'}],
                  });
                });
              }}
              closeOnTouchBackdrop={true}
              isOpen={modalHandler.current === 'PAY_WITH_ERROR'}
              title={errorState.title}
              customDescription={() => getStringChunks(errorState.message)}
              actions={utils => [
                {
                  id: 'button1',
                  render: (
                    <Button
                      text="Entiendo"
                      type="primary"
                      onPress={() => {
                        modalHandler.actions.close(() => {
                          navigation.reset({
                            index: 0,
                            routes: [{name: 'MainTab'}],
                          });
                        });
                      }}
                    />
                  ),
                },
              ]}
            />
          </FormBasicTemplate>
        )}
      </Formik>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
  },
  rowLabel: {
    fontFamily: FONTS.Bree,
    fontSize: 14,
    fontWeight: '500',
    color: '#697385',
    maxWidth: 150,
  },
  rowValue: {
    fontFamily: FONTS.Bree,
    fontSize: 14,
    fontWeight: '500',
    color: '#222D42',
  },
  containerInfo: {
    borderRadius: SIZES.XS,
    marginTop: 16,
  },
  text: {
    marginLeft: SIZES.XS,
  },
});
