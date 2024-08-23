import React from 'react';
import Separator from '@atoms/extra/Separator';
import BoxView from '@atoms/BoxView';
import Checkbox from '@atoms/extra/Checkbox';
import {SIZES} from '@theme/metrics';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import {indexStyles as styles} from '../styles';

interface Props {
  terms: {
    declaration: boolean;
    setDeclaration: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export const FirstStep = ({terms}: Props) => {
  return (
    <>
      <Separator type="xx-small" />
      <TextCustom
        text="En esta cuenta desembolsaremos tu crédito"
        weight="normal"
        lineHeight="comfy"
        color="neutral-darkest"
        variation="h5"
      />
      <Separator type="medium" />
      <BoxView style={styles.box} background="background-light">
        <BoxView direction="row" align="center">
          <Icon name="coin-bank" size={56} />
          <BoxView ml={18}>
            <TextCustom
              variation="h5"
              text="Cuenta en soles"
              color="neutral-darkest"
              weight="normal"
            />
            <TextCustom
              variation="h5"
              text="Ahorro Emprendedor"
              size={18}
              color="neutral-darkest"
              weight="normal"
            />
          </BoxView>
        </BoxView>
        <Separator type="small" />
        <BoxView style={{width: 250}} direction="row">
          <Icon name="icon-tick" size={18} />
          <BoxView ml={8}>
            <TextCustom
              variation="h5"
              text="Sin costo de mantenimiento."
              color="neutral-darkest"
              weight="normal"
              lineHeight="fair"
            />
          </BoxView>
        </BoxView>
        <Separator type="x-small" />
        <BoxView style={{width: 250}} direction="row">
          <Icon name="icon-tick" size={18} />
          <BoxView ml={8}>
            <TextCustom
              variation="h5"
              text="Realiza retiros ilimitados y gratuitos en cajeros de la RED UNICARD."
              color="neutral-darkest"
              weight="normal"
              lineHeight="fair"
            />
          </BoxView>
        </BoxView>
      </BoxView>

      <Separator type="large" />

      <BoxView direction="row" align="flex-start" mb={SIZES.LG}>
        <Checkbox
          type="primary"
          size="small"
          value={terms.declaration}
          onChange={value => {
            terms.setDeclaration(value);
          }}
        />
        <BoxView flex={1} ml={SIZES.XS}>
          <TextCustom
            text="Declaro que nací en Perú, tengo domicilio fiscal en Perú y solo tributo en Perú."
            weight="normal"
            variation="h5"
            color="neutral-darkest"
            lineHeight="comfy"
          />
          <Separator type="x-small" />
          <TextCustom
            text="Si no cumples con algunos requisitos de la declaración, acércate a una agencia."
            weight="normal"
            variation="p5"
            color="neutral-darkest"
            lineHeight="fair"
          />
        </BoxView>
      </BoxView>
    </>
  );
};
