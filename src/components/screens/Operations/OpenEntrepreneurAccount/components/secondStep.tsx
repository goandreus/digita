import React from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Picker from '@molecules/extra/Picker';
import Separator from '@atoms/extra/Separator';
import BoxView from '@atoms/BoxView';
import Checkbox from '@atoms/extra/Checkbox';
import {SIZES} from '@theme/metrics';
import {SecondStepPropsInterface} from '../types';

export const SecondStep = ({
  term1,
  term2,
  handleTerm1,
  handleTerm2,
  goTermsAndConditions,
  departments,
  provinces,
  selectedDepartment,
  selectedProvince,
  selectDepartment,
  selectProvince,
}: SecondStepPropsInterface) => {
  return (
    <>
      <TextCustom
        color="neutral-darkest"
        lineHeight="comfy"
        weight="normal"
        variation="h4"
        text="¿Dónde estás aperturando tu cuenta?"
      />
      <Separator type="medium" />
      <TextCustom
        color="neutral-darkest"
        lineHeight="comfy"
        weight="normal"
        variation="h4"
        text="Departamento"
      />
      <Picker
        error={
          Object.entries(selectedDepartment).length === 0 && term1 && term2
        }
        text="Elije el departamento"
        genericText="Seleccionar"
        enabled
        data={departments}
        onSelect={selectDepartment}
        long
      />
      <Separator type="medium" />
      <TextCustom
        color="neutral-darkest"
        lineHeight="comfy"
        weight="normal"
        variation="h4"
        text="Provincia"
      />
      <Picker
        error={Object.entries(selectedProvince).length === 0 && term1 && term2}
        text="Elige la provincia"
        genericText="Seleccionar"
        enabled
        data={provinces}
        onSelect={selectProvince}
      />
      <Separator type="large" />
      <BoxView direction="row" align="flex-start" mb={SIZES.MD}>
        <Checkbox
          type="primary"
          size="small"
          value={term1}
          onChange={handleTerm1}
        />
        <BoxView flex={1} ml={SIZES.XS}>
          <TextCustom
            text="Declaro que nací en Perú, tengo domicilio fiscal en Perú y solo tributo en Perú."
            weight="normal"
            variation="h5"
            color="neutral-darkest"
            lineHeight="comfy"
          />
          <TextCustom
            text="Si no cumples con algunos requisitos de la declaración, acércate a una agencia."
            weight="normal"
            variation="p5"
            color="neutral-darkest"
            lineHeight="comfy"
          />
        </BoxView>
      </BoxView>
      <BoxView direction="row" align="flex-start" mb={SIZES.MD}>
        <Checkbox
          type="primary"
          size="small"
          value={term2}
          onChange={handleTerm2}
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
              onPress={() =>
                goTermsAndConditions({otherType: 'ENTREPRENEUR_OPENING'})
              }>
              Términos y Condiciones
            </TextCustom>
            {' del '}
            <TextCustom
              decoration="underline"
              weight="normal"
              variation="h5"
              color="primary-dark"
              lineHeight="comfy"
              onPress={() =>
                goTermsAndConditions({type: 'ENTREPRENEUR_ACCOUNT_CONTRACT'})
              }>
              Contrato
            </TextCustom>
            {' así como las condiciones de la '}
            <TextCustom
              decoration="underline"
              weight="normal"
              variation="h5"
              color="primary-dark"
              lineHeight="comfy"
              onPress={() =>
                goTermsAndConditions({type: 'ENTREPRENEUR_ACCOUNT_INFO'})
              }>
              Cartilla informativa
            </TextCustom>
          </TextCustom>
        </BoxView>
      </BoxView>
    </>
  );
};
