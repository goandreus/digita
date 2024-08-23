import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import SuccessModal from '@molecules/extra/SuccessModal';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-community/clipboard';
import Separator from '@atoms/extra/Separator';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import Button from '@atoms/extra/Button';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {styles} from '../styles';

export const SuccessOpenEntrepreneurModal = ({
  isOpen,
  data,
  loadingActionButton1,
  loadingActionButton2,
  closeSuccessModal,
}: {
  isOpen: boolean;
  data: any;
  loadingActionButton1: boolean;
  loadingActionButton2: boolean;
  closeSuccessModal: (screenNAme: string) => void;
}) => {
  const {datetime, accountSavingName, accountSaving, cci, email} = data;

  const copyToClipboard = () => {
    Clipboard.setString(
      `Mi número de ${accountSavingName} en Compartamos Financiera es: ${accountSaving}.\nMi número de Cuenta Interbancario en Compartamos Financiera es: ${cci}.`,
    );
    Toast.show({
      type: 'info',
      text1: ' ',
      text2: 'Número de cuenta copiado',
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  return (
    <SuccessModal isOpen={isOpen} hasToast closeModal={() => {}}>
      <Separator size={-90} />
      <BoxView p={SIZES.LG} mb={SIZES.XS * 2} background="background-lightest">
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{padding: SIZES.XXS, backgroundColor: '#FFF'}}>
          <BoxView align="center">
            <TextCustom
              text={`¡Aperturaste con éxito tu\n${accountSavingName}!`}
              color="primary-medium"
              weight="normal"
              variation="h2"
              align="center"
            />
            <Separator type="medium" />
            <TextCustom
              text={datetime}
              color="neutral-dark"
              weight="normal"
              variation="h4"
            />
            <Separator type="medium" />
            <TouchableOpacity onPress={() => copyToClipboard()}>
              <BoxView direction="row" align="center">
                <Icon
                  iconName="icon_clipboard"
                  color={COLORS.Primary.Medium}
                  size={18}
                  style={{marginHorizontal: SIZES.XS}}
                />
                <TextCustom
                  text="Copiar Cuenta"
                  color="primary-darkest"
                  variation="h5"
                />
              </BoxView>
            </TouchableOpacity>
          </BoxView>
          <BoxView
            py={SIZES.LG}
            direction="row"
            align="center"
            mt={24}
            style={styles.block}
            justify="space-between">
            <TextCustom
              text={accountSavingName}
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
            <BoxView>
              <Separator type="xx-small" />
              <TextCustom
                text={accountSaving}
                variation="h5"
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
            justify="space-between">
            <TextCustom
              text="Cuenta interbancaria CCI"
              color="neutral-dark"
              weight="normal"
              variation="h5"
            />
            <BoxView>
              <TextCustom
                text={cci}
                color="neutral-darkest"
                weight="normal"
                variation="h5"
              />
            </BoxView>
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
              text={`Enviaremos los documentos contractuales de la apertura hasta en dos días hábiles al correo ${email}`}
            />
          </BoxView>
          <Separator type="medium" />
          <BoxView
            style={styles.containerBox}
            py={12}
            pl={16}
            background="background-light"
            direction="row"
            align="center"
            alignSelf="center">
            <Icon name="icon_payWithPhone" fill="#fff" size={75} />
            <BoxView mb={12} ml={16} style={styles.containerTexts}>
              <TextCustom
                weight="normal"
                text="Recibe pagos con tu celular"
                variation="h4"
                color="primary-medium"
                lineHeight="comfy"
              />
              <Separator size={2} />
              <TextCustom
                style={styles.containerBoxText}
                weight="normal"
                align="justify"
                variation="h6"
                text={
                  'Afiliaremos esta nueva cuenta a tu número celular y así puedas recibir dinero desde otras billeteras.'
                }
                color="neutral-darkest"
                lineHeight="comfy"
              />
            </BoxView>
          </BoxView>
        </View>
      </BoxView>
      <Button
        containerStyle={{
          ...styles.containerBtn,
          marginHorizontal: SIZES.LG * 2,
        }}
        onPress={() => closeSuccessModal('MainOperations')}
        orientation="horizontal"
        type="primary"
        haveBorder
        text="Hacer una operación"
        loading={loadingActionButton1}
        disabled={false}
      />
      <Separator size={10} />
      <Button
        containerStyle={{
          ...styles.containerBtn,
          marginHorizontal: SIZES.LG * 2,
        }}
        onPress={() => closeSuccessModal('Main')}
        orientation="horizontal"
        type="primary-inverted"
        text="Ir al inicio"
        haveBorder
        loading={loadingActionButton2}
        disabled={false}
      />
    </SuccessModal>
  );
};
