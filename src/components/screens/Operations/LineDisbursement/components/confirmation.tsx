import {View, Pressable, Image} from 'react-native';
import React from 'react';
import BoxView from '@atoms/BoxView';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import {SIZES} from '@theme/metrics';
import {indexStyles as styles} from '../styles';
import Picker from '@molecules/extra/Picker';
import {Saving} from '@features/userInfo';
import {COLORS} from '@theme/colors';
import Checkbox from '@atoms/extra/Checkbox';
import Tooltip from '@atoms/Tooltip';
import {useLineDisbursementContext} from '../context';
import AlertBasic from '@molecules/extra/AlertBasic';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '@navigations/types';

const ContentAccounts = ({
  accounts,
  hasSavings,
  defaultPicker,
  setOriginAccountUId,
}: {
  accounts: Saving[] | undefined;
  hasSavings: boolean;
  defaultPicker: {
    open: boolean;
    value?: number;
    onChange: () => void;
  };
  setOriginAccountUId: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
  return (
    <>
      <Separator type="large" />
      <TextCustom
        color="neutral-darkest"
        variation="h4"
        lineHeight="tight"
        text={'Recibirás tu crédito en'}
      />
      <Separator type="x-small" />
      {hasSavings ? (
        accounts ? (
          <View style={styles.pickerContainer}>
            <Picker
              defaultParams={{
                open: defaultPicker.open,
                value: defaultPicker.value,
                onChange: () => defaultPicker.onChange(),
              }}
              text="Elige una cuenta"
              data={accounts}
              onSelect={value => setOriginAccountUId(value.operationUId)}
              statusBarTranslucent
            />
          </View>
        ) : null
      ) : (
        <BoxView
          px={SIZES.MD}
          py={SIZES.LG}
          direction="row"
          align="center"
          justify="space-between"
          style={{...styles.pickerContainer, ...styles.emptyContainer}}>
          <TextCustom
            color="neutral-darkest"
            variation="h4"
            weight="normal"
            lineHeight="tight"
            text={'Cuenta Emprendedores'}
          />
          <BoxView
            px={SIZES.MD}
            py={SIZES.XS}
            background="secondary-lightest"
            style={{borderRadius: SIZES.XS}}>
            <TextCustom
              color="secondary-dark"
              variation="h6"
              weight="normal"
              lineHeight="tight"
              text={'Nueva'}
            />
          </BoxView>
        </BoxView>
      )}
    </>
  );
};

export const Confirmation = ({
  params,
}: {
  params: RouteProp<RootStackParamList, 'LineDisbursement'>['params'];
}) => {
  const {
    withCancellation,
    terms,
    accounts,
    originAccountUId,
    setOriginAccountUId,
    goTermsAndConditions,
    formatedTimeToken,
    tokenModal,
  } = useLineDisbursementContext();
  const {hasSavings} = params;

  // TO DO: Change to the correct accounts currency
  const [defaultOpenPicker, setDefaultOpenPicker] = React.useState(false);

  const pickerValues = {
    open: defaultOpenPicker,
    value: originAccountUId,
    onChange: () => setDefaultOpenPicker(false),
  };

  const [showTooltip, setShowTooltip] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 3600);
    return () => clearTimeout(timer);
  }, [showTooltip]);

  return (
    <>
      <BoxView>
        <TextCustom
          color="neutral-darkest"
          variation="h4"
          lineHeight="comfy"
          text={'Estás por desembolsar de tu Línea de Crédito'}
        />
        <Separator type="large" />

        <BoxView
          background="background-light"
          p={SIZES.LG}
          style={{...styles.containerInfo, ...styles.borderContainer}}>
          <TextCustom
            color="neutral-darkest"
            variation="h4"
            weight="normal"
            lineHeight="tight"
            text={
              withCancellation
                ? 'Monto total del nuevo desembolso'
                : 'Monto a desembolsar'
            }
          />
          <Separator type="xx-small" />
          <TextCustom
            color="neutral-darkest"
            variation="h2"
            lineHeight="tight"
            text={params.sTotalAmountDisbursement}
          />

          <Separator type="xx-small" />
          <TextCustom
            color="neutral-dark"
            variation="h5"
            lineHeight="tight"
            text={`TEA  ${params?.sTea}    TCEA  ${params?.sTcea}`}
          />

          {withCancellation && (
            <>
              <Separator type="medium" />
              <TextCustom
                color="primary-darkest"
                variation="h5"
                weight="normal"
                lineHeight="tight"
                text="¿Qué incluye el monto total?"
              />
              <Separator type="xx-small" />
              <BoxView
                px={SIZES.MD}
                py={SIZES.LG}
                background="error-lightest"
                style={styles.containerInfo}>
                <Image
                  source={require('@assets/images/advisor.png')}
                  style={styles.iconAdvisor}
                />
                <BoxView direction="row" align="center" justify="space-between">
                  <TextCustom
                    color="neutral-darkest"
                    variation="h6"
                    weight="normal"
                    lineHeight="fair"
                    text="Depósito en tu cuenta"
                  />
                  <TextCustom
                    color="primary-dark"
                    variation="h4"
                    weight="normal"
                    lineHeight="tight"
                    text={params.sAmount}
                  />
                </BoxView>
                <Separator type="xx-small" />
                <BoxView direction="row" align="center" justify="space-between">
                  <TextCustom
                    style={{flex: 1, marginRight: SIZES.XS}}
                    color="neutral-darkest"
                    variation="h6"
                    weight="normal"
                    lineHeight="fair"
                    text={'Cancelación deuda actual en Línea de Crédito*'}
                  />
                  <TextCustom
                    color="neutral-darkest"
                    variation="h4"
                    weight="normal"
                    lineHeight="tight"
                    text={params.sCurrentDebtCancellation}
                  />
                </BoxView>
              </BoxView>
              <Separator type="xx-small" />
              <TextCustom
                text="(*) Incluyen los interéses y gastos adicionales al día de hoy"
                color="neutral-dark"
                lineHeight="tight"
                variation="h6"
                size={10}
                weight="normal"
                align="center"
              />
            </>
          )}

          <Separator type="large" color={COLORS.Neutral.Light} showLine />
          <TextCustom
            color="neutral-darkest"
            variation="h4"
            lineHeight="tight"
            text={'Tus cuotas serán'}
          />
          <Separator type="xx-small" />
          <Pressable disabled={false} onPress={() => setShowTooltip(true)}>
            <BoxView direction="row">
              <TextCustom
                color="neutral-darkest"
                variation="h3"
                lineHeight="tight">
                {params.sTerms} cuotas de{' '}
                <TextCustom
                  color="primary-medium"
                  variation="h3"
                  weight="normal"
                  lineHeight="tight"
                  text={params.sMonthAmount}
                />
              </TextCustom>
              <View style={styles.btnTooltip}>
                <Icon
                  style={styles.iconTooltip}
                  name="info-circle"
                  size="tiny"
                  fill="#000"
                />
                {showTooltip && (
                  <Tooltip
                    width={140}
                    height={50}
                    text={'Incluye capital, intereses mas gastos asociados'}
                    xLocation="left"
                    yLocation="top"
                  />
                )}
              </View>
            </BoxView>
          </Pressable>
        </BoxView>

        <Separator type="x-small" />

        <BoxView
          direction="row"
          align="center"
          background="background-light"
          p={SIZES.LG}
          style={{...styles.containerInfo, ...styles.borderContainer}}>
          <View style={styles.iconContainer}>
            <Icon name="icon_schedule" size="normal" />
          </View>
          <BoxView flex={1}>
            <TextCustom
              color="neutral-darkest"
              variation="h5"
              weight="normal"
              lineHeight="fair">
              Tu primera cuota vence{' '}
              <TextCustom
                color="primary-dark"
                variation="h5"
                weight="normal"
                lineHeight="fair"
                text={params.sFirstQuoteDate}
              />
            </TextCustom>

            <Separator type="xx-small" />

            <TextCustom
              color="neutral-darkest"
              variation="h5"
              weight="normal"
              lineHeight="tight">
              Día de pago{' '}
              <TextCustom
                color="primary-dark"
                variation="h5"
                weight="normal"
                lineHeight="tight"
                text={params.sPaymentDay}
              />
            </TextCustom>
          </BoxView>
        </BoxView>

        <ContentAccounts
          hasSavings={hasSavings}
          accounts={accounts}
          setOriginAccountUId={setOriginAccountUId}
          defaultPicker={pickerValues}
        />

        <Separator type="large" />
        <BoxView
          direction="row"
          align="center"
          justify="center"
          background="informative-lightest"
          p={SIZES.MD}
          style={styles.containerInfo}>
          <Icon
            name="protected"
            size="small"
            fill={COLORS.Informative.Medium}
          />
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
                onPress={() => goTermsAndConditions('LINE_CREDIT_DISBURSE')}>
                Términos y Condiciones
              </TextCustom>
              {''} del desembolso y del Seguro de Desgravamen.
            </TextCustom>
          </BoxView>
        </BoxView>
      </BoxView>

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
