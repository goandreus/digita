import React, {useEffect, useState} from 'react';
import {ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {COLORS, Colors} from '@theme/colors';
import Separator from '@atoms/Separator';
import {getUserSavings, Savings} from '@services/User';
import Skeleton from '@molecules/Skeleton';
import ProductComponent from '@molecules/ProductComponent';
import {SEPARATOR_BASE, SIZES} from '@theme/metrics';
import ProductTitle from '@molecules/ProductTitle';
import {useUserInfo} from '@hooks/common';
import {Saving} from '@features/userInfo';

const MySavings = ({navigation, route}) => {
  const [savings, setSavings] = useState<Savings | null>(null);
  const [savingsListLoading, setSavingsListLoading] = useState(true);
  const [hasNotProducts, setHasNotProducts] = useState(true);

  const getSavings = async () => {
    const savingsList = await getUserSavings({
      personUid: route?.params?.personUId,
    });
    const flag = savingsList?.savings?.savings?.length === 0;
    setSavings(savingsList);
    setHasNotProducts(flag);
    setSavingsListLoading(false);
  };

  const {userInteroperabilityInfo} = useUserInfo();

  const isExclusiveProduct = (e: Saving) => {
    if (
      e.operationUId === parseInt(userInteroperabilityInfo?.operationUId) &&
      (e.productUId === 110 || e.productUId === 410 || e.productUId === 88)
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    getSavings();
  }, []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.Transparent}
        translucent={true}
      />
      <ScrollView
        contentContainerStyle={{flexGrow: hasNotProducts ? 1 : undefined}}
        style={{
          marginTop: SEPARATOR_BASE * 2,
          margin: SEPARATOR_BASE * 2,
        }}>
        {!savingsListLoading ? (
          <>
            {savings?.savings?.savings?.length > 0 ? (
              <View>
                <Separator size={SIZES.LG} />
                <ProductTitle
                  title="Ahorros"
                  iconName="pig_cash"
                  showMore={false}
                  bree={false}
                />
                <View style={styles.productContainer}>
                  {savings?.savings?.savings?.map(
                    (
                      saving: {
                        balance: string | number;
                        productType: string;
                        subAccount: string | string[];
                        productName: string;
                        currency: string;
                        operationUId: any;
                        accountCode: any;
                        accountCci: any;
                        contable: any;
                      },
                      index: React.Key | null | undefined,
                    ) => {
                      let title = saving.productType;
                      if (title === 'PF') title = 'Depósito a Plazo Fijo';
                      if (saving.subAccount.includes('CTS')) {
                        title = 'CTS';
                      } else {
                        title = 'Ahorros';
                      }
                      return (
                        <ProductComponent
                          key={saving.operationUId}
                          widthName="50%"
                          productName={saving.productName}
                          currency={saving.currency}
                          amount={saving.sBalance}
                          index={index}
                          action={async () => {
                            if (isExclusiveProduct(saving)) {
                              navigation.navigate('EntrepreneurSavingDetail', {
                                from: 'MainScreen',
                                title: 'Ahorros',
                                accountName: saving.productName,
                                accountNumber: saving.accountCode,
                                cci: saving.accountCci,
                                contable: saving.contable,
                                currency: saving.currency,
                                operationId: saving.operationUId,
                                productType: saving.productType,
                                sAvailableBalance: saving.sBalance,
                                balance: saving.balance,
                              });
                            } else {
                              if (saving.productType !== 'PF') {
                                navigation.navigate('SavingDetail', {
                                  from: 'MySavings',
                                  title,
                                  accountName: saving.productName,
                                  accountNumber: saving.accountCode,
                                  cci: saving.accountCci,
                                  contable: saving.contable,
                                  currency: saving.currency,
                                  operationId: saving.operationUId,
                                  productType: saving.productType,
                                  sAvailableBalance: saving.sBalance,
                                });
                              } else {
                                navigation.navigate('SavingDetail', {
                                  from: 'MySavings',
                                  title: 'Depósito a Plazo Fijo',
                                  accountName: saving.productName,
                                  accountNumber: saving.accountCode,
                                  cci: saving.accountCci,
                                  contable: saving.contable,
                                  currency: saving.currency,
                                  operationId: saving.operationUId,
                                  productType: saving.productType,
                                });
                              }
                            }
                          }}
                        />
                      );
                    },
                  )}
                </View>
              </View>
            ) : null}

            {savings?.compensations?.savings?.length > 0 ? (
              <View>
                <Separator size={SIZES.LG} />
                <ProductTitle
                  title="CTS"
                  iconName="pig_cash"
                  showMore={false}
                  bree={false}
                />
                <View style={styles.productContainer}>
                  {savings?.compensations?.savings?.map(
                    (
                      saving: {
                        balance: string | number;
                        productType: string;
                        subAccount: string | string[];
                        productName: string;
                        currency: string;
                        operationUId: any;
                        accountCode: any;
                        accountCci: any;
                        contable: any;
                      },
                      index: React.Key | null | undefined,
                    ) => {
                      let title = saving.productType;
                      if (title === 'PF') title = 'Depósito a Plazo Fijo';
                      if (saving.subAccount.includes('CTS')) {
                        title = 'CTS';
                      } else {
                        title = 'Ahorros';
                      }
                      return (
                        <ProductComponent
                          key={saving.operationUId}
                          widthName="50%"
                          productName={saving.productName}
                          currency={saving.currency}
                          amount={saving.sBalance}
                          index={index}
                          action={async () => {
                            if (saving.productType !== 'PF') {
                              navigation.navigate('SavingDetail', {
                                from: 'MySavings',
                                title,
                                accountName: saving.productName,
                                accountNumber: saving.accountCode,
                                cci: saving.accountCci,
                                contable: saving.contable,
                                currency: saving.currency,
                                operationId: saving.operationUId,
                                productType: saving.productType,
                                sAvailableBalance: saving.sBalance,
                              });
                            } else {
                              navigation.navigate('SavingDetail', {
                                from: 'MySavings',
                                title: 'Depósito a Plazo Fijo',
                                accountName: saving.productName,
                                accountNumber: saving.accountCode,
                                cci: saving.accountCci,
                                contable: saving.contable,
                                currency: saving.currency,
                                operationId: saving.operationUId,
                                productType: saving.productType,
                              });
                            }
                          }}
                        />
                      );
                    },
                  )}
                </View>
              </View>
            ) : null}

            {savings?.investments?.savings?.length > 0 ? (
              <View>
                <Separator size={SIZES.LG} />
                <ProductTitle
                  title="Depósito a Plazo Fijo"
                  iconName="pig_cash"
                  showMore={false}
                  bree={false}
                />
                <View style={styles.productContainer}>
                  {savings?.investments?.savings?.map(
                    (
                      saving: {
                        balance: string | number;
                        productType: string;
                        subAccount: string | string[];
                        productName: string;
                        currency: string;
                        operationUId: any;
                        accountCode: any;
                        accountCci: any;
                        contable: any;
                      },
                      index: React.Key | null | undefined,
                    ) => {
                      let title = saving.productType;
                      if (title === 'PF') title = 'Depósito a Plazo Fijo';
                      if (saving.subAccount.includes('CTS')) {
                        title = 'CTS';
                      } else {
                        title = 'Ahorros';
                      }
                      return (
                        <ProductComponent
                          key={saving.operationUId}
                          widthName="50%"
                          productName={saving.productName}
                          currency={saving.currency}
                          amount={saving.sBalance}
                          index={index}
                          action={async () => {
                            if (saving.productType !== 'PF') {
                              navigation.navigate('SavingDetail', {
                                from: 'MainScreen',
                                title,
                                accountName: saving.productName,
                                accountNumber: saving.accountCode,
                                cci: saving.accountCci,
                                contable: saving.contable,
                                currency: saving.currency,
                                operationId: saving.operationUId,
                                productType: saving.productType,
                                sAvailableBalance: saving.sBalance,
                              });
                            } else {
                              navigation.navigate('SavingDetail', {
                                from: 'MainScreen',
                                title: 'Depósito a Plazo Fijo',
                                accountName: saving.productName,
                                accountNumber: saving.accountCode,
                                cci: saving.accountCci,
                                contable: saving.contable,
                                currency: saving.currency,
                                operationId: saving.operationUId,
                                productType: saving.productType,
                              });
                            }
                          }}
                        />
                      );
                    },
                  )}
                </View>
              </View>
            ) : null}
          </>
        ) : (
          <Skeleton timing={600}>
            <View style={styles.skeleton1} />
            <View style={styles.skeleton2} />
          </Skeleton>
        )}

        <Separator type="small" />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  skeleton1: {
    alignSelf: 'center',
    width: '90%',
    height: 50,
    borderRadius: 8,
    backgroundColor: '#E1E1E1',
  },
  skeleton2: {
    borderWidth: 0.5,
    borderColor: '#efefef',
    marginTop: '6%',
  },
  productContainer: {
    marginTop: SEPARATOR_BASE,
    backgroundColor: Colors.White,
    borderRadius: 12,
  },
});

export default MySavings;
