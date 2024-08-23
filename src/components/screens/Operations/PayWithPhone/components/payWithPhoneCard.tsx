/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, Image, View} from 'react-native';
import Separator from '@atoms/extra/Separator';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import {styles} from '../styles';
import {IInteroperabilityExecuteData} from '@services/Interoperability';
import HeaderWithLogo from '@molecules/extra/SuccessModal/Components/HeaderWithLogo';

interface Props {
  viewShotRef?: any;
  cardData: IInteroperabilityExecuteData;
}

const PayWithPhoneCard = ({viewShotRef, cardData}: Props) => {
  const {
    beneficiaryBankName,
    beneficiaryCellPhone,
    beneficiaryFullName,
    dateTransaction,
    hourTransaction,
    movementAmountFormat,
    numberOperation,
  } = cardData;

  const beneficiaryName = beneficiaryFullName.replace(/(.{31})/g, '$1\n');

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
      <View style={{padding: SIZES.MD, backgroundColor: '#FFF'}}>
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
      </View>
    </View>
  );
};

export default PayWithPhoneCard;
