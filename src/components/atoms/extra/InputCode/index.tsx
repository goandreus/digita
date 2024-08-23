import React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputFocusEventData,
  TextStyle,
  View,
} from 'react-native';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {COLORS} from '@theme/colors';
import {FONTS, FONT_SIZES} from '@theme/fonts';
import TextCustom from '../TextCustom';
import Separator from '../Separator';
import { SIZES } from '@theme/metrics';

interface InputCodeProps {
  quantity: number;
  value: string;
  haveError?: boolean;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onChangeText: (text: string) => void;
  errorMessage?: string;
}

const InputCode = ({
  quantity,
  value,
  haveError = false,
  onBlur,
  onChangeText,
  errorMessage
}: InputCodeProps) => {
  const styles = getStyles(haveError,quantity);
  const ref = useBlurOnFulfill({value, cellCount: quantity});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: onChangeText,
  });

  return (
    <View style={styles.container}>
      <CodeField
        ref={ref}
        {...props}
        caretHidden={false}
        value={value}
        onChangeText={onChangeText}
        cellCount={quantity}
        rootStyle={styles.codeFieldRoot}
        onBlur={onBlur}
        keyboardType="numeric"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      {haveError && errorMessage && (
        <>
          <Separator size={SIZES.XS} />
          <TextCustom variation="p5" color="error-medium" lineHeight="tight">
            {errorMessage}
          </TextCustom>
        </>
      )}
    </View>
  );
};

const getStyles = (haveError: boolean,quantity: number) => {
  let cell: TextStyle = {
    color: COLORS.Neutral.Darkest,
    borderColor: COLORS.Neutral.Medium
  };

  if (haveError) {
    cell.borderColor = COLORS.Error.Medium;
  }

  const stylesBase = StyleSheet.create({
    container: {
      width: quantity * 44,
    },
    codeFieldRoot: {},
    cell: {
      width: 34,
      height: 44,
      fontFamily: FONTS.AmorSansPro,
      fontSize: FONT_SIZES.XL,
      lineHeight: FONT_SIZES.XL,
      paddingTop: 10,
      textAlign: 'center',
      borderWidth: 1,
      borderRadius: 5,
      ...cell,
    },
    focusCell: {
      ...cell,
      borderColor: haveError ? COLORS.Error.Medium : COLORS.Neutral.Darkest,
    },
  });

  return stylesBase;
};

export default InputCode;
