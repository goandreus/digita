import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import TextCustom from '@atoms/extra/TextCustom';
import SimpleCurrencyInput from 'react-native-currency-input';
import {Currency} from '@features/userInfo';
import {COLORS} from '@theme/colors';
import {FONTS} from '@theme/fonts';
import {SIZES} from '@theme/metrics';

interface CurrencyInput {
  initialValue: number | null;
  amountValue: number | null;
  integerDigitsAmount?: number;
  currency: Currency;
  onChangeValue: (value: number | null) => void;
  onChangeText: (text: string) => void;
  editable: boolean;
  maxAmountSolesText?: string;
  maxAmountDollarsText?: string;
  maxAmountSolesNumber?: number;
  maxAmountDollarsNumber?: number;
  design?: 'normal' | 'tight';
  align?: 'center' | 'left' | 'right';
  alignErrorText?: 'center' | 'left' | 'right';
  newErrorText?: boolean;
}

const CurrencyInput = ({
  initialValue,
  amountValue,
  integerDigitsAmount = 5,
  currency,
  onChangeValue,
  onChangeText,
  editable,
  maxAmountSolesText = '10,000.00',
  maxAmountDollarsText = '3,000.00',
  maxAmountSolesNumber = 10000,
  maxAmountDollarsNumber = 3000,
  design = 'normal',
  align = 'center',
  alignErrorText = 'center',
  newErrorText,
}: CurrencyInput) => {
  const digitsAmount = [9, 99, 999, 9999, 99999, 999999]
  const styles = getStyles(
    amountValue,
    currency,
    initialValue,
    maxAmountSolesNumber,
    maxAmountDollarsNumber,
    design,
  );
  return (
    <View style={styles.container}>
      <TextCustom
        text="Monto"
        variation="h4"
        weight="normal"
        color="neutral-darkest"
      />
      <SimpleCurrencyInput
        textAlign={align}
        style={styles.input}
        value={amountValue}
        onChangeValue={onChangeValue}
        onChangeText={onChangeText}
        prefix={`${currency} `}
        delimiter=","
        separator="."
        precision={2}
        selectionColor={COLORS.Neutral.Dark}
        placeholder={`${currency} 00.00`}
        placeholderTextColor={COLORS.Neutral.Dark}
        maxValue={digitsAmount[integerDigitsAmount-1] ?? 99999}
        editable={editable}
      />

      {amountValue &&
      initialValue &&
      amountValue > initialValue &&
      initialValue <
        (currency === 'S/' ? maxAmountSolesNumber : maxAmountDollarsNumber) &&
      amountValue >= 1 &&
      amountValue <=
        (currency === 'S/' ? maxAmountSolesNumber : maxAmountDollarsNumber) ? (
        <TextCustom
          align={alignErrorText}
          variation="p4"
          text={ newErrorText ? 'Saldo insuficiente para esta operación' : 'Saldo insuficiente para esta transferencia'}
          color="error-medium"
          weight="bold"
        />
      ) : null}
      {amountValue && amountValue < 1 ? (
        <TextCustom
          align={alignErrorText}
          variation="p4"
          text={ newErrorText ? `El monto mínimo es ${currency} 1.00` : `Monto mínimo ${currency} 1.00`}
          color="error-medium"
          weight="bold"
        />
      ) : null}
      {amountValue &&
      amountValue > maxAmountSolesNumber &&
      currency === 'S/' ? (
        <TextCustom
          align={alignErrorText}
          variation="p4"
          text={ newErrorText
            ? `El monto máximo por operación es ${currency} ${maxAmountSolesText}` 
            : `Monto máximo ${currency} ${maxAmountSolesText}`}
          color="error-medium"
          weight="bold"
        />
      ) : null}
      {amountValue &&
      amountValue > maxAmountDollarsNumber &&
      currency === '$' ? (
        <TextCustom
          align={alignErrorText}
          variation="p4"
          text={ newErrorText
            ? `El monto máximo por operación es ${currency} ${maxAmountDollarsText}` 
            : `Monto máximo ${currency} ${maxAmountDollarsText}`}
          color="error-medium"
          weight="bold"
        />
      ) : null}
    </View>
  );
};

const getStyles = (
  amountValue: number | null,
  currency: string,
  initialValue: number | null,
  maxAmountSolesNumber: number,
  maxAmountDollarsNumber: number,
  design: 'normal' | 'tight',
) => {
  const stylesBase = StyleSheet.create({
    container: {
      marginTop: 36,
    },
    input: {
      paddingRight: 12,
      marginTop: (design === 'normal') ? SIZES.XS * 2 : SIZES.XXS,
      paddingVertical: (design === 'normal') ? undefined : 0,
      marginBottom: Platform.OS === 'ios' ? 8 : 0,
      fontSize: SIZES.XS * 5,
      color:
        amountValue &&
        (amountValue < 1 ||
          (amountValue > maxAmountSolesNumber && currency === 'S/') ||
          (amountValue > maxAmountDollarsNumber && currency === '$') ||
          (initialValue && amountValue > initialValue))
          ? COLORS.Error.Medium
          : COLORS.Neutral.Darkest,
      fontFamily: FONTS.AmorSansProBold,
    },
  });

  return stylesBase;
};

export default CurrencyInput;
