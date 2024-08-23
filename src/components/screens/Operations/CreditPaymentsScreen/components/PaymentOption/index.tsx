/* eslint-disable react-native/no-inline-styles */
import RadioButton from '@atoms/RadioButton';
import {Colors} from '@theme/colors';
import {FontSizes, FontTypes} from '@theme/fonts';
import React, {FC, ReactNode, useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import * as Progress from 'react-native-progress';

interface IProps {
  active: boolean;
  title: string | ReactNode;
  subtitle: string | ReactNode;
  amountLabel?: string | ReactNode;
  amount: string | ReactNode;
  disabled: boolean;
  hideRadioButton?: boolean;
  showProgressBar?: boolean;
  progressBarValue?: number;
  onPress?: () => void;
}

const PaymentOption: FC<IProps> = ({
  active,
  title,
  subtitle,
  amountLabel,
  amount,
  disabled,
  hideRadioButton = false,
  showProgressBar = false,
  progressBarValue = 0,
  onPress,
}) => {
  const [isActive, setIsActive] = useState(active);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

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
          ? {borderColor: '#A2004A', borderWidth: 1}
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
        }}>
        {typeof amountLabel === 'string' ? (
          <Text
            style={{
              ...styles.payment__text,
              textAlign: 'right',
              fontSize: 12,
            }}>
            {amountLabel}
          </Text>
        ) : (
          amountLabel
        )}
        {typeof amount === 'string' ? (
          <Text
            style={{
              ...styles.payment__text,
              textAlign: 'right',
            }}>
            {amount}
          </Text>
        ) : (
          amount
        )}
        {showProgressBar ? (
          <View
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
            <Progress.Bar
              style={{
                backgroundColor: Colors.GrayBackground,
                borderColor: Colors.GrayBackground,
              }}
              progress={progressBarValue}
              height={1}
              width={89}
              color={'#FCCFCF'}
            />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

export default PaymentOption;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header__container: {
    backgroundColor: '#FFFFFF',
    shadowColor: '0px 2px 8px rgba(0, 0, 0, 0.15);',
    height: 56,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header__back: {
    position: 'absolute',
    top: 18,
    left: 19,
  },
  header__title: {
    color: '#222D42',
    fontFamily: FontTypes.Bree,
    fontSize: FontSizes.Paragraph,
    fontWeight: '500',
  },
  stepText: {
    fontFamily: FontTypes.Bree,
    fontWeight: '500',
    fontSize: 14,
    color: '#97A3B6',
    marginTop: 32,
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
});
