/* eslint-disable react-native/no-inline-styles */
import {View, Image, TouchableOpacity, Dimensions} from 'react-native';
import React, {ReactNode, useMemo, useRef} from 'react';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import {SIZES} from '@theme/metrics';
import Icon from '@atoms/Icon';
import {COLORS} from '@theme/colors';
import {shareScreenshot} from '@utils/screenshot';
import SuccessModal from '@molecules/extra/SuccessModal';
import Button from '@atoms/extra/Button';
import {indexStyles as styles} from '../styles';
import {IFormData, ISuccessData} from '../hooks/useOwnAccounts';
import {convertToCurrency} from '@utils/convertCurrency';
import {nameForTransfer} from '@utils/nameForTransfer';
import HeaderWithLogo from '@molecules/extra/SuccessModal/Components/HeaderWithLogo';

interface PropsContent {
  viewShotRef?: any;
  formData: IFormData;
  successModal: ISuccessData;
}

interface Props {
  children: ReactNode;
  isOpen: boolean;
  handleGoToHome: () => void;
  onCloseModal: () => void;
}

const TransferContent = ({
  viewShotRef,
  formData,
  successModal,
}: PropsContent) => {
  const {amountValue, originAccount, destinationAccount} = formData;
  const successData = successModal.data;

  const amountCharged = convertToCurrency(amountValue! || 0);

  const arrNames = useMemo(
    () => nameForTransfer(destinationAccount?.productName ?? ''),
    [destinationAccount],
  );

  return (
    <View style={{padding: SIZES.XXS, backgroundColor: '#FFF'}}>
      <BoxView align="center">
        <TextCustom
          text="¡Transferencia exitosa!"
          color="primary-medium"
          weight="normal"
          variation="h2"
        />
        <Separator type="medium" />
        <TextCustom
          text="Monto transferido"
          color="neutral-darkest"
          weight="normal"
          variation="h4"
        />
        <TextCustom
          text={`${originAccount?.currency} ${amountCharged}`}
          color="neutral-darkest"
          weight="normal"
          variation="h1"
        />
        <Separator type="xx-small" />
        <TextCustom
          text={successData?.dateTimeTransaction}
          color="neutral-dark"
          weight="normal"
          variation="h6"
        />
        {viewShotRef && (
          <>
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
          </>
        )}
      </BoxView>
      <Separator type="medium" />
      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        style={styles.block}
        justify="space-between">
        <TextCustom
          text="Transferido a"
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
            text={destinationAccount?.accountCode}
            variation="h6"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-dark"
          />
        </BoxView>
      </BoxView>
      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <TextCustom
          text="Desde"
          color="neutral-dark"
          weight="normal"
          variation="h5"
        />
        <BoxView>
          <TextCustom
            text={originAccount?.productName}
            color="neutral-darkest"
            weight="normal"
            variation="h5"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={originAccount?.accountCode}
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
        justify="space-between"
        style={styles.block}>
        <TextCustom
          text="Nª operación"
          color="neutral-dark"
          weight="normal"
          variation="h5"
        />
        <BoxView>
          <TextCustom
            text={`${successData?.movementId}`}
            color="neutral-darkest"
            weight="normal"
            variation="h5"
          />
        </BoxView>
      </BoxView>
      {viewShotRef && (
        <>
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
              text={`Enviamos la constancia de tu transferencia al correo ${successData?.email}`}
            />
          </BoxView>
        </>
      )}
    </View>
  );
};

export const SuccessTransferModal = ({
  children,
  isOpen,
  onCloseModal,
  handleGoToHome,
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
      {/* Modal */}
      <SuccessModal
        hasScrollButton
        hasLogo
        isOpen={isOpen}
        closeModal={onCloseModal}>
        <Separator size={-364} />
        <BoxView p={SIZES.LG} background="background-lightest">
          {childrenWithExtraProps}
        </BoxView>
        <Button
          containerStyle={{
            ...styles.containerBtn,
            marginHorizontal: SIZES.LG * 2,
          }}
          onPress={handleGoToHome}
          loading={false}
          orientation="horizontal"
          type="primary"
          text={`${'Ir a inicio'}`}
          disabled={false}
        />
      </SuccessModal>

      <View
        collapsable={false}
        ref={viewShotRef}
        style={{
          backgroundColor: '#FFF',
          position: 'absolute',
          width: Dimensions.get('window').width,
          left: -Dimensions.get('screen').width,
        }}>
        <HeaderWithLogo />
        <Separator size={-264} />
        <Image
          source={require('@assets/images/successMan.png')}
          style={{
            alignSelf: 'center',
            bottom: 95,
          }}
        />
        <Separator size={-90} />
        <BoxView px={SIZES.MD}>{children}</BoxView>
      </View>
    </>
  );
};

SuccessTransferModal.Content = TransferContent;
