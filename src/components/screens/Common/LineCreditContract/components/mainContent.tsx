import {TouchableOpacity} from 'react-native';
import React from 'react';
import BoxView from '@atoms/BoxView';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import LabelRoundIcon from '@atoms/LabelRoundIcon';
import {COLORS} from '@theme/colors';
import Icon from '@atoms/Icon';
import {contentStyles as styles} from '../styles';
import {useLineCreditContractContext} from '../context';
import Checkbox from '@atoms/extra/Checkbox';
import {useUserInfo} from '@hooks/common';

export const MainContent = () => {
  const {userCreditToDisburt} = useUserInfo();
  const {terms, setTerms, goTermsAndConditions, goKnowMore} =
    useLineCreditContractContext();
  return (
    <>
      <Separator type="large" />
      <TextCustom
        color="neutral-darkest"
        variation="p4"
        weight="normal"
        lineHeight="comfy"
        text="Al crear tu Línea de Crédito podrás obtener al instante dinero para tu negocio."
      />
      <Separator type="medium" />
      <LabelRoundIcon
        icon="bills"
        color={COLORS.Background.Lightest}
        text={
          <TextCustom
            variation="p4"
            weight="normal"
            color="neutral-darkest"
            lineHeight="comfy">
            Utiliza tu Línea hasta por{' '}
            <TextCustom
              color="neutral-darkest"
              variation="p4"
              weight="bold"
              lineHeight="comfy"
              text="36 meses."
            />
          </TextCustom>
        }
      />
      <Separator type="medium" />
      <LabelRoundIcon
        icon="percentage"
        iconSize={15}
        color={COLORS.Background.Lightest}
        text={
          <TextCustom
            variation="p4"
            weight="normal"
            color="neutral-darkest"
            lineHeight="comfy">
            <TextCustom
              color="neutral-darkest"
              variation="p4"
              weight="bold"
              lineHeight="comfy"
              text={`TEA ${userCreditToDisburt?.tea} `}
            />
            al desembolsar el total de la Línea. Sí el monto es menor puede
            variar.
          </TextCustom>
        }
      />
      <Separator type="medium" />
      <TouchableOpacity onPress={goKnowMore}>
        <BoxView direction="row" align="center">
          <TextCustom
            color="primary-medium"
            variation="h5"
            weight="normal"
            lineHeight="tight"
            text="Conoce más sobre la Línea de Crédito"
          />
          <Icon
            style={styles.arrowIcon}
            iconName={'icon_arrows_right_thin'}
            size={12}
            color={COLORS.Primary.Medium}
          />
        </BoxView>
      </TouchableOpacity>
      <Separator type="large" />
      <BoxView
        direction="row"
        align="center"
        justify="center"
        background="informative-lightest"
        p={SIZES.MD}
        style={styles.containerInfo}>
        <Icon name="protected" size="small" fill={COLORS.Informative.Medium} />
        <TextCustom
          style={styles.text}
          color="informative-dark"
          variation="h6"
          lineHeight="fair"
          weight="normal"
          text={'Esta operación se validará con tu Token Digital'}
        />
      </BoxView>

      <Separator type="medium" />

      <BoxView direction="row" align="flex-start" mb={SIZES.MD}>
        <Checkbox
          type="primary"
          size="small"
          value={terms}
          onChange={value => setTerms(value)}
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
              onPress={() => goTermsAndConditions('LINE_CREDIT_CONTRACT')}>
              Términos y Condiciones
            </TextCustom>
            {''} de la Línea de Crédito.
          </TextCustom>
        </BoxView>
      </BoxView>
    </>
  );
};
