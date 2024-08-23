/* eslint-disable react-hooks/exhaustive-deps */
import React, {useMemo} from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import Icon from '@atoms/Icon';
import BoxView from '@atoms/BoxView';
import {SIZES} from '@theme/metrics';
import {indexStyles as styles} from '../styles';
import {useLineSimulationContext} from '../context';
import {CurrencyInputV2} from '@atoms/extra/CurrencyInputV2';
import PickerCheck from '@molecules/extra/PickerCheck';
import {QUOTAS_LIST} from '@global/lists';
import {TabList} from './tabList';
import {useUserInfo} from '@hooks/common';
import {toString} from 'lodash';

export const Content = () => {
  const {
    amountValue,
    limits,
    payDay,
    lineCredit,
    setAmountValue,
    setAmountValueText,
    setPayDay,
  } = useLineSimulationContext();
  const {userLineCredit} = useUserInfo();

  const textByAmount = (amount: string) =>
    userLineCredit?.deadlines.find(e => e.value === amount)?.name;

  const [minAmount, maxAmount] = useMemo(() => {
    return [
      textByAmount(toString(limits.minAmount)),
      limits.isMaxDeadline
        ? textByAmount(toString(limits.maxAmount))
        : lineCredit?.sAvailableCreditLineAmount,
    ];
  }, []);

  const errors = [
    {
      condition: amountValue ? amountValue < limits.minAmount : false,
      message: `Monto mínimo para desembolsar ${minAmount}.`,
    },
    {
      condition: amountValue ? amountValue > limits.maxAmount : false,
      message: `Monto máximo para desembolsar ${maxAmount}.`,
    },
  ];

  return (
    <>
      <BoxView
        pt={SIZES.XXS}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.topContainer}>
        <BoxView>
          <TextCustom
            text={`Tienes disponible ${lineCredit?.sAvailableCreditLineAmount}`}
            variation="h4"
            weight="normal"
            lineHeight="tight"
            color="secondary-darkest"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={`Vigencia ${lineCredit?.sEffectiveDate}`}
            variation="h6"
            weight="normal"
            lineHeight="tight"
            color="neutral-medium"
          />
        </BoxView>
        <Icon name="coin-shiny" size={80} />
      </BoxView>

      <Separator size={53} />

      <TextCustom
        align="center"
        text="¿Cuánto necesitas?"
        variation="h4"
        weight="normal"
        lineHeight="tight"
        color="neutral-darkest"
      />

      <Separator type="small" />

      <CurrencyInputV2
        align="center"
        amountValue={amountValue}
        currency="S/"
        onChangeValue={setAmountValue}
        onChangeText={setAmountValueText}
        editable
        errors={errors}
      />

      <Separator type="large" />

      <TextCustom
        text="¿Qué fecha te gustaría pagar? "
        variation="h4"
        weight="normal"
        lineHeight="tight"
        color="neutral-darkest"
      />

      <Separator type="small" />

      <PickerCheck
        seletedItem={payDay}
        title="Elige un día de pago"
        subtitle="Esto podría generar un cambio en el cálculo de tu cuota."
        data={QUOTAS_LIST}
        onSelect={quota => setPayDay(quota)}
      />

      <Separator type="large" />

      <TextCustom
        variation="h4"
        weight="normal"
        lineHeight="tight"
        color="neutral-darkest">
        Elige tus cuotas
        <TextCustom
          text=" (Entre 18 y 06)"
          variation="h4"
          weight="normal"
          lineHeight="tight"
          color="neutral-dark"
        />
      </TextCustom>

      <Separator size={10} />

      <TabList />

      <Separator type="small" />
    </>
  );
};
