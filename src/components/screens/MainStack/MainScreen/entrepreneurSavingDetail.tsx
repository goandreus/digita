/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  BackHandler,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getSavingsOperations,
  SavingOperationInterface,
  getSavingMovements,
} from '@services/Accounts';
import {useLastUser, useUserInfo} from '@hooks/common';
import {EntrepreneurSavingDetailProps} from '@navigations/types';
import TextCustom from '@atoms/TextCustom';
import TextCustomNew from '@atoms/extra/TextCustom';
import Separator from '@atoms/Separator';
import Skeleton from '@molecules/Skeleton';
import {useFocusEffect} from '@react-navigation/native';
import DetailEntrepreneurCard from './Components/DetailEntrepreneurCard';
import SummaryEntrepreneurCard from './Components/SummaryEntrepreneurCard';
import BoxView from '@atoms/BoxView';
import {HeaderStack} from '@molecules/extra/HeaderStack';
import SvgIconReload from '@assets/icons/SvgIconReload';
import Icon from '@atoms/Icon';
import BalanceToggle from '@atoms/extra/BalanceToggle';
import {useAppSelector} from '@hooks/useAppSelector';
import {SIZES} from '@theme/metrics';
import {COLORS, Colors} from '@theme/colors';

const EntrepreneurSavingDetail = ({
  navigation,
  route,
}: EntrepreneurSavingDetailProps) => {
  const [movements, setMovements] = useState<any | null>([]);
  const [savingDetail, setSavingDetail] =
    useState<SavingOperationInterface | null>(null);

  const {user} = useUserInfo();
  const {lastUser} = useLastUser();
  const person = user?.person;
  const [refresh, setRefresh] = useState(false);
  const {balanceVisibility} = useAppSelector(state => state.balanceVisibility);

  const reloadScreen = () => {
    setSavingDetail(null);
    setMovements(null);
    setRefresh(true);
  };

  const getAccountDetail = async () => {
    const resSavingDetail = await getSavingsOperations({
      operationUId: route.params.operationId,
      user: `0${person?.documentTypeId}${person?.documentNumber}`,
      screen: route.name,
    });
    setSavingDetail(resSavingDetail);
  };

  const getMovements = async () => {
    const savingMovements = await getSavingMovements({
      operationUId: route.params.operationId,
      user: `0${person?.documentTypeId}${person?.documentNumber}`,
      screen: route.name,
      payload: {
        numberOfDays: '30',
        numberOfMovements: '10',
      },
    });
    const movementsSav = savingMovements?.movements?.slice(0, 30);
    const monthsMovements = movementsSav?.map(
      (e: {monthString: string; yearString: string}) =>
        `${e.monthString}-${e.yearString}`,
    );
    const filteredMonths = [...new Set(monthsMovements)];

    const result = filteredMonths.map(e => ({
      month: e?.split('-')[0],
      year: e?.split('-')[1],
      data: movementsSav?.filter(
        (m: {monthString: string; yearString: string}) =>
          m.monthString === e?.split('-')[0] &&
          m.yearString === e?.split('-')[1],
      ),
    }));
    setMovements(result);
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
    if (refresh) {
      getMovements();
      getAccountDetail();
      setRefresh(false);
    }
  }, [refresh]);

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
      <BoxView style={styles.headerBorder} mt={2}>
        <HeaderStack
          canGoBack={navigation.canGoBack()}
          onBack={() => navigation.goBack()}
          title={'Mis movimientos'}
        />
      </BoxView>
      <ScrollView style={{flex: 1, width: '100%'}}>
        <>
          {savingDetail && movements ? (
            <>
              <View style={styles.container1}>
                <View style={{margin: 25, maxWidth: '100%', flexWrap: 'wrap'}}>
                  <BoxView
                    direction="row"
                    align="center"
                    justify="space-between"
                    style={{width: '100%'}}>
                    <TextCustom
                      text="Mi día a día"
                      variation="h2"
                      size={22}
                      weight="normal"
                      color={Colors.Primary}
                    />
                    <TouchableOpacity onPress={reloadScreen}>
                      <SvgIconReload width={87} height={22} />
                    </TouchableOpacity>
                  </BoxView>
                  <TextCustom
                    text="Recibe pagos usando tu número celular"
                    variation="h2"
                    weight="normal"
                    size={14}
                    color={COLORS.Primary.Darkest}
                  />
                  <BoxView
                    mt={24}
                    direction="row"
                    justify="space-between"
                    align="center"
                    style={{width: '100%'}}>
                    <Icon name="icon_phone-cash" size={70} />
                    <View style={styles.containerBalance}>
                      <TextCustom
                        text="Saldo Disponible"
                        variation="h2"
                        weight="normal"
                        size={12}
                        color={COLORS.Primary.Darkest}
                        align="center"
                      />
                      <TextCustom
                        text={`${route?.params?.currency} ${
                          route.params.balance && route.params.balance < 0
                            ? '0.00'
                            : balanceVisibility
                            ? route?.params?.sAvailableBalance
                            : '********'
                        }`}
                        variation="h2"
                        size={20}
                        weight="normal"
                        color={Colors.Primary}
                        align="center"
                      />
                    </View>
                    <BalanceToggle direction="column" fonSize={12} />
                  </BoxView>
                  <Separator size={SIZES.MD} />
                  <SummaryEntrepreneurCard
                    title={'Resumen del día'}
                    giveAmount={savingDetail.soutlay}
                    receiveAmount={savingDetail.sincome}
                    currency={savingDetail.currencyType}
                  />
                  <Separator size={SIZES.XS} />
                  <DetailEntrepreneurCard
                    title={'Detalle de cuenta afiliada'}
                    cellphone={lastUser?.cellphoneNumber}
                    accountName={route.params.accountName?.replace(
                      /\b\w/g,
                      char => char.toUpperCase(),
                    )}
                    accountCode={route.params.accountNumber}
                    accountCci={route.params.cci}
                  />
                </View>
              </View>

              <View
                style={{
                  marginTop: '6%',
                }}
              />
              <Separator type="x-small" />

              <View style={{flex: 1}}>
                <View style={styles.container2}>
                  <TextCustom
                    text="Últimos movimientos"
                    variation="h2"
                    weight="normal"
                    color={COLORS.Primary.Medium}
                    size={18}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <Pressable
                      onPress={() =>
                        navigation.navigate('EntrepreneurSavingMovements', {
                          operationId: route.params.operationId!,
                        })
                      }
                      style={{flexDirection: 'row', alignSelf: 'center'}}>
                      <TextCustom
                        text="Ver más"
                        variation="h2"
                        weight="normal"
                        size={14}
                        color={COLORS.Primary.Dark}
                      />
                    </Pressable>
                  </View>
                </View>
                <Separator size={8} />
                <BoxView>
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
                        <View key={index} style={{paddingHorizontal: '6%'}}>
                          <>
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
                                    borderBottomColor:
                                      movement?.data?.length > 1
                                        ? COLORS.Neutral.Light
                                        : COLORS.Background.Lightest,
                                    borderBottomWidth:
                                      movement?.data?.length > 1 ? 1 : 0.0,
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
                                      variation="h4"
                                      weight="normal"
                                      numberOfLines={1}
                                      ellipsizeMode="tail"
                                      style={{
                                        color: COLORS.Neutral.Darkest,
                                      }}
                                    />
                                    <Separator type="xx-small" />
                                    <TextCustom
                                      text={`${data?.dayString} ${data?.monthString}, ${data?.time}`}
                                      variation="h2"
                                      weight="normal"
                                      color={COLORS.Neutral.Dark}
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
                                        variation="h2"
                                        weight="normal"
                                        size={16}
                                        color={COLORS.Error.Medium}
                                      />
                                    )}
                                    <TextCustom
                                      text={String(
                                        route?.params?.currency + ' ',
                                      )}
                                      variation="h2"
                                      size={16}
                                      weight="normal"
                                      color={
                                        data?.debitCredit === 'C'
                                          ? COLORS.Neutral.Darkest
                                          : COLORS.Error.Medium
                                      }
                                    />
                                    <TextCustom
                                      text={String(data.samount) || '0'}
                                      variation="h2"
                                      weight="normal"
                                      size={16}
                                      color={
                                        data?.debitCredit === 'C'
                                          ? COLORS.Neutral.Darkest
                                          : COLORS.Error.Medium
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
                      <Icon name="icon_wallet-sad" size={90} />
                      <Separator size={SIZES.MD} />
                      <TextCustom
                        size={16}
                        text="Aún no hay movimientos"
                        variation="h2"
                        weight="normal"
                        color={COLORS.Neutral.Darkest}
                      />
                    </View>
                  )}
                </BoxView>
              </View>
            </>
          ) : (
            <Skeleton timing={600}>
              <View style={styles.skeletonHeader}>
                <View style={styles.skeletonBody1} />
                <View style={styles.skeletonBody2} />
                <View style={styles.skeletonBody3} />
                <View style={styles.skeletonBody4} />
                <View style={styles.skeletonBody5} />
              </View>
              <View style={styles.skeletonBottom}>
                <View style={styles.skeletonBottomBody1} />
                <View style={styles.skeletonBottomBody2} />
              </View>
            </Skeleton>
          )}
        </>
      </ScrollView>
    </>
  );
};

export default EntrepreneurSavingDetail;

const styles = StyleSheet.create({
  headerBorder: {
    borderTopWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.01)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 12,
    zIndex: 1,
  },
  container1: {
    flexDirection: 'column',
    backgroundColor: '#FFECEC',
  },
  container2: {
    marginHorizontal: '6%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.White,
  },
  noMovements: {
    marginTop: '12%',
    alignItems: 'center',
  },
  skeletonHeader: {
    width: '100%',
    height: 297,
    backgroundColor: '#FFECEC',
  },
  skeletonBody1: {
    width: '25%',
    height: 20,
    marginLeft: 16,
    marginTop: 24,
    backgroundColor: '#FDDFDF',
  },
  skeletonBody2: {
    width: '50%',
    height: 14,
    marginLeft: 16,
    marginTop: 5,
    backgroundColor: '#FDDFDF',
  },
  skeletonBody3: {
    width: '90%',
    height: 70,
    marginLeft: 16,
    marginTop: 20,
    backgroundColor: '#FDDFDF',
  },
  skeletonBody4: {
    width: '90%',
    height: 46,
    marginLeft: 16,
    marginTop: 15,
    backgroundColor: '#FDDFDF',
  },
  skeletonBody5: {
    width: '90%',
    height: 46,
    marginLeft: 16,
    marginTop: 10,
    backgroundColor: '#FDDFDF',
  },
  skeletonBottom: {
    width: '100%',
    backgroundColor: COLORS.Background.Lightest,
  },
  skeletonBottomBody1: {
    width: '90%',
    height: 32,
    marginLeft: 16,
    marginTop: 20,
    backgroundColor: '#F6F6F9',
  },
  skeletonBottomBody2: {
    width: '90%',
    height: '60%',
    marginLeft: 16,
    marginTop: 15,
    backgroundColor: '#F6F6F9',
  },
  containerBalance: {
    width: 180,
    paddingHorizontal: 20,
    height: 64,
    borderRadius: 16,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF99',
    justifyContent: 'center',
  },
  containerReload: {
    flexShrink: 1,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
