import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  BackHandler,
  Keyboard,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import TransfersTemplate from '@templates/TransfersTemplate';

import Button from '@atoms/Button';
import ModalInfo from '@atoms/ModalInfo';
import TextCustom from '@atoms/TextCustom';
import {Information} from '@global/information';
import CheckboxLabel from '@molecules/CheckboxLabel';
import {
  OtherBanksScreenProps,
  TermsAndConditionsScreenProps,
} from '@navigations/types';
import {Colors} from '@theme/colors';
import {FontSizes} from '@theme/fonts';
import useForm from '@hooks/useForm';
import DropDownAccount from '@atoms/DropDownAccount';
import {useFocusEffect} from '@react-navigation/native';
import useToggle from '@hooks/useToggle';
import {EventRegister} from '@utils/EventRegister';
import Separator from '@atoms/Separator';
import PopUp from '@atoms/PopUp';
import {getMainScreenByName} from '@utils/getMainScreenByName';
import {useTerms} from '@hooks/common';

type From = 'MainScreen' | 'Operations' | 'ConfirmationOtherBanks';

const TermsAndConditions = ({
  route,
  navigation,
}: TermsAndConditionsScreenProps) => {
  const from = route.params.from as From;
  const {setTerms} = useTerms();

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          return true;
        },
      );

      return () => backHandler.remove();
    }, [navigation]),
  );

  const goBack = useCallback(() => {
    return navigation.navigate('OtherBanks', {from: 'TermsAndConditions'});
  }, [navigation]);
  return (
    <>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
      />
      <View style={{flex: 1}}>
        <TransfersTemplate
          title="Términos y condiciones"
          titleSize={24}
          goBack={goBack}
          variant="close">
          <ScrollView style={{flex: 1}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <View
                style={{
                  margin: 5,
                  marginHorizontal: 7,
                  width: 5,
                  height: 5,
                  borderRadius: 5,
                  backgroundColor: Colors.GrayDark,
                }}></View>

              <View style={{flex: 1}}>
                <TextCustom
                  text="La Financiera no asume responsabilidad por eventuales errores o demora en la tramitación de la transferencia que se deriven de la información consignada por el cliente."
                  variation="p"
                  weight="normal"
                  size={16}
                />
              </View>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <View
                style={{
                  margin: 5,
                  marginHorizontal: 7,
                  width: 5,
                  height: 5,
                  borderRadius: 5,
                  backgroundColor: Colors.GrayDark,
                }}></View>

              <View style={{flex: 1}}>
                <TextCustom
                  text="Si el pago no llegara a realizarse por causas ajenas a la Financiera, la comisión y gastos cobrados no serán reembolsados."
                  variation="p"
                  weight="normal"
                  size={16}
                />
              </View>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <View
                style={{
                  margin: 5,
                  marginHorizontal: 7,
                  width: 5,
                  height: 5,
                  borderRadius: 5,
                  backgroundColor: Colors.GrayDark,
                }}></View>

              <View style={{flex: 1}}>
                <TextCustom
                  text="Las entidades financieras de destino efectuarán la devolución o rechazo de las transferencias por los motivos y en los plazos estipulados a continuación:"
                  variation="p"
                  weight="normal"
                  size={16}
                />
              </View>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <View
                style={{
                  margin: 5,
                  marginHorizontal: 7,
                  width: 5,
                  height: 5,
                  borderRadius: 5,
                }}></View>

              <View style={{flex: 1}}>
                <TextCustom
                  text="- Los bancos en el caso de transferencias con destinos a cuentas de abono, se basan en el CCI (código cuenta interbancario) especificado por el ordenante de la transferencia. Otros datos como es el caso del nombre del beneficiario, tipo o número del documento de identidad, son referenciales. La Financiera no asume responsabilidad alguna si por error del ordenante al proporcionar el CCI, los fondos se acreditan a favor de otro beneficiario distinto."
                  variation="p"
                  weight="normal"
                  size={16}
                />
                <TextCustom
                  text="- De haber una devolución o rechazo de parte de la entidad financiera de destino, su importe se acreditará en el N° de cuenta indicado en su solicitud. Si la devolución fuese en una moneda distinta a la señalada, el abono se efectuará aplicando el tipo de cambio compra o venta según sea el caso."
                  variation="p"
                  weight="normal"
                  size={16}
                />
              </View>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <View
                style={{
                  margin: 5,
                  marginHorizontal: 7,
                  width: 5,
                  height: 5,
                  borderRadius: 5,
                  backgroundColor: Colors.GrayDark,
                }}></View>

              <View style={{flex: 1}}>
                <TextCustom
                  text="Límite diario para transaccionar por canales digitales: Hasta S/10,000.00 o US$ 3,000.00. Si desea realizar transferencias por montos mayores a los límites señalados para los canales digitales, estas deberán ser realizadas en nuestras Agencias."
                  variation="p"
                  weight="normal"
                  size={16}
                />
              </View>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <View
                style={{
                  margin: 5,
                  marginHorizontal: 7,
                  width: 5,
                  height: 5,
                  borderRadius: 5,
                  backgroundColor: Colors.GrayDark,
                }}></View>

              <View style={{flex: 1}}>
                <TextCustom
                  text="En caso de cuentas mancomunadas, el cliente podrá solicitar la devolución de ITF en caso de que el orden de los mancomunos sea el mismo tanto en la cuenta de origen como en la cuenta de destino. Es decir, si la cuenta de origen está a nombre de “Sr.A-Sr.(a)B”, la cuenta de destino debe seguir el mismo orden y estar a nombre de “Sr.A-Sr.(a) B”. Se debe tomar en consideración que la devolución del ITF se hará efectiva toda vez que se presente una carta de la otra entidad con la información de los mancomunos y coincida con los datos en nuestro registro."
                  variation="p"
                  weight="normal"
                  size={16}
                />
              </View>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <View
                style={{
                  margin: 5,
                  marginHorizontal: 7,
                  width: 5,
                  height: 5,
                  borderRadius: 5,
                  backgroundColor: Colors.GrayDark,
                }}></View>

              <View style={{flex: 1}}>
                <TextCustom
                  text="Las tarifas del servicio de transferencias interbancarias diferidas vía CCE así como los horarios de envío se encuentran disponibles en nuestra página web: www.compartamos.com.pe"
                  variation="p"
                  weight="normal"
                  size={16}
                />
              </View>
            </View>

            <View
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                width: '80%',
              }}>
              <Button
                text="Acepto"
                textSize={18}
                type="primary"
                orientation="vertical"
                onPress={() => {
                  setTerms(true);
                  goBack();
                }}
              />
            </View>
          </ScrollView>
        </TransfersTemplate>
      </View>
    </>
  );
};

export default TermsAndConditions;
