/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {FONTS} from '@theme/fonts';
import Button from '@atoms/extra/Button';
import {StackActions, useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import AnimatedLottieView from 'lottie-react-native';
import TruncatedText from '@atoms/TruncatedText';
import moment from 'moment';
import 'moment/locale/es';
import {useUserInfo} from '@hooks/common';
import {CreditPayments} from '@interface/Credit';
import {shareScreenshot} from '@utils/screenshot';
import {SIZES} from '@theme/metrics';
import {getUserSavings} from '@services/User';
import formatNumberWithCommas from '@utils/formatNumberWithCommas';

// Configurar el idioma en español
moment.locale('es');

interface IData {
  amountToPay: number;
  currencyToPay: string;
  isPayingOtherAmount: boolean;
  creditProductName: string;
  savingProductName: string;
  accountCode: string;
  accountNumber: string;
  amountInstallments?: number;
  installments?: string;
  email: string;
  date: string;
  operationNumber: string;
}

const PaymentReceiptModal = ({
  data,
  isOpen,
  delay = 800,
  closeModal = () => {},
}: {
  data: IData;
  creditPayment: CreditPayments;
  isOpen: boolean;
  delay?: number;
  navigation: any;
  closeModal: () => void;
}) => {
  const viewShotRef = useRef(null);
  const animationRef = useRef<AnimatedLottieView>(null);
  const [isDone, setIsDone] = useState(true);
  const navigation = useNavigation();
  const {userCredits, setUserSavings} = useUserInfo();
  const mainStackNavigator = navigation.getParent('MainStackNavigator' as any);
  const [hideCreditButton, setHideCreditButton] = useState(false);

  useEffect(() => {
    if (
      userCredits &&
      userCredits.individualCredits.length === 0 &&
      userCredits.groupCredits.length === 0
    ) {
      setHideCreditButton(true);
    } else {
      setHideCreditButton(false);
    }
    return () => {};
  }, [userCredits]);

  useEffect(() => {
    let delayTimer: NodeJS.Timeout;
    let durationTimer: NodeJS.Timeout;
    if (isOpen) {
      delayTimer = setTimeout(() => {
        animationRef.current?.play();
      }, delay);

      durationTimer = setTimeout(() => {
        setIsDone(false);
      }, 1000);
    }

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(durationTimer);
    };
  }, [delay, isOpen]);

  const hanldleGoToCredit = () => {
    const _i = userCredits?.individualCredits.find(
      e => e.accountCode === data.accountCode,
    );
    const _g = userCredits?.groupCredits.find(
      e => e.accountCode === data.accountCode,
    );
    if (_i) {
      mainStackNavigator?.dispatch(
        StackActions.push('MainTab', {
          screen: 'Main',
          params: {
            screen: 'CreditsDetail',
            params: {
              status: _i.status,
              productName: _i.productName,
              advancePercentage: _i.advancePercentage,
              disbursedCapital: _i.sDisbursedCapital,
              disbursedCapitalAmount: _i.disbursedCapital,
              currency: _i.currency,
              accountNumber: _i.accountCode,
              capitalCanceled: _i.sCapitalAmount,
              capitalCanceledAmount: _i.capitalAmount,
              isPunished: _i.isPunished,
              type: 'Individual',
            },
          },
        }),
      );
      setTimeout(() => {
        closeModal();
      });
    } else if (_g) {
      mainStackNavigator?.dispatch(
        StackActions.push('MainTab', {
          screen: 'Main',
          params: {
            screen: 'GroupCreditDetail',
            params: {
              status: _g.status,
              productName: _g.productName,
              advancePercentage: _g.advancePercentage,
              disbursedCapital: _g.sDisbursedCapital,
              disbursedCapitalAmount: _g.disbursedCapital,
              currency: _g.currency,
              accountNumber: _g.accountCode,
              capitalCanceled: _g.sCapitalAmount,
              capitalCanceledAmount: _g.capitalAmount,
              type: 'Grupal',
            },
          },
        }),
      );
      setTimeout(() => {
        closeModal();
      });
    } else {
      updateUserSavings();
      mainStackNavigator?.dispatch(
        StackActions.push('MainTab', {
          screen: 'Main',
          params: {
            screen: 'MainScreen',
            params: {},
          },
        }),
      );
      setTimeout(() => {
        closeModal();
      });
    }
  };

  const updateUserSavings = useCallback(async () => {
    await getUserSavings().then(res => setUserSavings(res));
  }, [setUserSavings]);

  return (
    <>
      <Modal
        backdropTransitionOutTiming={0}
        onBackdropPress={closeModal}
        animationInTiming={600}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        hasBackdrop={false}
        isVisible={isOpen}
        useNativeDriver
        style={styles.modal}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={'#CA005D'}
          translucent={true}
        />

        <ScrollView
          style={{flex: 1, backgroundColor: 'white'}}
          bounces={false}
          contentContainerStyle={{
            ...styles.scrollView,
          }}>
          <View style={{backgroundColor: 'white'}}>
            <View style={{backgroundColor: 'white'}}>
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
              <View
                style={{
                  position: 'absolute',
                  display: 'flex',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: 56,
                }}>
                <Image
                  source={require('@assets/images/successMan.png')}
                  style={styles.image}
                />
                <AnimatedLottieView
                  ref={animationRef}
                  style={{
                    width: 175,
                    position: 'absolute',
                  }}
                  source={require('@assets/images/Confetti.json')}
                  loop={isDone}
                />
              </View>
            </View>
            <DataInfo data={data} viewShotRef={viewShotRef} />
          </View>
          <View style={{marginHorizontal: 48}}>
            {!hideCreditButton ? (
              <Button
                type={'primary'}
                onPress={() => {
                  hanldleGoToCredit();
                }}
                text="Ver crédito"
              />
            ) : null}
            <View style={{marginTop: 24, marginBottom: 32}}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  updateUserSavings();
                  mainStackNavigator?.dispatch(
                    StackActions.push('MainTab', {
                      screen: 'Main',
                      params: {
                        screen: 'MainScreen',
                        params: {},
                      },
                    }),
                  );
                  setTimeout(() => {
                    closeModal();
                  });
                }}>
                <Text style={styles.buttonText}>Ir al inicio</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Modal>
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
        <View style={{backgroundColor: 'white'}}>
          <View style={{backgroundColor: 'white'}}>
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
            <View
              style={{
                position: 'absolute',
                display: 'flex',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                top: 56,
              }}>
              <Image
                source={require('@assets/images/successMan.png')}
                style={styles.image}
              />
            </View>
          </View>
          <DataInfo data={data} />
        </View>
      </View>
    </>
  );
};

const DataInfo = ({data, viewShotRef}: {data: IData; viewShotRef?: any}) => {
  return (
    <View style={{marginTop: 14}}>
      <Text style={styles.title}>¡Pago exitoso!</Text>
      <View style={{marginTop: 24}}>
        <Text style={styles.totalPaid}>Total pagado</Text>
        <Text style={styles.amount}>
          {data.currencyToPay} {formatNumberWithCommas(data.amountToPay)}
        </Text>
        <Text style={styles.date}>{data.date}</Text>
      </View>
      {viewShotRef && (
        <TouchableOpacity
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 24,
          }}
          onPress={() => {
            shareScreenshot(viewShotRef);
          }}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Rect width="24" height="24" fill="white" />
            <Path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.0254 4.00053C10.525 4.00053 9.30103 5.26309 9.30103 6.81083C9.30103 7.72602 9.73077 8.53957 10.3909 9.05315L7.76301 13.5904C7.4421 13.454 7.08989 13.3796 6.7244 13.3796C5.22397 13.3796 4 14.6422 4 16.1899C4 17.7377 5.22397 19.0002 6.7244 19.0002C8.1009 19.0002 9.2409 17.9353 9.42042 16.5646H14.5796C14.7587 17.9355 15.8988 19.0002 17.2756 19.0002C18.776 19.0002 20 17.7377 20 16.1899C20 14.6422 18.776 13.3796 17.2756 13.3796C15.8982 13.3796 14.758 14.4434 14.5796 15.8153H9.42593C9.32952 15.0657 8.94588 14.408 8.39286 13.9651L11.0264 9.42181C11.3369 9.54936 11.6717 9.62084 12.0254 9.62084C13.5258 9.62084 14.7498 8.35828 14.7498 6.81054C14.7498 5.2628 13.5258 4.00024 12.0254 4.00024L12.0254 4.00053ZM12.0254 4.74988C13.1332 4.74988 14.0234 5.66808 14.0234 6.81083C14.0234 7.95359 13.1333 8.87178 12.0254 8.87178C10.9176 8.87178 10.0275 7.95359 10.0275 6.81083C10.0275 5.66808 10.9176 4.74988 12.0254 4.74988ZM6.7242 14.1293C7.08807 14.1293 7.42797 14.2286 7.72318 14.4045C8.31953 14.7613 8.72216 15.4252 8.72216 16.1902C8.72216 17.3329 7.83203 18.2511 6.7242 18.2511C5.61638 18.2511 4.72625 17.3329 4.72625 16.1902C4.72625 15.0474 5.61638 14.1293 6.7242 14.1293ZM17.2754 14.1293C18.3832 14.1293 19.2734 15.0475 19.2734 16.1902C19.2734 17.333 18.3832 18.2512 17.2754 18.2512C16.1676 18.2512 15.2775 17.333 15.2775 16.1902C15.2775 15.0475 16.1676 14.1293 17.2754 14.1293Z"
              fill="#CA005D"
            />
          </Svg>
          <Text style={styles.shareText}>Compartir constancia</Text>
        </TouchableOpacity>
      )}
      <View style={{paddingHorizontal: 24, marginTop: 24}}>
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Crédito</Text>
          <View>
            <Text style={styles.detailLabelValue}>
              {data.creditProductName}
            </Text>
            <Text style={styles.detailValue}>{data.accountCode}</Text>
          </View>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Cuenta de origen</Text>
          <View>
            <Text style={styles.detailLabelValue}>
              {data.savingProductName}
            </Text>
            <Text style={styles.detailValue}>{data.accountNumber}</Text>
          </View>
        </View>
        {!data.isPayingOtherAmount ? (
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Cuota</Text>
            <View>
              <TruncatedText
                style={styles.detailLabelValue}
                installmentsText={data.installments}
                amountInstallmentsText={`${data.amountInstallments}`}
                maxLength={20}
              />
            </View>
          </View>
        ) : null}
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Nª operación</Text>
          <View>
            <Text style={styles.detailLabelValue}>{data.operationNumber}</Text>
          </View>
        </View>
      </View>
      <View style={{paddingHorizontal: 24}}>
        <View style={styles.infoContainer}>
          <View>
            <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <Path
                d="M17.1 20.6842H21.5V17.5263L27 22.2632L21.5 27V23.8421H17.1V20.6842ZM24.8 7H7.2C6.61652 7 6.05694 7.2218 5.64437 7.61662C5.23178 8.01143 5 8.54691 5 9.10526V21.7368C5 22.2952 5.23178 22.8307 5.64437 23.2255C6.05694 23.6203 6.61652 23.8421 7.2 23.8421H14.9V21.7368H7.2V11.2105L16 16.4737L24.8 11.2105V17.5263H27V9.10526C27 8.54691 26.7682 8.01143 26.3556 7.61662C25.9431 7.2218 25.3835 7 24.8 7ZM16 14.3684L7.2 9.10526H24.8L16 14.3684Z"
                fill="#0187CB"
              />
            </Svg>
          </View>
          <Text style={styles.infoText}>
            Enviamos la constancia de tu pago al correo{'\n'}
            {data.email}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PaymentReceiptModal;

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    alignSelf: 'center',
    position: 'absolute',
    margin: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  image: {
    alignSelf: 'center',
  },
  title: {
    fontFamily: FONTS.Bree,
    color: '#CA005D',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  totalPaid: {
    fontFamily: FONTS.Bree,
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '500',
    color: '#222D42',
    textAlign: 'center',
  },
  amount: {
    fontFamily: FONTS.Bree,
    fontSize: 32,
    lineHeight: 32,
    color: '#222D42',
    textAlign: 'center',
    marginTop: 4,
  },
  date: {
    fontFamily: FONTS.Bree,
    fontSize: 14,
    lineHeight: 14,
    color: '#697385',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 8,
  },
  shareText: {
    fontFamily: FONTS.Bree,
    fontSize: 14,
    lineHeight: 14,
    color: '#790038',
    textAlign: 'center',
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 62,
    borderBottomColor: '#E3E8EF',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  detailLabel: {
    fontFamily: FONTS.Bree,
    fontSize: 14,
    lineHeight: 14,
    color: '#697385',
    fontWeight: '500',
  },
  detailLabelValue: {
    fontFamily: FONTS.Bree,
    fontSize: 14,
    lineHeight: 14,
    color: '#222D42',
    textAlign: 'right',
    fontWeight: '500',
  },
  detailValue: {
    fontFamily: FONTS.Bree,
    fontSize: 12,
    lineHeight: 12,
    color: '#697385',
    textAlign: 'right',
    marginTop: 4,
  },
  infoContainer: {
    backgroundColor: '#E5FEFE',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 56,
    marginBottom: 24,
  },
  infoText: {
    fontFamily: FONTS.Bree,
    fontSize: 12,
    lineHeight: 15.36,
    color: '#0165AA',
    fontWeight: '500',
    marginLeft: 8,
  },
  button: {
    width: '100%',
    height: 48,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#CA005D',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONTS.Bree,
    fontSize: 16,
    lineHeight: 17.92,
    color: '#CA005D',
    fontWeight: '500',
  },
});
