import React, {useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Platform,
} from 'react-native';
import Icon from '@atoms/Icon';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {SuccessRefillBimProps} from '@navigations/types';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import SuccessTransferTemplate from '@templates/SuccessTransferTemplate';
import {Colors} from '@theme/colors';
import {saveScreenshot, shareScreenshot} from '@utils/screenshot';
import Modal from 'react-native-modal';
import {getUserSavings} from '@services/User';
import {useLoading, useUserInfo} from '@hooks/common';
import moment from 'moment';
import { OperationStackContext } from '@contexts/OperationStackContext';

const SuccessRefillBimScreen = ({route, navigation}: SuccessRefillBimProps) => {
  const operationStackContext = useContext(OperationStackContext);
  const {
    date: _date,
    hour,
    movementId,
    operationUId,
    formatAmount,
    phoneNumberBim,
  } = route.params;

  const {setHideTabBar} = useLoading();
  const {setUserSavings} = useUserInfo();
  const viewShotRef = useRef<View | null>(null);
  const [showModal, setShowModal] = useState(false);

  const originAccount = useAccountByOperationUid({operationUId});

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  const updateUserSavings = async () => {
    await getUserSavings()
      .then(res => setUserSavings(res))
      .catch(err => console.log({err}));
  };

  const goHome = () => {
    setHideTabBar(false);
    navigation.navigate('Main');
  };

  useLayoutEffect(() => {
    operationStackContext.disableUseFocusEffect = false;
  }, []);

  const date = `${moment(_date).format('DD MMMM [del] YYYY')}, ${hour}`;

  return (
    <SuccessTransferTemplate title="¡Recarga Exitosa!">
      <Modal style={styles.modal} isVisible={showModal}>
        <TextCustom
          variation="p"
          color="#83786F"
          text="La constancia de transferencia ha sido guardada en tu galeria de fotos correctamente."
        />
        <TouchableOpacity
          style={{alignSelf: 'flex-end', marginTop: 24}}
          onPress={() => setShowModal(false)}>
          <TextCustom
            text="Aceptar"
            variation="p"
            weight="bold"
            color="#83786F"
          />
        </TouchableOpacity>
      </Modal>

      <View
        onLayout={updateUserSavings}
        style={{flex: 1, position: 'relative', width: '100%'}}>
        <ScrollView style={{flex: 1, marginBottom: 40}}>
          <TextCustom
            style={{marginBottom: 8}}
            text="Monto recargado en Bim"
            variation="p"
            weight="bold"
            size={20}
            color={Colors.Paragraph}
          />
          <TextCustom
            align="center"
            text={formatAmount}
            variation="p"
            weight="bold"
            size={36}
            color="#83786F"
            style={{marginBottom: 7}}
          />
          <TextCustom
            align="center"
            text={date}
            variation="p"
            weight="normal"
            size={16}
            color="#83786F"
          />

          <Separator showLine type="small" color="#EFEFEF" />

          <View style={[styles.row]}>
            <TextCustom
              text="Número celular"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
            />
            <View style={{alignItems: 'flex-end'}}>
              <TextCustom
                text="Recarga Bim"
                variation="p"
                weight="normal"
                size={16}
                color="#83786F"
              />
              <TextCustom
                text={phoneNumberBim}
                variation="p"
                weight="normal"
                size={16}
                color="#83786F"
              />
            </View>
          </View>

          <Separator showLine type="small" color="#EFEFEF" />

          <View style={styles.row}>
            <TextCustom
              text="Cuenta Origen"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
            />
            <View style={{alignItems: 'flex-end'}}>
              <TextCustom
                style={{marginBottom: 2.5}}
                text={originAccount?.productName}
                variation="p"
                weight="normal"
                size={16}
                color="#83786F"
              />
              <TextCustom
                text={originAccount?.accountCode}
                variation="p"
                weight="normal"
                size={16}
                color="#83786F"
              />
            </View>
          </View>

          <Separator showLine type="small" color="#EFEFEF" />

          <View style={styles.row}>
            <TextCustom
              text="Número de operación"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
            />
            <View style={{alignItems: 'flex-end'}}>
              <TextCustom
                style={{marginBottom: 2.5}}
                text={String(movementId)}
                variation="p"
                weight="normal"
                size={16}
                color="#83786F"
              />
            </View>
          </View>

          <Separator showLine type="small" color="#EFEFEF" />

          <View style={styles.info}>
            <Icon name="mail" size="x-small" style={{marginRight: 36}} />
            <TextCustom
              size={16}
              weight="bold"
              variation="small"
              text="A continuación enviaremos el detalle de la operación a tu correo electrónico registrado."
            />
          </View>

          <View
            style={{
              marginBottom: Platform.OS === 'android' ? 22 : 8,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Pressable
              onPress={() => shareScreenshot(viewShotRef)}
              style={{
                width: 80,
                height: 80,
                marginRight: 4,
                alignItems: 'center',
                justifyContent: 'center',
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
                weight="bold"
                size={16}
                color={Colors.DarkGray}
              />
            </Pressable>
            <Pressable
              onPress={() => saveScreenshot(viewShotRef).then(setShowModal)}
              style={{
                width: 80,
                height: 80,
                marginLeft: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon
                size="small"
                name="download"
                stroke={Colors.DarkGray}
                style={{marginBottom: 4}}
              />
              <TextCustom
                variation="p"
                weight="bold"
                text="Descargar"
                size={16}
                color={Colors.DarkGray}
              />
            </Pressable>
          </View>

          <View style={{alignSelf: 'center', width: '80%'}}>
            <Button
              textSize={18}
              type="primary"
              text="Ir a inicio"
              orientation="vertical"
              onPress={goHome}
            />
          </View>
        </ScrollView>

        <View
          ref={viewShotRef}
          collapsable={false}
          style={{
            left: '-200%',
            position: 'absolute',
            width: Dimensions.get('window').width,
          }}>
          <View
            style={{
              height: 80,
              justifyContent: 'center',
              backgroundColor: Colors.Primary,
            }}>
            <Image
              style={styles.logo}
              source={require('@assets/images/header_transfers.png')}
            />
          </View>
          <View
            style={{
              backgroundColor: '#FFF',
              paddingHorizontal: 12,
              paddingTop: 24,
              paddingBottom: 28,
              borderBottomWidth: 8,
              borderBottomColor: Colors.Primary,
            }}>
            <TextCustom
              style={{marginBottom: 24}}
              text="Constancia de monto recargado en Bim"
              variation="p"
              weight="bold"
              size={16}
              color={Colors.Primary}
            />
            <TextCustom
              style={{marginBottom: 12}}
              text="Monto recargado en Bim"
              variation="p"
              weight="bold"
              size={16}
              color={Colors.Paragraph}
            />
            <TextCustom
              align="center"
              text={formatAmount}
              variation="p"
              weight="bold"
              size={36}
              color="#83786F"
              style={{marginBottom: 7}}
            />
            <TextCustom
              align="center"
              text={date}
              variation="p"
              weight="bold"
              size={16}
              color="#83786F"
            />

            <Separator showLine type="small" color="#EFEFEF" />

            <View style={[styles.row]}>
              <TextCustom
                text="Número celular"
                variation="p"
                weight="bold"
                size={18}
                color="#83786F"
              />
              <View style={{alignItems: 'flex-end'}}>
                <TextCustom
                  text="Recarga Bim"
                  variation="p"
                  weight="normal"
                  size={16}
                  color="#83786F"
                />
                <TextCustom
                  text={phoneNumberBim}
                  variation="p"
                  weight="normal"
                  size={16}
                  color="#83786F"
                />
              </View>
            </View>

            <Separator showLine type="small" color="#EFEFEF" />

            <View style={styles.row}>
              <TextCustom
                text="Cuenta Origen"
                variation="p"
                weight="bold"
                size={18}
                color="#83786F"
              />
              <View style={{alignItems: 'flex-end'}}>
                <TextCustom
                  style={{marginBottom: 2.5}}
                  text={originAccount?.productName}
                  variation="p"
                  weight="normal"
                  size={16}
                  color="#83786F"
                />
                <TextCustom
                  text={originAccount?.accountCode}
                  variation="p"
                  weight="normal"
                  size={16}
                  color="#83786F"
                />
              </View>
            </View>

            <Separator showLine type="small" color="#EFEFEF" />

            <View style={styles.row}>
              <TextCustom
                text="Número de operación"
                variation="p"
                weight="bold"
                size={18}
                color="#83786F"
              />
              <View style={{alignItems: 'flex-end'}}>
                <TextCustom
                  style={{marginBottom: 2.5}}
                  text={String(movementId)}
                  variation="p"
                  weight="normal"
                  size={16}
                  color="#83786F"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </SuccessTransferTemplate>
  );
};

export default SuccessRefillBimScreen;

const styles = StyleSheet.create({
  logo: {
    width: 389,
    height: 73,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
  },
  row_align: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.GrayBackground,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 4,
    marginTop: 24,
    marginBottom: Platform.OS === 'android' ? 28 : 8,
  },
});
