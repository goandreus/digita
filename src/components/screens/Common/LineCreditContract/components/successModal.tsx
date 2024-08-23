import {View, TouchableOpacity, Image, Dimensions} from 'react-native';
import React, {useRef} from 'react';
import SuccessModal from '@molecules/extra/SuccessModal';
import Separator from '@atoms/extra/Separator';
import BoxView from '@atoms/BoxView';
import {modalStyles as styles} from '../styles';
import {SIZES} from '@theme/metrics';
import {useLineCreditContractContext} from '../context';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import {shareScreenshot} from '@utils/screenshot';
import {COLORS} from '@theme/colors';
import Button from '@atoms/extra/Button';
import {Path, Svg} from 'react-native-svg';

const SuccessLineContractContent = ({viewShotRef}: {viewShotRef?: any}) => {
  const {goHome, goSimulation, successData, loadNavigation} =
    useLineCreditContractContext();
  return (
    <BoxView pt={SIZES.LG}>
      <BoxView align="center">
        <TextCustom
          text="¡Línea de Crédito creada!"
          color="primary-medium"
          weight="normal"
          variation="h2"
        />
        <TextCustom
          text="Ahora tienes efectivo para cuando lo necesites"
          color="primary-medium"
          weight="normal"
          variation="h5"
        />
        <Separator type="medium" />
        <TextCustom
          text="Monto de Línea de Crédito"
          color="neutral-darkest"
          weight="normal"
          variation="h4"
        />
        <Separator type="xx-small" />
        <TextCustom
          text={successData?.sDisbursedAmount}
          color="neutral-darkest"
          weight="normal"
          variation="h1"
        />
        <Separator type="x-small" />
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
        py={SIZES.MD}
        direction="row"
        align="center"
        justify="space-between"
        mx={SIZES.LG}
        style={styles.block}>
        <TextCustom
          text="Vigente hasta"
          variation="h5"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        <View>
          <TextCustom
            text={successData?.dateEffective}
            variation="h5"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-dark"
          />
        </View>
      </BoxView>

      <BoxView
        py={SIZES.MD}
        direction="row"
        align="center"
        justify="space-between"
        mx={SIZES.LG}
        style={styles.block}>
        <TextCustom
          text="Nº operación"
          variation="h5"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        <View>
          <TextCustom
            text={`${successData?.operationNumber}`}
            variation="h5"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-dark"
          />
        </View>
      </BoxView>
      <Separator type="medium" />

      <BoxView
        direction="row"
        align="center"
        justify="center"
        background="informative-lightest"
        mx={SIZES.LG}
        p={SIZES.MD}
        style={styles.containerInfo}>
        <Icon
          name="icon_mail-blue"
          size="normal"
          fill={COLORS.Informative.Medium}
        />
        <BoxView flex={1}>
          <TextCustom
            style={styles.text}
            color="informative-dark"
            variation="h6"
            lineHeight="fair"
            weight="normal"
            text={`Enviaremos los documentos contractuales de tu Línea de Crédito al correo: ${successData?.email}`}
          />
        </BoxView>
      </BoxView>

      <Separator type="medium" />

      {viewShotRef && (
        <BoxView p={SIZES.LG * 2} align="center" background="error-lightest">
          {/* <BoxView
            background="error-lightest"
            py={SIZES.LG}
            px={SIZES.MD}
            style={styles.infoContainer}>
            <BoxView direction="row">
              <Image
                style={styles.logo}
                source={require('@assets/images/advisorCall.png')}
              />
              <BoxView flex={1} justify="center" ml={SIZES.XS}>
                <TextCustom
                  color="primary-medium"
                  variation="h4"
                  lineHeight="tight"
                  weight="normal"
                  text={'¡Llama a tu asesor!'}
                />
                <TextCustom
                  color="neutral-darkest"
                  variation="h6"
                  lineHeight="comfy"
                  weight="normal"
                  text={
                    'Comunícate con tu asesor para que obtengas dinero de tu Línea de Crédito sin ir a la agencia.'
                  }
                />
              </BoxView>
            </BoxView>
          </BoxView> */}
          <Icon name="money-line-credit" size={85} />
          <Separator type="small" />
          <TextCustom
            color="primary-medium"
            variation="h0"
            lineHeight="fair"
            weight="normal"
            text={'¡Obtén dinero ahora!'}
          />
          <Separator type="small" />
          <TextCustom
            color="neutral-darkest"
            variation="p4"
            lineHeight="comfy"
            weight="normal"
            text="El momento de hacer realidad tus planes ha llegado. Haz la primera disposición de tu Línea de Crédito."
          />
          <Separator type="medium" />
          <Button
            containerStyle={styles.containerBtn}
            text={'Obtener dinero'}
            type="primary"
            onPress={goSimulation}
            disabled={loadNavigation}
          />
          <Separator type="small" />
          <Button
            containerStyle={styles.containerBtn}
            text={'Lo haré luego'}
            type="primary-inverted"
            haveBorder={true}
            onPress={goHome}
            disabled={loadNavigation}
          />
        </BoxView>
      )}
    </BoxView>
  );
};

export const SuccessLineContract = () => {
  const {showSuccessModal, setShowSuccessModal} =
    useLineCreditContractContext();
  const viewShotRef = useRef(null);

  return (
    <>
      {/* Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        statusBarTranslucent
        extraBottomPadding={false}
        icon="individual"
        closeModal={() => setShowSuccessModal(false)}>
        <BoxView>
          <Separator size={-110} />
          <SuccessLineContractContent viewShotRef={viewShotRef} />
        </BoxView>
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
            source={require('@assets/images/successMan.png')}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              alignSelf: 'center',
              bottom: 95,
            }}
          />
          <Separator size={-90} />
          <SuccessLineContractContent />
        </View>
      )}
    </>
  );
};
