import React, {ReactNode} from 'react';
import {View} from 'react-native';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import Icon from '@atoms/Icon';
import SuccessModal from '@molecules/extra/SuccessModal';
import Button from '@atoms/extra/Button';
import BoxView from '@atoms/BoxView';
import {indexStyles as styles} from '../styles';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';

export type operationType =
  | 'affiliation'
  | 'updateAffiliation'
  | 'disaffiliation';

interface SuccessAffiliationProps {
  children: ReactNode;
  isOpen: boolean;
  goToHome: (i: operationType) => void;
  goToPay: () => void;
  operationType?: operationType;
}

interface PropsContent {
  formData?: any;
  successData?: any;
  operationType?: operationType;
}

const AffiliateContent = ({successData, operationType}: PropsContent) => {
  const {
    dateFormatted,
    hourFormatted,
    accountSavingName,
    cellPhone,
    email,
    accountSaving,
  } = successData;

  return (
    <View style={styles.successContent}>
      <BoxView align="center">
        <TextCustom
          text={
            operationType === 'affiliation'
              ? 'Afiliaste tu cuenta de ahorros a tu celular!'
              : operationType !== 'disaffiliation'
              ? '¡Actualizaste tu cuenta de ahorros afiliada a tu celular!'
              : '¡Desafiliaste tu cuenta de ahorros de tu número celular!'
          }
          align="center"
          color="primary-medium"
          weight="normal"
          variation="h2"
        />
        <Separator type="large" />
        <TextCustom
          text={`${dateFormatted} - ${hourFormatted}`}
          color="neutral-dark"
          weight="normal"
          variation="h6"
        />
      </BoxView>
      <Separator type="large" />
      <BoxView
        py={SIZES.MD}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <TextCustom
          text="Cuenta de ahorros"
          color="neutral-dark"
          weight="normal"
          variation="h5"
        />
        <BoxView>
          <TextCustom
            text={accountSavingName}
            color="neutral-darkest"
            weight="normal"
            variation="h5"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={accountSaving}
            color="neutral-dark"
            align="right"
            weight="normal"
            variation="h6"
          />
        </BoxView>
      </BoxView>
      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        style={styles.block}
        justify="space-between">
        <TextCustom
          text="Número de celular"
          color="neutral-dark"
          weight="normal"
          variation="h5"
        />
        <BoxView>
          <Separator type="xx-small" />
          <TextCustom
            text={cellPhone}
            variation="h5"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
          />
        </BoxView>
      </BoxView>
      <Separator type="large" />
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
          text={`Enviamos la constancia de tu ${
            operationType === 'disaffiliation' ? 'desafiliación' : 'afiliación'
          } al correo ${email}`}
        />
      </BoxView>
      <Separator type="x-large" />
    </View>
  );
};

export const SuccessAffiliation = ({
  children,
  isOpen,
  operationType,
  goToHome,
  goToPay,
}: SuccessAffiliationProps) => {
  return (
    <SuccessModal
      isOpen={isOpen}
      closeModal={() => goToHome(operationType!)}
      statusBarTranslucent
      hasLogo>
      <Separator size={-340} />
      <BoxView px={SIZES.LG} mb={SIZES.XS * 9} background="background-lightest">
        {children}
      </BoxView>

      {operationType !== 'disaffiliation' ? (
        <>
          <Button
            containerStyle={{
              ...styles.containerBtn,
              marginHorizontal: SIZES.LG * 2,
            }}
            onPress={goToPay}
            loading={false}
            orientation="horizontal"
            type="primary"
            text={
              operationType === 'affiliation'
                ? 'Haz tu primer pago'
                : 'Pagar a un celular'
            }
            disabled={false}
          />
          <Separator size={10} />
        </>
      ) : null}

      <Button
        containerStyle={{
          ...styles.containerBtn,
          marginHorizontal: SIZES.LG * 2,
        }}
        onPress={() => goToHome(operationType!)}
        loading={false}
        orientation="horizontal"
        type={
          operationType !== 'disaffiliation' ? 'primary-inverted' : 'primary'
        }
        haveBorder={true}
        text={'Ir al inicio'}
        disabled={false}
      />
    </SuccessModal>
  );
};

SuccessAffiliation.Content = AffiliateContent;
