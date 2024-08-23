import React, {useEffect, useState, useRef} from 'react';
import {Image} from 'react-native';
import SuccessModal from '@molecules/extra/SuccessModal';
import {useGroupCreditContractContext} from '../context';
import Separator from '@atoms/extra/Separator';
import BoxView from '@atoms/BoxView';
import Button from '@atoms/extra/Button';
import Tooltip from '@atoms/Tooltip';
import {indexStyles as styles, modalStyles} from '../styles';
import {SIZES} from '@theme/metrics';
import {TouchableOpacity, View, Pressable, Dimensions} from 'react-native';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import {shareScreenshot} from '@utils/screenshot';
import {COLORS} from '@theme/colors';
import {Path, Svg} from 'react-native-svg';
import {useUserInfo} from '@hooks/common';

const SuccessModalGroupCreditContent = ({viewShotRef}: {viewShotRef?: any}) => {
  const {userGroupCreditToDisburt: groupCredit} = useUserInfo();
  const {successData, hasInsurance} = useGroupCreditContractContext();
  const [showTooltip1, setShowTooltip1] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const [moreInfo, setMoreInfo] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip1(false);
    }, 3600);
    return () => clearTimeout(timer);
  }, [showTooltip1]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip2(false);
    }, 3600);
    return () => clearTimeout(timer);
  }, [showTooltip2]);

  return (
    <>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{padding: SIZES.XXS, backgroundColor: '#FFF'}}>
        <BoxView align="center">
          <TextCustom
            text="¡Crédito contratado!"
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
            text="Monto total del Crédito Grupal"
            color="neutral-darkest"
            weight="normal"
            variation="h4"
          />
          <TextCustom
            text={groupCredit?.sGroupAmountTotal}
            color="neutral-darkest"
            weight="normal"
            variation="h1"
          />
          <Separator type="medium" />
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

        <Separator type="large" />

        <BoxView
          py={SIZES.LG}
          direction="row"
          align="center"
          justify="space-between"
          style={styles.block}>
          <TextCustom
            text="Grupo"
            variation="h5"
            lineHeight="tight"
            weight="normal"
            color="neutral-dark"
          />
          <TextCustom
            text={groupCredit?.groupName}
            variation="h5"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
          />
        </BoxView>

        <BoxView
          py={SIZES.LG}
          direction="row"
          align="center"
          justify="space-between"
          style={styles.block}>
          <Pressable onPress={() => setShowTooltip2(true)}>
            <BoxView direction="row" align="center" justify="center">
              <TextCustom
                text="Cuota grupal"
                variation="h5"
                lineHeight="tight"
                weight="normal"
                color="neutral-dark"
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

          <TextCustom
            text={groupCredit?.sGroupPaymentFee}
            variation="h5"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
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
            variation="h5"
            lineHeight="tight"
            weight="normal"
            color="neutral-dark"
          />
          <View>
            <TextCustom
              text={groupCredit?.sGroupPayments}
              variation="h5"
              align="right"
              lineHeight="tight"
              weight="normal"
              color="neutral-darkest"
            />
          </View>
        </BoxView>

        <BoxView
          py={SIZES.LG}
          direction="row"
          align="center"
          justify="space-between"
          style={styles.block}>
          <TextCustom
            text="Primera cuota"
            variation="h5"
            lineHeight="tight"
            weight="normal"
            color="neutral-dark"
          />
          <View>
            <TextCustom
              text={groupCredit?.sDateFirstPayment}
              variation="h5"
              align="right"
              lineHeight="tight"
              weight="normal"
              color="neutral-darkest"
            />
          </View>
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
                text="Ciclo de pago"
                variation="h5"
                lineHeight="tight"
                weight="normal"
                color="neutral-dark"
              />
              <View>
                <TextCustom
                  text={groupCredit?.sGroupPayFrequency}
                  variation="h5"
                  align="right"
                  lineHeight="tight"
                  weight="normal"
                  color="neutral-darkest"
                />
              </View>
            </BoxView>

            <BoxView
              py={SIZES.LG}
              direction="row"
              align="center"
              justify="space-between"
              style={styles.block}>
              <TextCustom
                text="TEA"
                variation="h5"
                lineHeight="tight"
                weight="normal"
                color="neutral-dark"
              />
              <View>
                <TextCustom
                  text={groupCredit?.sTea}
                  variation="h5"
                  align="right"
                  lineHeight="tight"
                  weight="normal"
                  color="neutral-darkest"
                />
              </View>
            </BoxView>

            <BoxView
              py={SIZES.LG}
              direction="row"
              align="center"
              justify="space-between"
              style={styles.block}>
              <TextCustom
                text="TCEA"
                variation="h5"
                lineHeight="tight"
                weight="normal"
                color="neutral-dark"
              />
              <View>
                <TextCustom
                  text={groupCredit?.sTcea}
                  variation="h5"
                  align="right"
                  lineHeight="tight"
                  weight="normal"
                  color="neutral-darkest"
                />
              </View>
            </BoxView>

            {hasInsurance && (
              <BoxView
                py={SIZES.LG}
                direction="row"
                align="center"
                justify="space-between"
                style={styles.block}>
                <TextCustom
                  text="Total del Seguro Protección"
                  variation="h5"
                  lineHeight="tight"
                  weight="normal"
                  color="neutral-dark"
                />
                <View>
                  <TextCustom
                    text={groupCredit?.sAmountInsuranceGroup}
                    variation="h5"
                    align="right"
                    lineHeight="tight"
                    weight="normal"
                    color="neutral-darkest"
                  />
                </View>
              </BoxView>
            )}

            {hasInsurance && (
              <BoxView
                py={SIZES.LG}
                direction="row"
                align="center"
                justify="space-between"
                style={styles.block}>
                <TextCustom
                  text="Monto grupal a desembolsar"
                  variation="h5"
                  lineHeight="tight"
                  weight="normal"
                  color="neutral-dark"
                />
                <View>
                  <TextCustom
                    text={groupCredit?.sGroupAmountDisburse}
                    variation="h5"
                    align="right"
                    lineHeight="tight"
                    weight="normal"
                    color="neutral-darkest"
                  />
                </View>
              </BoxView>
            )}

            <BoxView
              py={SIZES.LG}
              direction="row"
              align="center"
              justify="space-between"
              style={styles.block}>
              <TextCustom
                text="Nº Solicitud Crédito Grupal"
                variation="h5"
                lineHeight="tight"
                weight="normal"
                color="neutral-dark"
              />
              <View>
                <TextCustom
                  text={groupCredit?.groupRequestCode}
                  variation="h5"
                  align="right"
                  lineHeight="tight"
                  weight="normal"
                  color="neutral-darkest"
                />
              </View>
            </BoxView>
          </>
        ) : null}

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
                // eslint-disable-next-line react-native/no-inline-styles
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
            text={`Los documentos de tu crédito grupal lo enviaremos a ${successData?.email}`}
          />
        </BoxView>
        <Separator type="large" />

        <BoxView
          direction="row"
          align="center"
          background="background-light"
          p={SIZES.MD}
          style={styles.containerInfo}>
          <View style={styles.iconContainer}>
            <Icon name="man" size="x-large" />
          </View>
          <BoxView flex={1}>
            <TextCustom
              color="primary-medium"
              variation="h4"
              weight="normal"
              text={'Comunícate con tu asesor'}
            />
            <Separator type="xx-small" />
            <TextCustom
              color="neutral-darkest"
              variation="h6"
              weight="normal"
              lineHeight="fair"
              text={'Y avísale que ya contrataste el crédito grupal. '}
            />
          </BoxView>
        </BoxView>
      </View>
    </>
  );
};

export const SuccessModalGroupCredit = () => {
  const {showSuccessModal, setShowSuccessModal, goHome} =
    useGroupCreditContractContext();

  const viewShotRef = useRef(null);
  return (
    <>
      {/* Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        statusBarTranslucent
        icon="group"
        closeModal={() => setShowSuccessModal(false)}>
        <Separator size={-90} />
        <BoxView p={SIZES.LG} background="background-lightest">
          <SuccessModalGroupCreditContent viewShotRef={viewShotRef} />
        </BoxView>
        <Button
          containerStyle={{
            ...modalStyles.containerBtn,
            marginHorizontal: SIZES.LG * 2,
          }}
          onPress={goHome}
          loading={false}
          orientation="horizontal"
          type="primary"
          text={'Ir a inicio'}
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
          <SuccessModalGroupCreditContent />
        </View>
      )}
    </>
  );
};
