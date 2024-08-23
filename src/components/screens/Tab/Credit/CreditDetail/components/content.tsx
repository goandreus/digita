import {Share, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';
import BoxView from '@atoms/BoxView';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import Icon from '@atoms/Icon';
import {SumaryCard} from './sumaryCard';
import {cardStyles as styles} from '../styles';
import {PayCard} from './payCard';
import {COLORS} from '@theme/colors';
import {CreditDetailInterface} from '@services/Accounts';

interface Props {
  data: CreditDetailInterface | null;
  name: string;
  sumary: ReactNode;
  payCard: ReactNode;
}

export const Content = ({data, name, sumary, payCard}: Props) => {
  const handleShare = () => {
    Share.share({
      message: `N° de crédito ${data?.individualAccountId}`,
    });
  };

  return (
    <>
      <BoxView px={SIZES.LG} background="background-light">
        <Separator type="large" />
        <TextCustom
          text={name}
          variation="h4"
          size={20}
          lineHeight="tight"
          weight="bold"
          color="primary-medium"
        />
        <Separator type="xx-small" />
        <BoxView align="center" direction="row" justify="space-between">
          <TextCustom
            text={`Nº de crédito ${data?.individualAccountId}`}
            variation="h5"
            lineHeight="tight"
            weight="normal"
            color="neutral-dark"
          />

          <TouchableOpacity onPress={handleShare}>
            <BoxView direction="row" align="center">
              <Icon
                name="share-two"
                size={14}
                color={'#000'}
                style={{marginRight: SIZES.XS}}
              />
              <TextCustom
                color="primary-dark"
                variation="h6"
                weight="normal"
                lineHeight="tight"
                text="Compartir"
              />
            </BoxView>
          </TouchableOpacity>
        </BoxView>
        <Separator type="medium" />
        {sumary}
        <Separator type="large" />
      </BoxView>
      <Separator type="large" />
      {payCard}
      <Separator type="small" />
      <BoxView
        direction="row"
        align="center"
        background="informative-lightest"
        p={SIZES.MD}
        style={styles.disclaimerContainer}>
        <BoxView>
          <Icon
            name="exclamation-circle-inverted"
            size="x-small"
            fill={COLORS.Informative.Dark}
          />
        </BoxView>
        <BoxView ml={SIZES.XS} flex={1}>
          <TextCustom
            color="informative-dark"
            variation="h6"
            weight="normal"
            text="Paga tu cuota por la app de lunes a sábado de 06:00 am a 8:30 pm excepto feriados."
          />
        </BoxView>
      </BoxView>
      <Separator type="large" />
    </>
  );
};

Content.SumaryCard = SumaryCard;
Content.PayCard = PayCard;
