import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React, {useCallback} from 'react';
import {
  DestinationOtherBanksScreenProps,
  RootStackParamList,
} from '@navigations/types';
import {useDestinationOtherBanks} from './hook';
import {getMainScreenByName} from '@utils/getMainScreenByName';
import TransfersTemplate from '@templates/TransfersTemplate';
import TextCustom from '@atoms/TextCustom';
import Separator from '@atoms/Separator';
import Button from '@atoms/Button';
import ModalError from '@molecules/ModalError';
import PopUp from '@atoms/PopUp';
import CurrencyInput from '@atoms/CurrencyInput';
import Input from '@atoms/Input';
import Select from '@atoms/Select';
import CheckboxLabel from '@molecules/CheckboxLabel';
import {Colors} from '@theme/colors';

const DestinationOtherBanks = ({
  route,
  navigation,
}: DestinationOtherBanksScreenProps) => {
  const from = route.params.from;
  const routeName = route.name;

  const goBack = useCallback(() => {
    return navigation.navigate('OtherBanks', {from: 'DestinationOtherBanks'});
  }, [navigation]);

  const navigateToMainByName = (name: string) =>
    navigation.navigate(getMainScreenByName(name));

  const navigateToMain = () => {
    navigation.navigate('Main');
  };

  const navigateToConfirmation = (
    data: RootStackParamList['ConfirmationOtherBanks'],
  ) => navigation.navigate('ConfirmationOtherBanks', data);

  const navigateToSameBank = (destinationAccount: string) => {
    navigation.navigate('MainOperations', {
      screen: 'SameBank',
      params: {
        from,
        data: {
          destinationAccount,
        },
      },
    });
  };

  //values.destinationAccountNumber

  const {
    values,
    form,
    isOpen,
    error,
    errors,
    selectOpen,
    originAccount,
    documentTypes,
    loading,
    isBtnDisabled,
    onClose,
    setSelectOpen,
    onClosePopUp,
    onCloseModalError,
    onPressContainer,
    clearScreen,
    onChangeTransfer,
    handleSubmit,
    handleBackPress,
    handleFocus,
  } = useDestinationOtherBanks({
    params: route.params,
    from: from,
    routeName,
    navigation: {
      goBack,
      navigateToMain,
      navigateToMainByName,
      navigateToConfirmation,
      navigateToSameBank,
    },
  });

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />
      <TransfersTemplate
        title="A Otros Bancos"
        titleSize={24}
        goBack={handleBackPress}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          bounces={false}
          extraHeight={8 * 16}
          enableOnAndroid={true}>
          <TouchableWithoutFeedback onPress={onPressContainer}>
            <View style={{flex: 1}}>
              <TextCustom
                style={{marginTop: 18, marginBottom: 12}}
                text="Cuenta Destino Interbancaria"
                variation="p"
                weight="bold"
                size={20}
                color="#83786F"
              />
              <Input
                maxLength={20}
                keyboardType="decimal-pad"
                placeholder="Ingrese número de cuenta Interbancaria CCI"
                onFocus={handleFocus}
                {...form.inputProps('destinationAccountNumber')}
              />
              <CheckboxLabel
                style={{marginTop: 8}}
                checkboxSize="small"
                value={values.accountOwner}
                onChange={value => {
                  form.setField('accountOwner', value);
                  form.checkErrors({...values, accountOwner: value});
                  handleFocus();
                }}
                textComponent={
                  <TextCustom
                    variation="p"
                    weight="bold"
                    size={20}
                    text="Soy titular de la cuenta destino"
                  />
                }
              />

              <>
                <TextCustom
                  style={{marginTop: 32, marginBottom: 12}}
                  text="Tipo y documento del beneficiario"
                  variation="p"
                  weight="bold"
                  size={20}
                />
                <View style={[styles.inputsWrapper, {marginBottom: 0}]}>
                  <View style={styles.selectWrapper}>
                    {documentTypes && (
                      <Select
                        isOpen={selectOpen}
                        onClose={setSelectOpen}
                        disabled={values.accountOwner}
                        value={values.documentType}
                        items={documentTypes}
                        onSelect={value => {
                          form.setField('documentType', value!);
                          form.setField('documentNumber', '');
                          form.checkErrors({...values, documentType: value!});
                        }}
                      />
                    )}
                  </View>
                  <View style={styles.inputWrapper}>
                    <Input
                      onFocus={handleFocus}
                      selectTextOnFocus={!values.accountOwner}
                      errorLeft
                      editable={
                        !values.accountOwner
                          ? values.documentType.length > 0
                          : false
                      }
                      maxLength={
                        values.documentType === '1'
                          ? 8
                          : values.documentType === '2'
                          ? 12
                          : 11
                      }
                      keyboardType={
                        values.documentType === '2' ? 'default' : 'numeric'
                      }
                      placeholder="Ej. 70548393"
                      {...form.inputProps('documentNumber')}
                    />
                  </View>
                </View>
                {errors.documentNumber && (
                  <Text
                    style={{
                      marginTop: 4,
                      fontSize: 14,
                      color: Colors.Error,
                    }}>
                    {errors.documentNumber}
                  </Text>
                )}

                <TextCustom
                  style={{marginBottom: 12, marginTop: 32}}
                  text="Nombre del beneficiario"
                  variation="p"
                  weight="bold"
                  size={20}
                />

                <View style={styles.inputWrapper}>
                  <Input
                    onFocus={handleFocus}
                    selectTextOnFocus={!values.accountOwner}
                    editable={!values.accountOwner}
                    placeholder="Ingrese nombre del beneficiario"
                    maxLength={60}
                    {...form.inputProps('destinationAccountName')}
                  />
                </View>
              </>

              <CurrencyInput
                initialValue={originAccount?.balance ?? null}
                currency={originAccount?.currency!}
                amountValue={values?.amount}
                editable={
                  values.accountOwner
                    ? values?.destinationAccountNumber?.length !== 0
                    : values?.destinationAccountNumber?.length !== 0 &&
                      values?.documentType?.length !== 0 &&
                      values?.documentNumber?.length !== 0 &&
                      values?.destinationAccountName?.length !== 0
                }
                onChangeValue={value => form.setField('amount', value)}
                onChangeText={text => form.setField('formatAmount', text)}
              />

              <View
                style={{
                  width: '80%',
                  marginVertical: 18,
                  alignSelf: 'center',
                }}>
                <Button
                  textSize={18}
                  type="primary"
                  text="Continuar"
                  orientation="vertical"
                  loading={loading}
                  onPress={form.onSubmit(handleSubmit)}
                  disabled={loading || isBtnDisabled}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
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
          onPress={onClosePopUp}
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
        isOpen={error.isOpen}
        errorCode={error.errorCode}
        title={error.message.title}
        content={error.message.content}
        close={onCloseModalError}
        titleButton={
          error.errorCode === '494' ? 'Elegir otra cuenta' : undefined
        }
        keepScreen={clearScreen}
        changeTransfer={onChangeTransfer}
      />
    </>
  );
};

export default DestinationOtherBanks;

const styles = StyleSheet.create({
  inputsWrapper: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    zIndex: 3000,
    marginBottom: 32,
  },
  selectWrapper: {
    flex: 1,
    marginRight: 8,
  },
  inputWrapper: {
    flex: 2,
  },
});
