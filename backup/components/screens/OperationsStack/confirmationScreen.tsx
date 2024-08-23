import React, {useCallback} from 'react';
import {
  View,
  StatusBar,
  ScrollView,
  BackHandler,
} from 'react-native';
import TextCustom from '@atoms/TextCustom';
import TransfersTemplate from '@templates/TransfersTemplate';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Separator from '@atoms/Separator';
import Button from '@atoms/Button';
import {ownAccountsExecute} from '@services/Transactions';
import PopUp from '@atoms/PopUp';
import {useFocusEffect} from '@react-navigation/native';
import {EventRegister} from '@utils/EventRegister';
import useToggle from '@hooks/useToggle';
import ModalError from '@molecules/ModalError';
import { getUserSavings } from '@services/User';
import { ConfirmationOwnAccountsScreenProps } from '@navigations/types';
import { SEPARATOR_BASE } from '@theme/metrics';
import {useLoading, useUserInfo} from '@hooks/common';
interface errorMessage {
  isOpen: boolean
  errorCode: string
  message: {
    title: string
    content: string
  }
}

const ConfirmationScreen = ({navigation, route}: ConfirmationOwnAccountsScreenProps) => {
  const {isOpen, onOpen, onClose} = useToggle();

  const {
    showPopUp,
    displayErrorModal,
    isConfirmLoading,
    isConfirmPopUp,
    setHideTabBar,
    setDisplayErrorModal,
    setPersistSameBankData,
  } = useLoading();

  const {user, setUserSavings} = useUserInfo();
  const person = user?.person;

  const onSubmit = async () => {
    isConfirmLoading(true);

    const payload = {
      concept: '',
      destinationAccount: route.params.destinationSelectedAccount,
      movementAmount: route.params.amount,
      movementCurrency: route.params.currency === 'S/' ? 1 : 2,
      originAccount: route.params.originSelectedAccount,
      typeDestinationAccount: route.params.destinationSelectedName, //here goes the type of the destino account
      typeOriginAccount: route.params.originSelectedName, //here goes the type of the origin account
    }
    try {
      const res = await ownAccountsExecute({payload, documentType: person?.documentTypeId, documentNumber: person?.documentNumber, screen: route.name})

      if((!res?.isWarning && !res?.isSuccess && res?.errorCode === '') || (res?.isWarning && !res?.isSuccess && res?.errorCode === '-1')) {
        isConfirmLoading(false);
        setDisplayErrorModal({
          errorCode: '-1',
          isOpen: true,
          message: {
            title: '¡Ups, hubo un problema!',
            content: 'No hemos podido cargar tu información, por favor intenta en unos segundos o vuelve a ingresar.'
          },
        });
        return
      }
      
      if(res?.isWarning && !res?.isSuccess) {
        isConfirmLoading(false);
        setDisplayErrorModal({
          isOpen: true,
          message: res.data.message,
          errorCode: res.errorCode,
        });
        return
      } else if (res?.data && res?.isSuccess) {
        setHideTabBar(true);
        setPersistSameBankData(false);
        navigation.navigate('SuccessTransfer', {
          originSelectedName: route.params.originSelectedName,
          originSelectedAccount: route.params.originSelectedAccount,
          destinationSelectedName: route.params.destinationSelectedName,
          destinationSelectedAccount: route.params.destinationSelectedAccount,
          movementAmount: route.params.amount,
          amountValueText: route.params.amountValueText,
          movementId: res?.data?.movementId,
          dateTransaction: res?.data?.dateTransaction,
          hourTransaction: res?.data?.hourTransaction,
        });
        isConfirmLoading(false);
      }
      
    } catch (error) {
      setDisplayErrorModal({
        errorCode: '-1',
        isOpen: true,
        message: {
          title: '¡Ups, hubo un problema!',
          content: 'No hemos podido cargar tu información, por favor intenta en unos segundos o vuelve a ingresar.'
        },
      });
    } finally {
      isConfirmLoading(false);
    }
  };

  const goBack = useCallback(() => {
    navigation.navigate('OwnAccounts', {from: 'Confirmation'});
  }, [navigation]);

  const goBackfromErrorModal = useCallback(() => {
    navigation.navigate('OwnAccounts', {from: 'errorModal'});
  }, [navigation]);

  const handlePressBack = useCallback(() => {
    goBack();
    // goBackInfo.current = {path: '', isFromTab: false}
    return true;
  }, [goBack]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => handlePressBack(),
      );

      return () => backHandler.remove();
    }, [handlePressBack]),
  );

  useFocusEffect(
    useCallback(() => {
      const id = EventRegister.on('tabPress', e => {
        e.preventDefault();
        onOpen();
        // goBackInfo.current = {path: e.target.split('-')[0], isFromTab: true}
      });

      return () => {
        EventRegister.rm(id!);
      };
    }, [onOpen]),
  );

  const updateUserSavings = async () => {
    await getUserSavings({ personUid: person?.personUId }).then(res => {
      setUserSavings(res);
    });
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent
      />
      <TransfersTemplate title="Confirmación" titleSize={24} goBack={goBack}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View
            style={{
              flex: 1,
              paddingBottom: SEPARATOR_BASE * 3,
              justifyContent: 'space-between',
              minHeight: '100%',
            }}>
            <View>
              <Separator type="small" color="#EFEFEF" />
              <TextCustom
                style={{marginBottom: SEPARATOR_BASE * 2}}
                text="Monto a transferir"
                variation="p"
                weight="bold"
                size={20}
                color="#83786F"
              />
              <TextCustom
                align="center"
                text={route.params.amountValueText}
                variation="p"
                weight="bold"
                size={45}
                color="#83786F"
              />

              <Separator showLine type="small" color="#EFEFEF" />

              <TextCustom
                style={{marginBottom: SEPARATOR_BASE * 0.7, marginTop: SEPARATOR_BASE * 0.6}}
                text="Cuenta Destino"
                variation="p"
                weight="bold"
                size={18}
                color="#83786F"
              />
              <TextCustom
                style={{marginBottom: SEPARATOR_BASE * 0.7}}
                text={route.params.destinationSelectedName}
                variation="p"
                weight="bold"
                size={16}
                color="#83786F"
              />
              <TextCustom
                style={{marginBottom: SEPARATOR_BASE * 0.7}}
                text={route.params.destinationSelectedAccount}
                variation="p"
                weight="bold"
                size={16}
                color="#83786F"
              />
              <Separator showLine type="small" color="#EFEFEF" />

              <TextCustom
                style={{marginBottom: SEPARATOR_BASE * 0.7, marginTop: SEPARATOR_BASE * 0.7}}
                text="Cuenta Origen"
                variation="p"
                weight="bold"
                size={18}
                color="#83786F"
              />
              <TextCustom
                style={{marginBottom: SEPARATOR_BASE * 0.7}}
                text={route.params.originSelectedName}
                variation="p"
                weight="bold"
                size={16}
                color="#83786F"
              />
              <TextCustom
                style={{marginBottom: SEPARATOR_BASE * 0.7}}
                text={route.params.originSelectedAccount}
                variation="p"
                weight="bold"
                size={16}
                color="#83786F"
              />
              <Separator showLine type="large" color="#EFEFEF" />
            </View>

            <View
              style={{
                width: '80%',
                alignSelf: 'center',
              }}>
              <Button
                text="Transferir"
                textSize={18}
                type="primary"
                onPress={onSubmit}
                orientation="vertical"
              />
            </View>
          </View>
        </ScrollView>

        {showPopUp?.isVisible && (
          <PopUp open={showPopUp?.isVisible}>
            <TextCustom
              text={showPopUp?.message}
              weight="normal"
              variation="h2"
              color="#83786F"
              size={20}
            />
            <Separator type="small" />
            <TextCustom
              weight="normal"
              variation="p"
              text="Recuerda que puedes transferir hasta S/ 10,000.00 o $ 3,000.00 por día."
              color="#83786F"
              align="center"
            />
            <Separator type="medium" />
            <Button
              text="Entiendo"
              textSize={18}
              type="primary"
              orientation="horizontal"
              onPress={() => {
                isConfirmPopUp({
                  isVisible: false,
                  message: '',
                });
              }}
              containerStyle={{
                width: '75%',
                justifyContent: 'center',
              }}
            />
          </PopUp>
        )}
      </TransfersTemplate>

      <ModalError
        isOpen={displayErrorModal.isOpen}
        errorCode={displayErrorModal.errorCode}
        title={displayErrorModal.message.title}
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
          updateUserSavings()
          if(displayErrorModal.errorCode === '-1') {
            navigation.navigate('Main')
          } else {
            goBackfromErrorModal()
          }
        }}
      />

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
            /*if (goBackInfo.current?.isFromTab) {
              onClose()
              await new Promise(res => setTimeout(res, 500));
              navigation.navigate(getMainScreenByName(goBackInfo.current.path))
              return
            }
            onClose()
            await new Promise(res => setTimeout(res, 500));
            goBack()*/

            onClose();
            await new Promise(res => setTimeout(res, 500));
            navigation.navigate('MainScreen');
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
    </>
  );
};

export default ConfirmationScreen;
