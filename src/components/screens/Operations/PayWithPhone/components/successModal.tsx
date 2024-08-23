/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode, useRef} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Separator from '@atoms/extra/Separator';
import SuccessModal from '@molecules/extra/SuccessModal';
import Button from '@atoms/extra/Button';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import {COLORS} from '@theme/colors';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import {styles} from '../styles';
import {shareScreenshot} from '@utils/screenshot';
import PayWithPhoneCard from './payWithPhoneCard';
import {IInteroperabilityExecuteData} from '@services/Interoperability';

interface PropsContent {
  viewShotRef?: any;
  successData: IInteroperabilityExecuteData;
}

interface Props {
  children: ReactNode;
  isOpen: boolean;
  goToHome: () => void;
}
const PayWithPhoneContent = ({viewShotRef, successData}: PropsContent) => {
  const {
    beneficiaryBankName,
    beneficiaryCellPhone,
    beneficiaryFullName,
    dateTransaction,
    email,
    hourTransaction,
    movementAmountFormat,
    numberOperation,
  } = successData;

  const beneficiaryName = beneficiaryFullName.replace(/(.{31})/g, '$1\n');

  return (
    <>
      <View style={{padding: SIZES.XXS, backgroundColor: '#FFF'}}>
        <BoxView align="center">
          <TextCustom
            text="¡Pago exitoso!"
            color="primary-medium"
            weight="normal"
            variation="h2"
          />
          <Separator type="medium" />
          <TextCustom
            text="Total pagado"
            color="neutral-darkest"
            weight="normal"
            variation="h4"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={movementAmountFormat}
            color="neutral-darkest"
            weight="normal"
            variation="h1"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={`${dateTransaction} - ${hourTransaction}`}
            color="neutral-dark"
            weight="normal"
            variation="h6"
          />
          <Separator type="medium" />
          <TouchableOpacity onPress={() => shareScreenshot(viewShotRef)}>
            <BoxView direction="row" align="center">
              <Icon
                iconName="icon_share-outline"
                size={18}
                color={'#000'}
                style={{marginHorizontal: SIZES.XS}}
              />
              <TextCustom
                text="Compartir constancia"
                color="primary-darkest"
                variation="h5"
              />
            </BoxView>
          </TouchableOpacity>
        </BoxView>
        <Separator type="medium" />
        <BoxView
          py={SIZES.LG}
          direction="row"
          align="center"
          style={styles.block}
          justify="space-between">
          <TextCustom
            text="Pagado a"
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
          <BoxView>
            <Separator type="xx-small" />
            <TextCustom
              text={beneficiaryName}
              variation="h6"
              align="right"
              lineHeight="tight"
              weight="normal"
              color="neutral-darkest"
            />
          </BoxView>
        </BoxView>
        <BoxView
          py={SIZES.LG}
          direction="row"
          align="center"
          justify="space-between"
          style={styles.block}>
          <BoxView direction="row">
            <TextCustom
              text="Número celular"
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
          </BoxView>
          <TextCustom
            text={`*** *** ${String(beneficiaryCellPhone)?.slice(
              String(beneficiaryCellPhone).length - 3,
              String(beneficiaryCellPhone).length,
            )}`}
            color="neutral-darkest"
            weight="normal"
            variation="h5"
          />
        </BoxView>
        <BoxView
          py={SIZES.LG}
          direction="row"
          align="center"
          justify="space-between"
          style={styles.block}>
          <BoxView direction="row">
            <TextCustom
              text="Destino"
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
          </BoxView>
          <TextCustom
            text={`${beneficiaryBankName}`}
            color="neutral-darkest"
            weight="normal"
            variation="h5"
          />
        </BoxView>
        <BoxView
          py={SIZES.LG}
          direction="row"
          align="center"
          justify="space-between"
          style={styles.block}>
          <BoxView direction="row">
            <TextCustom
              text="Nª operación"
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
          </BoxView>
          <TextCustom
            text={`${numberOperation}`}
            color="neutral-darkest"
            weight="normal"
            variation="h5"
          />
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
            text={`Enviamos la constancia de tu transferencia al correo ${email}`}
          />
        </BoxView>
      </View>
      <PayWithPhoneCard cardData={successData} viewShotRef={viewShotRef} />
    </>
  );
};

export const SuccessPayWithPhoneModal = ({
  children,
  isOpen,
  goToHome,
}: Props) => {
  const viewShotRef = useRef<any>(null);
  const childrenWithExtraProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement<any>(child, {viewShotRef});
    }
    return child;
  });
  return (
    <>
      <SuccessModal
        hasLogo
        isOpen={isOpen}
        closeModal={goToHome}
        statusBarTranslucent>
        <Separator size={-364} />
        <BoxView p={SIZES.LG} background="background-lightest">
          {childrenWithExtraProps}
        </BoxView>
        <Button
          containerStyle={{
            ...styles.containerBtn,
            marginHorizontal: SIZES.LG * 2,
          }}
          onPress={goToHome}
          loading={false}
          orientation="horizontal"
          type="primary"
          haveBorder
          text="Ir a inicio"
          disabled={false}
        />
      </SuccessModal>
    </>
  );
};

SuccessPayWithPhoneModal.Content = PayWithPhoneContent;
