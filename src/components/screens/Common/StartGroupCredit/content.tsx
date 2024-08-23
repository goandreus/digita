import {View} from 'react-native';
import React from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import {useLastUser, useUserInfo} from '@hooks/common';
import Separator from '@atoms/extra/Separator';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import {indexStyles as styles} from './styles';
import Icon from '@atoms/Icon';

type TInsurance = 'all' | 'some' | 'none';

export const Content = () => {
  const {lastUser} = useLastUser();
  const {userGroupCreditToDisburt} = useUserInfo();
  const insurance: TInsurance =
    userGroupCreditToDisburt?.hasInsuranceGroup === 'S'
      ? 'none'
      : userGroupCreditToDisburt?.hasInsuranceGroup === 'T'
      ? 'all'
      : 'some';

  return (
    <>
      <TextCustom
        color="neutral-lightest"
        variation="h1"
        weight="normal"
        lineHeight="tight"
        text={`${lastUser.firstName},`}
      />
      <TextCustom
        color="neutral-lightest"
        variation="h4"
        weight="normal"
        lineHeight="comfy">
        Como{' '}
        <TextCustom
          color="neutral-lightest"
          variation="h4"
          weight="bold"
          lineHeight="comfy"
          text="presidente de tu grupo"
        />{' '}
        contrata de manera rápida tu crédito grupal solicitado.
      </TextCustom>
      <Separator size={SIZES.LG} />

      <View style={styles.infoContainer}>
        <BoxView py={SIZES.LG} align="center" background="secondary-lightest">
          <TextCustom
            color="neutral-darkest"
            variation="h5"
            weight="normal"
            lineHeight="tight"
            text="Crédito grupal solicitado"
          />
          <Separator size={SIZES.XXS} />
          <TextCustom
            color="neutral-darkest"
            variation="h2"
            weight="normal"
            lineHeight="tight"
            text={userGroupCreditToDisburt?.sGroupAmountTotal}
          />
        </BoxView>
        <BoxView
          direction="row"
          py={SIZES.LG}
          justify="space-evenly"
          background="neutral-lightest">
          <BoxView align="center">
            <TextCustom
              color="neutral-darkest"
              variation="h6"
              weight="normal"
              lineHeight="tight"
              text="Cuota grupal"
            />
            <Separator size={SIZES.XXS} />
            <TextCustom
              color="primary-dark"
              variation="h2"
              weight="normal"
              lineHeight="tight"
              text={userGroupCreditToDisburt?.sGroupPaymentFee}
            />
            <TextCustom
              color="neutral-darkest"
              variation="h6"
              weight="normal"
              lineHeight="tight"
              text={`TEA: ${userGroupCreditToDisburt?.sTea}`}
            />
          </BoxView>
          <BoxView align="center">
            <TextCustom
              color="neutral-darkest"
              variation="h6"
              weight="normal"
              lineHeight="tight"
              text="Nro. de Cuotas"
            />
            <Separator size={SIZES.XXS} />
            <TextCustom
              color="neutral-darkest"
              variation="h2"
              weight="normal"
              lineHeight="tight"
              text={userGroupCreditToDisburt?.sGroupPayments}
            />
          </BoxView>
        </BoxView>
        <BoxView
          direction="row"
          py={SIZES.LG}
          justify="space-evenly"
          background="background-light">
          <BoxView align="center">
            <TextCustom
              color="neutral-darkest"
              variation="h6"
              weight="normal"
              lineHeight="tight"
              text="Ciclo de pago"
            />
            <Separator size={SIZES.XXS} />
            <TextCustom
              color="neutral-darkest"
              variation="h0"
              weight="normal"
              lineHeight="fair"
              text={userGroupCreditToDisburt?.sGroupPayFrequency}
            />
          </BoxView>
          <BoxView align="center">
            <TextCustom
              color="neutral-darkest"
              variation="h6"
              weight="normal"
              lineHeight="tight"
              text="Primera cuota"
            />
            <Separator size={SIZES.XXS} />
            <TextCustom
              color="neutral-darkest"
              variation="h0"
              weight="normal"
              lineHeight="fair"
              text={userGroupCreditToDisburt?.sDateFirstPayment}
            />
          </BoxView>
        </BoxView>
      </View>

      {insurance !== 'none' && (
        <>
          <Separator size={SIZES.XS} />
          <BoxView
            flex={1}
            align="center"
            justify="center"
            py={SIZES.MD}
            px={SIZES.LG}
            direction="row"
            background="primary-dark"
            style={{borderRadius: SIZES.XS}}>
            <Icon name="icon-insurance" size="large" />
            <BoxView ml={8}>
              <TextCustom
                color="neutral-lightest"
                variation="h6"
                weight="normal"
                lineHeight="tight"
                text={
                  insurance === 'some'
                    ? 'Algunos integrantes estarán protegidos con el'
                    : 'Al desembolsar tu grupo estará protegido con el'
                }
              />
              <Separator size={SIZES.XXS} />
              <TextCustom
                color="neutral-lightest"
                variation="h4"
                align="center"
                weight="normal"
                lineHeight="tight"
                text="Seguro Protección"
              />
            </BoxView>
          </BoxView>
        </>
      )}

      <Separator size={SIZES.XXS} />
      <TextCustom
        size={11}
        color="primary-lightest"
        variation="h6"
        align="center"
        weight="normal"
        lineHeight="comfy"
        text="Si deseas cambiar las condiciones del crédito contacta a tu asesor."
      />
      <Separator size={SIZES.MD} />
    </>
  );
};
