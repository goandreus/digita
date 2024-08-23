import {StyleSheet} from 'react-native';
import React from 'react';
import SimpleCurrencyInput from 'react-native-currency-input';
import {Currency} from '@features/userInfo';
import {SIZES} from '@theme/metrics';
import {FONTS} from '@theme/fonts';
import {COLORS} from '@theme/colors';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';

export interface IErrorCurrencyInput {
  condition: boolean;
  message: string;
}

interface Props {
  amountValue: number | null;
  align?: 'center' | 'left' | 'right';
  currency: Currency;
  integerDigitsAmount?: number;
  editable: boolean;
  errors?: IErrorCurrencyInput[];
  onChangeValue: (value: number | null) => void;
  onChangeText: (text: string) => void;
}

export const CurrencyInputV2 = ({
  align,
  amountValue,
  currency,
  editable,
  errors,
  integerDigitsAmount = 5,
  onChangeValue,
  onChangeText,
}: Props) => {
  const digitsAmount = [9, 99, 999, 9999, 99999, 999999];

  const styles = getStyles(
    errors?.map(error => error.condition).includes(true) ?? false,
  );

  return (
    <>
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
        maxValue={digitsAmount[integerDigitsAmount - 1] ?? 99999}
        editable={editable}
      />
      <Separator type="x-small" />

      {errors?.map((error, index) => {
        return error.condition ? (
          <TextCustom
            key={`error-${index}`}
            align="center"
            text={error.message}
            variation="p5"
            weight="normal"
            color="error-medium"
            lineHeight="tight"
          />
        ) : null;
      })}
    </>
  );
};

const getStyles = (isError: boolean) => {
  return StyleSheet.create({
    container: {},
    input: {
      fontSize: SIZES.XS * 5,
      paddingVertical: SIZES.LG,
      borderRadius: SIZES.XS,
      borderWidth: 1,
      borderColor: /* isError ? COLORS.Error.Medium : */ COLORS.Neutral.Light,
      fontFamily: FONTS.Bree,
      color: isError ? COLORS.Error.Medium : COLORS.Neutral.Darkest,
      backgroundColor: COLORS.Background.Light,
    },
  });
};
