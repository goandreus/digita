/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useRef} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import TextCustom from '@atoms/extra/TextCustom';
import {COLORS} from '@theme/colors';
import Separator from '@atoms/extra/Separator';
import Icon from '@atoms/Icon';
import SuccessModal from '@molecules/extra/SuccessModal';
import Button from '@atoms/extra/Button';
import {SIZES} from '@theme/metrics';
import {useOtherAccountsContext} from '../../contexts';
import {convertToCurrency} from '@utils/convertCurrency';
import BoxView from '@atoms/BoxView';
import {indexStyles as styles} from '../../styles';
import {shareScreenshot} from '@utils/screenshot';
import {nameForTransfer} from '@utils/nameForTransfer';
import {Image} from 'react-native';
import HeaderWithLogo from '@molecules/extra/SuccessModal/Components/HeaderWithLogo';

export const SuccessTransferCF = () => {
  const {
    successModal,
    setSuccessModal,
    initialForm,
    originAccount,
    confirmationCF,
    queryInfo,
    handleGoToHome,
    favoriteModalUtils,
  } = useOtherAccountsContext();
  const {destinationAccountName, destinationAccountNumber} = queryInfo;
  const arrNames = useMemo(
    () => nameForTransfer(destinationAccountName! || ''),
    [destinationAccountName],
  );
  const data = successModal?.data;
  const itfTax = data?.itfTax;

  const {
    values: {amount},
  } = initialForm;
  const amountCharged = convertToCurrency(amount! || 0);
  const total = convertToCurrency(itfTax! + amount! || 0);
  const {
    values: {concept},
  } = confirmationCF;

  const viewShotRef = useRef(null);

  return (
    <>
      <SuccessModal
        hasScrollButton
        hasLogo
        isOpen={successModal.isOpen}
        closeModal={() => setSuccessModal(prev => ({...prev, isOpen: false}))}>
        <Separator size={-364} />
        <View style={{padding: SIZES.LG, backgroundColor: '#FFF'}}>
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
              text={data?.dateTimeTransaction}
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
              <Separator type="xx-small" />
              <TextCustom
                text={destinationAccountNumber}
                align="right"
                color="neutral-dark"
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
              text="Nª operación"
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
            <BoxView>
              <TextCustom
                text={`${data?.movementId}`}
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
                  weight="normal"
                  variation="h5"
                  color="neutral-darkest"
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
              text={`Enviamos la constancia de tu transferencia al correo ${data?.email}`}
            />
          </BoxView>
          <Separator type="large" />
        </View>
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
        <BoxView px={SIZES.MD}>
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
              text={data?.dateTimeTransaction}
              color="neutral-dark"
              weight="normal"
              variation="h6"
            />
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
              <Separator type="xx-small" />
              <TextCustom
                text={destinationAccountNumber}
                align="right"
                color="neutral-dark"
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
              text="Nª operación"
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
            <BoxView>
              <TextCustom
                text={`${data?.movementId}`}
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
                  weight="normal"
                  variation="h5"
                  color="neutral-darkest"
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
        </BoxView>
      </View>
    </>
  );
};
