import React from 'react';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import Picker from '@molecules/extra/Picker';
import Input from '@atoms/extra/Input';
import CurrencyInput from '@atoms/extra/CurrencyInput';
import {useOriginAccounts} from '../hooks/useOriginAccounts';
import {formatPhoneNumber} from '@helpers/NumberHelper';

export const FirstStep = ({data}: any) => {
  const {values, form, onSetField, originAccount, setOriginAccountUId} = data;
  const {allSavingsFilter} = useOriginAccounts();
  const inputProps = form.inputProps('phoneNumberBim');
  inputProps.value = formatPhoneNumber(inputProps.value);

  return (
    <>
      <TextCustom
        text="Cuenta origen"
        variation="h4"
        weight="normal"
        color="neutral-darkest"
      />
      <Separator type="x-small" />
      {allSavingsFilter.length > 0 && (
        <Picker
          text="Elige una cuenta"
          data={allSavingsFilter}
          onSelect={value => setOriginAccountUId(value.operationUId)}
        />
      )}
      <Separator type="medium" />
      <TextCustom
        text="Número de celular"
        variation="h4"
        weight="normal"
        color="neutral-darkest"
      />
      <Separator type="x-small" />
      <Input
        maxLength={11}
        keyboardType="decimal-pad"
        placeholder="Ingresa el número de celular"
        {...inputProps}
      />
      <CurrencyInput
        align="left"
        amountValue={values.amount}
        currency={originAccount?.currency!}
        initialValue={originAccount?.balance!}
        editable={!form.errors.phoneNumberBim}
        onChangeValue={value => onSetField('amount', value)}
        onChangeText={text => onSetField('formatAmount', text)}
      />
    </>
  );
};
