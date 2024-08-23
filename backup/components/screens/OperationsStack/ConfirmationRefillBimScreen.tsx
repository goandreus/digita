import {View, StatusBar, StyleSheet, BackHandler, Alert} from 'react-native';
import React, {useCallback, useContext, useRef} from 'react';
import {Colors} from '@theme/colors';
import TransfersTemplate from '@templates/TransfersTemplate';
import {ConfirmationRefillScreenProps} from '@navigations/types';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import Button from '@atoms/Button';
import Icon from '@atoms/Icon';
import PopUp from '@atoms/PopUp';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import useToggle from '@hooks/useToggle';
import {StackActions, useFocusEffect} from '@react-navigation/native';
import {EventRegister} from '@utils/EventRegister';
import {getMainScreenByName} from '@utils/getMainScreenByName';
import {refillBimExecute} from '@services/Transactions';
import {storeOTP} from '@hooks/useStoreOTP';
import ModalError from '@molecules/ModalError';
import {useLoading, useTimer, useUserInfo} from '@hooks/common';
import { OperationStackContext } from '@contexts/OperationStackContext';
import ModalIcon from '@molecules/ModalIcon';

type transferencyStatus = 'SUCCESS' | 'NEED_AUTHENTICATION' | 'BLOCKED' | 'UNKNOWN';

const ConfirmationRefillScreen = ({
  route,
  navigation,
}: ConfirmationRefillScreenProps) => {
  const {restart} = useTimer();

  const operationStackContext = useContext(OperationStackContext);
  const goBackPath = useRef<string | null>(null);

  const {amount, formatAmount, operationUId, phoneNumberBim} = route?.params;

  const {user} = useUserInfo();
  const person = user?.person;
  const originAccount = useAccountByOperationUid({operationUId});

  const {
    displayErrorModal,
    setHideTabBar,
    isConfirmLoading,
    setDisplayErrorModal,
    showTokenModal,
    setShowTokenModal
  } = useLoading();

  const {isOpen, onOpen, onClose} = useToggle();

  const handleSubmit = async () => {
    const mainStackNavigator = navigation.getParent('MainStackNavigator');
    const token = storeOTP.getOtpState().currentToken;

    if (!token) {
      // TODO: If i came to this view without token
      return;
    }

    let isLoadingWithFishes: boolean = false;

    try {
      //isConfirmLoading(true);
      isLoadingWithFishes = true;
      operationStackContext.disableUseFocusEffect = true;
      mainStackNavigator?.dispatch(StackActions.push('LoadingFishes', {screenId: 'Loading-' + route.key}));
      const res = await refillBimExecute({
        amount,
        codeVerification: String(token),
        receivingfri: `51${phoneNumberBim}`,
        accountType: originAccount?.productName!,
        accountNumber: originAccount?.accountCode!,
        documentType: person?.documentTypeId,
        documentNumber: person?.documentNumber,
      });

      let status: transferencyStatus = 'UNKNOWN';
      if (res?.isSuccess === true) {
        if (res?.errorCode === '100') status = 'SUCCESS';
      } else {
        if (res?.errorCode === '102') status = 'BLOCKED';
        else if (res?.errorCode === '101') status = 'NEED_AUTHENTICATION';
      }

      if (res === 499) {
        mainStackNavigator?.dispatch(StackActions.pop());
        operationStackContext.disableUseFocusEffect = false;
        setShowTokenModal(true);
      } else {
        switch (status) {
          case 'UNKNOWN':
            mainStackNavigator?.dispatch(StackActions.pop());
            operationStackContext.disableUseFocusEffect = false;
            const modalMessage =
              res?.data?.message?.title !== undefined &&
              res?.data?.message?.content !== undefined
                ? {
                    errorCode: '-1',
                    isOpen: true,
                    message: {
                      title: res.data.message.title,
                      content: res.data.message.content,
                    },
                  }
                : {
                    errorCode: '-1',
                    isOpen: true,
                    message: {
                      title: '¡Ups, hubo un problema!',
                      content:
                        'No hemos podido cargar tu información, por favor intenta en unos segundos o vuelve a ingresar.',
                    },
                  };
            setDisplayErrorModal(modalMessage);
            break;
          case 'NEED_AUTHENTICATION':
            if(person !== undefined){
              restart({
                documentNumber: person.documentNumber,
                documentType: person.documentTypeId
              });
              navigation.dispatch(
                StackActions.replace('RegisterOTP', {
                  type: 'REFILL_BIM',
                  documentType: person.documentTypeId,
                  documentNumber: person.documentNumber,
                  phoneNumberObfuscated: res?.data?.cellphone,
                  channel: 'sms',
                  isSensitiveInfo: true,
                  stepProps: undefined,
                  trackingTransaction: res?.data?.trackingTransaction,
                  refillData: {
                    amount: route.params.amount,
                    formatAmount: route.params.formatAmount,
                    operationUId: route.params.operationUId,
                    phoneNumberBim: route.params.phoneNumberBim,
                  },
                }),
              );
            }
            break;
          case 'BLOCKED':
            navigation.dispatch(StackActions.replace('InfoAccessBlocked'));
            break;
          case 'SUCCESS':
            setHideTabBar(true);
            navigation.dispatch(
              StackActions.replace('MainTab', {
                screen: 'MainOperations',
                params: {
                  screen: 'SuccessRefillBim',
                  params: {
                    ...route?.params,
                    date: res.data.date,
                    hour: res.data.hour,
                    movementId: res.data.transactionId,
                  },
                },
              }),
            );
            break;
        }
      }
    } catch (error) {
      if (isLoadingWithFishes === true) {
        mainStackNavigator?.dispatch(StackActions.pop());
        operationStackContext.disableUseFocusEffect = false;
      }
      setDisplayErrorModal({
        isOpen: true,
        message: {
          title: '¡Ups, hubo un problema!',
          content: 'No hemos podido cargar tu información, por favor intenta en unos segundos o vuelve a ingresar.'
        },
      });
    } finally {
    }
  };

  const goBack = useCallback(
    () => navigation.navigate('RefillBim', {from: 'ConfirmationRefillBim'}),
    [navigation],
  );

  const handleBackPress = useCallback(() => {
    goBack();
    return true;
  }, [goBack]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => handleBackPress(),
      );

      return () => backHandler.remove();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const id = EventRegister.on('tabPress', e => {
        e.preventDefault();
        onOpen();

        goBackPath.current = 'MainScreen';
      });

      return () => {
        EventRegister.rm(id!);
      };
    }, []),
  );

  return (
    <>
      <ModalIcon
        type="token"
        message="Token digital"
        description="Lo sentimos, no pudimos validar tu token digital, por favor recarga nuevamente."
        open={showTokenModal}
        onRequestClose={() => {}}
        actions={
          <>
            <Button
              onPress={() => setShowTokenModal(false)}
              orientation="horizontal"
              type="primary"
              text="Volver a intentar"
            />
          </>
        }
      />
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent
      />
      <TransfersTemplate title="Confirmación" goBack={goBack}>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View>
            <TextCustom
              style={{marginBottom: 16}}
              text="Monto a recargar en Bim"
              variation="p"
              weight="bold"
              size={20}
              color="#83786F"
            />
            <TextCustom
              align="center"
              text={formatAmount}
              variation="p"
              weight="bold"
              size={45}
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
          </View>

          <View>
            <View style={styles.info}>
              <Icon name="three-dots" size="x-small" style={{marginRight: 8}} />
              <TextCustom
                weight="bold"
                variation="small"
                text="Validaremos esta operación con tu Token Digital"
              />
            </View>

            <View
              style={{alignSelf: 'center', width: '80%', paddingBottom: 24}}>
              <Button
                text="Recargar"
                textSize={18}
                type="primary"
                orientation="vertical"
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </TransfersTemplate>

      <PopUp open={isOpen}>
        <TextCustom
          align="center"
          color="#665F59"
          variation="h0"
          weight="normal"
          size={18}
          text="¿Seguro que quieres cerrar la operación?"
        />
        <Separator type="small" />
        <TextCustom
          align="center"
          color="#83786F"
          variation="p"
          text="Si cierras la operación, toda la información será eliminada"
        />
        <Separator size={24} />
        <Button
          containerStyle={{width: '100%'}}
          type="primary"
          text="Sí, cerrar"
          onPress={async () => {
            onClose();
            await new Promise(res => setTimeout(res, 500));
            navigation.navigate(getMainScreenByName(goBackPath.current));
          }}
          orientation="horizontal"
        />
        <Separator type="small" />
        <TextCustom
          size={16}
          align="center"
          color="#83786F"
          variation="link"
          text="Mantener la operación"
          onPress={() => onClose()}
        />
      </PopUp>

      <ModalError
        isOpen={displayErrorModal.isOpen}
        errorCode={displayErrorModal.errorCode}
        title={displayErrorModal.message.title}
        titleButton={
          displayErrorModal.errorCode === '497' ? 'Aceptar' : undefined
        }
        content={displayErrorModal.message.content}
        close={() => {
          setDisplayErrorModal({
            isOpen: false,
            message: {
              title: '',
              content: '',
            },
            errorCode: '',
          });
          if (
            displayErrorModal.errorCode == '497' ||
            displayErrorModal.errorCode == '499' ||
            displayErrorModal.errorCode == '498'
          ) {
            navigation.navigate('Main');
          } else {
            navigation.navigate('RefillBim', {from: 'Operations'});
          }
        }}
      />
    </>
  );
};

export default ConfirmationRefillScreen;

const styles = StyleSheet.create({
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
    backgroundColor: Colors.GrayBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 31,
  },
});
