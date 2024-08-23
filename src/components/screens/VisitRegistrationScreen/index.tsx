/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Image,
  Text,
} from 'react-native';

import { Colors, COLORS } from '@theme/colors';
import TextCustom from '@atoms/TextCustom';
import QRCode from 'react-native-qrcode-svg';
import { SIZES } from '@theme/metrics';
import { FontTypes } from '@theme/fonts';
import Separator from '@atoms/Separator';
import Icon from '@atoms/Icon';
import { getLocation } from '@helpers/getLocation';
import { useLastUser } from '@hooks/common';
import * as deviceInfo from 'react-native-device-info';
import Button from '@atoms/extra/Button';
import Skeleton from '@molecules/Skeleton'
import { encryptWithIV } from '@utils/AES';
import moment from 'moment';
import { CT_QR, QY_QR } from '@constants';
import NativeConfig from 'react-native-config';


const SkeletonLoader = () => {
  return (
    <Skeleton timing={600}>
      <View style={styles.container}>
        <View style={{ alignSelf: 'center' }}>
          <View style={{ width: 132.22, height: 21, backgroundColor: '#F6F6F9' }} />
          <View style={{ width: 312, height: 24, marginTop: 4, backgroundColor: '#F6F6F9' }} />
        </View>

        <View style={{ alignSelf: 'center' }}>
          <View style={{ width: 312, height: 21, marginTop: 40, backgroundColor: '#F6F6F9' }} />
          <View style={{ width: 312, height: 21, marginTop: 4, backgroundColor: '#F6F6F9' }} />
        </View>

        <View style={{ alignSelf: 'center', marginTop: 4, }}>
          <View style={styles.containerQR}>
          </View>
          <Separator size={SIZES.LG} />
          <View style={{ width: 312, height: 68, backgroundColor: '#F6F6F9' }} />
        </View>
      </View>
    </Skeleton>
  );
};

const VisitRegistrationScreen = () => {
  const [seconds, setSeconds] = useState(60);
  const { lastUser } = useLastUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showQR, setShowQR] = useState(false);
  const [isLoadingQR, setIsLoadingQR] = useState(true);
  const [qrValue, setQrValue] = useState("{}");

  const handleCoordenates = useCallback(async () => {
    setIsLoadingQR(true);
    setIsLoading(true)
    try {
      const location = await getLocation();
      const formattedDateTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
  
      let newPayload = null;
      if (location && lastUser && lastUser.personId) {
        setShowQR(true);
        const personId = parseInt(lastUser.personId);
        newPayload = {
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          dateHour: formattedDateTime,
          personId: personId,
          uniqueId: deviceInfo.getUniqueId(),
        };
      } else {
        setShowQR(false);
      }
      let body = JSON.stringify(newPayload)
      const encryptedBody = encryptWithIV(body, QY_QR[NativeConfig.ENV], CT_QR[NativeConfig.ENV]);
      setQrValue(encryptedBody);
      setSeconds(60);
      setIsLoadingQR(false);
      setIsLoading(false);
    } catch {
      setShowQR(false);
      setIsLoadingQR(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSecond => prevSecond - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds < 0) {
      handleCoordenates();
    }
  }, [seconds]);

  useEffect(() => {
    handleCoordenates();
  }, []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.Transparent}
        translucent={true}
      />
      <View style={{ backgroundColor: 'white', flex: 1, flexDirection: 'column' }}>
        {isLoadingQR ? (
          <SkeletonLoader />
        ) : (
          <>
            {showQR ? (
              // Mostrar el contenido del QR
              <View style={styles.container}>
                <View style={{ alignSelf: 'center' }}>
                  <TextCustom
                    variation="p"
                    weight="bold"
                    text="Nos acercamos más a ti"
                    color={COLORS.Neutral.Medium}
                    style={{ marginBottom: 5 }}
                  />
                  <TextCustom
                    variation="h1"
                    weight='normal'
                    text="Confirma la visita de tu asesor"
                    color={Colors.Primary}
                  />
                </View>

                <View style={{ alignSelf: 'center' }}>
                  <View style={styles.containerImage}>
                    <Image
                      source={require('@assets/images/asesor.png')}
                      style={{
                        width: 66.02,
                        height: 70,
                      }}
                    />
                    <View>
                      <TextCustom
                        variation="h2"
                        weight='normal'
                        color={COLORS.Neutral.Darkest}
                        align='left'
                        style={styles.text}
                        size={16}
                      >
                        Muéstrale este QR a tu asesor y
                      </TextCustom>
                      <Separator size={SIZES.XXS} />
                      <TextCustom
                        variation="h2"
                        weight='normal'
                        color={COLORS.Neutral.Darkest}
                        align='left'
                        style={styles.text}
                        size={16}
                      >
                        así confirmaremos que te visitó.
                      </TextCustom>
                    </View>
                  </View>
                  <View style={styles.containerQR}>
                    <View style={styles.containerWhiteQR}>
                      <View style={{ alignItems: 'center', paddingTop: 30 }}>
                        <QRCode
                          value={qrValue}
                          size={180}
                        />
                      </View>
                    </View>
                    <View style={styles.containerCronometer}>
                      <Text style={styles.timerText}>Se actualizará en</Text>
                      <Text style={styles.secondsText}> {seconds} segundos</Text>
                    </View>
                  </View>
                  <Separator size={SIZES.XL} />
                  <View style={styles.containerInfoQR}>
                    <View style={styles.infoQR}>
                      <Icon
                        name="info_qr"
                        size="small"
                        fill={COLORS.Informative.Dark}
                      />
                      <View>
                        <Text style={styles.textInfoQR}>Al leer este QR se está registrando el lugar,</Text>
                        <Separator size={SIZES.XXS} />
                        <Text style={styles.textInfoQR}>fecha y hora de la visita del asesor</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              // Mostrar el mensaje de error si no se puede generar el QR
              <View style={styles.headerBorder}>
                <View style={styles.container}>
                  <Image
                    source={require('@assets/images/error_connection.png')}
                    style={{
                      width: 213,
                      height: 213,
                      alignSelf: 'center'
                    }}
                  />
                  <TextCustom
                    variation="h2"
                    weight='normal'
                    align='center'
                    style={styles.textInfoErrorTitle}
                  >
                    ¡Uy, ocurrió un problema!
                  </TextCustom>

                  <View style={{ alignSelf: 'center' }}>
                    <View>
                      <TextCustom
                        variation="h2"
                        weight='normal'
                        color={COLORS.Neutral.Darkest}
                        align='left'
                        style={styles.text}
                        size={16}
                      >
                        En este momento no podemos generar el
                      </TextCustom>
                      <Separator size={SIZES.XXS} />
                      <TextCustom
                        variation="h2"
                        weight='normal'
                        color={COLORS.Neutral.Darkest}
                        align='left'
                        style={styles.text}
                        size={16}
                      >
                        QR para confirmar la visita del asesor.
                      </TextCustom>
                    </View>
                  </View>
                  <Separator size={SIZES.XXL}></Separator>
                  <Button
                    onPress={handleCoordenates}
                    orientation="horizontal"
                    type="primary"
                    text="Volver a intentar"
                    loading={isLoading}
                  />
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
};

export default VisitRegistrationScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 20,
    margin: 20
  },
  containerImage: {
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    paddingLeft: 10
  },
  containerQR: {
    borderRadius: SIZES.XS,
    backgroundColor: '#F6F6F9',
    width: 312,
    height: 318
  },
  containerWhiteQR: {
    backgroundColor: 'white',
    width: 240,
    height: 240,
    marginTop: 24,
    marginLeft: 36
  },
  containerCronometer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  timerText: {
    fontSize: 14,
    color: '#697385',
    fontFamily: FontTypes.Bree
  },
  secondsText: {
    fontSize: 14,
    color: '#CA005D',
    fontFamily: FontTypes.Bree
  },
  containerInfoQR: {
    borderRadius: SIZES.XS,
    backgroundColor: '#E5FEFE',
    width: 312,
    height: 68,
    justifyContent: 'center',
  },
  infoQR: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInfoQR: {
    color: COLORS.Informative.Dark,
    fontFamily: FontTypes.Bree,
    fontSize: 12,
    marginLeft: 16
  },
  headerBorder: {
    backgroundColor: 'white',
    flex: 1,
    borderTopWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.01)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 12,
  },
  textInfoErrorTitle: {
    margin: 20
  },
  textInfoErrorDetail: {
    color: '#222D42',
    fontFamily: FontTypes.AmorSansPro,
    fontSize: 16,
    margin: 20
  },
});
