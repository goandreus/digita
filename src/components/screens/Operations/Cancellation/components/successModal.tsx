import React, {useMemo} from 'react';
import Separator from '@atoms/extra/Separator';
import Button from '@atoms/extra/Button';
import {SIZES} from '@theme/metrics';
import CancellationModal from '@molecules/extra/CancellationModal';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import {indexStyles as styles} from '../styles';
import {COLORS} from '@theme/colors';
import {nameForTransfer} from '@utils/nameForTransfer';
import {Saving} from '@features/userInfo';
import {CancellationData} from '@interface/Cancellation';

interface SuccessModalProps {
  isOpen: boolean;
  cancellationData: CancellationData;
  account: Saving | null;
  goHome: () => void;
}

export const SuccessModal = ({
  isOpen,
  cancellationData,
  account,
  goHome,
}: SuccessModalProps) => {
  const arrNames = useMemo(
    () => nameForTransfer(account?.productName ?? ''),
    [account],
  );

  return (
    <CancellationModal
      isOpen={isOpen}
      closeModal={() => {}}
      statusBarTranslucent>
      <Separator size={-110} />
      <BoxView px={SIZES.LG} background="background-lightest">
        <BoxView align="center">
          <TextCustom
            text={'¡Solicitud de anulación de\n cuenta generada!'}
            color="primary-medium"
            weight="normal"
            variation="h2"
            align="center"
          />
          <Separator size={30} />
          <TextCustom
            text={`${cancellationData?.date ?? ''} - ${
              cancellationData?.hour ?? ''
            }`}
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
        </BoxView>

        <Separator type="small" />
        <BoxView
          py={SIZES.LG}
          direction="row"
          align="center"
          style={styles.block}
          justify="space-between">
          <TextCustom
            text="Cuenta de ahorros"
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
          <BoxView>
            <Separator type="xx-small" />
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
              text={`⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕${account?.accountCode.slice(-4)}`}
              variation="h6"
              align="right"
              lineHeight="tight"
              weight="normal"
              color="neutral-dark"
            />
          </BoxView>
        </BoxView>

        <Separator type="medium" />
        <BoxView
          direction="row"
          align="center"
          background="informative-lightest"
          p={SIZES.MD}
          style={styles.containerInfo}>
          <Icon
            name="icon_mail-blue"
            size="normal"
            fill={COLORS.Informative.Medium}
          />
          <TextCustom
            style={styles.text}
            color="informative-dark"
            variation="h6"
            lineHeight="fair"
            weight="normal"
            text={`Enviamos la constancia de tu solicitud al correo ${cancellationData?.email}`}
          />
        </BoxView>

        <Separator type="medium" />
        <BoxView style={styles.banner} background="background-light">
          <BoxView direction="row" align="center">
            <Icon name="icon_envelope" size={56} />
            <BoxView ml={17} flex={1}>
              <TextCustom
                variation="h5"
                text="Pronto te contactaremos"
                size={16}
                color="primary-medium"
                weight="normal"
              />
              <Separator type="xx-small" />
              <TextCustom
                variation="h5"
                size={12}
                text={
                  'Cuando tu solicitud esté procesada, nos comunicaremos contigo por correo electrónico para darte más información.'
                }
                color="neutral-darkest"
                weight="normal"
              />
            </BoxView>
          </BoxView>
          <Separator type="x-small" />
        </BoxView>
      </BoxView>

      <BoxView flex={1}>
        <Separator type="large" />
      </BoxView>

      <Button
        containerStyle={{
          ...styles.containerBtn,
          marginHorizontal: SIZES.LG * 2,
        }}
        onPress={goHome}
        loading={false}
        orientation="horizontal"
        type="primary"
        haveBorder
        text="Ir a inicio"
        disabled={false}
      />
    </CancellationModal>
  );
};
