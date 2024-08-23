import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import Icon from '@atoms/Icon';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import { SuccessOtherBanksScreenProps } from '@navigations/types';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import SuccessTransferTemplate from '@templates/SuccessTransferTemplate';
import { Colors } from '@theme/colors';
import { saveScreenshot, shareScreenshot } from '@utils/screenshot';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { convertToCurrency } from '@utils/convertCurrency';
import { nameForTransfer } from '@utils/nameForTransfer';
import { getUserSavings } from '@services/User';
import { useFocusEffect } from '@react-navigation/native';
import { useFavorites, useUserInfo } from '@hooks/common';
import { OperationStackContext } from '@contexts/OperationStackContext';
import { useLoading } from '@hooks/common';

const SuccessTransferOtherBanksScreen = ({
  route,
  navigation,
}: SuccessOtherBanksScreenProps) => {
  const operationStackContext = useContext(OperationStackContext);
  const {
    itfTax,
    concept,
    movementId,
    operationUId,
    formatAmount,
    originCommission,
    destinationCommission,
    ownerFullName,
    destinationAccount,
    destinationBankName,
    destinationAccountName,
    movementAmount,
    dateTransaction,
    hourTransaction,
    favoriteName,
    sameHeadLine,
  } = route.params;

  const {setHideTabBar} = useLoading();

  useLayoutEffect(() => {
    operationStackContext.disableUseFocusEffect = false;
  }, []);

  const montoCargado = convertToCurrency(
    itfTax + originCommission + destinationCommission + movementAmount,
  );

  // const [name, middleName, ...lastnames] = ownerFullName?.split(' ');
  const arrNames = useMemo(
    () => nameForTransfer(destinationBankName),
    [destinationBankName],
  );

  const viewShotRef = useRef<View | null>(null);
  const [showModal, setShowModal] = useState(false);
  const {user, setUserSavings} = useUserInfo();
  const person = user?.person;
  const {addFavorite} = useFavorites();

  const originAccount = useAccountByOperationUid({ operationUId });

  useFocusEffect(
    useCallback(() => {
      if (favoriteName) {
        /* addFavorite({
          concept: favoriteName,
          isLocal: false,
          ownAccount: sameHeadLine ? 
        }); */
      }
    }, [addFavorite, favoriteName]),
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  const updateUserSavings = async () => {
    await getUserSavings({ personUid: person?.personUId }).then(res => {
      setUserSavings(res);
    });
  };

  const goHome = () => {
    setHideTabBar(false);
    navigation.navigate('Main')
  }

  const hasConcept = concept.trim().length !== 0;

  return (
    <SuccessTransferTemplate title="¡Transferencia Exitosa!">
      <Modal style={styles.modal} isVisible={showModal}>
        <TextCustom
          variation="p"
          color="#83786F"
          text="La constancia de transferencia ha sido guardada en tu galeria de fotos correctamente."
        />
        <TouchableOpacity
          style={{ alignSelf: 'flex-end', marginTop: 24 }}
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
        style={{ flex: 1, position: 'relative', width: '100%' }}>
        <KeyboardAwareScrollView
          style={{ flex: 1, marginBottom:40 }}
          bounces={false}
          extraHeight={8 * 16}
          enableOnAndroid={true}>
          <TextCustom
            style={{ marginBottom: 8 }}
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
            style={{ marginBottom: 7 }}
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
              text="Cuenta Destino CCI"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
            />
            <View style={{ alignItems: 'flex-end' }}>
              {arrNames.map(n => (
                <TextCustom
                  key={`name-${n}`}
                  style={{ marginBottom: 2.5 }}
                  text={n}
                  variation="p"
                  weight="normal"
                  size={16}
                  color="#83786F"
                />
              ))}
              <TextCustom
                text={destinationAccount}
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
              style={{ marginBottom: 5 }}
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
              style={{ marginBottom: 5 }}
              text="Comisión Compartamos Financiera"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
            />
            <TextCustom
              text={`${originAccount?.currency} ${convertToCurrency(
                originCommission,
                5,
                4
              )}`}
              variation="p"
              weight="normal"
              size={16}
              color="#83786F"
            />
          </View>
          <View style={styles.row_align}>
            <TextCustom
              style={{ marginBottom: 5 }}
              text="Comisión Banco Destino"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
            />
            <TextCustom
              text={`${originAccount?.currency} ${convertToCurrency(
                destinationCommission,
                5,
                4
              )}`}
              variation="p"
              weight="normal"
              size={16}
              color="#83786F"
            />
          </View>
          <View style={styles.row_align}>
            <TextCustom
              style={{ marginBottom: 5 }}
              text="Monto Total Cargado"
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
            <View style={{ alignItems: 'flex-end' }}>
              <TextCustom
                style={{ marginBottom: 2.5 }}
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

          <View style={styles.row_align}>
            <TextCustom
              style={{ marginBottom: 5 }}
              text="Número de Operación"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
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
            <Icon name="mail" size="x-small" style={{ marginRight: 36 }} />
            <TextCustom
              size={16}
              weight="bold"
              variation="small"
              text="A continuación enviaremos el detalle de la operación a tu correo electrónico registrado."
            />
          </View>

          <View
            style={{
              marginBottom: 18,
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
                style={{ marginBottom: 4 }}
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
                  setShowModal(isSuccess),
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
                size="small"
                name="download"
                stroke={Colors.DarkGray}
                style={{ marginBottom: 4 }}
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

          <View style={{ alignSelf: 'center', width: '80%', paddingBottom: 40 }}>
            <Button
              textSize={18}
              type="primary"
              text="Ir a inicio"
              orientation="vertical"
              onPress={goHome}
            />
          </View>
        </KeyboardAwareScrollView>

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
              style={{ marginBottom: 24 }}
              text="Constancia de transferencia a otros bancos"
              variation="p"
              weight="bold"
              size={16}
              color={Colors.Primary}
            />
            <TextCustom
              style={{ marginBottom: 12 }}
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
              style={{ marginBottom: 7 }}
            />
            <TextCustom
              align="center"
              text={`${dateTransaction}, ${hourTransaction}`}
              variation="p"
              weight="bold"
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
                text="Cuenta Destino CCI"
                variation="p"
                weight="bold"
                size={18}
                color="#83786F"
              />
              <View style={{ alignItems: 'flex-end' }}>
                {arrNames.map(n => (
                  <TextCustom
                    key={`name-${n}`}
                    style={{ marginBottom: 2.5 }}
                    text={n}
                    variation="p"
                    weight="normal"
                    size={16}
                    color="#83786F"
                  />
                ))}
                <TextCustom
                  text={destinationAccount}
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
                style={{ marginBottom: 5 }}
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
                style={{ marginBottom: 5 }}
                text="Comisión Compartamos Financiera"
                variation="p"
                weight="bold"
                size={18}
                color="#83786F"
              />
              <TextCustom
                text={`${originAccount?.currency} ${convertToCurrency(
                  originCommission,
                  5,
                  4
                )}`}
                variation="p"
                weight="normal"
                size={16}
                color="#83786F"
              />
            </View>
            <View style={styles.row_align}>
              <TextCustom
                style={{ marginBottom: 5 }}
                text="Comisión Banco Destino"
                variation="p"
                weight="bold"
                size={18}
                color="#83786F"
              />
              <TextCustom
                text={`${originAccount?.currency} ${convertToCurrency(
                  destinationCommission,
                  5,
                  4
                )}`}
                variation="p"
                weight="normal"
                size={16}
                color="#83786F"
              />
            </View>
            <View style={styles.row_align}>
              <TextCustom
                style={{ marginBottom: 5 }}
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
              <View style={{ alignItems: 'flex-end' }}>
                <TextCustom
                  style={{ marginBottom: 2.5 }}
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

export default SuccessTransferOtherBanksScreen;

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
    marginBottom: 24,
  },
});
