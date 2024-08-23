import BoxView from '@atoms/BoxView';
import Button from '@atoms/extra/Button';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import {COLORS} from '@theme/colors';
import {FONTS} from '@theme/fonts';
import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import {SummaryInfo} from './summaryInfo';

interface IProps {
  amountToPay: number;
  currencyToPay: string;
  isPayingOtherAmount: boolean;
  creditProductName: string;
  savingProductName: string;
  accountCode: string;
  accountNumber: string;
  amountInstallments?: number;
  installments?: string;
  onPay: () => void;
}

export const PaymentSummary: FC<IProps> = ({
  amountToPay,
  currencyToPay,
  isPayingOtherAmount,
  creditProductName,
  savingProductName,
  accountCode,
  accountNumber,
  amountInstallments,
  installments,
  onPay,
}) => {
  return (
    <>
      <BoxView mb={isPayingOtherAmount ? 128 : 64}>
        <BoxView>
          <TextCustom
            text="Total a pagar"
            variation="h4"
            weight="normal"
            color="neutral-darkest"
          />
          <Separator type="xx-small" />
          <CurrencyInput
            prefix={`${currencyToPay} `}
            value={amountToPay}
            delimiter=","
            separator="."
            precision={2}
            style={styles.amount}
          />
        </BoxView>
        <Separator type="large" />

        <SummaryInfo
          title={'Crédito'}
          productNameOrInstallments={creditProductName}
          accountCode={accountCode}
        />
        <SummaryInfo
          title={'Cuenta de origen'}
          productNameOrInstallments={savingProductName}
          accountCode={accountNumber}
        />
        {!isPayingOtherAmount && (
          <SummaryInfo
            title={'Cuota'}
            productNameOrInstallments={`${installments} de ${amountInstallments}`}
          />
        )}
      </BoxView>

      {/* <View style={{marginTop: 40, paddingHorizontal: 24}}> */}
      <BoxView mx={24}>
        <Button
          onPress={() => {
            onPay();
          }}
          loading={false}
          orientation="horizontal"
          type="primary"
          text="Pagar"
          disabled={false}
        />
      </BoxView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  amount: {
    marginTop: -8,
    fontFamily: FONTS.Bree,
    fontSize: 32,
    padding: 0,
    color: COLORS.Neutral.Darkest,
  },
});
