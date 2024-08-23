/* eslint-disable react-native/no-inline-styles */
import Icon from '@atoms/Icon';
import TextCustom from '@atoms/extra/TextCustom';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import moment from 'moment';
import React, {useRef} from 'react';
import {
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {convertToCurrency} from '@utils/convertCurrency';
import CurrencyInput from 'react-native-currency-input';
import {FONTS} from '@theme/fonts';

interface Props {
  expiredAt: Date;
  debtNumber: string;
  amount: number;
  isChecked: boolean;
  isPartialChecked?: boolean;
  onToggle: (isChecked: boolean) => void;
  onPartialToogle?: (isChecked: boolean) => void;
  isDisabled?: boolean;
  allowPartialPayment?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  partialValue?: number;
  onPartialValueChange?: (val: number) => void;
}

const DebtItem = ({
  amount,
  debtNumber,
  expiredAt,
  isChecked,
  onToggle,
  onPartialToogle,
  isDisabled = false,
  allowPartialPayment,
  isPartialChecked,
  hasError,
  errorMessage,
  partialValue,
  onPartialValueChange,
}: Props) => {
  let fechaFormatted = moment(expiredAt)
    .format('DD MMM YYYY')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/ /g, '\u00A0');
  const amountRef = useRef<TextInput>(null);
  return (
    <View>
      <View
        style={{
          borderRadius: SIZES.XS,
          borderWidth: 1,
          borderColor:
            isChecked && !isDisabled
              ? COLORS.Primary.Medium
              : COLORS.Neutral.Medium,
        }}>
        <TouchableOpacity
          disabled={isDisabled}
          onPress={() => onToggle(!isChecked)}
          style={{
            paddingHorizontal: SIZES.MD,
            paddingVertical: SIZES.LG,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{marginRight: 12}}>
            {!isDisabled && (
              <>
                {isChecked === false && (
                  <Icon
                    iconName="icon_check_unchecked"
                    size={16}
                    color={COLORS.Neutral.Dark}
                  />
                )}
                {isChecked === true && (
                  <Icon
                    iconName="icon_check_checked"
                    size={16}
                    color={COLORS.Primary.Medium}
                  />
                )}
              </>
            )}
            {isDisabled && (
              <Icon
                iconName="icon_check_disabled"
                size={16}
                color={COLORS.Neutral.Dark}
              />
            )}
          </View>
          <View
            style={{
              flexGrow: 1,
              flexShrink: 1,
              paddingRight: 8,
            }}>
            <TextCustom
              style={{marginBottom: SIZES.XS / 2}}
              ellipsizeMode="tail"
              numberOfLines={2}
              variation="h4"
              color="neutral-darkest"
              lineHeight="tight">
              Vence {fechaFormatted}
            </TextCustom>
            <TextCustom
              ellipsizeMode="tail"
              numberOfLines={1}
              variation="h6"
              color="neutral-dark"
              lineHeight="tight">
              Nº recibo {debtNumber}
            </TextCustom>
          </View>
          <TextCustom
            style={{marginBottom: SIZES.XS / 2}}
            variation="h4"
            color={isPartialChecked ? 'neutral-dark' : 'neutral-darkest'}
            lineHeight="tight">
            S/ {convertToCurrency(amount)}
          </TextCustom>
        </TouchableOpacity>

        {allowPartialPayment && isChecked ? (
          <View
            style={{
              borderTopColor: '#EFEFEF',
              borderTopWidth: 1,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                paddingLeft: SIZES.MD + 12 + 16,
                paddingVertical: SIZES.LG,
                flexDirection: 'row',
                flexGrow: isPartialChecked ? 0 : 1,
                flexShrink: 1,
                paddingRight: 8,
                alignItems: 'center'
              }}
              onPress={() => {
                if (onPartialToogle) {
                  onPartialToogle(!isPartialChecked);
                }
              }}>
              <View style={{marginRight: 12}}>
                {!isPartialChecked && (
                  <Icon
                    iconName="icon_check_unchecked"
                    size={16}
                    color={COLORS.Neutral.Dark}
                  />
                )}
                {isPartialChecked && (
                  <Icon
                    iconName="icon_check_checked"
                    size={16}
                    color={COLORS.Primary.Medium}
                  />
                )}
              </View>
              <TextCustom
                style={{
                  flexShrink: 1,
                }}
                ellipsizeMode="tail"
                numberOfLines={2}
                variation="h4"
                color="neutral-darkest"
                lineHeight="tight">
                Pagar monto parcial
              </TextCustom>
            </TouchableOpacity>
            {isPartialChecked && (
              <TouchableWithoutFeedback
                onPress={() => {
                  amountRef.current?.focus();
                }}>
                <View
                  style={{
                    flexGrow: 1,
                    flexShrink: 0,
                    paddingHorizontal: SIZES.MD,
                    paddingVertical: SIZES.LG,
                  }}>
                  <CurrencyInput
                    ref={amountRef}
                    editable={isPartialChecked}
                    prefix={'S/ '}
                    value={partialValue ?? 0}
                    onChangeValue={val => {
                      if (onPartialValueChange) {
                        onPartialValueChange(val ?? 0);
                      }
                    }}
                    placeholder={'S/ 0.00'}
                    delimiter=","
                    separator="."
                    precision={2}
                    focusable={true}
                    maxLength={19}
                    style={{
                      padding: 0,
                      margin: 0,
                      textAlign: 'right',
                      borderBottomColor: hasError ? '#E42525' : '#97A3B6',
                      color: hasError
                        ? '#E42525'
                        : partialValue === undefined || partialValue === 0
                        ? '#697385'
                        : '#222D42',
                      borderBottomWidth: 1,
                      fontFamily: FONTS.Bree,
                      fontSize: 16,
                      fontWeight: '500',
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        ) : null}
      </View>
      {hasError && errorMessage ? (
        <TextCustom
          text={errorMessage}
          variation="p5"
          weight="normal"
          color="error-medium"
          style={{marginTop: 8}}
        />
      ) : null}
    </View>
  );
};

export default DebtItem;
