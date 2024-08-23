import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import Checkbox from '@atoms/extra/Checkbox';
import BoxView from '@atoms/BoxView';
import {SIZES} from '@theme/metrics';
import {indexStyles as styles} from '../styles';
import Icon from '@atoms/Icon';
import {COLORS} from '@theme/colors';
import Tooltip from '@atoms/Tooltip';
import {useUserInfo} from '@hooks/common';
import {Saving} from '@features/userInfo';
import {nameForTransfer} from '@utils/nameForTransfer';
import moment from 'moment';
import AlertBasic from '@molecules/extra/AlertBasic';
import {IDisbursCredit} from '@interface/Credit';
interface Props {
  disburseCredit: IDisbursCredit;
  hasSavings: boolean;
  originAccount: Saving | null;
  showModal: boolean;
  formatedTimeToken: string | null;
  terms: {
    termsDegravamen: boolean;
    termsEntrepreneur: boolean;
    termsInsurance: boolean;
    setTermsDegravamen: React.Dispatch<React.SetStateAction<boolean>>;
    setTermsEntrepreneur: React.Dispatch<React.SetStateAction<boolean>>;
    setTermsInsurance: React.Dispatch<React.SetStateAction<boolean>>;
  };
  goTermsAndConditions: (
    type:
      | 'ACCOUNT_OPENING'
      | 'CREDIT_INSURANCE'
      | 'INDIVIDUAL_INSURANCE'
      | 'ECONOMIC_INSURANCE',
  ) => void;
}

export const SecondStep = ({
  showModal,
  disburseCredit,
  hasSavings,
  formatedTimeToken,
  terms,
  originAccount,
  goTermsAndConditions,
}: Props) => {
  const [showTooltip1, setShowTooltip1] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const [moreInfo, setMoreInfo] = useState<boolean>(false);
  const {userCreditToDisburt} = useUserInfo();
  const creditPending = userCreditToDisburt;

  const arrNames = nameForTransfer(originAccount?.productName || '');

  const firstDayPayment = moment(disburseCredit?.dateFirstPayment)
    .format('DD MMM YYYY')
    .replace(/\b\w/g, l => l.toUpperCase());

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
      <Separator type="large" />
      {creditPending?.insurance !== '' ? (
        <>
          <Pressable
            disabled={!(creditPending?.insuranceTypeFinancing === 'S')}
            onPress={() => setShowTooltip1(true)}>
            <BoxView direction="row" align="center">
              <TextCustom
                text="Monto total del préstamo"
                variation="h0"
                weight="normal"
                color="neutral-darkest"
              />
              {creditPending?.insuranceTypeFinancing === 'S' ? (
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
                      text={`Incluye el seguro\n${creditPending?.insurance}`}
                    />
                  )}
                </View>
              ) : null}
            </BoxView>
          </Pressable>
          <Separator type="xx-small" />
          <TextCustom
            text={creditPending?.sCreditFormat2}
            variation="h1"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
          />
        </>
      ) : (
        <>
          <TextCustom
            text="Monto a desembolsar"
            variation="h0"
            weight="normal"
            color="neutral-darkest"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={creditPending?.sCreditFormat1}
            variation="h1"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
          />
        </>
      )}
      {creditPending?.insurance !== '' ? (
        <>
          <Separator type="xx-small" />
          <BoxView direction="row" align="center" zIndex={-1}>
            <TextCustom
              text="Monto a desembolsar  "
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color="neutral-dark"
            />
            <TextCustom
              text={creditPending?.sCreditDeposit}
              variation="h4"
              lineHeight="tight"
              weight="normal"
              color="primary-medium"
            />
          </BoxView>
        </>
      ) : null}
      {creditPending?.insurance !== '' ? (
        <>
          <Separator size={6} />
          <BoxView direction="row" align="center">
            <TextCustom
              text={`Total ${creditPending?.insurance}  `}
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color="neutral-dark"
            />
            <TextCustom
              text={`${creditPending?.sInsuranceAmount}`}
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color="neutral-darkest"
            />
          </BoxView>
        </>
      ) : null}
      <Separator type="large" />
      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <TextCustom
          text="Depositar en"
          variation="h5"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        {hasSavings ? (
          <BoxView>
            {arrNames.map(n => (
              <TextCustom
                key={`key-${n}`}
                text={n}
                style={{marginBottom: SIZES.XXS}}
                variation="h5"
                align="right"
                lineHeight="tight"
                weight="normal"
                color="neutral-darkest"
              />
            ))}
            <TextCustom
              text={originAccount?.accountCode!}
              variation="h6"
              align="right"
              lineHeight="tight"
              weight="normal"
              color="neutral-dark"
            />
          </BoxView>
        ) : (
          <TextCustom
            text="Cuenta Emprendedores"
            variation="h5"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
          />
        )}
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
              text="Cuota mensual"
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
          text={creditPending?.sPaymentMonth}
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
        zIndex={-1}
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
            text={creditPending?.payments}
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
            text={firstDayPayment}
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
              text="Día de pago"
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color="neutral-dark"
            />
            <View>
              <TextCustom
                text={`${creditPending?.payDay} de cada mes`}
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
                text={disburseCredit?.stea}
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
                text={disburseCredit?.stcea}
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
          value={terms.termsDegravamen}
          onChange={value => {
            terms.setTermsDegravamen(value);
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
                goTermsAndConditions('CREDIT_INSURANCE');
              }}>
              Términos y Condiciones
            </TextCustom>
            {''} del Crédito y del Seguro de Desgravamen.
          </TextCustom>
        </BoxView>
      </BoxView>

      {creditPending?.insurance !== '' ? (
        <BoxView direction="row" align="flex-start" mb={SIZES.MD}>
          <Checkbox
            type="primary"
            size="small"
            value={terms.termsInsurance}
            onChange={value => {
              terms.setTermsInsurance(value);
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
                  if (
                    creditPending?.insuranceName ===
                    'MAPFRE - Protección Individual'
                  )
                    goTermsAndConditions('INDIVIDUAL_INSURANCE');
                  else goTermsAndConditions('ECONOMIC_INSURANCE');
                }}>
                Términos y Condiciones
              </TextCustom>
              {''} del {creditPending?.insurance}.
            </TextCustom>
          </BoxView>
        </BoxView>
      ) : null}

      {hasSavings ? null : (
        <BoxView direction="row" align="center" mb={SIZES.MD}>
          <Checkbox
            type="primary"
            size="small"
            value={terms.termsEntrepreneur}
            onChange={value => {
              terms.setTermsEntrepreneur(value);
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
                  goTermsAndConditions('ACCOUNT_OPENING');
                }}>
                Términos y Condiciones
              </TextCustom>
              {''} de la apertura de cuenta Ahorro Emprendedor.
            </TextCustom>
          </BoxView>
        </BoxView>
      )}

      {/* TokenExpiration Modal */}
      <AlertBasic
        isOpen={formatedTimeToken !== null && showModal}
        onClose={() => {}}
        title={`Continua con tu desembolso\nen 00:${formatedTimeToken || '00'}`}
        description="En unos segundos podrás continuar con el desembolso en curso. ¡No cierres la app!"
        actions={() => []}
      />
    </>
  );
};
