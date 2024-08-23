import React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputFocusEventData,
  TextStyle,
} from 'react-native';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {Colors} from '@theme/colors';
import {FontSizes, FontTypes} from '@theme/fonts';

interface InputCodeProps {
  quantity: number;
  value: string;
  haveError?: boolean;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onChangeText: (text: string) => void;
}

const InputCode = ({
  quantity,
  value,
  haveError = false,
  onBlur,
  onChangeText,
}: InputCodeProps) => {
  const styles = getStyles(haveError);
  const ref = useBlurOnFulfill({value, cellCount: quantity});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: onChangeText,
  });

  return (
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
  );
};

const getStyles = (haveError: boolean) => {
  let cell: TextStyle = {
    color: Colors.Paragraph,
  };

  if (haveError) {
    cell.borderColor = Colors.Primary;
  } else {
    cell.borderColor = Colors.Border;
  }

  const stylesBase = StyleSheet.create({
    codeFieldRoot: {},
    cell: {
      width: 40,
      height: 8 * 6,
      fontFamily: FontTypes.AmorSansPro,
      fontSize: FontSizes.Paragraph,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: Colors.Border,
      textAlign: 'center',
      lineHeight: FontSizes.Paragraph * 2.5,
      ...cell,
    },
    focusCell: {
      borderColor: Colors.Border,
      ...cell,
    },
  });

  return stylesBase;
};

export default InputCode;
