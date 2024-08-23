import React, {ReactNode, useCallback, useRef, useState} from 'react';
import {
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextStyle,
  TextInputKeyPressEventData,
  View,
  ViewStyle,
  Platform,
  Text,
} from 'react-native';

import Icon from '@atoms/Icon';
import {COLORS} from '@theme/colors';
import {FONTS, FONTS_LINE_HEIGHTS_FACTOR, FONT_SIZES} from '@theme/fonts';
import {SIZES} from '@theme/metrics';
import TextCustom from '../TextCustom';
import Separator from '../Separator';

export interface InputProps {
  rigthComponent?: ReactNode;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  value: string;
  placeholder?: string;
  haveError?: boolean;
  errorMessage?: string;
  maxLength?: number;
  hasCounter?: boolean;
  keyboardType?: KeyboardTypeOptions;
  style?: ViewStyle;
  styleInput?: TextStyle;
  forwardedRef?: React.ForwardedRef<TextInput>;
  secureTextEntry?: boolean;
  editable?: boolean;
  selectTextOnFocus?: boolean;
  contextMenuHidden?: boolean;
  onChange: (text: string) => void;
  onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  errorLeft?: boolean;
}

const Input = ({
  autoCapitalize = 'sentences',
  value,
  placeholder,
  haveError = false,
  hasCounter = false,
  errorMessage,
  maxLength,
  keyboardType,
  style,
  styleInput,
  forwardedRef,
  secureTextEntry,
  rigthComponent,
  contextMenuHidden,
  onKeyPress,
  onChange,
  onBlur,
  editable,
  selectTextOnFocus,
  onFocus,
}: InputProps) => {
  const [showFocusedBorder, setShowFocusedBorder] = useState<boolean>(false);
  const styles = getStyles(haveError,showFocusedBorder);

  const showErrorMessage = haveError && errorMessage;

  return (
    <View style={style}>
      <View style={{...styles.box}}>
        <TextInput
          selectTextOnFocus={selectTextOnFocus}
          editable={editable}
          autoCapitalize={autoCapitalize}
          ref={forwardedRef}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={COLORS.Neutral.Dark}
          maxLength={maxLength}
          keyboardType={keyboardType}
          onChangeText={onChange}
          onBlur={(e) => {
            setShowFocusedBorder(false);
            if(onBlur !== undefined)onBlur(e);
          }}
          onFocus={(e) => {
            setShowFocusedBorder(true);
            if(onFocus !== undefined)onFocus(e);
          }}
          onKeyPress={onKeyPress}
          secureTextEntry={secureTextEntry}
          contextMenuHidden={contextMenuHidden}
          style={{...styles.input, ...styleInput}}
        />
        {rigthComponent !== undefined && (
          <>
            <View style={styles.iconWrapper}>{rigthComponent}</View>
          </>
        )}
      </View>
      {(showErrorMessage || hasCounter) && (
        <>
          <Separator size={SIZES.XS} />
          <View style={styles.messageContainer}>
            {showErrorMessage ? (
              <TextCustom
                variation="p5"
                color="error-medium"
                lineHeight="tight">
                {errorMessage}
              </TextCustom>
            ) : (
              <View />
            )}
            {hasCounter && (
              <TextCustom
                style={{alignSelf: 'flex-end'}}
                variation="p6"
                weight="bold"
                align="right"
                color="neutral-darkest"
                lineHeight="tight">
                {value.length}/{maxLength}
              </TextCustom>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const getStyles = (haveError: boolean,showFocusedBorder: boolean) => {
  let borderColor: string = COLORS.Neutral.Medium;

  if(haveError)borderColor = COLORS.Error.Medium;
  else if(showFocusedBorder) borderColor = COLORS.Neutral.Darkest;

  const stylesBase = StyleSheet.create({
    box: {
      borderRadius: 4,
      borderWidth: 1,
      flexDirection: 'row',
      borderColor,
    },
    input: {
      flex: 1,
      paddingHorizontal: SIZES.MD,
      paddingVertical: SIZES.XS * 2.5,
      fontSize: FONT_SIZES.MD,
      color: COLORS.Neutral.Darkest,
      fontFamily: FONTS.AmorSansPro,
      lineHeight: FONT_SIZES.MD * FONTS_LINE_HEIGHTS_FACTOR.TIGHT
    },
    iconWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SIZES.MD,
    },
    messageContainer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
  });

  return stylesBase;
};

export default React.forwardRef<TextInput, InputProps>((props, ref) => (
  <Input {...props} forwardedRef={ref} />
));
