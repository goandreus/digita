import React from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import BoxView from '@atoms/BoxView';
import {indexStyles as styles} from '../styles';
import {SIZES} from '@theme/metrics';
import Icon from '@atoms/Icon';
import {COLORS} from '@theme/colors';
import Checkbox from '@atoms/extra/Checkbox';
import {useLineDisbursementContext} from '../context';

export const OpenAccount = () => {
  const {terms, goTermsAndConditions} = useLineDisbursementContext();

  return (
    <>
      <TextCustom
        color="neutral-darkest"
        variation="h4"
        weight="normal"
        lineHeight="comfy"
        text={'Necesitas abrir una cuenta para desembolsar'}
      />
      <Separator type="large" />
      <BoxView style={styles.accountContainer}>
        <BoxView
          direction="row"
          align="center"
          background="primary-lightest"
          p={SIZES.MD}>
          <Icon name="coin-bank" size={60} style={styles.iconRow} />
          <BoxView>
            <TextCustom
              color="primary-dark"
              variation="h5"
              weight="normal"
              lineHeight="comfy"
              text={'Ahorro en soles'}
            />
            <TextCustom
              color="primary-medium"
              variation="h0"
              weight="bold"
              lineHeight="comfy"
              text={'Cuenta Emprendedores'}
            />
          </BoxView>
        </BoxView>
        <Separator type="small" />
        <BoxView px={SIZES.MD} direction="row" align="center">
          <Icon
            iconName="icon_tick"
            size={18}
            color={COLORS.Primary.Dark}
            style={styles.iconRow}
          />
          <TextCustom
            variation="p4"
            color="neutral-darkest"
            weight="normal"
            lineHeight="comfy">
            <TextCustom
              variation="p4"
              text="Sin costo "
              color="neutral-darkest"
              weight="bold"
              lineHeight="comfy"
            />
            de mantenimiento.
          </TextCustom>
        </BoxView>
        <Separator type="x-small" />
        <BoxView px={SIZES.MD} direction="row" align="center">
          <Icon
            iconName="icon_tick"
            size={18}
            color={COLORS.Primary.Dark}
            style={styles.iconRow}
          />
          <BoxView flex={1}>
            <TextCustom
              variation="p4"
              color="neutral-darkest"
              weight="normal"
              lineHeight="comfy">
              Realiza
              <TextCustom
                variation="p4"
                text=" retiros ilimitados y gratuitos"
                color="neutral-darkest"
                weight="bold"
                lineHeight="comfy"
              />{' '}
              en cajeros de la RED UNICARD.
            </TextCustom>
          </BoxView>
        </BoxView>
        <Separator type="small" />
      </BoxView>

      <Separator type="large" />
      <BoxView direction="row" align="flex-start" mb={SIZES.XS}>
        <Checkbox
          type="primary"
          size="small"
          value={terms.nationality}
          onChange={value => {
            terms.setNationality(value);
          }}
        />
        <BoxView flex={1} ml={SIZES.XS}>
          <TextCustom
            weight="normal"
            variation="h5"
            color="neutral-darkest"
            lineHeight="comfy"
            text="Declaro que nací en Perú, tengo domicilio fiscal en Perú y solo
            tributo en Perú."
          />
        </BoxView>
      </BoxView>

      <BoxView flex={1}>
        <TextCustom
          style={{marginLeft: SIZES.XL}}
          weight="normal"
          variation="p5"
          color="neutral-dark"
          lineHeight="fair"
          text="Si no cumples con algunos requisitos de la declaración, acércate a una agencia."
        />
      </BoxView>

      <Separator type="small" />

      <BoxView direction="row" align="flex-start" mb={SIZES.MD}>
        <Checkbox
          type="primary"
          size="small"
          value={terms.account}
          onChange={value => {
            terms.setAccount(value);
          }}
        />
        <BoxView flex={1} ml={SIZES.XS}>
          <TextCustom
            weight="normal"
            variation="h5"
            color="neutral-darkest"
            lineHeight="comfy">
            Acepto los{' '}
            <TextCustom
              decoration="underline"
              weight="normal"
              variation="h5"
              color="primary-dark"
              lineHeight="comfy"
              onPress={() => goTermsAndConditions('ACCOUNT_OPENING')}>
              Términos y Condiciones
            </TextCustom>{' '}
            de la apertura de Cuenta Emprendedores.
          </TextCustom>
        </BoxView>
      </BoxView>
    </>
  );
};
