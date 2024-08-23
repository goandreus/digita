import React from 'react';
import { Platform, StyleSheet, View } from "react-native"
import SimpleCurrencyInput from 'react-native-currency-input'
import { FontTypes } from "@theme/fonts"
import { Currency } from "@features/userInfo"
import { COLORS, Colors } from "@theme/colors"
import Separator from "@atoms/Separator"
import TextCustom from '@atoms/extra/TextCustom';

interface CurrencyInput {
    initialValue: number | null;
    amountValue: number | null;
    currency: Currency;
    onChangeValue: (value: number | null) => void;
    onChangeText: (text: string) => void;
    editable: boolean;
    maxAmountSolesText?: string;
    maxAmountSolesNumber?: number;
};

const CurrencyInput = ({
    initialValue,
    amountValue,
    currency,
    onChangeValue,
    onChangeText,
    editable,
    maxAmountSolesText= "10,000.00",
    maxAmountSolesNumber= 10000
}: CurrencyInput) => (
    <View style={{marginTop:36}}>
    <TextCustom text='Monto' variation='p4' color='neutral-darkest' weight='bold' />
    <SimpleCurrencyInput
      textAlign='center'
      style={getStyles(amountValue,currency,initialValue, maxAmountSolesNumber).input}
      value={amountValue}
      onChangeValue={onChangeValue}
      onChangeText={onChangeText}
      prefix={`${currency} `}
      delimiter=","
      separator="."
      precision={2}
      selectionColor={Colors.Disabled}
      placeholder={`${currency} 00.00`}
      placeholderTextColor={Colors.Disabled}
      maxValue={100000}
      editable={editable}
    />
    <Separator type='xx-small' />
    {amountValue && initialValue && amountValue > initialValue ? <TextCustom align='center' variation='p4' text={'Saldo insuficiente para esta transferencia'} color='error-medium' weight='bold' /> : null}
    {amountValue && amountValue < 1 ? <TextCustom align='center' variation='p4' text={`Monto mínimo ${currency} 1.00`} color='error-medium' weight='bold' /> : null}
    {amountValue &&  amountValue > maxAmountSolesNumber  && currency === 'S/' ? <TextCustom align='center' variation='p4' text={`Monto Máximo ${currency} ${maxAmountSolesText}`} color='error-medium' weight='bold' /> : null}
    {amountValue &&  amountValue > 3000 && currency === '$' ? <TextCustom align='center' variation='p4' text={`Monto Máximo ${currency} 3,000.00`} color='error-medium' weight='bold' /> : null}
  </View>
)

const getStyles = (amountValue: number | null,currency:string,initialValue:number|null, maxAmountSolesNumber: number) => {
    const stylesBase = StyleSheet.create({
        input:{
            alignSelf:'center',
            paddingRight:12,
            fontWeight:Platform.OS === 'android' ? 'normal' : 'bold',
            fontSize:45,
            color:amountValue && (amountValue < 1 || (amountValue > maxAmountSolesNumber && currency === 'S/') || amountValue > 3000 && currency === '$' || (currency && initialValue && amountValue > initialValue)) ? '#ED001C' : Colors.Paragraph,
            fontFamily:Platform.OS === 'android' ? FontTypes.AmorSansProBold : FontTypes.AmorSansPro,
            borderBottomColor:amountValue && (amountValue < 1 || (amountValue > maxAmountSolesNumber && currency === 'S/') || amountValue > 3000 && currency === '$' || (initialValue && amountValue > initialValue)) ? '#ED001C' : Colors.Disabled
        },
});
  
    return stylesBase;
  };

export default CurrencyInput