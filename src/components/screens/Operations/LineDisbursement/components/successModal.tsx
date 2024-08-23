import React, {useEffect, useRef, useState} from 'react';
import {Image, Dimensions} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import Button from '@atoms/extra/Button';
import Separator from '@atoms/extra/Separator';
import SuccessModal from '@molecules/extra/SuccessModal';
import {SIZES} from '@theme/metrics';
import {indexStyles as styles} from '../styles';
import BoxView from '@atoms/BoxView';
import {useLineDisbursementContext} from '../context';
import {Pressable, TouchableOpacity, View} from 'react-native';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import Tooltip from '@atoms/Tooltip';
import {shareScreenshot} from '@utils/screenshot';
import {COLORS} from '@theme/colors';

const SuccessModalContent = ({viewShotRef}: {viewShotRef?: any}) => {
  const {withCancellation, successData, originAccount} =
    useLineDisbursementContext();
  const [moreInfo, setMoreInfo] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [showTooltip2, setShowTooltip2] = useState<boolean>(false);
  const [showTooltip3, setShowTooltip3] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 3600);
    return () => clearTimeout(timer);
  }, [showTooltip]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip2(false);
    }, 3600);
    return () => clearTimeout(timer);
  }, [showTooltip2]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip3(false);
    }, 3600);
    return () => clearTimeout(timer);
  }, [showTooltip3]);

  return (
    <BoxView p={SIZES.LG} background="background-lightest">
      <BoxView align="center">
        <TextCustom
          text="¡Desembolso exitoso!"
          color="primary-medium"
          weight="normal"
          variation="h2"
        />
        <TextCustom
          text="Sigue creciendo y cumpliendo tus sueños"
          color="primary-medium"
          weight="normal"
          variation="h5"
        />
        <Separator type="medium" />
        <TextCustom
          text="Monto desembolsado"
          color="neutral-darkest"
          weight="normal"
          variation="h4"
        />
        <Separator type="xx-small" />
        <TextCustom
          text={successData?.sDeliveredAmount}
          color="neutral-darkest"
          weight="normal"
          variation="h1"
        />
        <Separator type="xx-small" />
        <TextCustom
          text={`${successData?.dateTransaction} - ${successData?.hourTransaction}`}
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
          text="Depositado en"
          color="neutral-dark"
          weight="normal"
          variation="h5"
        />
        <BoxView>
          <Separator type="xx-small" />
          <TextCustom
            key={'key-1'}
            text={'Cuenta Emprendedor'}
            style={{marginBottom: SIZES.XXS}}
            variation="h5"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
          />
          {originAccount && (
            <TextCustom
              text={originAccount.accountCode}
              variation="h6"
              align="right"
              lineHeight="tight"
              weight="normal"
              color="neutral-dark"
            />
          )}
        </BoxView>
      </BoxView>
      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <Pressable onPress={() => setShowTooltip(true)}>
          <BoxView direction="row">
            <TextCustom
              text="Cuota mensual"
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
            <View style={styles.btnTooltip}>
              <Icon
                style={styles.iconTooltip}
                name="info-circle"
                size="tiny"
                fill="#000"
              />
              {showTooltip && (
                <Tooltip
                  width={140}
                  height={50}
                  text={'Incluye Capital + Interés\n+ Gastos asociados'}
                />
              )}
            </View>
          </BoxView>
        </Pressable>
        <TextCustom
          text={successData?.paymentMonth}
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
        <TextCustom
          text="Cuotas"
          color="neutral-dark"
          weight="normal"
          variation="h5"
        />
        <BoxView>
          <TextCustom
            text={successData?.payments}
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
          text="Primera cuota"
          color="neutral-dark"
          weight="normal"
          variation="h5"
        />
        <BoxView>
          <TextCustom
            text={successData?.dateFirstPayment}
            color="neutral-darkest"
            weight="normal"
            variation="h5"
          />
        </BoxView>
      </BoxView>
      {moreInfo || !viewShotRef ? (
        <>
          <BoxView
            py={SIZES.LG}
            direction="row"
            align="center"
            justify="space-between"
            style={styles.block}>
            <TextCustom
              text="Día de pago"
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
            <BoxView>
              <TextCustom
                text={successData?.payDay}
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
              text="TEA"
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
            <BoxView>
              <TextCustom
                text={successData?.tea}
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
              text="TCEA"
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
            <BoxView>
              <TextCustom
                text={successData?.tcea}
                color="neutral-darkest"
                weight="normal"
                variation="h5"
              />
            </BoxView>
          </BoxView>

          {withCancellation && (
            <>
              <BoxView
                py={SIZES.LG}
                direction="row"
                align="center"
                justify="space-between"
                style={styles.block}>
                <Pressable onPress={() => setShowTooltip2(true)}>
                  <TextCustom
                    text="Cancelación deuda actual"
                    color="neutral-dark"
                    weight="normal"
                    lineHeight="comfy"
                    variation="h5"
                  />
                  <BoxView direction="row" align="center">
                    <TextCustom
                      text="en Línea de Crédito"
                      color="neutral-dark"
                      weight="normal"
                      lineHeight="comfy"
                      variation="h5"
                    />
                    <View style={styles.btnTooltip}>
                      <Icon
                        style={styles.iconTooltip}
                        name="info-circle"
                        size="tiny"
                        fill="#000"
                      />
                      {showTooltip2 && (
                        <Tooltip
                          width={140}
                          height={50}
                          text={'Incluye Capital + Interés\n+ Gastos asociados'}
                        />
                      )}
                    </View>
                  </BoxView>
                </Pressable>
                <BoxView>
                  <TextCustom
                    text={successData?.currentDebtCancellation}
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
                  text="Monto total del nuevo desembolso"
                  color="neutral-dark"
                  weight="normal"
                  variation="h5"
                />
                <BoxView>
                  <TextCustom
                    text={successData?.totalAmountRequested}
                    color="neutral-darkest"
                    weight="normal"
                    variation="h5"
                  />
                </BoxView>
              </BoxView>
            </>
          )}

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
                text={`${successData?.operationNumber}`}
                color="neutral-darkest"
                weight="normal"
                variation="h5"
              />
            </BoxView>
          </BoxView>
        </>
      ) : null}
      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <Pressable onPress={() => setShowTooltip3(true)}>
          <BoxView direction="row">
            <TextCustom
              text="Disponible en Línea de Crédito"
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
            <View style={styles.btnTooltip}>
              <Icon
                style={styles.iconTooltip}
                name="info-circle"
                size="tiny"
                fill="#000"
              />
              {showTooltip3 && (
                <Tooltip
                  width={140}
                  height={50}
                  text={'Incluye Capital + Interés\n+ Gastos asociados'}
                />
              )}
            </View>
          </BoxView>
        </Pressable>
        <BoxView>
          <TextCustom
            text={successData?.amountAvailable}
            color="neutral-darkest"
            weight="normal"
            variation="h5"
          />
        </BoxView>
      </BoxView>

      <Separator type="small" />
      {viewShotRef && (
        <Pressable onPress={() => setMoreInfo(!moreInfo)}>
          <BoxView direction="row" justify="center" align="center">
            <TextCustom
              text={`Ver ${moreInfo ? 'menos' : 'más'} información`}
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
            <Icon
              style={{marginLeft: 4}}
              name={moreInfo ? 'arrow-up-light' : 'arrow-down-light'}
              stroke={COLORS.Neutral.Medium}
              size={24}
            />
          </BoxView>
        </Pressable>
      )}

      <Separator type="large" />
      <BoxView
        direction="row"
        align="center"
        justify="center"
        background="informative-lightest"
        p={SIZES.MD}
        style={styles.disclaimerContainer}>
        <BoxView>
          <Icon
            name="exclamation-circle-inverted"
            size={25}
            fill={COLORS.Informative.Dark}
          />
        </BoxView>
        <TextCustom
          style={styles.disclaimerText}
          color="informative-dark"
          variation="h6"
          weight="normal"
          text="Esta operación está afecta al pago del ITF."
        />
      </BoxView>

      <Separator type="large" />
      <BoxView style={styles.banner} background="error-lightest">
        <BoxView direction="row" align="center">
          <Icon name="hand_bills" size={61} />
          <BoxView ml={17} flex={1}>
            <TextCustom
              variation="h4"
              text="¿Necesitarás más dinero?"
              color="primary-medium"
              weight="normal"
            />
            <Separator type="xx-small" />
            <TextCustom
              variation="h6"
              color="neutral-darkest"
              weight="normal"
              lineHeight="comfy">
              Si tienes disponible en tu Línea de Crédito un monto mayor o igual
              a{' '}
              <TextCustom
                variation="h6"
                text={'S/1,000'}
                color="neutral-darkest"
                weight="bold"
                lineHeight="comfy"
              />{' '}
              puedes volver a desembolsar.
            </TextCustom>
          </BoxView>
        </BoxView>
      </BoxView>

      <Separator type="medium" />
      <BoxView style={styles.banner} background="background-light">
        <BoxView direction="row" align="center">
          <Icon name="icon_schedule" size={61} />
          <BoxView ml={17} flex={1}>
            <TextCustom
              variation="h4"
              text="Cronograma de pagos"
              color="primary-medium"
              weight="normal"
            />
            <Separator type="xx-small" />
            <TextCustom
              variation="h6"
              text={
                'Encuéntralo junto a los documentos contractuales de tu desembolso que te enviaremos en breve al correo:'
              }
              color="neutral-darkest"
              weight="normal"
              lineHeight="comfy"
            />
            <Separator type="x-small" />
            <TextCustom
              variation="h5"
              text={successData?.email}
              color="primary-darkest"
              weight="normal"
            />
          </BoxView>
        </BoxView>
      </BoxView>
      <Separator type="medium" />
      <BoxView style={styles.banner} background="warning-lightest">
        <BoxView direction="row" align="center">
          <Image
            source={require('@assets/images/payAction.png')}
            style={styles.payActionLogo}
          />
          <BoxView ml={17} flex={1}>
            <TextCustom
              variation="h4"
              lineHeight="tight"
              text="¡Olvídate de ir a la agencia!"
              color="primary-medium"
              weight="normal"
            />
            <Separator type="xx-small" />
            <TextCustom
              variation="h6"
              text={
                'Dile adiós a las colas, paga tus cuotas desde la app ¡Es fácil y seguro!'
              }
              color="neutral-darkest"
              weight="normal"
              lineHeight="comfy"
            />
          </BoxView>
        </BoxView>
      </BoxView>
      <Separator type="large" />
    </BoxView>
  );
};

export const SuccessDisburseLineModal = () => {
  const {showSuccessModal, handleGoToTransfers, handleShowDisbursement} =
    useLineDisbursementContext();

  const viewShotRef = useRef(null);

  return (
    <>
      <SuccessModal
        isOpen={showSuccessModal}
        closeModal={() => {}}
        statusBarTranslucent>
        <BoxView flex={20}>
          <Separator size={-110} />
          <SuccessModalContent viewShotRef={viewShotRef} />
        </BoxView>

        <Button
          containerStyle={{
            ...styles.containerBtn,
            marginHorizontal: SIZES.LG * 2,
          }}
          onPress={handleGoToTransfers}
          loading={false}
          orientation="horizontal"
          type="primary"
          haveBorder
          text="Transferir dinero"
          disabled={false}
        />
        <Separator type="medium" />
        <Button
          containerStyle={{
            ...styles.containerBtn,
            marginHorizontal: SIZES.LG * 2,
          }}
          onPress={handleShowDisbursement}
          loading={false}
          orientation="horizontal"
          type="primary-inverted"
          haveBorder
          text="Ver desembolso"
          disabled={false}
        />
      </SuccessModal>

      {/* Shared Voucher */}

      {showSuccessModal && (
        <View
          collapsable={false}
          ref={viewShotRef}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            padding: SIZES.LG,
            backgroundColor: '#FFF',
            position: 'absolute',
            width: Dimensions.get('window').width,
            left: -Dimensions.get('screen').width,
          }}>
          <Svg
            // eslint-disable-next-line react-native/no-inline-styles
            style={{alignSelf: 'center'}}
            width="100%"
            height="150"
            viewBox="15 24 360 112"
            fill="none">
            <Path
              scaleX={1.1}
              d="M359.998 -88.9999V75.9809C317.642 91.7253 267.715 101.952 207.381 107.565C127.797 114.968 57.6709 112.27 0 105.583L5.45208e-06 -89L359.998 -88.9999Z"
              fill="#CA005D"
            />
          </Svg>
          <Image
            source={require('@assets/images/successPeople.png')}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              alignSelf: 'center',
              bottom: 95,
            }}
          />
          <Separator size={-90} />
          <SuccessModalContent />
        </View>
      )}
    </>
  );
};
