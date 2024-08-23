import {
  View,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {SuccessSameBankScreenProps} from '@navigations/types';
import SuccessTransferTemplate from '@templates/SuccessTransferTemplate';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import Button from '@atoms/Button';
import Icon from '@atoms/Icon';
import {Colors} from '@theme/colors';
import {saveScreenshot, shareScreenshot} from '@utils/screenshot';
import Modal from 'react-native-modal';
import moment from 'moment';
import {getUserSavings} from '@services/User';
import {useLoading, useUserInfo} from '@hooks/common';
import {convertToCurrency} from '@utils/convertCurrency';
import {nameForTransfer} from '@utils/nameForTransfer';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import { OperationStackContext } from '@contexts/OperationStackContext';
import { useFavorites } from '@hooks/common';
import { useFocusEffect } from '@react-navigation/native';
import { SEPARATOR_BASE } from '@theme/metrics';

const SuccessTransferSameBankScreen = ({
  route,
  navigation,
}: SuccessSameBankScreenProps) => {
  const operationStackContext = useContext(OperationStackContext);
  const {
    concept,
    formatAmount,
    operationUId,
    destinationAccountName,
    destinationAccountNumber,
    movementId,
    itfTax,
    amount,
    hourTransaction,
    dateTransaction,
    favoriteName
  } = route.params;

  useLayoutEffect(() => {
    operationStackContext.disableUseFocusEffect = false;
  }, []);

  const montoCargado = convertToCurrency(itfTax + amount);

  const originAccount = useAccountByOperationUid({operationUId});
  const arrNames = useMemo(
    () => nameForTransfer(destinationAccountName),
    [destinationAccountName],
  );

  const viewShotRef = useRef<View | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {user, setUserSavings} = useUserInfo();
  const person = user?.person;
  const {setHideTabBar} = useLoading();
  const {addFavorite} = useFavorites();

  const updateUserSavings = async () => {
    await getUserSavings({personUid: person?.personUId}).then(res =>
      setUserSavings(res),
    );
  };
  const goHome = () => {
    setHideTabBar(false);
    navigation.navigate('Main');
  };

  useFocusEffect(
    useCallback(() => {
      if (favoriteName) {
        addFavorite({
          concept: favoriteName,
          isLocal: true,
          ownAccount: false,
          compartamosBeneficiaryAccount: destinationAccountNumber,
        });
      }
    }, [addFavorite, destinationAccountNumber, favoriteName]),
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  const hasConcept = concept.trim().length !== 0;

  return (
    <SuccessTransferTemplate title="¡Transferencia Exitosa!">
      <Modal style={styles.modal} isVisible={showModal}>
        <Separator type="medium" />
        <TextCustom
          text="La constancia de transferencia ha sido guardada en tu galeria de fotos correctamente."
          variation="p"
          color="#83786F"
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
        <Separator type="small" />
      </Modal>

      <View
        onLayout={updateUserSavings}
        style={{flex: 1, position: 'relative', width: '100%'}}>
        <ScrollView
          style={{
            flex: 1,
            zIndex: 9999,
            width: '100%',
            backgroundColor: '#fff',
          }}>
          <TextCustom
            style={{marginVertical: SEPARATOR_BASE * 2}}
            text="Monto transferido"
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
            style={{marginBottom: SEPARATOR_BASE * 2}}
          />
          <TextCustom
            align="center"
            text={`${dateTransaction}, ${hourTransaction}`}
            variation="p"
            weight="normal"
            size={16}
            color="#83786F"
          />

          <Separator showLine type="small" color="#EFEFEF" />

          {hasConcept && (
            <>
              <View style={styles.row_align}>
                <TextCustom
                  text="Concepto"
                  variation="p"
                  weight="bold"
                  size={18}
                  color={Colors.Paragraph}
                />
                <TextCustom
                  text={concept}
                  variation="p"
                  weight="normal"
                  size={16}
                  color="#83786F"
                />
              </View>
              <Separator showLine type="small" color="#EFEFEF" />
            </>
          )}

          <View style={[styles.row]}>
            <TextCustom
              text="Cuenta Destino"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
            />
            <View style={{alignItems: 'flex-end'}}>
              {arrNames.map(n => (
                <TextCustom
                  key={`name-${n}`}
                  style={{marginBottom: SEPARATOR_BASE * 0.5}}
                  text={n}
                  variation="p"
                  weight="normal"
                  size={16}
                  color="#83786F"
                />
              ))}
              <TextCustom
                text={destinationAccountNumber}
                variation="p"
                weight="normal"
                size={16}
                color="#83786F"
              />
            </View>
          </View>

          <Separator showLine type="small" color="#EFEFEF" />

          <View style={styles.row_align}>
            <TextCustom
              style={{marginBottom: SEPARATOR_BASE * 0.7}}
              text="ITF"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
            />
            <TextCustom
              text={`${originAccount?.currency} ${convertToCurrency(itfTax,5,4)}`}
              variation="p"
              weight="normal"
              size={16}
              color="#83786F"
            />
          </View>

          <View style={styles.row_align}>
            <TextCustom
              style={{marginBottom: SEPARATOR_BASE * 0.7}}
              text="Monto total cargado"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
            />
            <TextCustom
              text={`${originAccount?.currency} ${montoCargado}`}
              variation="p"
              weight="normal"
              size={16}
              color="#83786F"
            />
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
                style={{marginBottom: SEPARATOR_BASE * 0.5}}
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
              text="Número de Operación"
              variation="p"
              weight="bold"
              size={18}
            />
            <TextCustom
              text={String(movementId)}
              variation="p"
              weight="normal"
              size={16}
              color="#83786F"
            />
          </View>

          <Separator showLine type="small" color="#EFEFEF" />

          <View style={styles.info}>
            <Icon name="mail" size="x-small" style={{marginRight: SEPARATOR_BASE * 6}} />
            <TextCustom
              size={16}
              weight="bold"
              variation="small"
              text="A continuación enviaremos el detalle de la operación a tu correo electrónico registrado."
            />
          </View>

          <View
            style={{
              marginBottom: SEPARATOR_BASE * 2.5,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Pressable
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
                style={{marginBottom: SEPARATOR_BASE * 0.5}}
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
              onPress={() =>
                saveScreenshot(viewShotRef).then(isSuccess =>
                  setShowModal(!!isSuccess),
                )
              }
              style={{
                width: 80,
                height: 80,
                marginLeft: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon
                name="download"
                size="small"
                stroke={Colors.DarkGray}
                style={{marginBottom: SEPARATOR_BASE * 0.5}}
              />
              <TextCustom
                text="Descargar"
                variation="p"
                weight="bold"
                size={16}
                color={Colors.DarkGray}
              />
            </Pressable>
          </View>

          <View style={{alignSelf: 'center', width: '80%', paddingBottom: SEPARATOR_BASE * 7}}>
            <Button
              textSize={18}
              text="Ir a inicio"
              orientation="vertical"
              type="primary"
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
              style={{width: 389, height: 73}}
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
              size={16}
              variation="p"
              weight="bold"
              color={Colors.Primary}
              style={{marginBottom: 24}}
              text="Constancia de transferencia a otras cuentas Compartamos"
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
              text={formatAmount}
              variation="p"
              weight="bold"
              size={36}
              color="#83786F"
              style={{marginBottom: 7}}
            />
            <TextCustom
              align="center"
              text={`${dateTransaction}, ${hourTransaction}`}
              variation="p"
              weight="bold"
              size={14}
              color="#83786F"
            />

            <Separator showLine type="small" color="#EFEFEF" />

            {hasConcept && (
              <>
                <View style={styles.row_align}>
                  <TextCustom
                    text="Concepto"
                    variation="p"
                    weight="bold"
                    size={18}
                    color={Colors.Paragraph}
                  />
                  <TextCustom
                    text={concept}
                    variation="p"
                    weight="normal"
                    size={16}
                    color="#83786F"
                  />
                </View>
                <Separator showLine type="small" color="#EFEFEF" />
              </>
            )}

            <View style={[styles.row]}>
              <TextCustom
                text="Cuenta Destino"
                variation="p"
                weight="bold"
                size={18}
                color="#83786F"
              />
              <View style={{alignItems: 'flex-end'}}>
                {arrNames.map(n => (
                  <TextCustom
                    key={`name-${n}`}
                    style={{marginBottom: SEPARATOR_BASE * 0.3}}
                    text={n}
                    variation="p"
                    weight="normal"
                    size={16}
                    color="#83786F"
                  />
                ))}
                <TextCustom
                  text={destinationAccountNumber}
                  variation="p"
                  weight="normal"
                  size={16}
                  color="#83786F"
                />
              </View>
            </View>

            <Separator showLine type="small" color="#EFEFEF" />

            <View style={styles.row_align}>
              <TextCustom
                style={{marginBottom: 5}}
                text="ITF"
                variation="p"
                weight="bold"
                size={18}
                color="#83786F"
              />
              <TextCustom
                text={`${originAccount?.currency} ${convertToCurrency(itfTax,5,4)}`}
                variation="p"
                weight="normal"
                size={16}
                color="#83786F"
              />
            </View>

            <View style={styles.row_align}>
              <TextCustom
                style={{marginBottom: 5}}
                text="Monto total cargado"
                variation="p"
                weight="bold"
                size={18}
                color="#83786F"
              />
              <TextCustom
                text={`${originAccount?.currency} ${montoCargado}`}
                variation="p"
                weight="normal"
                size={16}
                color="#83786F"
              />
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
                  style={{marginBottom: SEPARATOR_BASE * 0.3}}
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
                text="Número de Operación"
                variation="p"
                weight="bold"
                size={18}
              />
              <TextCustom
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
    </SuccessTransferTemplate>
  );
};

export default SuccessTransferSameBankScreen;

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    top: '30%',
    backgroundColor: '#FFF',
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: SEPARATOR_BASE,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SEPARATOR_BASE * 0.6,
    marginBottom: SEPARATOR_BASE * 0.6,
  },
  row_align: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SEPARATOR_BASE * 0.6,
    marginBottom: SEPARATOR_BASE * 0.6,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.GrayBackground,
    paddingVertical: SEPARATOR_BASE * 1.5,
    paddingHorizontal: 30,
    borderRadius: 4,
    marginTop: SEPARATOR_BASE * 3,
    marginBottom: SEPARATOR_BASE * 3,
  },
});
