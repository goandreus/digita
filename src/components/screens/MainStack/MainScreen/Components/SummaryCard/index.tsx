import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import * as Progress from 'react-native-progress';
import {COLORS} from '@theme/colors';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import TextTitleValue from '@atoms/extra/TextTitleValue';
import Icon from '@atoms/Icon';

export interface SummaryCardProps {
  title: string;
  subtitle?: string;
  groupCapitalOriginal?: string;
  groupAmountBalanceCapital?: string;
  groupInstallmentAmount?: string;
  quota?: number;
  quotasNumber?: number;
  currency?: string;
  dueDate?: string;
  style?: ViewStyle;
}

const SummaryCard = ({
  title,
  subtitle,
  groupCapitalOriginal,
  groupAmountBalanceCapital,
  groupInstallmentAmount,
  quota,
  quotasNumber,
  currency,
  dueDate,
  style,
}: SummaryCardProps) => {
  const styles = getStyles();

  const canceledInstallments = quota ? quota - 1 : 0;
  const pendingInstallments =
    quotasNumber && quotasNumber - canceledInstallments;
  const advancePorcentage = quotasNumber
    ? canceledInstallments / quotasNumber
    : 0;

  const canceledInstallmentsFormat =
    canceledInstallments < 10
      ? `0${canceledInstallments}`
      : `${canceledInstallments}`;
  const pendingInstallmentsFormat =
    pendingInstallments && pendingInstallments < 10
      ? `0${pendingInstallments}`
      : `${pendingInstallments}`;
  const quotasNumberFormat =
    quotasNumber && quotasNumber < 10 ? `0${quotasNumber}` : `${quotasNumber}`;

  return (
    <>
      <BoxView style={{...styles.container, ...style}}>
        <BoxView style={styles.cardTitle}>
          <BoxView direction="row">
            <TextCustom text={title} variation="h6" color="neutral-lightest" />
            <Icon
              style={{marginLeft: 4}}
              name="info-circle"
              size="tiny"
              fill="#000"
            />
          </BoxView>
          <TextCustom
            text={`${currency} ${groupAmountBalanceCapital}`}
            variation="h2"
            color="neutral-lightest"
          />
          <TextTitleValue
            text1={subtitle!}
            text2={`${currency} ${groupCapitalOriginal}`}
            text1Variation="h6"
            text2Variation="h6"
            text1Color="neutral-lightest"
            text2Color="neutral-lightest"
            text2weight="bold"
          />
        </BoxView>
        <BoxView style={styles.cardInfo}>
          <BoxView
            direction="row"
            justify="space-between"
            px={4}
            style={{width: '100%'}}>
            <TextTitleValue
              text1="Cuotas pagadas"
              text2={canceledInstallmentsFormat}
              text1Variation="h5"
              text2Variation="h5"
              text1Color="neutral-dark"
              text2Color="neutral-darkest"
            />
            <TextTitleValue
              text1="Cuotas pendientes"
              text2={pendingInstallmentsFormat}
              text1Variation="h5"
              text2Variation="h5"
              text1Color="neutral-dark"
              text2Color="neutral-darkest"
            />
          </BoxView>
          <BoxView pt={2} pb={8} style={{width: '100%'}}>
            <Progress.Bar
              style={{
                marginTop: 2,
                backgroundColor: COLORS.Neutral.Light,
                borderColor: COLORS.Neutral.Light,
              }}
              progress={advancePorcentage}
              height={8}
              width={null}
              color={COLORS.Secondary.Medium}
            />
          </BoxView>
          <TextTitleValue
            text1="Total cuotas"
            text2={quotasNumberFormat}
            text1Variation="h5"
            text2Variation="h5"
            text1Color="neutral-dark"
            text2Color="neutral-darkest"
          />
        </BoxView>
        <BoxView style={styles.cardDetail}>
          <TextTitleValue
            text1="Cuota grupal"
            text2={`${currency} ${groupInstallmentAmount}`}
            text1Variation="h5"
            text2Variation="h4"
            text1Color="neutral-dark"
            text2Color="neutral-darkest"
            directionFlex="column"
          />
          <TextTitleValue
            text1="Día de pago"
            text2={dueDate ?? ''}
            text1Variation="h5"
            text2Variation="h4"
            text1Color="neutral-dark"
            text2Color={
              dueDate === 'Ayer' || dueDate === 'Hoy' || dueDate === 'Mañana'
                ? 'error-medium'
                : 'neutral-darkest'
            }
            directionFlex="column"
          />
        </BoxView>
      </BoxView>
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    container: {},
    cardTitle: {
      padding: SIZES.MD,
      backgroundColor: COLORS.Primary.Dark,
      alignItems: 'center',
      borderTopStartRadius: SIZES.MD,
      borderTopRightRadius: SIZES.MD,
    },
    cardInfo: {
      backgroundColor: COLORS.Background.Lightest,
      padding: 16,
      alignItems: 'center',
    },
    cardDetail: {
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      paddingVertical: SIZES.MD,
      backgroundColor: COLORS.Background.Light,
      borderBottomEndRadius: SIZES.MD,
      borderBottomLeftRadius: SIZES.MD,
    },
    dataIn: {
      marginRight: SIZES.XXL,
    },
  });

  return stylesBase;
};

export default SummaryCard;
