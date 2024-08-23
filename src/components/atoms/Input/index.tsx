import React, {ReactNode} from 'react';
import {
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextStyle,
  TextInputKeyPressEventData,
  TextInputProps,
  View,
  ViewStyle,
  Platform,
  Text,
} from 'react-native';
import {FontSizes, FontTypes} from '@theme/fonts';
import {Colors} from '@theme/colors';
import Icon from '@atoms/Icon';
import {SEPARATOR_BASE} from '@theme/metrics';

export interface InputProps {
  rigthComponent?: ReactNode;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  value: string;
  placeholder?: string;
  haveError?: boolean;
  errorMessage?: string;
  maxLength?: number;
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
  errorLeft = false,
}: InputProps) => {
  const styles = getStyles(haveError);

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
          placeholderTextColor={Colors.Placeholder}
          maxLength={maxLength}
          keyboardType={keyboardType}
          onChangeText={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyPress={onKeyPress}
          secureTextEntry={secureTextEntry}
          contextMenuHidden={contextMenuHidden}
          style={{...styles.input, ...styleInput}}
        />
        {rigthComponent}
        {haveError && rigthComponent === undefined && (
          <Icon
            name="exclamation-circle"
            size="tiny"
            fill={Colors.Error}
            style={{alignSelf: 'center', marginRight: 12}}
          />
        )}
      </View>
      {!errorLeft && haveError && errorMessage && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}
    </View>
  );
};

const getStyles = (haveError: boolean) => {
  const stylesBase = StyleSheet.create({
    box: {
      borderRadius: 5,
      borderWidth: 1.5,
      flexDirection: 'row',
      borderColor: haveError ? Colors.Error : Colors.Border,
    },
    input: {
      flex: 1,
      height: 8 * 6,
      padding: SEPARATOR_BASE,
      fontSize: 16,
      color: Colors.Paragraph,
      fontWeight: Platform.OS === 'android' ? 'normal' : 'bold',
      fontFamily:
        Platform.OS === 'android'
          ? FontTypes.AmorSansProBold
          : FontTypes.AmorSansPro,
    },
    errorMessage: {
      marginTop: SEPARATOR_BASE * 0.5,
      fontSize: 14,
      color: Colors.Error,
    },
  });

  return stylesBase;
};

export default React.forwardRef<TextInput, InputProps>((props, ref) => (
  <Input {...props} forwardedRef={ref} />
));
