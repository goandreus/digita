import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Share,
} from 'react-native';
import Toast, {BaseToast, BaseToastProps} from 'react-native-toast-message';
import {ScreenSize} from '@theme/metrics';
import {COLORS, Colors} from '@theme/colors';
import TextCustom from '@atoms/TextCustom';
import Separator from '@atoms/Separator';
import Icon from '@atoms/Icon';
import Svg, {Path} from 'react-native-svg';
import Clipboard from '@react-native-community/clipboard';

interface SavingsTemplateProps {
  children?: React.ReactNode;
  top?: any;
  right?: any;
  user?: any;
  title?: string;
  detail?: boolean;
  accountName?: string;
  accountNumber?: string;
  cci?: string;
  currency?: string;
  productType?: string;
  action: () => void;
}

const SavingsTemplate = ({
  children,
  title,
  detail,
  accountName,
  accountNumber,
  cci,
  currency,
  productType,
  action,
}: SavingsTemplateProps) => {
  const interbankAccount =
    productType !== 'PF'
      ? `\nMi número de Cuenta Interbancario en Compartamos Financiera es: ${cci}.`
      : '';
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Mi número de ${accountName} ${currency} en Compartamos Financiera es: ${accountNumber}.\n${interbankAccount}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {}
  };

  const toastConfig = {
    info: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
      <BaseToast
        {...props}
        style={styles.toastContainer}
        // eslint-disable-next-line react-native/no-inline-styles
        text1Style={{height: 0}}
        text2Style={styles.toastTextContainer}
      />
    ),
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(
      `Mi número de ${accountName} ${currency} en Compartamos Financiera es: ${accountNumber}.${interbankAccount}`,
    );
    Toast.show({
      type: 'info',
      text1: ' ',
      text2: 'Número de cuenta copiado',
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  const styles = getStyles(detail);

  return (
    <View style={styles.mainContainer}>
      {detail ? (
        <Svg
          style={styles.svg}
          width="100%"
          height="191"
          viewBox="30 0 360 191"
          fill="none"
          xmlns="http://www.w3.org/3000/svg">
          <Path
            scaleX={1.17}
            d="M370.998 -9.99994V154.981C317.642 170.725 267.715 180.952 207.381 186.565C127.797 193.968 57.6709 191.27 0 184.583L5.45208e-06 -10L359.998 -9.99994Z"
            fill="#CA005D"
          />
        </Svg>
      ) : (
        <Svg
          style={styles.svg}
          width="100%"
          height="150"
          viewBox="15 0 360 112"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <Path
            scaleX={1.1}
            d="M359.998 -88.9999V75.9809C317.642 91.7253 267.715 101.952 207.381 107.565C127.797 114.968 57.6709 112.27 0 105.583L5.45208e-06 -89L359.998 -88.9999Z"
            fill="#CA005D"
          />
        </Svg>
      )}
      <View style={styles.productDetailContainer}>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={action}>
            <Icon name="arrow-left" fill={Colors.Black} size="tiny" />
          </TouchableOpacity>
          <TextCustom
            // eslint-disable-next-line react-native/no-inline-styles
            style={{marginLeft: 8}}
            text={title}
            variation="p"
            color={Colors.White}
            weight="bold"
            size={35}
          />
          <Separator type="large" />
        </View>
        {detail &&
          (productType !== 'PF' ? (
            <View style={styles.productContainer}>
              <View style={styles.detailContainer}>
                <TextCustom
                  text={accountName}
                  variation="p"
                  color={Colors.White}
                  weight="bold"
                />
                <TextCustom
                  text={`Cuenta: ${accountNumber}`}
                  variation="small"
                  color={Colors.White}
                  weight="bold"
                />
                <TextCustom
                  text={cci ? `CCI: ${cci}` : ''}
                  variation="small"
                  color={Colors.White}
                  weight="bold"
                />
              </View>
              {cci !== '' ? (
                <View style={styles.cci}>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(String(accountNumber))}>
                    <Icon
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{marginRight: 16}}
                      name="copy"
                      fill="#fff"
                      size="x-small"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onShare}>
                    <Icon name="share" fill="#fff" size="x-small" />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.pfContainer}>
              <View style={styles.detailContainer}>
                <TextCustom
                  text={accountName}
                  variation="p"
                  color={Colors.White}
                  weight="bold"
                />
                <Separator type="xx-small" />
                <TextCustom
                  text="Número de depósito"
                  variation="small"
                  color={Colors.White}
                  weight="bold"
                />
                <TextCustom
                  text={accountNumber}
                  variation="small"
                  color={Colors.White}
                  weight="bold"
                />
              </View>
              {cci !== '' ? (
                <View style={styles.PFcci}>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(String(accountNumber))}>
                    <Icon
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{marginRight: 16}}
                      name="copy"
                      fill="#fff"
                      size="x-small"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onShare}>
                    <Icon name="share" fill="#fff" size="x-small" />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ))}
      </View>
      {detail ? (
        <View style={styles.detail}>{children}</View>
      ) : (
        <ScrollView style={styles.body}>{children}</ScrollView>
      )}
      <Toast config={toastConfig} />
    </View>
  );
};

const getStyles = (detail: boolean | undefined) => {
  const stylesBase = StyleSheet.create({
    svg: {
      alignSelf: 'center',
    },
    toastContainer: {
      borderLeftWidth: 0,
      backgroundColor: '#9a9a9a',
      opacity: 0.9,
      borderRadius: 12,
      width: '64%',
      height: 48,
    },
    toastTextContainer: {
      color: '#fff',
      fontSize: 15.25,
      fontWeight: 'bold',
    },
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.Background.Lightest,
    },
    productDetailContainer: {
      width: '90%',
      alignSelf: 'center',
      position: 'absolute',
      top: '5%',
      left: 6,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: '4%',
      marginBottom: detail ? '0%' : '-6%',
    },
    productContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '80%',
      marginLeft: 6,
    },
    pfContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '80%',
      marginLeft: 6,
    },
    cci: {
      flexDirection: 'row',
      marginRight: '-28%',
      marginBottom: '10%',
    },
    PFcci: {
      flexDirection: 'row',
      marginRight: '-28%',
      marginBottom: '8%',
    },
    header: {
      backgroundColor: Colors.Primary,
      height: detail ? ScreenSize.height / 4 : ScreenSize.height / 6,
    },
    descriptionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '15%',
      marginLeft: '4%',
    },
    detailContainer: {
      marginLeft: '4%',
    },
    body: {
      marginTop: '4%',
      marginBottom: 12,
      marginHorizontal: '6%',
      backgroundColor: Colors.White,
      height: '75%',
    },
    detail: {
      marginTop: '6%',
      backgroundColor: Colors.White,
      height: '95%',
    },
  });

  return stylesBase;
};

export default SavingsTemplate;
