import {View, ImageBackground, Linking} from 'react-native';
import React from 'react';
import GenericTemplate from '@templates/extra/GenericTemplate';
import {KnowMoreLineCreditScreenProps} from '@navigations/types';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import {styles} from './styles';
import BoxView from '@atoms/BoxView';
import {SIZES} from '@theme/metrics';
import LabelRoundIcon from '@atoms/LabelRoundIcon';
import {COLORS} from '@theme/colors';
import {Information} from '@global/information';

export const KnowMoreLineCredit = ({
  navigation,
  route,
}: KnowMoreLineCreditScreenProps) => {
  /* const {amount} = route.params; */

  return (
    <GenericTemplate
      isFlex
      hasPadding={false}
      hasExtraTopPadding={false}
      headerTitle="Conoce más"
      canGoBack={navigation.canGoBack()}
      goBack={() => navigation.pop()}>
      <ImageBackground
        resizeMode="stretch"
        style={styles.imageContainer}
        source={require('@assets/images/background_conocemaslinea.png')}>
        <BoxView mx={SIZES.MD}>
          <View>
            <Separator type="x-small" />
            <TextCustom
              text={'Línea de Crédito'}
              variation="h2"
              weight="normal"
              size={24}
              color="primary-medium"
            />
            <Separator type="xx-small" />
            <TextCustom
              text={'Efectivo siempre disponible para\ncuando lo necesites.'}
              variation="h4"
              weight="normal"
              lineHeight="comfy"
              color={'primary-dark'}
            />
          </View>
        </BoxView>
      </ImageBackground>

      <Separator type="medium" />

      <BoxView px={SIZES.LG} direction="row" justify="flex-start">
        <LabelRoundIcon
          icon="icon_assessment"
          text={
            <TextCustom
              variation="p4"
              weight="normal"
              color="neutral-darkest"
              lineHeight="comfy">
              <TextCustom text={'Una sola '} variation="p4" weight="bold" />
              evaluación.
            </TextCustom>
          }
        />
      </BoxView>

      <Separator type="medium" />

      <BoxView px={SIZES.LG} direction="row" justify="flex-start">
        <LabelRoundIcon
          icon="icon_disbursement"
          text={
            <TextCustom
              variation="p4"
              weight="normal"
              color="neutral-darkest"
              lineHeight="comfy">
              <TextCustom text={'Desembolsa '} variation="p4" weight="bold" />
              el total de tu Línea o solo lo que necesites.
            </TextCustom>
          }
        />
      </BoxView>

      <Separator type="medium" />

      <BoxView px={SIZES.LG} direction="row" justify="flex-start">
        <LabelRoundIcon
          icon="icon_run_clock"
          text={
            <TextCustom
              variation="p4"
              weight="normal"
              color="neutral-darkest"
              lineHeight="comfy">
              Desembolsa
              <TextCustom text={' al instante '} variation="p4" weight="bold" />
              y en cualquier momento en tu cuenta de ahorros.
            </TextCustom>
          }
        />
      </BoxView>

      <Separator type="medium" />

      <BoxView px={SIZES.LG} direction="row" justify="flex-start">
        <LabelRoundIcon
          icon="icon_run_clock"
          text={
            <TextCustom
              variation="p4"
              weight="normal"
              color="neutral-darkest"
              lineHeight="comfy">
              El monto mínimo para desembolsar es{"\n"}
              <TextCustom text={'S/1,000.00.'} variation="p4" weight="bold" />
            </TextCustom>
          }
        />
      </BoxView>

      <Separator type="medium" />

      <BoxView px={SIZES.LG} direction="row" justify="flex-start">
        <LabelRoundIcon
          icon="icon_calendar_ok"
          text={
            <TextCustom
              variation="p4"
              weight="normal"
              color="neutral-darkest"
              lineHeight="comfy">
              Plazos de pago entre{' '}
              <TextCustom variation="p4" weight="bold">
                06
              </TextCustom>{' '}
              y{' '}
              <TextCustom variation="p4" weight="bold">
                18
              </TextCustom>{' '}
              meses.
            </TextCustom>
          }
        />
      </BoxView>

      <Separator type="large" />

      <BoxView px={SIZES.LG} py={SIZES.LG} direction="row" justify="flex-start">
        <TextCustom
          text="Visita nuestra web para más información"
          decoration="underline"
          variation="h4"
          lineHeight="tight"
          style={{
            textDecorationLine: 'underline',
            color: COLORS.Primary.Medium,
          }}
          onPress={() => {
            Linking.openURL(Information.KnowMoreLineCredit);
          }}
        />
      </BoxView>
    </GenericTemplate>
  );
};
