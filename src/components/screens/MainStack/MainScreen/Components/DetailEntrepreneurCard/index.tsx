/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import TextCustom from '@atoms/extra/TextCustom';
import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';
import Clipboard from '@react-native-community/clipboard';
import Toast, {BaseToast, BaseToastProps} from 'react-native-toast-message';
import Separator from '@atoms/Separator';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';

export interface DetailEntrepreneurCardProps {
  title: string;
  cellphone?: string;
  accountName?: string;
  accountCode?: string;
  accountCci?: string;
}

const DetailEntrepreneurCard = ({
  title,
  cellphone,
  accountName,
  accountCode,
  accountCci,
}: DetailEntrepreneurCardProps) => {
  const styles = getStyles();
  const [showCard, setShowCard] = useState(false);

  const toastConfig = {
    info: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
      <BaseToast
        {...props}
        style={{
          borderLeftWidth: 0,
          backgroundColor: '#9a9a9a',
          opacity: 0.9,
          borderRadius: 12,
          width: '64%',
          height: 48,
        }}
        text1Style={{height: 0}}
        text2Style={{
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold',
        }}
      />
    ),
  };

  const copyToClipboard = (value: string | undefined) => {
    Clipboard.setString(`${value}`);
    Toast.show({
      type: 'info',
      text1: ' ',
      text2: 'Número de cuenta copiado',
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  return (
    <>
      <BoxView>
        <Pressable onPress={() => setShowCard(!showCard)}>
          <BoxView
            background="background-lightest"
            py={SIZES.MD}
            px={SIZES.MD}
            direction="row"
            align="center"
            justify="space-between"
            style={{
              ...styles.cardTitle,
              borderBottomEndRadius: showCard ? 0 : SIZES.MD,
              borderBottomLeftRadius: showCard ? 0 : SIZES.MD,
            }}>
            <TextCustom text={title} variation="h5" color="primary-medium" />
            <View>
              <Icon
                iconName={
                  showCard ? 'icon_arrows_top_v2' : 'icon_arrows_back_v2'
                }
                size={16}
                color={COLORS.Primary.Medium}
              />
            </View>
          </BoxView>
        </Pressable>

        <BoxView
          background="background-light"
          py={SIZES.MD}
          px={SIZES.LG}
          style={{
            ...styles.cardInfoContainer,
            display: showCard ? 'flex' : 'none',
          }}>
          <BoxView
            direction="row"
            pb={SIZES.MD}
            align="center"
            justify="space-between">
            <TextCustom
              text={'Número celular afiliado'}
              variation="h5"
              color="neutral-dark"
              weight="normal"
            />
            <TextCustom
              text={`${cellphone}`}
              variation={'h5'}
              color={'neutral-darkest'}
              weight={'normal'}
            />
          </BoxView>
          <Separator showLine size={1} color={COLORS.Neutral.Light} />
          <BoxView
            direction="row"
            justify="space-between"
            py={SIZES.MD}
            align="center">
            <TextCustom
              text={'Cuenta afiliada'}
              variation="h5"
              color="neutral-dark"
              weight="normal"
            />
            <TextCustom
              text={`${accountName}`}
              variation={'h5'}
              color={'neutral-darkest'}
              weight={'normal'}
            />
          </BoxView>
          <BoxView
            direction="row"
            justify="space-between"
            py={SIZES.MD}
            align="center">
            <BoxView>
              <TextCustom
                text={'Nº de cuenta'}
                variation="h6"
                color="neutral-dark"
                weight="normal"
              />
              <TextCustom
                text={`${accountCode}`}
                variation={'h5'}
                color={'neutral-darkest'}
                weight={'normal'}
              />
              <TouchableOpacity
                onPress={() => copyToClipboard(accountCode)}
                style={{marginTop: SIZES.XS}}>
                <BoxView direction="row" align="center">
                  <Icon
                    iconName="icon_clipboard"
                    color={COLORS.Primary.Medium}
                    size={10}
                  />
                  <TextCustom
                    style={{marginLeft: 4}}
                    text="Copiar"
                    color="primary-darkest"
                    variation="h6"
                  />
                </BoxView>
              </TouchableOpacity>
            </BoxView>
            <BoxView>
              <TextCustom
                text={'Interbancario (CCI)'}
                variation="h6"
                color="neutral-dark"
                weight="normal"
              />
              <TextCustom
                text={`${accountCci}`}
                variation={'h5'}
                color={'neutral-darkest'}
                weight={'normal'}
              />
              <TouchableOpacity
                onPress={() => copyToClipboard(accountCci)}
                style={{marginTop: SIZES.XS}}>
                <BoxView direction="row">
                  <Icon
                    iconName="icon_clipboard"
                    color={COLORS.Primary.Medium}
                    size={10}
                  />
                  <TextCustom
                    style={{marginLeft: 4}}
                    text="Copiar"
                    color="primary-darkest"
                    variation="h6"
                  />
                </BoxView>
              </TouchableOpacity>
            </BoxView>
          </BoxView>
        </BoxView>
      </BoxView>
      <Toast config={toastConfig} />
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    cardTitle: {
      borderTopStartRadius: SIZES.MD,
      borderTopRightRadius: SIZES.MD,
    },
    cardInfoContainer: {
      borderBottomEndRadius: SIZES.MD,
      borderBottomLeftRadius: SIZES.MD,
    },
  });

  return stylesBase;
};

export default DetailEntrepreneurCard;
