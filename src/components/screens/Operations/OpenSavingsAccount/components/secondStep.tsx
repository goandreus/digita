/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions} from 'react-native';
import TextCustom from '@atoms/extra/TextCustom';
import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';
import Separator from '@atoms/extra/Separator';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {Path, Svg} from 'react-native-svg';
import {OpenEntrepreneurAccountSreenProps} from '@navigations/types';
import {styles} from '../styles';

export const SecondStep = ({
  type,
}: {
  type: OpenEntrepreneurAccountSreenProps['route']['params']['type'];
}) => {
  return (
    <>
      <Svg
        style={{alignSelf: 'center'}}
        width={Dimensions.get('screen').width}
        height="191"
        viewBox="30 0 360 191"
        fill="none"
        xmlns="http://www.w3.org/3000/svg">
        <Path
          scaleX={1.17}
          d="M8.24928e-05 0H360L360 169.063C360 169.063 274.5 194 173.95 194C73.3993 194 0 169.063 0 169.063L8.24928e-05 0Z"
          fill="#FFECEC"
        />
      </Svg>
      <BoxView style={{top: -150}} direction="row">
        <BoxView style={{width: '66%'}} pl={24}>
          <TextCustom
            variation="h2"
            color="primary-medium"
            text="Cuenta de ahorros"
            size={18}
          />
          {type === 'entrepreneur' ? (
            <TextCustom
              variation="h2"
              color="primary-medium"
              text="Emprendedores"
              weight="bold"
              size={32}
            />
          ) : (
            <TextCustom
              variation="h2"
              color="primary-medium"
              text="WOW"
              weight="bold"
              size={32}
            />
          )}
          {type === 'entrepreneur' ? (
            <TextCustom
              variation="h2"
              color="primary-darkest"
              text="Pensada para impulsar tu negocio y tus sueños."
              size={16}
            />
          ) : (
            <TextCustom
              variation="h2"
              color="primary-darkest"
              text="Donde tu dinero crece más rápido con una súper tasa."
              size={16}
            />
          )}
        </BoxView>
        {type === 'entrepreneur' ? (
          <Icon name="icon_entrepreneur-saving" size={120} />
        ) : (
          <Icon
            style={{transform: [{scaleX: -1}]}}
            name="icon_wow-saving"
            size={120}
          />
        )}
      </BoxView>
      <Separator size={-90} />
      <BoxView mx={24} background="background-lightest">
        <BoxView direction="row" align="center">
          {type === 'entrepreneur' ? (
            <>
              <Icon name="icon_cellphoneWithCash" size={36} />
              <TextCustom style={{marginLeft: 16, width: 242, flexShrink: 1}}>
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
            </>
          ) : (
            <>
              <Icon name="icon_tea" size={36} />
              <TextCustom style={{marginLeft: 16, width: 242, flexShrink: 1}}>
                <TextCustom
                  variation="p5"
                  color="neutral-darkest"
                  text="Accede a una "
                  size={16}
                />
                <TextCustom
                  variation="p5"
                  color="neutral-darkest"
                  weight="bold"
                  text="súper tasa"
                  size={16}
                />
                <TextCustom
                  variation="p5"
                  color="neutral-darkest"
                  text=" según campaña. A mayor saldo, mayor tasa."
                  size={16}
                />
              </TextCustom>
            </>
          )}
        </BoxView>
        <BoxView direction="row" mt={24} align="center">
          {type === 'entrepreneur' ? (
            <>
              <Icon name="icon_cash" size={36} />
              <TextCustom style={{marginLeft: 16, width: 242, flexShrink: 1}}>
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
            </>
          ) : (
            <>
              <Icon name="icon_money-hand" size={36} />
              <TextCustom style={{marginLeft: 16, width: 242, flexShrink: 1}}>
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
                  text=" depósitos ilimitados gratis "
                  size={16}
                />
                <TextCustom
                  variation="p5"
                  color="neutral-darkest"
                  text={'en ventanilla y agentes Kasnet.'}
                  size={16}
                />
              </TextCustom>
            </>
          )}
        </BoxView>
        <BoxView direction="row" mt={24} align="center">
          <Icon name="icon_zeroSoles" size={36} />
          <TextCustom style={{marginLeft: 16, width: 242, flexShrink: 1}}>
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
        <Separator size={24} />
        <BoxView
          direction="row"
          align="center"
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
      </BoxView>
    </>
  );
};
