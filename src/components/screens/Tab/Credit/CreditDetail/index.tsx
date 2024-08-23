import React from 'react';
import {Content} from './components/content';
import GenericTemplate from '@templates/extra/GenericTemplate';
import {DebtModal} from './components/debtModal';
import {useCreditDetail} from './hook';
import Skeleton from '@molecules/Skeleton';
import {View} from 'react-native';
import {indexStyles as styles} from './styles';
import {CreditsDetailProps} from '@navigations/types';

export const CreditDetail = ({navigation, route}: CreditsDetailProps) => {
  const {showModal, creditDetail, setShowModal, goBack, handlePayQuota} =
    useCreditDetail({
      route,
      navigation,
    });

  const {currency, productName} = route.params;

  return (
    <>
      <GenericTemplate
        headerTitle="Detalle de crédito"
        hasExtraTopPadding={false}
        hasPadding={false}
        canGoBack={navigation.canGoBack()}
        isFlex
        goBack={goBack}>
        {creditDetail ? (
          <Content
            name={productName}
            data={creditDetail}
            sumary={
              <Content.SumaryCard
                currentDebt={creditDetail.sindividualAmountBalanceCapital}
                totalAmount={creditDetail.sindividualCapitalOriginal}
                currency={currency}
                quota={creditDetail.individualFeeNumber - 1}
                quotasNumber={creditDetail.individualTotalFeeNumber}
              />
            }
            payCard={
              <Content.PayCard
                amount={creditDetail.sindividualInstallmentAmount}
                currency={currency}
                isDuePay={creditDetail.individualOverdueAmount !== 0}
                dueDate={creditDetail.expirationDateString}
                onPressPay={handlePayQuota}
              />
            }
          />
        ) : (
          <Skeleton timing={600}>
            <View style={{...styles.skeleton, height: 40}} />
            <View style={{...styles.skeleton, height: 200}} />
            <View style={{...styles.skeleton, height: 200}} />
            <View style={{...styles.skeleton, height: 60}} />
          </Skeleton>
        )}
      </GenericTemplate>

      <DebtModal isOpen={showModal} onPress={() => setShowModal(false)} />
    </>
  );
};
