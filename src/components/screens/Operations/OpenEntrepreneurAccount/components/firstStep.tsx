/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';
import Separator from '@atoms/extra/Separator';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {styles} from '../styles';

export const FirstStep = () => {
  return (
    <>
      <Separator size={2} />
      <BoxView
        style={{borderRadius: 25, width: '100%'}}
        py={16}
        pl={16}
        background="primary-lightest"
        direction="row"
        align="center"
        alignSelf="center">
        <Icon name="pig-save" fill="#fff" size="x-large" />
        <BoxView ml={16}>
          <TextCustom
            weight="normal"
            text="Ahorros en soles"
            variation="h4"
            size={14}
            color="primary-dark"
            lineHeight="comfy"
          />
          <TextCustom
            weight="bold"
            variation="h4"
            size={18}
            text="Cuenta Emprendedores"
            color="primary-medium"
          />
        </BoxView>
      </BoxView>
      <Separator type="large" />
      <BoxView
        py={16}
        background="background-lightest"
        style={styles.containerCard}>
        <BoxView>
          <BoxView direction="row" mt={4}>
            <Icon name="icon_cellphoneWithCash" size={36} />
            <TextCustom style={{marginLeft: 16, width: 242}}>
              <TextCustom
                variation="p5"
                color="neutral-darkest"
                text="Recibe y envía dinero en esta cuenta compartiendo solo "
                size={16}
              />
              <TextCustom
                variation="p5"
                color="neutral-darkest"
                weight="bold"
                text="tu número celular."
                size={16}
              />
            </TextCustom>
          </BoxView>
          <BoxView direction="row" mt={24} align="center">
            <Icon name="icon_zeroSoles" size={36} />
            <TextCustom style={{marginLeft: 16, width: 242}}>
              <TextCustom
                variation="p5"
                weight="bold"
                color="neutral-darkest"
                text="Sin costo"
                size={16}
              />
              <TextCustom
                variation="p5"
                color="neutral-darkest"
                text=" de mantenimiento."
                size={16}
              />
            </TextCustom>
          </BoxView>
          <BoxView direction="row" mt={24} align="center">
            <Icon name="icon_cash" size={36} />
            <TextCustom style={{marginLeft: 16, width: 242}}>
              <TextCustom
                variation="p5"
                color="neutral-darkest"
                text="Realiza"
                size={16}
              />
              <TextCustom
                variation="p5"
                weight="bold"
                color="neutral-darkest"
                text=" retiros ilimitados y gratuitos "
                size={16}
              />
              <TextCustom
                variation="p5"
                color="neutral-darkest"
                text={'en cajeros de la RED UNICARD.'}
                size={16}
              />
            </TextCustom>
          </BoxView>
        </BoxView>
      </BoxView>
      <Separator size={24} />
      <BoxView
        direction="row"
        align="center"
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
    </>
  );
};
