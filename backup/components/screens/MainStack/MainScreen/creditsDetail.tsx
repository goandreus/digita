/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Icon from '@atoms/Icon';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import DetailTemplate from '@templates/DetailTemplate';
import * as Progress from 'react-native-progress';
import {Colors} from '@theme/colors';
import Pill from '@atoms/Pill';
import {CreditDetailInterface} from '@services/Accounts';
import Skeleton from '@molecules/Skeleton';
import {CreditsDetailProps} from '@navigations/types';
import {useUserInfo, useLoading} from '@hooks/common';
import Button from '@atoms/extra/Button';
import {SIZES} from '@theme/metrics';
import useSavings from '@hooks/useSavings';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {
  setShowCreditPunishedModal,
  setShowNeedSavingModal,
} from '@features/appConfig';
import {OperationStackContext} from '@contexts/OperationStackContext';
import {StackActions, useFocusEffect} from '@react-navigation/native';
import { getCreditDetail } from '@services/CreditLine';

const Tooltip = () => {
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: 20,
        width: 240,
        height: 50,
        backgroundColor: '#83786F',
        opacity: 0.9,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TextCustom
        text={
          'Incluye el monto de las cuotas vencidas, intereses compensatorios y moratorios al día de hoy.'
        }
        variation="p"
        color="#EFEFEF"
        size={11}
        weight="bold"
      />
    </View>
  );
};

const CreditsDetail = ({navigation, route}: CreditsDetailProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [creditDetail, setCreditDetail] =
    useState<CreditDetailInterface | null>(null);
  const {targetScreen, setTargetScreen} = useLoading();
  const {user} = useUserInfo();
  const {hasAccountForTransact} = useSavings();
  const dispatch = useAppDispatch();
  const person = user?.person;

  const getAccountDetail = async () => {
    const _creditDetail = await getCreditDetail({
      accountCode: route?.params?.accountNumber,
      user: `0${person?.documentTypeId}${person?.documentNumber}`,
      screen: route.name,
    });
    setCreditDetail(_creditDetail);
  };

  useEffect(() => {
    getAccountDetail();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowTooltip(false);
    }, 3600);
  }, [showTooltip]);

  const mainStackNavigator = navigation.getParent(
    'MainStackNavigator' as never,
  );
  const operationStackContext = useContext(OperationStackContext);

  useFocusEffect(
    useCallback(() => {
      operationStackContext.disableUseFocusEffect = false;
    }, []),
  );

  const goBack = () => {
    const isFromCredits = targetScreen?.CreditsDetail === 'MyCredits';
    if (isFromCredits) {
      // clear target screen
      setTargetScreen({
        screen: 'CreditsDetail',
        from: undefined,
      });
      navigation.goBack();
      return;
    }
    mainStackNavigator?.dispatch(
      StackActions.push('MainTab', {
        screen: 'Main',
        params: {
          screen: 'MainScreen',
          params: {},
        },
      }),
    );
  };

  const handlePayQuota = () => {
    setTargetScreen({
      screen: 'CreditPayments',
      from: 'CreditsDetail',
    });

    if (!hasAccountForTransact()) {
      dispatch(setShowNeedSavingModal(true));
    } else {
      if (route?.params?.isPunished === false) {
        operationStackContext.disableUseFocusEffect = true;
        mainStackNavigator?.dispatch(
          StackActions.push('OperationsStack', {
            screen: 'CreditPayments',
            params: {
              status: route?.params?.status,
              productName: route?.params?.productName,
              advancePercentage: route?.params?.advancePercentage,
              disbursedCapital: route?.params?.disbursedCapital,
              disbursedCapitalAmount: route?.params?.disbursedCapitalAmount,
              currency: route?.params?.currency,
              accountNumber: route?.params?.accountNumber,
              capitalCanceled: route?.params?.capitalCanceled,
              capitalCanceledAmount: route?.params?.capitalCanceledAmount,
              type: 'Individual',
              from: 'CreditsDetail',
            },
          }),
        );
      } else {
        dispatch(setShowCreditPunishedModal(true));
      }
    }
  };

  return (
    <>
      <DetailTemplate
        type={route.params.type}
        currency={route.params.currency}
        title={route.params.productName}
        accountNumber={route.params.accountNumber}
        action={goBack}>
        {creditDetail ? (
          <>
            <View style={styles.detailsContainer}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <TextCustom
                    text="Crédito Desembolsado"
                    variation="p"
                    weight="bold"
                    size={14}
                  />
                  <TextCustom
                    text={`${route.params.currency} ${route.params.disbursedCapital}`}
                    variation="p"
                    weight="bold"
                    color={Colors.Primary}
                    size={32}
                  />
                </View>
                <View style={{justifyContent: 'center'}}>
                  <TextCustom
                    text="Saldo Capital"
                    variation="p"
                    weight="bold"
                    size={14}
                  />
                  <TextCustom
                    text={`${route.params.currency} ${route.params.capitalCanceled}`}
                    variation="p"
                    weight="bold"
                    size={18}
                    color={Colors.DarkGray}
                  />
                </View>
              </View>
              <Separator type="small" />
              <Progress.Bar
                style={{
                  marginTop: 2,
                  backgroundColor:
                    route.params.capitalCanceledAmount >
                    route.params.disbursedCapitalAmount
                      ? '#FCCFCF'
                      : Colors.GrayBackground,
                  borderColor:
                    route.params.capitalCanceledAmount >
                    route.params.disbursedCapitalAmount
                      ? '#FCCFCF'
                      : Colors.GrayBackground,
                }}
                progress={route.params.advancePercentage}
                height={8}
                width={null}
                color={
                  route.params.capitalCanceledAmount >
                  route.params.disbursedCapitalAmount
                    ? '#FCCFCF'
                    : Colors.Secondary
                }
              />
            </View>

            <View style={styles.payButton}>
              <Button
                text="Pagar mi cuota"
                type="primary-inverted"
                haveBorder
                orientation="horizontal"
                onPress={handlePayQuota}
              />
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailContainer}>
                <TextCustom
                  weight="bold"
                  text="Estado de la cuota"
                  variation="p"
                  color={Colors.DarkGray}
                  size={14}
                />
                <Pill
                  title={
                    creditDetail?.individualOverdueAmount !== 0
                      ? 'Vencido'
                      : 'Al día'
                  }
                />
              </View>
              <View style={styles.detailContainer}>
                <TextCustom
                  weight="bold"
                  text="Fecha de Vencimiento"
                  variation="p"
                  color={Colors.DarkGray}
                  size={14}
                />
                <TextCustom
                  weight="bold"
                  text={creditDetail?.expirationDate}
                  variation="p"
                  color={Colors.DarkGray}
                  size={14}
                />
              </View>
              <View style={styles.detailContainer}>
                <TextCustom
                  weight="bold"
                  text="Número de Cuota"
                  variation="p"
                  color={Colors.DarkGray}
                  size={14}
                />
                <TextCustom
                  weight="bold"
                  text={`${creditDetail?.individualFeeNumber} de ${creditDetail?.individualTotalFeeNumber}`}
                  variation="p"
                  color={Colors.DarkGray}
                  size={14}
                />
              </View>
              <View style={styles.detailContainer}>
                <TextCustom
                  weight="bold"
                  text="Cuota cronograma"
                  variation="p"
                  color={Colors.DarkGray}
                  size={14}
                />
                <TextCustom
                  weight="bold"
                  text={`${route.params.currency} ${creditDetail?.sindividualInstallmentAmount}`}
                  variation="p"
                  color={Colors.DarkGray}
                  size={14}
                />
              </View>
              {creditDetail?.individualOverdueAmount !== 0 && (
                <>
                  <Separator
                    type="small"
                    showLine
                    width={0.5}
                    color="#EFEFEF"
                  />
                  <View style={styles.detailContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextCustom
                        weight="bold"
                        text="Deuda Vencida"
                        variation="p"
                        color={Colors.DarkGray}
                        size={14}
                      />
                      <Pressable
                        style={{position: 'relative'}}
                        onPress={() => setShowTooltip(true)}>
                        <Icon
                          style={{marginLeft: 6}}
                          name="info"
                          size="tiny"
                          fill="#000"
                        />
                        {showTooltip && <Tooltip />}
                      </Pressable>
                    </View>
                    <TextCustom
                      weight="bold"
                      text={`${route.params.currency} ${creditDetail?.sindividualOverdueAmount}`}
                      color={Colors.DarkGray}
                      variation="p"
                      size={14}
                    />
                  </View>
                </>
              )}
            </View>
          </>
        ) : (
          <Skeleton timing={600}>
            <View
              style={{
                marginTop: 24,
                marginLeft: 16,
                width: '90%',
                height: 80,
                borderRadius: 8,
                backgroundColor: '#E1E1E1',
              }}
            />
            <View
              style={{
                marginTop: 24,
                marginLeft: 16,
                width: '90%',
                height: 80,
                borderRadius: 8,
                backgroundColor: '#E1E1E1',
              }}
            />
          </Skeleton>
        )}
      </DetailTemplate>
    </>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    alignSelf: 'center',
    borderRadius: 12,
    padding: 18,
    backgroundColor: '#f9f9f9',
    width: '90%',
  },
  detailContainer: {
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  payButton: {
    paddingHorizontal: SIZES.XS * 6,
    marginVertical: SIZES.XS * 2,
  },
});

export default CreditsDetail;
