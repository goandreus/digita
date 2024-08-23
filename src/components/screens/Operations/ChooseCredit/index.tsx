import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import { useLoading, useUserInfo } from '@hooks/common';
import { CustomCredits, IndividualCredit } from '@interface/Credit';
import ProductCard from '@molecules/extra/ProductCard';
import Skeleton from '@molecules/Skeleton';
import { ChooseCreditScreenProps } from '@navigations/types';
import { getCustomCredits } from '@services/User';
import PaysTemplate from '@templates/extra/PaysTemplate';
import { COLORS, Colors } from '@theme/colors';
import { SIZES } from '@theme/metrics';
import React, { useEffect, useState } from 'react'
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native'
import { PaySkeleton } from '../CreditPaymentsScreen/components/paySkeleton';

export const ChooseCredit = ({navigation, route}: ChooseCreditScreenProps) => {

  const styles = getStyles();
  const {setTargetScreen} = useLoading();
  const goBack = () => navigation.goBack();
  const {user} = useUserInfo();
  const [creditsDetail, setCreditsDetail] = useState<CustomCredits | null>(null);
  
  useEffect(() => {
    getCredits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const getCredits = async () => {
    const _credits = await getCustomCredits({
      // personUid: user?.person?.personUId,
      user: `0${user?.person?.documentTypeId}${user?.person?.documentNumber}`,
      screen: route.name,
    });
    setCreditsDetail(_credits);
  };

  const goToPayCredit = (credit: IndividualCredit) => {

    setTargetScreen({
      screen: 'CreditPayments',
      from: 'ChooseCredit',
    });

    navigation.navigate('OperationsStack', {
      screen: 'CreditPayments',
      params: {
        status: credit.status,
        productName: credit.productName,
        disbursedCapital: credit.sDisbursedCapital,
        disbursedCapitalAmount: credit.disbursedCapital,
        currency: credit.currency,
        accountNumber: credit.accountCode,
        type: 'Individual',
        from: 'ChooseCredit',
      },
    });
  }

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />
      <PaysTemplate
        headerTitle="Pagar Crédito"
        title="¿Qué crédito pagarás?"
        goBack={goBack}
        canGoBack={true}
        footerInfo={
          (creditsDetail?.groupCredits.length > 0) && (
            <BoxView
              direction="row"
              align="center"
              background="informative-lightest"
              py={SIZES.MD}
              style={styles.disclaimerContainer}
            >
              <BoxView style={styles.disclaimerIcon}> 
                <Icon
                  name="exclamation-circle-inverted"
                  size="x-small"
                  fill={COLORS.Informative.Dark}
                />
              </BoxView>
              <TextCustom
                style={styles.disclaimerText}
                color="informative-dark"
                variation="h6"
                weight="normal"
                text="Por el momento solo están disponibles los pagos de créditos individuales."
              />
            </BoxView>
          )
        }
      >
        <BoxView>
          {
            creditsDetail ? (
              creditsDetail?.individualCredits
                .filter( credit => credit.isPunished === false )
                .map((credit, index) => {
                  return (
                    <ProductCard
                      key={index}
                      title={credit.productName}
                      disbursedCapital={credit.sDisbursedCapital}
                      currency={credit.currency}
                      quota={credit.sInstallmentToBePaidAmountTotPay}
                      quotaNumber={credit.installmentToBePaidNumber}
                      dueDate={credit.installmentToBePaidExpirationDate}
                      onPressCredit={() => goToPayCredit(credit)}
                      existsInstallmentDue={credit.existsInstallmentDue}
                    />
                  )
                })
              ) : (
                <PaySkeleton height={144} amount={2}/>
              )
          }
        </BoxView>
      </PaysTemplate>
    </>
  )
}

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    disclaimerContainer: {
      borderRadius: SIZES.XS
    },
    disclaimerIcon: {
      padding: SIZES.XXS,
      marginHorizontal: SIZES.XS,
    },
    disclaimerText: {
      width: Dimensions.get('window').width - SIZES.MD * 7,
    },
  });

  return stylesBase;
};