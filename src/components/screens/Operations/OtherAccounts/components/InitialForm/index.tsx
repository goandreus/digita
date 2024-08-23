import React from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import Picker from '@molecules/extra/Picker';
import Input from '@atoms/extra/Input';
import CurrencyInput from '@atoms/extra/CurrencyInput';
import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';
import {SIZES} from '@theme/metrics';
import {useOtherAccountsContext} from '../../contexts';
import {indexStyles as styles} from '../../styles';
import {COLORS} from '@theme/colors';
import FavoriteItem from '@molecules/extra/FavoriteItem';

interface Props {}

export const InitialForm = ({}: Props) => {
  const {
    defaultOpenPicker,
    setDefaultOpenPicker,
    originSavings,
    originAccount,
    initialForm,
    showFavoriteOperation,
    favorite,
  } = useOtherAccountsContext();

  const {values, form, onSetField} = initialForm;

  return (
    <>
      <TextCustom
        text="Cuenta origen"
        variation="h4"
        weight="normal"
        color="neutral-darkest"
      />
      <Separator type="x-small" />
      {originSavings.length > 0 && (
        <Picker
          defaultParams={{
            open: defaultOpenPicker,
            value: values.operationUId,
            onChange: () => setDefaultOpenPicker(false),
          }}
          text="Elige una cuenta"
          data={originSavings}
          onSelect={value => onSetField('operationUId', value.operationUId)}
        />
      )}
      <Separator type="medium" />
      <TextCustom
        text="Cuenta bancaria o CCI"
        variation="h4"
        weight="normal"
        color="neutral-darkest"
      />
      <Separator type="x-small" />
      {showFavoriteOperation ? (
        <FavoriteItem
          alias={favorite?.alias ?? ''}
          operationName={favorite?.operationName ?? ''}
        />
      ) : (
        <Input
          maxLength={20}
          keyboardType="decimal-pad"
          placeholder="Ingresa el número de cuenta"
          {...form.inputProps('destinationAccount')}
        />
      )}
      <CurrencyInput
        align="left"
        amountValue={values.amount}
        currency={originAccount?.currency!}
        initialValue={originAccount?.balance!}
        editable={values.destinationAccount.trim().length !== 0}
        onChangeValue={value => onSetField('amount', value)}
        onChangeText={text => onSetField('formatAmount', text)}
        maxAmountDollarsNumber={5000}
        maxAmountDollarsText="5,000.00"
      />
      <Separator type="large" />
      <BoxView
        flex={1}
        direction="row"
        align="center"
        background="warning-lightest"
        p={SIZES.MD}
        style={styles.containerInfo}>
        <Icon
          name="exclamation-triangle"
          size="small"
          fill={COLORS.Secondary.Dark}
          style={styles.icon}
        />
        <TextCustom
          style={styles.text}
          color="secondary-darkest"
          variation="h6"
          lineHeight="fair"
          weight="normal"
          text={
            'La moneda de la cuenta origen y destino deben ser las mismas para tener éxito.'
          }
        />
      </BoxView>
      <Separator type="medium" />
    </>
  );
};
