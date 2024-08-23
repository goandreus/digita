import {View, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import Tooltip from '@atoms/Tooltip';
import {indexStyles as styles} from '../styles';
import Separator from '@atoms/extra/Separator';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import Checkbox from '@atoms/extra/Checkbox';
import {useGroupCreditContractContext} from '../context';
import AlertBasic from '@molecules/extra/AlertBasic';
import {useUserInfo} from '@hooks/common';

export const SecondStep = () => {
  const {
    terms,
    tokenModal,
    formatedTimeToken,
    hasInsurance,
    goTermsAndConditions,
  } = useGroupCreditContractContext();
  const {userGroupCreditToDisburt: groupCredit} = useUserInfo();
  const [showTooltip1, setShowTooltip1] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const [moreInfo, setMoreInfo] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip1(false);
    }, 3600);
    return () => clearTimeout(timer);
  }, [showTooltip1]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip2(false);
    }, 3600);
    return () => clearTimeout(timer);
  }, [showTooltip2]);

  return (
    <>
      <Pressable disabled={false} onPress={() => setShowTooltip1(true)}>
        <BoxView direction="row" align="center">
          <TextCustom
            text="Monto total del Crédito Grupal"
            variation="h0"
            weight="normal"
            color="neutral-darkest"
          />
          {hasInsurance ? (
            <View style={styles.btnTooltip}>
              <Icon
                style={styles.iconTooltip}
                name="info-circle"
                size="tiny"
                fill="#000"
              />
              {showTooltip1 && (
                <Tooltip
                  width={140}
                  height={50}
                  text={'Incluye seguro\nProtección financiado'}
                  xLocation="left"
                  yLocation="top"
                />
              )}
            </View>
          ) : null}
        </BoxView>
      </Pressable>

      <Separator type="xx-small" />
      <TextCustom
        variation="h1"
        lineHeight="tight"
        weight="normal"
        color="neutral-darkest"
        text={groupCredit?.sGroupAmountTotal}
      />

      {hasInsurance && (
        <>
          <Separator type="x-small" />
          <BoxView direction="row" align="center" zIndex={-1}>
            <TextCustom
              text="Monto grupal a desembolsar  "
              variation="h6"
              lineHeight="tight"
              weight="normal"
              color="neutral-dark"
            />
            <TextCustom
              text={groupCredit?.sGroupAmountDisburse}
              variation="h4"
              lineHeight="tight"
              weight="normal"
              color="primary-medium"
            />
          </BoxView>

          <Separator type="x-small" />
          <BoxView direction="row" align="center">
            <TextCustom
              text="Total del Seguro Protección  "
              variation="h6"
              lineHeight="tight"
              weight="normal"
              color="neutral-dark"
            />
            <TextCustom
              text={groupCredit?.sAmountInsuranceGroup}
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color="neutral-darkest"
            />
          </BoxView>
        </>
      )}

      <Separator type="large" />

      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <TextCustom
          text="Grupo"
          variation="h5"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        <TextCustom
          text={groupCredit?.groupName}
          variation="h5"
          align="right"
          lineHeight="tight"
          weight="normal"
          color="neutral-darkest"
        />
      </BoxView>

      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <Pressable onPress={() => setShowTooltip2(true)}>
          <BoxView direction="row" align="center" justify="center">
            <TextCustom
              text="Cuota grupal"
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color="neutral-dark"
            />
            <View style={styles.btnTooltip}>
              <Icon
                style={styles.iconTooltip}
                name="info-circle"
                size="tiny"
                fill="#000"
              />
              {showTooltip2 && (
                <Tooltip
                  width={140}
                  height={50}
                  text={'Incluye Capital + Interés\n+ Gastos asociados'}
                />
              )}
            </View>
          </BoxView>
        </Pressable>

        <TextCustom
          text={groupCredit?.sGroupPaymentFee}
          variation="h5"
          align="right"
          lineHeight="tight"
          weight="normal"
          color="neutral-darkest"
        />
      </BoxView>

      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <TextCustom
          text="Cuotas"
          variation="h5"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        <View>
          <TextCustom
            text={groupCredit?.sGroupPayments}
            variation="h5"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
          />
        </View>
      </BoxView>

      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <TextCustom
          text="Primera cuota"
          variation="h5"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        <View>
          <TextCustom
            text={groupCredit?.sDateFirstPayment}
            variation="h5"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
          />
        </View>
      </BoxView>

      {moreInfo ? (
        <>
          <BoxView
            py={SIZES.LG}
            direction="row"
            align="center"
            justify="space-between"
            style={styles.block}>
            <TextCustom
              text="Ciclo de pago"
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color="neutral-dark"
            />
            <View>
              <TextCustom
                text={groupCredit?.sGroupPayFrequency}
                variation="h5"
                align="right"
                lineHeight="tight"
                weight="normal"
                color="neutral-darkest"
              />
            </View>
          </BoxView>

          <BoxView
            py={SIZES.LG}
            direction="row"
            align="center"
            justify="space-between"
            style={styles.block}>
            <TextCustom
              text="TEA"
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color="neutral-dark"
            />
            <View>
              <TextCustom
                text={groupCredit?.sTea}
                variation="h5"
                align="right"
                lineHeight="tight"
                weight="normal"
                color="neutral-darkest"
              />
            </View>
          </BoxView>

          <BoxView
            py={SIZES.LG}
            direction="row"
            align="center"
            justify="space-between"
            style={styles.block}>
            <TextCustom
              text="TCEA"
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color="neutral-dark"
            />
            <View>
              <TextCustom
                text={groupCredit?.sTcea}
                variation="h5"
                align="right"
                lineHeight="tight"
                weight="normal"
                color="neutral-darkest"
              />
            </View>
          </BoxView>
        </>
      ) : null}
      <Separator type="small" />
      <Pressable onPress={() => setMoreInfo(!moreInfo)}>
        <BoxView direction="row" justify="center" align="center">
          <TextCustom
            text={`Ver ${moreInfo ? 'menos' : 'más'} información`}
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
          <Icon
            // eslint-disable-next-line react-native/no-inline-styles
            style={{marginLeft: 4}}
            name={moreInfo ? 'arrow-up-light' : 'arrow-down-light'}
            stroke={COLORS.Neutral.Medium}
            size={24}
          />
        </BoxView>
      </Pressable>

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
      <Separator type="large" />

      <BoxView direction="row" align="flex-start" mb={SIZES.MD}>
        <Checkbox
          type="primary"
          size="small"
          value={terms.degravamen}
          onChange={value => {
            terms.setDegravamen(value);
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
              onPress={() => {
                if (groupCredit?.groupPayFrequency === 14) {
                  goTermsAndConditions('GROUP_CREDIT_SHORT');
                } else goTermsAndConditions('GROUP_CREDIT_LONG');
              }}>
              Términos y Condiciones
            </TextCustom>
            {''} del Crédito y del Seguro de Desgravamen.
          </TextCustom>
        </BoxView>
      </BoxView>

      {hasInsurance ? (
        <BoxView direction="row" align="flex-start" mb={SIZES.MD}>
          <Checkbox
            type="primary"
            size="small"
            value={terms.insurance}
            onChange={value => {
              terms.setInsurance(value);
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
                onPress={() => goTermsAndConditions('GROUP_INSURANCE')}>
                Términos y Condiciones
              </TextCustom>
              {''} del Seguro Protección.
            </TextCustom>
          </BoxView>
        </BoxView>
      ) : null}

      {/* TokenExpiration Modal */}
      <AlertBasic
        isOpen={formatedTimeToken !== null && tokenModal}
        onClose={() => {}}
        title={`Continua con tu desembolso\nen 00:${formatedTimeToken || '00'}`}
        description="En unos segundos podrás continuar con el desembolso en curso. ¡No cierres la app!"
        actions={() => []}
      />
    </>
  );
};
