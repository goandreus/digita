import {View} from 'react-native';
import React from 'react';
import BoxView from '@atoms/BoxView';
import {indexStyles as styles} from '../styles';
import TextCustom from '@atoms/extra/TextCustom';
import {ProductItem} from './productItem';
import Separator from '@atoms/extra/Separator';
import {useLoading, useUserInfo} from '@hooks/common';
import {useNavigation} from '@react-navigation/native';

export const MainContent = () => {
  const {userCredits} = useUserInfo();
  const navigation = useNavigation();
  const {setTargetScreen} = useLoading();

  return (
    <>
      {userCredits && userCredits?.individualCredits?.length > 0 ? (
        <BoxView>
          <TextCustom
            text="Mis créditos individuales"
            variation={'h4'}
            weight={'normal'}
            color={'primary-darkest'}
            lineHeight="tight"
          />
          <Separator type="small" />

          <View style={styles.listContainer}>
            {userCredits?.individualCredits?.map((credit, index) => (
              <ProductItem
                key={index}
                productName={credit.productName}
                text="Crédito desembolsado"
                currency={credit.currency}
                amount={credit.sDisbursedCapital}
                index={index}
                action={() => {
                  setTargetScreen({
                    screen: 'CreditsDetail',
                    from: 'MyCredits',
                  });
                  navigation.navigate('CreditsDetail2', {
                    status: credit.status,
                    productName: credit.productName,
                    advancePercentage: credit.advancePercentage,
                    disbursedCapital: credit.sDisbursedCapital,
                    disbursedCapitalAmount: credit.disbursedCapital,
                    currency: credit.currency,
                    accountNumber: credit.accountCode,
                    capitalCanceled: credit.sCapitalAmount,
                    capitalCanceledAmount: credit.capitalAmount,
                    isPunished: credit.isPunished,
                    type: 'Individual',
                  });
                }}
              />
            ))}
          </View>
          <Separator type="medium" />
        </BoxView>
      ) : null}

      {userCredits && userCredits.groupCredits?.length > 0 ? (
        <>
          <TextCustom
            text="Mis Créditos Grupales"
            variation={'h4'}
            weight={'normal'}
            color={'primary-darkest'}
            lineHeight="tight"
          />
          <Separator type="small" />
          <View style={styles.listContainer}>
            {userCredits?.groupCredits?.map((credit, index) => (
              <ProductItem
                key={index}
                isGroupAccount={true}
                productName={credit.productName}
                text="Crédito desembolsado"
                currency={credit.currency}
                amount={credit.sDisbursedCapital}
                index={index}
                action={() =>
                  navigation.navigate('GroupCreditDetail2', {
                    status: credit.status,
                    productName: credit.productName,
                    advancePercentage: credit.advancePercentage,
                    disbursedCapital: credit.sDisbursedCapital,
                    disbursedCapitalAmount: credit.disbursedCapital,
                    currency: credit.currency,
                    accountNumber: credit.accountCode,
                    capitalCanceled: credit.sCapitalAmount,
                    capitalCanceledAmount: credit.capitalAmount,
                    type: 'Grupal',
                  })
                }
              />
            ))}
          </View>
        </>
      ) : null}
    </>
  );
};
