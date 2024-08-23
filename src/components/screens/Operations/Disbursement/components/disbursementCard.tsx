/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, Image, View} from 'react-native';
import BoxView from '@atoms/BoxView';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import {Path, Svg} from 'react-native-svg';
import {indexStyles as styles} from '../styles';
import Icon from '@atoms/Icon';
import {SIZES} from '@theme/metrics';
import {nameForTransfer} from '@utils/nameForTransfer';
import {useUserInfo} from '@hooks/common';
import moment from 'moment';
import {Saving} from '@features/userInfo';
import {COLORS} from '@theme/colors';

interface Props {
  viewShotRef?: any;
  data: any;
  originAccount?: Saving | null;
}

const DisbursementCard = ({viewShotRef, data, originAccount}: Props) => {
  const {userCreditToDisburt} = useUserInfo();
  const arrNames = nameForTransfer(
    data?.typeAccount || originAccount?.productName,
  );
  const creditPending = userCreditToDisburt;
  const firstDayPayment = moment(data?.dateFirstPayment)
    .format('DD MMM YYYY')
    .replace(/\b\w/g, l => l.toUpperCase());

  return (
    <View
      ref={viewShotRef}
      collapsable={false}
      style={{
        backgroundColor: '#FFF',
        position: 'absolute',
        width: Dimensions.get('window').width,
        left: -Dimensions.get('screen').width,
      }}>
      <Svg
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
        style={{
          alignSelf: 'center',
          bottom: 95,
        }}
      />
      <Separator size={-90} />
      <View style={{padding: SIZES.LG, backgroundColor: '#FFF'}}>
        <BoxView align="center">
          <TextCustom
            text="¡Crédito desembolsado!"
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
            text={creditPending?.sCreditDeposit}
            color="neutral-darkest"
            weight="normal"
            variation="h1"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={`${data?.dateTransaction} - ${data?.hourTransaction}`}
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
            text="Depositado en"
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
              text={data.disburseAccount || originAccount?.accountCode!}
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
          <BoxView direction="row">
            <TextCustom
              text="Cuota mensual"
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
          </BoxView>
          <TextCustom
            text={data?.sPaymentMonth}
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
              text={creditPending?.payments}
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
              text={firstDayPayment}
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
            text="Día de pago"
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
          <BoxView>
            <TextCustom
              text={`${creditPending?.payDay} de cada mes`}
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
              text={data?.stea}
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
              text={data?.stcea}
              color="neutral-darkest"
              weight="normal"
              variation="h5"
            />
          </BoxView>
        </BoxView>
        {creditPending?.insurance !== '' ? (
          <>
            <BoxView
              py={SIZES.LG}
              direction="row"
              align="center"
              justify="space-between"
              style={styles.block}>
              <BoxView direction="row" align="center">
                <TextCustom
                  text={creditPending?.insurance}
                  variation="h5"
                  lineHeight="tight"
                  weight="normal"
                  color="neutral-dark"
                />
              </BoxView>
              <BoxView>
                <TextCustom
                  text={`${creditPending?.sInsuranceAmount}`}
                  variation="h5"
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
              <TextCustom
                text="Monto total del préstamo"
                color="neutral-dark"
                weight="normal"
                variation="h5"
              />
              <BoxView>
                <TextCustom
                  text={creditPending?.sCreditFormat2}
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
          <TextCustom
            text="Nª operación"
            color="neutral-dark"
            weight="normal"
            variation="h5"
          />
          <BoxView>
            <TextCustom
              text={`${data?.operationNumber}`}
              color="neutral-darkest"
              weight="normal"
              variation="h5"
            />
          </BoxView>
        </BoxView>
        <Separator type="large" />

        <BoxView style={styles.banner} background="background-light">
          <BoxView direction="row" align="center">
            <Icon name="icon_schedule" size={56} />
            <BoxView ml={17} flex={1}>
              <TextCustom
                variation="h5"
                text="Cronograma de pagos"
                size={18}
                color="primary-medium"
                weight="normal"
              />
              <Separator type="xx-small" />
              <TextCustom
                variation="h5"
                text={
                  'Encuéntralo junto a los documentos\ncontractuales de tu crédito que hemos\nenviado al correo:'
                }
                color="neutral-darkest"
                weight="normal"
              />
              <Separator type="x-small" />
              <TextCustom
                variation="h5"
                text={data?.email}
                color="primary-darkest"
                weight="normal"
              />
            </BoxView>
          </BoxView>
        </BoxView>

        <Separator type="large" />
        <BoxView
          direction="row"
          align="center"
          background="informative-lightest"
          py={SIZES.MD}
          style={styles.disclaimerContainer}>
          <BoxView style={styles.disclaimerIcon}>
            <Icon
              name="exclamation-circle-inverted"
              size="x-small"
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
      </View>
    </View>
  );
};

export default DisbursementCard;
