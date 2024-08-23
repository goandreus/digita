import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import RNModal from 'react-native-modal';
import {modalStyles} from '../styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import {COLORS} from '@theme/colors';
import BoxView from '@atoms/BoxView';
import {SIZES} from '@theme/metrics';
import Icon from '@atoms/Icon';
import Button from '@atoms/extra/Button';
import {useLineSimulationContext} from '../context';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handle: () => void;
}

export const Modal = ({isOpen, onClose, handle}: Props) => {
  const {loading, withCancellation, simulationData} =
    useLineSimulationContext();
  const insets = useSafeAreaInsets();
  const styles = modalStyles(insets);

  return (
    <RNModal
      backdropTransitionOutTiming={0}
      animationInTiming={1000}
      animationOutTiming={600}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      statusBarTranslucent
      useNativeDriver
      useNativeDriverForBackdrop
      backdropColor={COLORS.Neutral.Dark}
      backdropOpacity={0.78}
      isVisible={isOpen}
      style={styles.modal}>
      <View style={styles.container}>
        <TextCustom
          text={
            withCancellation
              ? 'Monto total del nuevo desembolso'
              : 'Te depositaremos en tu cuenta de ahorros'
          }
          color="neutral-lightest"
          lineHeight="tight"
          variation="h5"
          weight="normal"
          align="center"
        />
        <Separator type="xx-small" />
        <TextCustom
          text={`${simulationData?.sTotalAmountRequest}`}
          color="neutral-lightest"
          lineHeight="tight"
          size={40}
          variation="h5"
          weight="normal"
          align="center"
        />
        <TextCustom
          text={`TEA ${simulationData?.tea}%`}
          color="neutral-lightest"
          lineHeight="tight"
          variation="h6"
          weight="normal"
          align="center"
        />

        {withCancellation && (
          <>
            <Separator type="medium" />
            <TextCustom
              text={'¿Qué incluye el monto total?'}
              color="neutral-lightest"
              lineHeight="tight"
              variation="h5"
              weight="normal"
              align="center"
            />
            <Separator type="xx-small" />
            <BoxView
              px={SIZES.MD}
              py={SIZES.LG}
              background="primary-dark"
              style={styles.radiusContainer}>
              <BoxView direction="row" align="center" justify="space-between">
                <TextCustom
                  text="Depositaremos en tu cuenta"
                  color="neutral-lightest"
                  lineHeight="fair"
                  variation="h6"
                  weight="normal"
                  align="center"
                />
                <TextCustom
                  text={simulationData?.sAmountAccount}
                  color="secondary-light"
                  lineHeight="tight"
                  variation="h4"
                  weight="bold"
                  align="center"
                />
              </BoxView>

              <Separator type="x-small" />

              <BoxView direction="row" align="center" justify="space-between">
                <TextCustom
                  text={'Cancelaremos la deuda actual\nde tu Línea de Crédito*'}
                  color="neutral-lightest"
                  lineHeight="fair"
                  variation="h6"
                  weight="normal"
                />
                <TextCustom
                  text={simulationData?.sCurrentDebtCancellation}
                  color="neutral-lightest"
                  lineHeight="tight"
                  variation="h4"
                  weight="normal"
                  align="center"
                />
              </BoxView>
            </BoxView>
            <Separator type="xx-small" />
            <TextCustom
              text="(*) Incluyen los interéses y gastos adicionales al día de hoy"
              color="primary-light"
              lineHeight="tight"
              variation="h6"
              weight="normal"
              align="center"
            />
          </>
        )}

        <Separator type="medium" />
        <BoxView
          style={styles.subContainer}
          align="center"
          background="background-lightest"
          py={SIZES.LG}>
          <TextCustom
            text="Pagarías"
            color="neutral-dark"
            lineHeight="tight"
            variation="h5"
            weight="normal"
          />
          <Separator type="x-small" />
          <TextCustom
            text={`${simulationData?.quotesNumber} cuotas mensuales de`}
            color="neutral-darkest"
            lineHeight="tight"
            variation="h0"
            weight="normal"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={`${simulationData?.sQuoteAmount}`}
            color="primary-medium"
            lineHeight="tight"
            variation="h1"
            weight="normal"
          />
          <Separator type="small" />
          <TouchableOpacity onPress={onClose}>
            <BoxView direction="row">
              <Icon
                iconName="icon_pencil"
                color={COLORS.Warning.Darkest}
                size={14}
              />
              <TextCustom
                style={styles.margin}
                text="Cambiar simulación"
                color="warning-darkest"
                decoration="underline"
                lineHeight="tight"
                variation="h4"
                weight="normal"
              />
            </BoxView>
          </TouchableOpacity>
        </BoxView>
        <Separator type="xx-small" />
        <TextCustom
          text="El monto de la cuota es referencial."
          color="primary-light"
          lineHeight="tight"
          variation="h6"
          weight="normal"
          align="center"
        />
        <Separator type="medium" />
        <Button
          containerStyle={styles.containerBtn}
          onPress={handle}
          loading={loading}
          textStyle={styles.textBtn}
          orientation="horizontal"
          type="secondary"
          text={'Obtener desembolso'}
          disabled={loading}
        />
      </View>
    </RNModal>
  );
};
