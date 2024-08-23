import {Pressable, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {cardStyles as styles} from '../styles';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import BoxView from '@atoms/BoxView';
import Tooltip from '@atoms/Tooltip';
import {SIZES} from '@theme/metrics';
import Icon from '@atoms/Icon';
import * as Progress from 'react-native-progress';
import {COLORS} from '@theme/colors';

interface Props {
  currentDebt?: string;
  totalAmount?: string;
  currency: string;
  quota?: number;
  quotasNumber?: number;
}

export const SumaryCard = ({
  currentDebt,
  totalAmount,
  currency,
  quota,
  quotasNumber,
}: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const pendingInstallments = quotasNumber && quotasNumber - quota!;
  const canceledInstallmentsFormat = quota! < 10 ? `0${quota}` : `${quota}`;
  const advancePorcentage = quotasNumber ? quota! / quotasNumber : 0;
  const pendingInstallmentsFormat =
    pendingInstallments && pendingInstallments < 10
      ? `0${pendingInstallments}`
      : `${pendingInstallments}`;
  const quotasNumberFormat =
    quotasNumber && quotasNumber < 10 ? `0${quotasNumber}` : `${quotasNumber}`;

  useEffect(() => {
    setTimeout(() => {
      setShowTooltip(false);
    }, 3600);
  }, [showTooltip]);

  return (
    <BoxView background="error-lightest" style={styles.mainContainer}>
      <View style={styles.backgroundIcon}>
        <Icon name="icon_bill_background" size={76} />
      </View>
      <Separator type="medium" />
      <BoxView px={SIZES.MD}>
        <Pressable
          style={styles.btntooltip}
          onPress={() => setShowTooltip(true)}>
          <BoxView direction="row">
            <TextCustom
              text="Deuda actual"
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color="primary-darkest"
            />
            <View>
              <Icon
                style={styles.iconTooltip}
                name="info-circle"
                size={12}
                fill="#000"
              />
              {showTooltip && (
                <Tooltip
                  xLocation="right"
                  yLocation="bottom"
                  width={120}
                  height={50}
                  text={'Capital + intereses +\n gastos asociados'}
                />
              )}
            </View>
          </BoxView>
        </Pressable>

        <Separator type="xx-small" />
        <TextCustom
          text={`${currency} ${currentDebt}`}
          variation="h2"
          lineHeight="tight"
          weight="normal"
          color="primary-medium"
        />
        <Separator type="xx-small" />
        <TextCustom
          variation="h5"
          lineHeight="tight"
          weight="normal"
          color="neutral-darkest">
          Monto total del crédito{' '}
          <TextCustom
            variation="h5"
            text={`${currency} ${totalAmount}`}
            lineHeight="tight"
            weight="bold"
            color="neutral-darkest"
          />
        </TextCustom>
        <Separator type="medium" />
      </BoxView>
      <View style={styles.subContainer}>
        <BoxView px={SIZES.XXS} direction="row" justify="space-between">
          <TextCustom
            variation="h5"
            lineHeight="tight"
            weight="normal"
            color="neutral-dark">
            Cuotas pagadas{' '}
            <TextCustom
              text={canceledInstallmentsFormat}
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color="neutral-darkest"
            />
          </TextCustom>
          <TextCustom
            variation="h5"
            lineHeight="tight"
            weight="normal"
            color="neutral-dark">
            Cuotas pendientes{' '}
            <TextCustom
              text={pendingInstallmentsFormat}
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color="neutral-darkest"
            />
          </TextCustom>
        </BoxView>

        <Separator type="xx-small" />

        <Progress.Bar
          borderRadius={5}
          borderWidth={0}
          unfilledColor={COLORS.Neutral.Light}
          progress={advancePorcentage}
          height={8}
          width={null}
          color={COLORS.Secondary.Medium}
        />

        <Separator type="x-small" />
        <TextCustom
          align="center"
          variation="h5"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark">
          Total cuotas{' '}
          <TextCustom
            text={quotasNumberFormat}
            variation="h5"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
          />
        </TextCustom>
      </View>
    </BoxView>
  );
};
