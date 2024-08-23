import {
  View,
  StatusBar,
  StyleSheet,
  BackHandler,
} from 'react-native';
import React, {useCallback, useContext, useMemo} from 'react';
import {Colors} from '@theme/colors';
import TransfersTemplate from '@templates/TransfersTemplate';
import {ConfirmationSameBankScreenProps} from '@navigations/types';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import Button from '@atoms/Button';
import Input from '@atoms/Input';
import Icon from '@atoms/Icon';
import {sameBankExecute} from '@services/Transactions';
import useForm, {FormError} from '@hooks/useForm';
import PopUp from '@atoms/PopUp';
import {convertToCurrency} from '@utils/convertCurrency';
import {nameForTransfer} from '@utils/nameForTransfer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {validateConcept} from '@utils/validateConcept';
import {isEmpty} from '@utils/isEmpty';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import useToggle from '@hooks/useToggle';
import {StackActions, useFocusEffect} from '@react-navigation/native';
import {EventRegister} from '@utils/EventRegister';
import { storeOTP } from '@hooks/useStoreOTP';
import ModalIcon from '@molecules/ModalIcon';
import ModalError from '@molecules/ModalError';
import { getUserSavings } from '@services/User';
import AddAccountToFavorite, { useAddAccountToFavorite } from '@molecules/AddAccountToFavorite';
import { OperationStackContext } from '@contexts/OperationStackContext';
import { getRemoteValue } from '@utils/firebase';
import { SEPARATOR_BASE } from '@theme/metrics';
import {useLoading, useTimer, useUserInfo} from '@hooks/common';

type transferencyStatus = 'SUCCESS' | 'NEED_AUTHENTICATION' | 'BLOCKED' | 'UNKNOWN';

const ConfirmationSameBankScreen = ({
  route,
  navigation,
}: ConfirmationSameBankScreenProps) => {
  const operationStackContext = useContext(OperationStackContext);
  const {
    amount,
    formatAmount,
    operationUId,
    destinationAccountName,
    destinationAccountNumber,
    originSelectedName,
    itfTax,
  } = route?.params;

  const montoCargado = convertToCurrency(itfTax + amount);

  const originAccount = useAccountByOperationUid({operationUId});
  const arrNames = useMemo(
    () => nameForTransfer(destinationAccountName),
    [destinationAccountName],
  );

  const {isOpen, onOpen, onClose} = useToggle();
  const {user, setUserSavings} = useUserInfo();
  const {accountToFavorite, handleToggle, handleChangeText} =
    useAddAccountToFavorite();
  const {restart} = useTimer();

  const {
    showTokenModal,
    displayErrorModal,
    setHideTabBar,
    setDisplayErrorModal,
    setShowTokenModal,
  } = useLoading();
  useFocusEffect(
    useCallback(() => {
      operationStackContext.disableUseFocusEffect = false;
    }, []),
  );
  const person = user?.person;

  const updateUserSavings = async () => {
    await getUserSavings({ personUid: person?.personUId }).then(res => {
      setUserSavings(res);
    });
  };

  const {values, ...form} = useForm({
    initialValues: {concept: ''},
    validate: rawValues => {
      const newErrors: FormError<{concept: string}> = {};

      if (!isEmpty(rawValues.concept) && !validateConcept(rawValues.concept)) {
        newErrors.concept = 'Valor ingresado invalido.';
      }

      return newErrors;
    },
  });

  const handleSubmit = async () => {

    const mainStackNavigator = navigation.getParent('MainStackNavigator');
    const token = storeOTP.getOtpState().currentToken;

    if (!token) {
      // TODO: If i came to this view without token
      return;
    }


    const payload = {
      concept: values.concept,
      movementAmount: amount,
      codeVerification: String(token),
      originAccount: originAccount?.accountCode!,
      destinationAccount: destinationAccountNumber,
      movementCurrency: originAccount?.currency === 'S/' ? 1 : 2,
      name: user?.person?.names,
      typeOriginAccount: originSelectedName,
    };
    let isLoadingWithFishes: boolean = false;
    try {
      isLoadingWithFishes = true;
      operationStackContext.disableUseFocusEffect = true;
      mainStackNavigator?.dispatch(StackActions.push('LoadingFishes', {screenId: 'Loading-' + route.key}));
      const res = await sameBankExecute({payload, documentType: user?.person.documentTypeId, documentNumber: user?.person.documentNumber, screen: route.name});

      let status: transferencyStatus = 'UNKNOWN';
      if(res?.isSuccess === true){
        if(res?.errorCode === '100')status = 'SUCCESS';
      }
      else {
        if(res?.errorCode === '102')status = 'BLOCKED';
        else if(res?.errorCode === '101') status = 'NEED_AUTHENTICATION';
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
                documentType: person.documentTypeId,
              });
              navigation.dispatch(
                StackActions.replace('RegisterOTP', {
                  type: 'TRANSFERENCY_LOCAL',
                  documentType: person.documentTypeId,
                  documentNumber: person.documentNumber,
                  phoneNumberObfuscated: res?.data?.cellphone,
                  channel: 'sms',
                  isSensitiveInfo: true,
                  stepProps: undefined,
                  trackingTransaction: res?.data?.trackingTransaction,
                  transfer: {
                    amount,
                    operationUId,
                    formatAmount,
                    destinationAccountName,
                    concept: values.concept,
                    destinationAccountNumber,
                  },
                }),
              );
            }
            break;
          case 'BLOCKED':
            navigation.dispatch(StackActions.replace('InfoAccessBlocked'));
            break;
          case 'SUCCESS':
            form.clear();
            setHideTabBar(true);
            navigation.dispatch(
              StackActions.replace('MainTab', {
                screen: 'MainOperations',
                params: {
                  screen: 'SuccessTransferSameBank',
                  params: {
                    amount,
                    operationUId,
                    formatAmount,
                    destinationAccountName,
                    concept: values.concept,
                    destinationAccountNumber,
                    movementId: res.data.movementId,
                    itfTax: res.data.itfTax,
                    dateTransaction: res?.data?.dateTransaction,
                    hourTransaction: res?.data?.hourTransaction,
                    ...(isValidAccountFav && {
                      favoriteName: accountToFavorite.data?.accountName,
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
        }
      });
    }
  };

  const goBack = useCallback(
    () => navigation.navigate('SameBank', {from: 'ConfirmationSameBank'}),
    [navigation],
  );

  const goBackfromErrorModal = useCallback(() => {
    navigation.navigate('SameBank', {from: 'errorModal'});
  }, [navigation]);

  const handleBackPress = useCallback(() => {
    // goBackInfo.current = {isFromTab: false, path: ''}
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
    }, [handleBackPress]),
  );

  useFocusEffect(
    useCallback(() => {
      const id = EventRegister.on('tabPress', e => {
        e.preventDefault();
        onOpen();

        // goBackInfo.current = { path: e.target.split('-')[0], isFromTab: true }
      });

      return () => {
        EventRegister.rm(id!);
      };
    }, [onOpen]),
  );

  const hasFavorites = getRemoteValue('active_favs').asBoolean()

  const hasErrors = Object.keys(form.errors).length !== 0;
  const isValidAccountFav = accountToFavorite.enable && accountToFavorite.ok;

  const isBtnDisabled = hasFavorites
    ? accountToFavorite.enable
      ? !accountToFavorite.ok
      : hasErrors
    : hasErrors;

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
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent
      />
      <TransfersTemplate title="Confirmación" goBack={goBack}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          bounces={false}
          extraHeight={8 * 16}
          enableOnAndroid={true}>
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
            text={formatAmount}
            variation="p"
            weight="bold"
            size={45}
            color="#83786F"
          />

          <Separator showLine type="small" color="#EFEFEF" />

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
                  style={{marginBottom: SEPARATOR_BASE * 0.4 }}
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
              style={{marginBottom: SEPARATOR_BASE}}
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
              style={{marginBottom: SEPARATOR_BASE * 0.8}}
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
                style={{marginBottom: SEPARATOR_BASE * 0.4}}
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

          <Input
            placeholder="Ingrese concepto"
            style={{marginTop: SEPARATOR_BASE * 3, marginBottom: hasFavorites ? SEPARATOR_BASE * 3 : SEPARATOR_BASE * 4}}
            {...form.inputProps('concept')}
          />

          <AddAccountToFavorite
            accountToFavorite={accountToFavorite}
            style={{marginBottom: SEPARATOR_BASE * 3}}
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

          <View style={{alignSelf: 'center', width: '80%', paddingBottom: SEPARATOR_BASE * 4}}>
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
            message: {
              title: '',
              content: '',
            },
            errorCode: '',
          });
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
        <Separator size={SEPARATOR_BASE * 3} />
        <Button
          containerStyle={{width: '100%'}}
          type="primary"
          text="Sí, cerrar"
          onPress={async () => {
            /*if (goBackInfo.current?.isFromTab) {
              onClose()
              await new Promise(res => setTimeout(res, 500));
              navigation.navigate(getMainScreenByName(goBackInfo.current.path))
              form.clear()
              return
            }
            onClose()
            await new Promise(res => setTimeout(res, 500));
            goBack()
            form.clear()*/

            onClose();
            await new Promise(res => setTimeout(res, 500));
            navigation.navigate('MainScreen');
            form.clear();
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

export default ConfirmationSameBankScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SEPARATOR_BASE,
    marginBottom: SEPARATOR_BASE,
  },
  row_align: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SEPARATOR_BASE,
    marginBottom: SEPARATOR_BASE,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.GrayBackground,
    paddingVertical: SEPARATOR_BASE + 1.5,
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom: SEPARATOR_BASE * 4,
  },
});
