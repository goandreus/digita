import React, {useCallback, useContext, useMemo, useRef, useState} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {Colors} from '@theme/colors';
import TransfersTemplate from '@templates/TransfersTemplate';
import {ConfirmationOtherBanksScreenProps} from '@navigations/types';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import Button from '@atoms/Button';
import Input from '@atoms/Input';
import Icon from '@atoms/Icon';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import {otherBanksExecute} from '@services/Transactions';
import {useDispatch} from 'react-redux';
import {convertToCurrency} from '@utils/convertCurrency';
import {nameForTransfer} from '@utils/nameForTransfer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useForm, {FormError} from '@hooks/useForm';
import {validateConcept} from '@utils/validateConcept';
import {isEmpty} from '@utils/isEmpty';
import {useFocusEffect, StackActions} from '@react-navigation/native';
import {EventRegister} from '@utils/EventRegister';
import useToggle from '@hooks/useToggle';
import PopUp from '@atoms/PopUp';
import {getMainScreenByName} from '@utils/getMainScreenByName';
import { storeOTP } from '@hooks/useStoreOTP';
import ModalIcon from '@molecules/ModalIcon';
import ModalError from '@molecules/ModalError';
import { getUserSavings } from '@services/User';
import AddAccountToFavorite, { useAddAccountToFavorite } from '@molecules/AddAccountToFavorite';
import FocusAwareStatusBar from '@atoms/FocusAwareStatusBar';
import { getRemoteValue } from '@utils/firebase';
import { OperationStackContext } from '@contexts/OperationStackContext';
import {useLoading, useTerms, useTimer, useUserInfo} from '@hooks/common';

type transferencyStatus = 'SUCCESS' | 'NEED_AUTHENTICATION' | 'BLOCKED' | 'UNKNOWN';

const ConfirmationOtherBanksScreen = ({
  route,
  navigation,
}: ConfirmationOtherBanksScreenProps) => {
  const operationStackContext = useContext(OperationStackContext);
  const {
    itfTax,
    originCommission,
    destinationCommission,
    operationUId,
    formatAmount,
    transferData,
    destinationBankName,
    ownerFullName,
    productName,
    owner
  } = route.params;

  const {user, setUserSavings} = useUserInfo();
  const person = user?.person;

  useFocusEffect(
    useCallback(() => {
      operationStackContext.disableUseFocusEffect = false;
    }, []),
  );
  const montoCargado = convertToCurrency(
    itfTax +
      originCommission +
      destinationCommission +
      transferData.movementAmount,
  );

  // const [name, middleName, ...lastnames] = ownerFullName?.split(' ');
  const arrNames = useMemo(
    () => nameForTransfer(destinationBankName),
    [destinationBankName],
  );

  const dispatch = useDispatch();
  const {isOpen, onOpen, onClose} = useToggle();
  const {accountToFavorite, handleToggle, handleChangeText} =
    useAddAccountToFavorite();
  const {restart} = useTimer();
  const goBackPath = useRef<{isFromTab: boolean; path: string} | null>(null);
  const {values, clear, ...form} = useForm({
    initialValues: {concept: ''},
    validate: rawValues => {
      const newErrors: FormError<{concept: string}> = {};

      if (!isEmpty(rawValues.concept) && !validateConcept(rawValues.concept)) {
        newErrors.concept = 'Valor ingresado invalido.';
      }

      return newErrors;
    },
  });

  const originAccountData = useAccountByOperationUid({operationUId});
  const {
    showTokenModal,
    displayErrorModal,
    setHideTabBar,
    isConfirmLoading,
    setDisplayErrorModal,
    setShowTokenModal,
  } = useLoading();

  const {setTerms} = useTerms();
  const handleSubmit = async () => {
    const mainStackNavigator = navigation.getParent('MainStackNavigator');
    const token = storeOTP.getOtpState().currentToken;
    
    if (!token) {
      // TODO: If i came to this view without token
      return;
    }

    // isConfirmLoading(true);
    setTerms(false);
    let isLoadingWithFishes: boolean = false;

    try {
      if(transferData.destinationAccount.slice(0,3) === '091') {
        setDisplayErrorModal({
          errorCode: '450',
          isOpen: true,
          message: {
            title: 'Cambia el tipo de transferencia para realizar esta operación',
            content: 'La cuenta de destino es de Compartamos Financiera por ello debes hacer la operación desde Transferencia a otras cuentas Compartamos',
          },
        });
        return
      }

      isLoadingWithFishes = true;
      operationStackContext.disableUseFocusEffect = true;
      mainStackNavigator?.dispatch(StackActions.push('LoadingFishes', {screenId: 'Loading-' + route.key}));
      
      const res = await otherBanksExecute({
        payload: {
          ...transferData,
          codeVerification: String(token),
          typeOriginAccount: productName,
          movementCurrency: transferData.movementCurrency === 'S/' ? 1 : 2,
          concept: values.concept,
        },
        documentType: person?.documentTypeId,
        documentNumber: person?.documentNumber,
        screen: route.name
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
      }
      else {
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
            if (person !== undefined) {
              restart({
                documentNumber: person.documentNumber,
                documentType: person.documentTypeId,
              });
              navigation.dispatch(
                StackActions.replace('RegisterOTP', {
                  type: 'TRANSFERENCY_OTHERS',
                  documentType: person.documentTypeId,
                  documentNumber: person.documentNumber,
                  phoneNumberObfuscated: res?.data?.cellphone,
                  channel: 'sms',
                  isSensitiveInfo: true,
                  stepProps: undefined,
                  trackingTransaction: res?.data?.trackingTransaction,
                  transfer: {
                    operationUId,
                    concept: values.concept,
                    movementAmount: transferData.movementAmount,
                    formatAmount,
                    originCommission,
                    destinationBankName,
                    destinationAccountName: '',
                    destinationAccount: transferData.destinationAccount,
                    ...(isValidAccountFav && {
                      favoriteName: accountToFavorite.data?.accountName,
                      sameHeadLine: transferData.sameHeadLine,
                    }),
                  },
                }),
              );
            }
            break;
          case 'BLOCKED':
            navigation.dispatch(StackActions.replace('InfoAccessBlocked'));
            break;
          case 'SUCCESS':
            clear();
            setHideTabBar(true);
            navigation.dispatch(
              StackActions.replace('MainTab', {
                screen: 'MainOperations',
                params: {
                  screen: 'SuccessTransferOtherBanks',
                  params: {
                    itfTax,
                    operationUId,
                    concept: values.concept,
                    movementAmount: transferData.movementAmount,
                    formatAmount,
                    ownerFullName: res.data.ownerFullName,
                    originCommission,
                    destinationCommission,
                    destinationBankName,
                    movementId: res.data.movementId,
                    destinationAccountName: '',
                    destinationAccount: transferData.destinationAccount,
                    hourTransaction: res.data.hourTransaction,
                    dateTransaction: res.data.dateTransaction,
                    ...(isValidAccountFav && {
                      favoriteName: accountToFavorite.data?.accountName,
                      sameHeadLine: transferData.sameHeadLine,
                    }),
                  },
                },
              }),
            );
            break;
        }
      }
  
    } catch (err: any) {
      if (isLoadingWithFishes === true) {
        mainStackNavigator?.dispatch(StackActions.pop());
        operationStackContext.disableUseFocusEffect = false;
      }
      setDisplayErrorModal({
        errorCode: '-1',
        isOpen: true,
        message: {
          title: '¡Ups, hubo un problema!',
          content: 'No hemos podido cargar tu información, por favor intenta en unos segundos o vuelve a ingresar.'
        },
      });
    }
  };

  const goBack = useCallback(() => {
    navigation.navigate('DestinationOtherBanks', {
      operationUId,
      owner,
      from: 'ConfirmacionOtherBanks',
    });
  }, [navigation, operationUId]);

  /*const handleBackPress = useCallback(() => {
    goBackPath.current = { isFromTab: false, path: '' };
    onOpen();
    return false;
  }, [onOpen]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => handleBackPress(),
      );

      return () => backHandler.remove();
    }, [handleBackPress]),
  );*/

  useFocusEffect(
    useCallback(() => {
      const id = EventRegister.on('tabPress', e => {
        e.preventDefault();
        onOpen();

        goBackPath.current = {isFromTab: true, path: 'MainScreen'};
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

  const hasFavorites = getRemoteValue('active_favs').asBoolean()

  const hasErrors = Object.keys(form.errors).length !== 0;
  const isValidAccountFav = accountToFavorite.enable && accountToFavorite.ok;
  const isBtnDisabled = hasFavorites ? !isValidAccountFav || hasErrors : hasErrors;

  return (
    <>
      <ModalIcon
        type="token"
        message="Token digital"
        description="Lo sentimos, no pudimos validar tu token digital, por favor transfiere nuevamente."
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
      <FocusAwareStatusBar
        barStyle="light-content"
        backgroundColor={Colors.Transparent}
        translucent
      />
      <TransfersTemplate
        title="Confirmación"
        goBack={() => navigation.goBack()}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          bounces={false}
          extraHeight={8 * 16}
          enableOnAndroid={true}>
          <TextCustom
            style={{marginBottom: 16}}
            text="Monto a transferir"
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
              text="Cuenta Destino CCI"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
            />
            <View style={{alignItems: 'flex-end'}}>
              {arrNames.map(n => (
                <TextCustom
                  key={`name-${n}`}
                  style={{marginBottom: 2.5}}
                  text={n}
                  variation="p"
                  weight="normal"
                  size={16}
                  color="#83786F"
                />
              ))}

              <TextCustom
                text={transferData.destinationAccount}
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
              text={`${originAccountData?.currency} ${convertToCurrency(
                itfTax,
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
              style={{marginBottom: 5}}
              text="Comisión Compartamos Financiera"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
            />
            <TextCustom
              text={`${originAccountData?.currency} ${convertToCurrency(
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
              style={{marginBottom: 5}}
              text="Comisión Banco Destino"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
            />
            <TextCustom
              text={`${originAccountData?.currency} ${convertToCurrency(
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
              style={{marginBottom: 5}}
              text="Monto total cargado"
              variation="p"
              weight="bold"
              size={18}
              color="#83786F"
            />
            <TextCustom
              text={`${originAccountData?.currency} ${montoCargado}`}
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
                style={{marginBottom: 2.5}}
                text={originAccountData?.productName}
                variation="p"
                weight="normal"
                size={16}
                color="#83786F"
              />
              <TextCustom
                text={originAccountData?.accountCode}
                variation="p"
                weight="normal"
                size={16}
                color="#83786F"
              />
            </View>
          </View>

          <Separator showLine type="small" color="#EFEFEF" />

          <Input
            placeholder="Ingrese concepto"
            style={{marginTop: 24, marginBottom: hasFavorites ? 24 : 48}}
            {...form.inputProps('concept')}
          />

          <AddAccountToFavorite
            accountToFavorite={accountToFavorite}
            style={{marginBottom: 24}}
            handleToggle={handleToggle}
            handleChangeText={handleChangeText}
          />

          <View style={styles.info}>
            <Icon name="three-dots" size="x-small" style={{marginRight: 8}} />
            <TextCustom
              weight="bold"
              variation="small"
              text="Validaremos esta operación con tu Token Digital"
            />
          </View>

          <View style={{alignSelf: 'center', width: '80%', paddingBottom: 40}}>
            <Button
              text="Transferir"
              textSize={18}
              type="primary"
              orientation="vertical"
              onPress={handleSubmit}
              disabled={isBtnDisabled}
            />
          </View>
        </KeyboardAwareScrollView>
      </TransfersTemplate>

      <ModalError
        isOpen={displayErrorModal.isOpen}
        errorCode={displayErrorModal.errorCode}
        title={displayErrorModal.message.title}
        content={displayErrorModal.message.content}
        close={() => {
          setDisplayErrorModal({
            isOpen: false,
            errorCode: '',
            message: {
              title: '',
              content: '',
            },
          });
          clear();
          if (displayErrorModal.errorCode === '-1') {
            navigation.navigate('Main');
          } else {
            navigation.navigate('DestinationOtherBanks', {
              operationUId,
              from: 'OtherBanks',
            });
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
            onClose();

            await new Promise(res => setTimeout(res, 500));
            if (goBackPath.current?.isFromTab) {
              navigation.navigate(
                getMainScreenByName(goBackPath.current?.path),
              );
            } else {
              goBack();
            }

            clear();
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

export default ConfirmationOtherBanksScreen;

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
    marginBottom: 40,
  },
});
