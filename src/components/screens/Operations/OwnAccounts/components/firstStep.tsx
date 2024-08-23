import React from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import CurrencyInput from '@atoms/extra/CurrencyInput';
import {IFormData} from '../hooks/useOwnAccounts';
import Picker from '@molecules/extra/Picker';
import {SIZES} from '@theme/metrics';

interface Props {
  data: IFormData;
}

export const FirstStep = ({data}: Props) => {
  const {
    originSavings,
    destinationSavings,
    amountValue,
    originAccount,
    setAmountValue,
    setAmountValueText,
    setOriginAccountUId,
    setDestinationAccountUId,
  } = data;

  return (
    <>
      <TextCustom
        text="Cuenta origen"
        variation="h4"
        weight="normal"
        color="neutral-darkest"
      />
      <Separator type="x-small" />
      {originSavings && originSavings.length > 0 && (
        <Picker
          text="Elige una cuenta"
          data={originSavings}
          onSelect={value => setOriginAccountUId(value.operationUId)}
        />
      )}

      {destinationSavings && destinationSavings.length > 0 && (
        <>
          <Separator size={SIZES.XS * 5} />
          <TextCustom
            text="Cuenta destino"
            variation="h4"
            weight="normal"
            color="neutral-darkest"
          />
          <Separator type="x-small" />

          <Picker
            text="Elige una cuenta"
            data={destinationSavings}
            onSelect={value => setDestinationAccountUId(value.operationUId)}
          />
          <CurrencyInput
            editable
            align="left"
            amountValue={amountValue}
            currency={originAccount?.currency!}
            initialValue={originAccount?.balance ?? null}
            onChangeValue={value => setAmountValue(value)}
            onChangeText={text => setAmountValueText(text)}
          />
        </>
      )}
      <Separator type="large" />
    </>
  );
};
