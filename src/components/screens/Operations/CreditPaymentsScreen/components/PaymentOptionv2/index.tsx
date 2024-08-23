/* eslint-disable react-native/no-inline-styles */
import RadioButton from '@atoms/RadioButton';
import {FONTS, FontSizes, FontTypes} from '@theme/fonts';
import React, {FC, ReactNode, useEffect, useRef, useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import CurrencyInput from 'react-native-currency-input';

interface IProps {
  active: boolean;
  title: string | ReactNode;
  subtitle: string | ReactNode;
  disabled: boolean;
  hideRadioButton?: boolean;
  showInput?: boolean;
  currency: string;
  value?: number | null;
  maxValue?: number | null;
  error: boolean;
  onChangeValue?: (val: number | null) => void;
  onPress?: () => void;
}

const PaymentOptionV2: FC<IProps> = ({
  active,
  title,
  subtitle,
  disabled,
  hideRadioButton = false,
  showInput = false,
  currency = 'S/',
  value,
  maxValue,
  error = false,
  onChangeValue = () => {},
  onPress,
}) => {
  const [isActive, setIsActive] = useState(active);
  const [inputValue, setInputValue] = useState<number | null>(value ?? null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handlePressed = () => {
    setIsActive(true);
    if (onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      style={{
        ...styles.payment__container,
        ...(disabled
          ? {
              backgroundColor: '#F6F6F9',
            }
          : {}),
        opacity: disabled ? 0.5 : 1,
        ...(isActive
          ? {borderColor: error ? '#E42525' : '#A2004A', borderWidth: 1}
          : {borderColor: '#E3E8EF', borderWidth: 1}),
      }}
      onPress={() => {
        handlePressed();
      }}
      disabled={disabled}>
      {!hideRadioButton && (
        <View style={{marginRight: 16}}>
          {/* TODO: crear átomo radio button */}
          <RadioButton active={isActive} disabled />
        </View>
      )}
      <View>
        {typeof title === 'string' ? (
          <Text
            style={{
              ...styles.payment__text,
              marginBottom: 4,
            }}>
            {title}
          </Text>
        ) : (
          title
        )}

        {typeof subtitle === 'string' ? (
          <Text
            style={{
              ...styles.payment__text,
              marginBottom: 4,
              fontSize: 12,
              color: '#697385',
            }}>
            {subtitle}
          </Text>
        ) : (
          subtitle
        )}
      </View>
      <View
        style={{
          flex: 1,
          display: 'flex',
          marginLeft: 16,
          justifyContent: 'center',
          height: 40,
        }}>
        {showInput ? (
          <View
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
              height: 16,
            }}>
            <CurrencyInput
              ref={inputRef}
              prefix={`${currency} `}
              value={inputValue}
              maxValue={maxValue ?? undefined}
              onChangeValue={val => {
                setInputValue(val);
                onChangeValue(val);
              }}
              placeholder={`${currency} 0.00`}
              delimiter=","
              separator="."
              precision={2}
              focusable={true}
              style={{
                ...styles.inputAmount,
                borderBottomColor: error ? '#E42525' : '#97A3B6',
                color: error ? '#E42525' : '#222D42',
              }}
            />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

export default PaymentOptionV2;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  title: {
    fontFamily: FontTypes.Bree,
    fontWeight: '500',
    fontSize: 24,
    color: '#CA005D',
  },
  subtitle: {
    fontFamily: FontTypes.Bree,
    fontWeight: '500',
    fontSize: 16,
    color: '#222D42',
  },
  warningText: {
    fontFamily: FontTypes.AmorSansPro,
    fontWeight: '400',
    color: '#222D42',
    fontSize: 16,
  },
  payment__container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
    height: 80,
    borderWidth: 0,
    borderColor: '#97A3B6',
    borderStyle: 'solid',
    borderRadius: 8,
  },
  payment__container__debt: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#97A3B6',
    borderStyle: 'solid',
  },
  payment__text: {
    fontFamily: FontTypes.Bree,
    fontWeight: '500',
    fontSize: FontSizes.Button,
    letterSpacing: 0.01,
    color: '#222D42',
  },
  inputAmount: {
    textAlign: 'right',
    height: 16,
    borderBottomColor: 'gray',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    minWidth: 89,
    fontFamily: FONTS.Bree,
    fontWeight: '500',
    fontSize: 16,
    padding: 0,
  },
});
