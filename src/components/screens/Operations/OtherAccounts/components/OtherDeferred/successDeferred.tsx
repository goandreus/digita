/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {View, TouchableOpacity, Dimensions} from 'react-native';
import SuccessModal from '@molecules/extra/SuccessModal';
import {useOtherAccountsContext} from '../../contexts';
import BoxView from '@atoms/BoxView';
import {SIZES} from '@theme/metrics';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import {convertToCurrency} from '@utils/convertCurrency';
import Icon from '@atoms/Icon';
import {shareScreenshot} from '@utils/screenshot';
import {indexStyles as styles} from '../../styles';
import Button from '@atoms/extra/Button';
import {COLORS} from '@theme/colors';
import {Image} from 'react-native';
import ScheduleModal from '@molecules/extra/ScheduleModal';
import HeaderWithLogo from '@molecules/extra/SuccessModal/Components/HeaderWithLogo';

interface PropsContent {
  viewShotRef?: any;
}

const TransferDeferredContent = ({viewShotRef}: PropsContent) => {
  const {
    bankCodes,
    initialForm,
    originAccount,
    scheduleModal,
    confirmationDeferred,
    queryInfo,
    successModal,
    favoriteModalUtils,
  } = useOtherAccountsContext();
  const {
    itfTax,
    originCommission,
    destinationCommission,
    destinationAccountNumber,
  } = queryInfo;
  const {
    values: {amount, destinationAccount},
  } = initialForm;
  const {
    values: {concept},
  } = confirmationDeferred;

  const successData = successModal?.data;
  const amountCharged = convertToCurrency(amount! || 0);
  const total = convertToCurrency(
    itfTax! + originCommission! + destinationCommission! + amount!,
  );

  const bankCode = parseInt(destinationAccount.slice(0, 3));
  const bankName = bankCodes?.current?.get(bankCode)!;

  return (
    <BoxView px={SIZES.MD}>
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

        {/* favoritos */}

        {
            favoriteModalUtils?.isOpenFavDisclaimer && (
              <>
              <Separator type="medium" />
              <BoxView
                style={styles.favorite_success}
                background="success-lightest"
                direction="row"
                align="center">
                <Icon
                  name="check-success"
                  size="x-small"
                  fill={COLORS.Primary.Medium}
                />
                <TextCustom
                  style={styles.text}
                  text={'Hemos guardado esta operación como favorita.'}
                  variation="h5"
                  lineHeight="tight"
                  weight="normal"
                  color={'success-medium'}
                />
              </BoxView>
              </>
            )
          }
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
            <TextCustom
              text={destinationAccountNumber}
              variation="h5"
              align="right"
              lineHeight="tight"
              weight="normal"
              color="neutral-darkest"
            />
            <Separator type="xx-small" />
            <TextCustom
              text={bankName}
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
            text="ITF"
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
          <BoxView>
            <TextCustom
              text={`${originAccount?.currency} ${convertToCurrency(
                itfTax || 0,
                5,
                4,
              )}`}
              color="neutral-darkest"
              weight="normal"
              variation="h5"
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
            style={{width: SIZES.LG * 6}}
            text="Comisión Compartamos Financiera"
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
          <BoxView>
            <TextCustom
              text={
                originCommission === 0
                  ? 'Gratis'
                  : `${originAccount?.currency} ${convertToCurrency(
                      originCommission || 0,
                    )}`
              }
              color="primary-medium"
              weight="normal"
              variation="h5"
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
            style={{width: SIZES.LG * 6}}
            text="Comisión banco destino"
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
          <BoxView>
            <TextCustom
              text={`${originAccount?.currency} ${convertToCurrency(
                destinationCommission || 0,
              )}`}
              color="neutral-darkest"
              weight="normal"
              variation="h5"
              align="right"
              lineHeight="tight"
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
            text="Total cargado"
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
          <BoxView>
            <TextCustom
              text={`${originAccount?.currency} ${total}`}
              color="neutral-darkest"
              weight="normal"
              variation="h5"
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
            style={{width: SIZES.LG * 6}}
            text="Tipo de transferencia"
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
          <BoxView>
            <TextCustom
              text={'Diferida'}
              color="neutral-darkest"
              weight="normal"
              variation="h5"
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
        {concept.length !== 0 && (
          <>
            <Separator type="large" />
            <BoxView>
              <TextCustom
                text="Mensaje"
                variation="h5"
                color="neutral-darkest"
                weight="normal"
              />
              <Separator type="x-small" />
              <View style={styles.messageContainer}>
                <TextCustom
                  text={concept}
                  variation="p5"
                  color="neutral-darkest"
                />
              </View>
            </BoxView>
          </>
        )}
        <Separator type="large" />
        <BoxView
          direction="row"
          align="center"
          p={SIZES.MD}
          style={styles.containerInfoDeferred}>
          <Image
            source={require('@assets/images/clock.png')}
            style={styles.imageClock}
          />
          <BoxView flex={1}>
            <TextCustom
              style={styles.text}
              color="neutral-darkest"
              variation="h4"
              lineHeight="tight"
              weight="normal"
              text="Recuerda"
            />
            <Separator type="xx-small" />
            <TextCustom
              style={styles.text}
              color="neutral-darkest"
              variation="h6"
              lineHeight="fair"
              weight="normal">
              Las transferencias diferidas pueden tardar como máximo 72 horas.{' '}
              <TextCustom
                style={styles.text}
                decoration="underline"
                weight="normal"
                variation="h6"
                color="primary-dark"
                lineHeight="fair"
                onPress={() => scheduleModal.onOpen()}>
                Revisa los horarios aquí.
              </TextCustom>
            </TextCustom>
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
        <Separator type="small" />
      </View>
      {/* Schedule Modal */}
      <ScheduleModal
        open={scheduleModal.isOpen}
        onClose={scheduleModal.onClose}
      />
    </BoxView>
  );
};

export const SuccessTransferDeferred = () => {
  const {successModal, setSuccessModal, handleGoToHome} =
    useOtherAccountsContext();
  const viewShotRef = useRef(null);

  return (
    <>
      {/* Modal */}
      <SuccessModal
        hasLogo
        hasScrollButton
        isOpen={successModal.isOpen}
        closeModal={() => setSuccessModal(prev => ({...prev, isOpen: false}))}>
        <Separator size={-364} />
        <BoxView p={SIZES.MD} background="background-lightest">
          <TransferDeferredContent viewShotRef={viewShotRef} />
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

      {/* Shared Voucher */}
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
        <TransferDeferredContent />
      </View>
    </>
  );
};
