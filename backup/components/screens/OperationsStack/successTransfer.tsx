import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  BackHandler,
} from 'react-native';
import {SuccessTransferScreenProps} from '@navigations/types';
import SuccessTransferTemplate from '@templates/SuccessTransferTemplate';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import Button from '@atoms/Button';
import Icon from '@atoms/Icon';
import {Colors} from '@theme/colors';
import Modal from 'react-native-modal';
import 'moment/locale/es';
import {getUserSavings} from '@services/User';
import {useLoading, useUserInfo} from '@hooks/common';
import {saveScreenshot, shareScreenshot} from '@utils/screenshot';
import { SEPARATOR_BASE } from '@theme/metrics';

const SuccessTransfer = ({navigation, route}: SuccessTransferScreenProps) => {
  const {
    originSelectedAccount,
    originSelectedName,
    destinationSelectedName,
    destinationSelectedAccount,
    movementId,
    amountValueText,
    dateTransaction,
    hourTransaction,
  } = route.params;

  const {setHideTabBar} = useLoading();
  const viewShotRef = useRef(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const {user, setUserSavings} = useUserInfo();
  const person = user?.person;

  const updateUserSavings = async () => {
    await getUserSavings({personUid: person?.personUId}).then(res => {
      setUserSavings(res);
    });
  };
  const goHome = () => {
    setHideTabBar(false);
    navigation.navigate('Main');
  };

  useEffect(() => {
    updateUserSavings();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <SuccessTransferTemplate title="¡Transferencia Exitosa!">
      <Modal style={stylesBase.modal} isVisible={showModal}>
        <TextCustom
          text="La constancia de transferencia ha sido guardada en tu galeria de fotos correctamente."
          variation="p"
          color="#83786F"
        />
        <TouchableOpacity
          style={{alignSelf: 'flex-end', marginTop: SEPARATOR_BASE * 3}}
          onPress={() => setShowModal(false)}>
          <TextCustom
            text="Aceptar"
            variation="p"
            weight="bold"
            color="#83786F"
          />
        </TouchableOpacity>
      </Modal>
      <View style={{flex: 1, position: 'relative', width: '100%'}}>
        <ScrollView
          style={{
            flex: 1,
            zIndex: 9999,
            width: '100%',
            backgroundColor: '#fff',
          }}>
          <View>
            <Separator type='medium' />
            <TextCustom
              style={{marginBottom: SEPARATOR_BASE}}
              text="Monto transferido"
              variation="p"
              weight="bold"
              size={20}
              color={Colors.Paragraph}
            />
            <TextCustom
              align="center"
              text={amountValueText}
              variation="p"
              weight="bold"
              size={36}
              color="#83786F"
              style={{marginBottom: SEPARATOR_BASE}}
            />
            <TextCustom
              align="center"
              text={`${dateTransaction}, ${hourTransaction}`}
              variation="p"
              weight="normal"
              size={16}
              color="#83786F"
              style={{marginBottom: SEPARATOR_BASE * 2}}
            />
            <Separator
              showLine
              type="xx-small"
              color="#EFEFEF"
              styleLine={{marginVertical: SEPARATOR_BASE + 1.5}}
            />

            <TextCustom
              style={{marginBottom: SEPARATOR_BASE}}
              text="Cuenta Destino"
              variation="p"
              weight="bold"
              size={18}
              color={Colors.Paragraph}
            />
            <TextCustom
              text={destinationSelectedName}
              variation="p"
              weight="bold"
              size={16}
              color="#83786F"
            />
            <Separator type="x-small" />
            <TextCustom
              text={destinationSelectedAccount}
              variation="p"
              weight="bold"
              size={16}
              color="#83786F"
            />

            <Separator
              showLine
              type="xx-small"
              color="#EFEFEF"
              styleLine={{marginVertical: SEPARATOR_BASE * 1.5}}
            />

            <TextCustom
              style={{marginBottom: SEPARATOR_BASE}}
              text="Cuenta Origen"
              variation="p"
              weight="bold"
              size={18}
              color={Colors.Paragraph}
            />
            <TextCustom
              style={{marginBottom: SEPARATOR_BASE}}
              text={originSelectedName}
              variation="p"
              weight="bold"
              size={16}
              color="#83786F"
            />
            <TextCustom
              text={originSelectedAccount}
              variation="p"
              weight="bold"
              size={16}
              color="#83786F"
            />

            <Separator
              showLine
              type="xx-small"
              color="#EFEFEF"
              styleLine={{marginVertical: SEPARATOR_BASE *2}}
            />

            <TextCustom
              style={{marginBottom: SEPARATOR_BASE}}
              text="Número de Operación"
              variation="p"
              weight="bold"
              size={18}
              color={Colors.Paragraph}
            />
            <TextCustom
              text={String(movementId)}
              variation="p"
              weight="bold"
              size={16}
              color="#83786F"
            />
          </View>

          <Separator
            showLine
            type="xx-small"
            color="#EFEFEF"
            styleLine={{marginTop: SEPARATOR_BASE * 1.5, marginBottom: SEPARATOR_BASE * 2}}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              backgroundColor: Colors.GrayBackground,
              paddingVertical: SEPARATOR_BASE * 1.5,
              paddingHorizontal: 30,
              borderRadius: 4,
              marginBottom: SEPARATOR_BASE * 3,
            }}>
            <Icon name="mail" size="x-small" style={{marginRight: SEPARATOR_BASE * 6}} />
            <TextCustom
              weight="bold"
              variation="small"
              text="A continuación enviaremos el detalle de la operación a tu correo electrónico registrado."
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: SEPARATOR_BASE * 2.4,
            }}>
            <TouchableOpacity
              onPress={() => shareScreenshot(viewShotRef)}
              style={{
                alignItems: 'center',
                width: 80,
                height: 80,
                justifyContent: 'center',
                marginRight: 4,
              }}>
              <Icon
                fill="#000"
                name="share-black"
                size="x-small"
                style={{marginBottom: 4}}
              />
              <TextCustom
                text="Compartir"
                variation="p"
                color={Colors.DarkGray}
                weight="bold"
                size={16}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                width: 80,
                height: 80,
                justifyContent: 'center',
                marginLeft: 4,
              }}
              onPress={() =>
                saveScreenshot(viewShotRef).then(isSuccess =>
                  setShowModal(!!isSuccess),
                )
              }>
              <Icon
                name="download"
                size="x-small"
                stroke={Colors.DarkGray}
                style={{marginBottom: 4}}
              />
              <TextCustom
                text="Descargar"
                variation="p"
                color={Colors.DarkGray}
                weight="bold"
                size={16}
              />
            </TouchableOpacity>
          </View>

          <View
            ref={viewShotRef}
            style={stylesBase.transferCard}
            collapsable={false}>
            <View style={stylesBase.logoContainer}>
              <Image
                style={stylesBase.logo}
                source={require('@assets/images/logo.png')}
              />
            </View>
            <View
              style={{
                backgroundColor: '#FFF',
                paddingHorizontal: 12,
              }}>
              <TextCustom
                style={{marginBottom: 24, marginTop: 18}}
                text="Constancia de Transferencia a Cuentas Propias"
                variation="p"
                weight="bold"
                size={16}
              />
              <TextCustom
                style={{marginBottom: 8}}
                text="Monto transferido"
                variation="p"
                weight="bold"
                size={16}
                color={Colors.Paragraph}
              />
              <TextCustom
                align="center"
                text={amountValueText}
                variation="p"
                weight="bold"
                size={36}
                color="#83786F"
                style={{marginBottom: 7}}
              />
              <TextCustom
                style={{marginBottom: 6}}
                align="center"
                text={`${dateTransaction}, ${hourTransaction}`}
                variation="p"
                weight="bold"
                size={14}
                color="#83786F"
              />
              <Separator showLine size={18} color="#EFEFEF" />

              <TextCustom
                style={{marginBottom: 6}}
                text="Cuenta Destino"
                variation="p"
                weight="bold"
                size={16}
                color={Colors.Paragraph}
              />
              <TextCustom
                text={destinationSelectedName}
                variation="p"
                weight="bold"
                size={14}
                color="#83786F"
              />
              <Separator size={2} />
              <TextCustom
                text={destinationSelectedAccount}
                variation="p"
                weight="bold"
                size={14}
                color="#83786F"
              />

              <Separator showLine size={18} color="#EFEFEF" />

              <TextCustom
                style={{marginBottom: 6}}
                text="Cuenta Origen"
                variation="p"
                weight="bold"
                size={16}
                color={Colors.Paragraph}
              />
              <TextCustom
                style={{marginBottom: 4}}
                text={originSelectedName}
                variation="p"
                weight="bold"
                size={14}
                color="#83786F"
              />
              <TextCustom
                text={originSelectedAccount}
                variation="p"
                weight="bold"
                size={14}
                color="#83786F"
              />

              <Separator showLine size={18} color="#EFEFEF" />

              <TextCustom
                style={{marginBottom: 6}}
                text="Número de Operación"
                variation="p"
                weight="bold"
                size={16}
                color={Colors.Paragraph}
              />
              <TextCustom
                style={{marginBottom: 20}}
                text={String(movementId)}
                variation="p"
                weight="bold"
                size={14}
                color="#83786F"
              />
            </View>
            <View style={{height: 12, backgroundColor: Colors.Primary}} />
          </View>
          <View style={{alignSelf: 'center', width: '80%', marginBottom: 42}}>
            <Button
              textSize={18}
              text="Ir a inicio"
              orientation="vertical"
              type="primary"
              onPress={goHome}
            />
          </View>
        </ScrollView>
      </View>
    </SuccessTransferTemplate>
  );
};

const stylesBase = StyleSheet.create({
  transferCard: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    left: -Dimensions.get('screen').width,
  },
  logoContainer: {
    backgroundColor: Colors.Primary,
    height: 85,
    justifyContent: 'center',
  },
  logo: {
    width: '56%',
    resizeMode: 'contain',
    marginLeft: -18,
  },
  modal: {
    position: 'absolute',
    top: '43%',
    backgroundColor: '#FFF',
    width: '80%',
    alignSelf: 'center',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 10,
  },
});

export default SuccessTransfer;
