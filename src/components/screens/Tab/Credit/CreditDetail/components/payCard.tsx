import {View} from 'react-native';
import React from 'react';
import BoxView from '@atoms/BoxView';
import {cardStyles as styles} from '../styles';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import {SIZES} from '@theme/metrics';
import Separator from '@atoms/extra/Separator';
import Button from '@atoms/extra/Button';

interface Props {
  currency: string;
  amount?: string;
  isDuePay: boolean;
  dueDate?: string;
  onPressPay: () => void;
}

export const PayCard = ({
  amount,
  currency,
  isDuePay,
  dueDate,
  onPressPay,
}: Props) => {
  const text = isDuePay
    ? '¡Tienes cuota(s) pendiente de pago! \nHaz tu pago lo más pronto posible.'
    : 'Estás al día con el pago de tus cuotas. ¡Gracias por tu puntualidad!';

  return (
    <BoxView style={styles.payContainer}>
      <BoxView px={SIZES.MD} direction="row" align="center">
        <Icon name={isDuePay ? 'due-pay' : 'up-date-pay'} size={50} />
        <BoxView flex={1} ml={SIZES.XS}>
          <TextCustom
            text={text}
            variation="h5"
            lineHeight="fair"
            weight="normal"
            color="neutral-darkest"
          />
        </BoxView>
      </BoxView>
      <Separator type="small" />
      <BoxView
        px={SIZES.MD}
        direction="row"
        align="center"
        justify="space-between">
        <View>
          <TextCustom
            text="Tu cuota es "
            variation="h5"
            lineHeight="tight"
            weight="normal"
            color="neutral-dark"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={`${currency} ${amount}`}
            variation="h2"
            lineHeight="tight"
            weight="normal"
            color={isDuePay ? 'error-medium' : 'neutral-darkest'}
          />
          {isDuePay && (
            <>
              <Separator type="xx-small" />
              <TextCustom
                text="Incluye mora y próx. cuota"
                variation="p5"
                lineHeight="tight"
                weight="normal"
                color="neutral-dark"
              />
            </>
          )}
        </View>
        <Button
          containerStyle={{
            paddingHorizontal: SIZES.LG,
          }}
          text="Pagar cuota"
          onPress={onPressPay}
          orientation="horizontal"
          type="primary"
        />
      </BoxView>
      <Separator type="medium" />
      <BoxView
        p={SIZES.MD}
        direction="row"
        align="center"
        style={styles.paySubContainer}
        background="background-light">
        <TextCustom
          text="Día de pago"
          variation="h5"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        <TextCustom
          style={{marginLeft: SIZES.XS}}
          text={isDuePay ? 'Vencido' : dueDate}
          variation="h4"
          lineHeight="tight"
          weight="normal"
          color={
            dueDate === 'Mañana' || dueDate === 'Hoy'
              ? 'warning-medium'
              : isDuePay
              ? 'error-medium'
              : 'neutral-darkest'
          }
        />
      </BoxView>
    </BoxView>
  );
};
