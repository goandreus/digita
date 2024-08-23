import {
  BackHandler,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '@theme/colors';
import {
  getInvestmenMovements,
  getInvestmentDeatil,
  getSavingDetail,
  getSavingMovements,
  InvestmentDetailInterface,
  SavingDetailInterface,
} from '@services/Accounts';
import {useUserInfo} from '@hooks/common';
import {SavingDetailProps} from '@navigations/types';
import SavingsTemplate from '@templates/SavingsTemplate';
import TextCustom from '@atoms/TextCustom';
import TextCustomNew from '@atoms/extra/TextCustom';
import Separator from '@atoms/Separator';
import Skeleton from '@molecules/Skeleton';
import {SEPARATOR_BASE} from '@theme/metrics';
import {useFocusEffect} from '@react-navigation/native';
import Icon from '@atoms/Icon';
import BoxView from '@atoms/BoxView';

const SavingDetail = ({navigation, route}: SavingDetailProps) => {
  const [movements, setMovements] = useState<any | null>([]);
  const [savingDetail, setSavingDetail] =
    useState<SavingDetailInterface | null>(null);
  const [investmentDetail, setInvestmentDetail] =
    useState<InvestmentDetailInterface | null>(null);

  const {user, userInteroperabilityInfo} = useUserInfo();
  const person = user?.person;
  const isInteropAffiliate = userInteroperabilityInfo ? true : false;

  const getAccountDetail = async () => {
    if (route?.params?.productType !== 'PF') {
      const resSavingDetail = await getSavingDetail({
        operationUId: route.params.operationId,
        user: `0${person?.documentTypeId}${person?.documentNumber}`,
        screen: route.name,
      });
      setSavingDetail(resSavingDetail);
    } else {
      const resInvestmentDetail = await getInvestmentDeatil({
        accountCode: Number(route?.params?.accountNumber),
      });
      setInvestmentDetail(resInvestmentDetail);
    }
  };

  const getMovements = async () => {
    if (route?.params?.productType !== 'PF') {
      const savingMovements = await getSavingMovements({
        operationUId: route.params.operationId,
        user: `0${person?.documentTypeId}${person?.documentNumber}`,
        screen: route.name,
      });
      const movements = savingMovements?.movements?.slice(0, 30);
      const monthsMovements = movements?.map(
        (e: {monthString: string; yearString: string}) =>
          `${e.monthString}-${e.yearString}`,
      );
      const filteredMonths = [...new Set(monthsMovements)];

      const result = filteredMonths.map(e => ({
        month: e?.split('-')[0],
        year: e?.split('-')[1],
        data: movements?.filter(
          (m: {monthString: string; yearString: string}) =>
            m.monthString === e?.split('-')[0] &&
            m.yearString === e?.split('-')[1],
        ),
      }));
      setMovements(result);
    } else {
      const investmentMovements = await getInvestmenMovements({
        operationUId: route.params.operationId,
        user: `0${person?.documentTypeId}${person?.documentNumber}`,
        screen: route.name,
      });
      const movements = investmentMovements?.movements?.slice(0, 30);
      const monthsMovements = movements?.map(
        (e: {monthString: string; yearString: string}) =>
          `${e.monthString}-${e.yearString}`,
      );
      const filteredMonths = [...new Set(monthsMovements)];
      const result = filteredMonths.map(e => ({
        month: e?.split('-')[0],
        year: e?.split('-')[1],
        data: movements.filter(
          (m: {monthString: string; yearString: string}) =>
            m.monthString === e?.split('-')[0] &&
            m.yearString === e?.split('-')[1],
        ),
      }));
      setMovements(result);
    }
  };

  const goBack = () => {
    if (route.params.from === 'Disbursement') navigation.navigate('MainScreen');
    else navigation.navigate(route.params.from);
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => goBack(),
      );

      return () => backHandler.remove();
    }, []),
  );
  useEffect(() => {
    getMovements();
    getAccountDetail();
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />
      <SavingsTemplate
        detail
        title={route?.params?.title || ''}
        accountName={route?.params?.accountName || ''}
        accountNumber={route?.params?.accountNumber || ''}
        cci={savingDetail?.cci || ''}
        currency={route?.params?.currency || ''}
        productType={route?.params?.productType}
        action={goBack}>
        {route?.params?.productType !== 'PF' ? (
          <>
            {savingDetail ? (
              <>
                <View style={styles.container1}>
                  <View>
                    <TextCustom
                      text={`${route?.params?.currency} ${
                        savingDetail?.availableBalance < 0
                          ? '0.00'
                          : route?.params?.sAvailableBalance
                      }`}
                      variation="p"
                      size={30}
                      weight="bold"
                      color={Colors.Primary}
                    />
                    <TextCustom
                      text="Saldo Disponible"
                      variation="small"
                      size={12}
                    />
                  </View>
                  <View>
                    <TextCustom
                      text={`${route?.params?.currency} ${savingDetail?.sCountableBalance}`}
                      variation="p"
                      weight="bold"
                      color={Colors.Paragraph}
                    />
                    <TextCustom
                      text="Saldo Contable"
                      variation="small"
                      size={12}
                    />
                  </View>
                </View>

                {isInteropAffiliate &&
                userInteroperabilityInfo?.accountSaving ===
                  route?.params?.accountNumber &&
                !route?.params?.accountName?.includes('emprendedores') ? (
                  <BoxView
                    background="secondary-lightest"
                    mt={24}
                    p={8}
                    style={styles.bannerContainer}>
                    <View style={styles.bannerBox}>
                      <Icon name="icon_payWithPhone_v2" size={64} />
                      <BoxView ml={16} style={styles.bannerTextBox}>
                        <TextCustomNew>
                          <TextCustomNew
                            text={'Cuenta afiliada para '}
                            variation="h5"
                            color="warning-darkest"
                            lineHeight="comfy"
                          />
                          <TextCustomNew
                            weight="bold"
                            text={'recibir y hacer pagos '}
                            variation="h5"
                            color="warning-darkest"
                            lineHeight="comfy"
                          />
                          <TextCustomNew
                            text={'utilizando tu número celular.'}
                            variation="h5"
                            color="warning-darkest"
                            lineHeight="comfy"
                          />
                        </TextCustomNew>
                      </BoxView>
                    </View>
                  </BoxView>
                ) : null}

                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: '#efefef',
                    marginTop: '6%',
                  }}
                />
                <Separator type="x-small" />

                <View style={{flex: 1, marginBottom: 150}}>
                  <View style={styles.container2}>
                    <Separator type="x-small" />
                    <TextCustom
                      text="Movimientos"
                      variation="p"
                      weight="bold"
                      color={Colors.Primary}
                      size={16}
                    />
                  </View>
                  <Separator type="small" />
                  <ScrollView
                    style={{height: '100%', marginBottom: SEPARATOR_BASE}}>
                    {movements && movements?.length !== 0 ? (
                      movements?.map(
                        (
                          movement: {
                            month: string;
                            year: string;
                            data: [];
                          },
                          index: number,
                        ) => (
                          <View
                            key={index}
                            style={{paddingHorizontal: '6%', marginBottom: 24}}>
                            <>
                              <TextCustom
                                text={`${
                                  movement?.month?.split('')[0].toUpperCase() +
                                  movement?.month?.slice(1)
                                } ${movement?.year}`}
                                variation="p"
                                weight="bold"
                                color="#9A9A9A"
                                size={12}
                              />
                              {movement?.data?.map(
                                (
                                  data: {
                                    concept: string;
                                    dayString: string;
                                    monthString: string;
                                    time: string;
                                    debitCredit: string;
                                    samount: string;
                                  },
                                  i,
                                ): {} => (
                                  <View
                                    key={i}
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      borderBottomColor: '#EFEFEF',
                                      borderBottomWidth: 0.8,
                                      paddingBottom: 16,
                                      paddingTop: 16,
                                    }}>
                                    <View
                                      style={{
                                        flexGrow: 1,
                                        flexShrink: 1,
                                      }}>
                                      <TextCustomNew
                                        text={
                                          data?.concept?.charAt(0) +
                                          data?.concept?.slice(1)
                                        }
                                        variation="p4"
                                        weight="bold"
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={{
                                          color: '#665f59',
                                        }}
                                      />
                                      <Separator type="xx-small" />
                                      <TextCustom
                                        text={`${data?.dayString} ${data?.monthString}, ${data?.time}`}
                                        variation="p"
                                        weight="bold"
                                        color="#83786F"
                                        size={12}
                                      />
                                    </View>
                                    <View
                                      style={{
                                        flexGrow: 1,
                                        flexShrink: 0,
                                        flexDirection: 'row',
                                        flexWrap: 'nowrap',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        marginLeft: 8,
                                      }}>
                                      {data?.debitCredit === 'D' && (
                                        <TextCustom
                                          text="- "
                                          variation="p"
                                          weight="bold"
                                          color="#EB4141"
                                        />
                                      )}
                                      <TextCustom
                                        text={String(
                                          route?.params?.currency + ' ',
                                        )}
                                        variation="p"
                                        weight="bold"
                                        color={
                                          data?.debitCredit === 'C'
                                            ? Colors.DarkGray
                                            : '#EB4141'
                                        }
                                      />
                                      <TextCustom
                                        text={String(data.samount) || '0'}
                                        variation="p"
                                        weight="bold"
                                        color={
                                          data?.debitCredit === 'C'
                                            ? Colors.DarkGray
                                            : '#EB4141'
                                        }
                                      />
                                    </View>
                                  </View>
                                ),
                              )}
                            </>
                          </View>
                        ),
                      )
                    ) : (
                      <View style={styles.noMovements}>
                        <TextCustom
                          size={14}
                          text="Aún no hay movimientos"
                          variation="p"
                          weight="bold"
                          color={Colors.Placeholder}
                        />
                      </View>
                    )}
                  </ScrollView>
                </View>
              </>
            ) : (
              <Skeleton timing={600}>
                <View
                  style={{
                    alignSelf: 'center',
                    width: '90%',
                    height: 50,
                    borderRadius: 8,
                    backgroundColor: '#E1E1E1',
                  }}
                />
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: '#efefef',
                    marginTop: '6%',
                  }}
                />
                <View
                  style={{
                    width: '25%',
                    height: 24,
                    borderRadius: 25,
                    marginTop: 24,
                    marginLeft: 16,
                    backgroundColor: '#E1E1E1',
                  }}
                />
                <View
                  style={{
                    width: '90%',
                    height: 60,
                    borderRadius: 8,
                    marginTop: 24,
                    marginLeft: 16,
                    backgroundColor: '#E1E1E1',
                  }}
                />
                <View
                  style={{
                    width: '90%',
                    height: 60,
                    borderRadius: 8,
                    marginTop: 24,
                    marginLeft: 16,
                    backgroundColor: '#E1E1E1',
                  }}
                />
              </Skeleton>
            )}
          </>
        ) : investmentDetail ? (
          <View style={styles.container2}>
            <View style={{marginHorizontal: '6%'}}>
              <TextCustom
                text={`${route?.params?.currency} ${investmentDetail?.sAvailableBalance}`}
                variation="p"
                size={30}
                weight="bold"
                color={Colors.Primary}
              />
              <Separator type="x-small" />
              <TextCustom text={'Monto'} variation="p" size={12} />
              <Separator type="small" />
              <TextCustom
                text={`Forma de pago de intereses: ${investmentDetail?.descriptionInstruction}`}
                variation="p"
                weight="bold"
                color={Colors.DarkGray}
                size={14}
              />
              <Separator type="small" />
              <TextCustom
                text={`Plazo: ${investmentDetail?.sNumberDaysTerm}`}
                variation="p"
                weight="bold"
                color={Colors.DarkGray}
                size={14}
              />
              <Separator type="small" />
              <TextCustom
                text={`TEA: ${investmentDetail?.sInterestRate}%`}
                variation="p"
                weight="bold"
                color={Colors.DarkGray}
                size={14}
              />
              <Separator type="small" />
              <TextCustom
                text={`Interés a pagar: ${route?.params?.currency} ${investmentDetail?.sAgreedInterestAmount}`}
                variation="p"
                weight="bold"
                color={Colors.DarkGray}
                size={14}
              />
              <Separator type="small" />
              <TextCustom
                text={`Fecha de inicio: ${investmentDetail?.highDate}`}
                variation="h2"
                weight="normal"
                color={Colors.DarkGray}
                size={14}
              />
              <Separator type="small" />
              <TextCustom
                text={`Fecha de vencimiento: ${investmentDetail?.expirationDate}`}
                variation="p"
                weight="bold"
                color={Colors.DarkGray}
                size={14}
              />
            </View>

            <View
              style={{borderWidth: 0.8, borderColor: 'e', marginTop: '6%'}}
            />
            <Separator type="x-small" />
            <View style={{marginHorizontal: '3%'}}>
              {movements && movements?.length !== 0 && (
                <View>
                  <Separator type="x-small" />
                  <TextCustom
                    text="Movimientos"
                    variation="p"
                    weight="bold"
                    color={Colors.Primary}
                    size={16}
                  />
                </View>
              )}
              <Separator type="small" />
              <ScrollView style={{height: '36%'}}>
                {movements && movements?.length !== 0
                  ? movements?.map(
                      (
                        movement: {
                          month: string;
                          year: string;
                          data: [];
                        },
                        index: number,
                      ) => (
                        <View key={index} style={{marginBottom: 24}}>
                          <TextCustom
                            text={`${
                              movement?.month?.split('')[0].toUpperCase() +
                              movement?.month?.slice(1)
                            } ${movement?.year}`}
                            variation="p"
                            weight="bold"
                            color="#9A9A9A"
                            size={12}
                          />
                          {movement.data?.map(
                            (
                              data: {
                                concept: string;
                                dayString: string;
                                monthString: string;
                                time: string;
                                debitCredit: string;
                                samount: string;
                              },
                              i,
                            ) => (
                              <View
                                key={i}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  borderBottomColor: '#EFEFEF',
                                  borderBottomWidth: 0.8,
                                  paddingBottom: 16,
                                }}>
                                <View
                                  style={{
                                    flexGrow: 1,
                                    flexShrink: 1,
                                  }}>
                                  <TextCustomNew
                                    text={
                                      data?.concept?.charAt(0) +
                                      data?.concept?.slice(1)
                                    }
                                    variation="p4"
                                    weight="bold"
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={{
                                      color: '#665f59',
                                    }}
                                  />
                                  <Separator type="xx-small" />
                                  <TextCustom
                                    text={`${data?.dayString} ${data?.monthString}, ${data?.time}`}
                                    variation="p"
                                    weight="bold"
                                    color="#83786F"
                                    size={12}
                                  />
                                </View>
                                <View
                                  style={{
                                    flexGrow: 1,
                                    flexShrink: 0,
                                    flexDirection: 'row',
                                    flexWrap: 'nowrap',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    marginLeft: 8,
                                  }}>
                                  {data?.debitCredit === 'D' && (
                                    <TextCustom
                                      text="- "
                                      variation="p"
                                      weight="bold"
                                      color="#EB4141"
                                    />
                                  )}
                                  <TextCustom
                                    text={String(route?.params?.currency + ' ')}
                                    variation="p"
                                    weight="bold"
                                    color={
                                      data?.debitCredit === 'C'
                                        ? Colors.DarkGray
                                        : '#EB4141'
                                    }
                                  />
                                  <TextCustom
                                    text={String(data.samount) || '0'}
                                    variation="p"
                                    weight="bold"
                                    color={
                                      data?.debitCredit === 'C'
                                        ? Colors.DarkGray
                                        : '#EB4141'
                                    }
                                  />
                                </View>
                              </View>
                            ),
                          )}
                        </View>
                      ),
                    )
                  : null}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Skeleton timing={600}>
            <View style={styles.skeletonHeader} />
            <View style={styles.skeletonBody} />
            <View style={styles.skeletonBody} />
            <View style={styles.skeletonBody} />
            <View
              style={{
                borderWidth: 0.5,
                borderColor: '#efefef',
                marginTop: '6%',
              }}
            />
            <View
              style={{
                width: '36%',
                height: 24,
                borderRadius: 25,
                marginLeft: 16,
                marginTop: 24,
                backgroundColor: '#E1E1E1',
              }}
            />
            <View style={styles.skeletonBottom} />
            <View style={styles.skeletonBottom} />
          </Skeleton>
        )}
      </SavingsTemplate>
    </>
  );
};

export default SavingDetail;

const transferMenuItemWidth = Dimensions.get('screen').width - 36;

const styles = StyleSheet.create({
  container1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginRight: 24,
    backgroundColor: Colors.White,
  },
  container2: {
    marginHorizontal: '6%',
    backgroundColor: Colors.White,
  },
  noMovements: {
    marginTop: '12%',
    alignItems: 'center',
  },
  skeletonHeader: {
    width: '36%',
    height: 45,
    borderRadius: 8,
    marginLeft: 16,
    backgroundColor: '#E1E1E1',
  },
  skeletonBody: {
    width: '90%',
    height: 45,
    borderRadius: 25,
    marginLeft: 16,
    marginTop: 24,
    backgroundColor: '#E1E1E1',
  },
  skeletonBottom: {
    width: '90%',
    height: 60,
    borderRadius: 8,
    marginLeft: 16,
    marginTop: 24,
    backgroundColor: '#E1E1E1',
  },
  bannerContainer: {
    width: transferMenuItemWidth,
    alignSelf: 'center',
    borderRadius: 16,
  },
  bannerImage: {
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderRadius: 12,
  },
  bannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    justifyContent: 'center',
  },
  bannerTextBox: {
    width: '65%',
    marginLeft: 14,
  },
  texts: {
    flexDirection: 'row',
  },
});
