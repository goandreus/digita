import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import TransfersTemplate from '@templates/TransfersTemplate';

import Button from '@atoms/Button';
import Input from '@atoms/Input';
import Select, {SelectItem} from '@atoms/Select';
import TextCustom from '@atoms/TextCustom';
import CheckboxLabel from '@molecules/CheckboxLabel';
import {DestinationOtherBanksScreenProps} from '@navigations/types';
import {Colors} from '@theme/colors';
import useForm, {FormError} from '@hooks/useForm';
import {isEmpty} from '../../../utils/isEmpty';
import {getBankCodes} from '@services/BankCode';
import CurrencyInput from '@atoms/CurrencyInput';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import {useUserInfo} from '@hooks/common';
import {otherBanksQuery} from '@services/Transactions';
import PopUp from '@atoms/PopUp';
import Separator from '@atoms/Separator';
import useToggle from '@hooks/useToggle';
import {useFocusEffect} from '@react-navigation/native';
import {EventRegister} from '@utils/EventRegister';
import {getMainScreenByName} from '@utils/getMainScreenByName';
import {CatalogueItem, getCatalogue} from '@services/Catalogue';
import {validateText} from '@utils/validateText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {validateTextNumber} from '@utils/validateTextNumber';
import ModalError from '@molecules/ModalError';
import { SEPARATOR_BASE } from '@theme/metrics';

type From = 'OtherBanks' | 'ConfirmationOtherBanks';

interface FormState {
  destinationAccountNumber: string;
  destinationAccountName: string;
  documentNumber: string;
  documentType: string;
  accountOwner: boolean;
  formatAmount: string;
  amount: number | null;
}
interface errorMessage {
  isOpen: boolean
  errorCode: string
  message: {
    title: string
    content: string
  }
}

const validateAccount = (destinationAccountNumber: string) => {
  const regex = /^[0-9]*$/;
  return regex.test(destinationAccountNumber);
};

const DestinationOtherBanks = ({
  route,
  navigation,
}: DestinationOtherBanksScreenProps) => {
  const {operationUId, accountCode, productName, owner} = route.params;
  const from = route.params.from as From;

  const {user} = useUserInfo();
  const originAccount = useAccountByOperationUid({operationUId});
  const [catalogue, setCatalogue] = useState<CatalogueItem[]>([]);
  const bankCodes = useRef<Map<number, string> | null>(null);

  const documentTypes: SelectItem[] = useMemo(() => {
    return catalogue?.map(catalogueItem => ({
      label: catalogueItem?.descripcionCorta,
      value: String(catalogueItem?.codigo),
    }));
  }, [catalogue]);
  const goBackPath = useRef<{isFromTab: boolean; path: string} | null>(null);

  const {isOpen, onOpen, onClose} = useToggle();
  const [loading, setLoading] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [error, setError] = useState<errorMessage>({
    isOpen: false,
    errorCode: '',
    message: {
      content: '',
      title: '',
    }
  })

  const {values, errors, touched, clear, ...form} = useForm<FormState>({
    initialValues: {
      destinationAccountNumber: '',
      destinationAccountName: '',
      documentNumber: '',
      documentType: '',
      accountOwner: false,
      formatAmount: '',
      amount: null,
    },
    validate: formState => {
      const newErrors: FormError<FormState> = {};

      const isDNI = formState.documentType === '1';
      const isCE = formState.documentType === '2';
      const isRUC = formState.documentType === '9';

      if (!formState.accountOwner) {
        if (isEmpty(formState.destinationAccountName)) {
          newErrors.destinationAccountName = 'Este campo es requerido';
        }

        if (!validateText(formState.destinationAccountName)) {
          newErrors.destinationAccountName =
            'Solo puedes ingresar letras y tildes';
        }

        if (isEmpty(formState.documentType)) {
          newErrors.documentType = 'Este campo es requerido';
        }
        if (isEmpty(formState.documentNumber)) {
          newErrors.documentNumber = 'Este campo es requerido';
        }

        if (isDNI) {
          if (formState.documentNumber.length !== 8) {
            newErrors.documentNumber = 'El DNI debe tener 8 digitos.';
          }
          if (!validateAccount(formState.documentNumber)) {
            newErrors.documentNumber = 'El DNI no es válido.';
          }
          if (formState.documentNumber === '00000000') {
            newErrors.documentNumber =
              'El numero de DNI ingresado no es  válido.';
          }
        }
        if (isCE) {
          if (
            formState.documentNumber.length < 9 ||
            formState.documentNumber.length > 12
          ) {
            newErrors.documentNumber =
              'El CE debe tener entre 9 a 12 caracteres';
          }
          if (!validateTextNumber(formState.documentNumber)) {
            newErrors.documentNumber = 'El CE no es válido.';
          }

          if (formState.documentNumber === '000000000') {
            newErrors.documentNumber =
              'El numero de CE ingresado no es  válido.';
          }
          if (formState.documentNumber === '0000000000') {
            newErrors.documentNumber =
              'El numero de CE ingresado no es  válido.';
          }

          if (formState.documentNumber === '00000000000') {
            newErrors.documentNumber =
              'El numero de CE ingresado no es  válido.';
          }
          if (formState.documentNumber === '000000000000') {
            newErrors.documentNumber =
              'El numero de CE ingresado no es  válido.';
          }
        }
        if (isRUC) {
          if (formState.documentNumber.length !== 11) {
            newErrors.documentNumber = 'El RUC debe tener 11 digitos';
          }
          if (
            formState.documentNumber.slice(0, 2) !== '10' &&
            formState.documentNumber.slice(0, 2) !== '20'
          ) {
            newErrors.documentNumber = 'El RUC no es válido.';
          }
          if (!validateAccount(formState.documentNumber)) {
            newErrors.documentNumber = 'El RUC no es válido.';
          }
          if (formState.documentNumber === '00000000000') {
            newErrors.documentNumber =
              'El numero de RUC ingresado no es  válido.';
          }
        }
      }

      if (formState.amount && formState.amount < 1) {
        newErrors.amount = 'El monto debe ser mayor a S/ 1';
      }
      if (formState.destinationAccountNumber.length !== 20) {
        newErrors.destinationAccountNumber =
          'La cuenta destino debe tener 20 dígitos.';
      }
      if (
        formState.destinationAccountNumber.length === 20 &&
        isNaN(+formState.destinationAccountNumber)
      ) {
        newErrors.destinationAccountNumber = 'Debe ingresar solo números.';
      }
      if (!validateAccount(formState.destinationAccountNumber)) {
        newErrors.destinationAccountNumber =
          'El número de cuenta destino ingresado no es válido.';
      }
      if (
        formState.destinationAccountNumber.length === 20 &&
        !isNaN(+formState.destinationAccountNumber) &&
        !isEmpty(formState.destinationAccountNumber)
      ) {
        const code = parseInt(formState.destinationAccountNumber.slice(0, 3));

        if (!bankCodes?.current?.has(code)) {
          newErrors.destinationAccountNumber =
            'El número de cuenta destino ingresado no es válido.';
        }
      }

      return newErrors;
    },
  });

  const handleSubmit = async () => {
    setLoading(true);
    const code = parseInt(values.destinationAccountNumber.slice(0, 3));

    const payload = {
      operationUId,
      formatAmount: values.formatAmount,
      destinationBankName: bankCodes?.current?.get(code)!,
      transferData: {
        beneficiaryDocumentNumber: values.documentNumber,
        beneficiaryDocumentType: Number(values.documentType),
        beneficiaryName: values.destinationAccountName,
        destinationAccount: values.destinationAccountNumber,
        destinationBank: code,
        holderName: values.destinationAccountName,
        concept: '',
        movementAmount: values.amount!,
        movementCurrency: originAccount?.currency!,
        originAccount: originAccount?.accountCode!,
        sameHeadLine: values.accountOwner!,
      },
    };

    // if (userInfo && values.accountOwner) {
    //   const {documentNumber, documentTypeId, names, lastName} = userInfo.person;
    //   payload.transferData.beneficiaryDocumentNumber = documentNumber;
    //   payload.transferData.beneficiaryDocumentType = String(documentTypeId);
    //   payload.transferData.beneficiaryName = `${names} ${lastName}`;
    //   payload.transferData.holderName = `${names} ${lastName}`;
    // }
    
    if(payload.transferData.destinationAccount.slice(0,3) === '091') {
      setError({
        errorCode: '450',
        isOpen: true,
        message: {
          title: 'Cambia el tipo de transferencia para realizar esta operación',
          content: 'La cuenta de destino es de Compartamos Financiera por ello debes hacer la operación desde Transferencia a otras cuentas Compartamos',
        }
      })
      return
    }

    const res = await otherBanksQuery({
      payload: {
        ...payload.transferData,
        movementCurrency: originAccount?.currency! === 'S/' ? 1 : 2,
      },
      documentType: user?.person.documentTypeId,
      documentNumber: user?.person.documentNumber,
      screen: route.name
    });
    setLoading(false);

    if((!res?.isWarning && !res?.isSuccess && res?.errorCode === '') || (res?.isWarning && !res?.isSuccess && res?.errorCode === '-1')) {
      setError({
        errorCode: '-1',
        isOpen: true,
        message: {
          title: '¡Ups, hubo un problema!',
          content: 'No hemos podido cargar tu información, por favor intenta en unos segundos o vuelve a ingresar.'
        }
      })
      return
    }

    if (res?.isWarning && !res?.isSuccess) {
      if (res.errorCode === '494') {
        setError({
          isOpen: true,
          message: {
            content: res.data.message,
            title: res.data.title,
          },
          errorCode: res.errorCode,
        });
        return;
      }
      setError({
        isOpen: true,
        message: res.data.message,
        errorCode: res.errorCode,
      })
      return
    } else if (res?.data && res?.isSuccess) {
      clear();
      navigation.navigate('ConfirmationOtherBanks', {
        productName,
        ...payload,
        transferData: {
          ...payload.transferData,
          movementCurrency: originAccount?.currency!,
        },
        itfTax: res.data.itfTax,
        ownerFullName: res.data.ownerFullName,
        originCommission: res.data.originCommission,
        destinationCommission: res.data.destinationCommission,
        owner,
      });
    }
  };

  useEffect(() => {
    getBankCodes().then(res => {
      bankCodes.current = res;
    });
  }, []);

  useEffect(() => {
    getCatalogue({
      screen: route.name,
      user: `0${user?.person?.documentTypeId}${user?.person?.documentNumber}`,
    })
      .then(data => setCatalogue(data))
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (values.accountOwner) {
      form.setFields({
        documentNumber: owner?.documentNumber,
        destinationAccountName: owner?.fullName,
        documentType: String(owner?.documentType),
      });
    }

    if (!values.accountOwner) {
      form.setFields({
        documentNumber: '',
        destinationAccountName: '',
        documentType: '',
      });
    }
  }, [values.accountOwner]);

  const isBtnDisabled =
    Object.keys(touched).length !== 0
      ? Object.keys(errors)?.length !== 0 ||
        (owner && Object.keys(owner).length === 0) ||
        !values.amount ||
        values?.amount < 1 ||
        values?.amount > originAccount?.balance! ||
        values.documentType === '' ||
        values.documentNumber === '' ||
        Object.keys(owner)?.length === 0 ||
        owner?.documentType === null ||
        owner?.documentNumber === '' ||
        owner?.fullName === '' ||
        values.destinationAccountName === '' ||
        (originAccount?.currency === 'S/' && values.amount > 10000) ||
        (originAccount?.currency === '$' && values.amount > 3000)
      : true;

  const goBack = useCallback(() => {
    return navigation.navigate('OtherBanks', {from: 'DestinationOtherBanks'});
  }, [navigation]);

  const handleBackPress = useCallback(() => {
    if (!isBtnDisabled) {
      onOpen();
      return false;
    }

    goBack();
    return true;
  }, [isBtnDisabled, goBack, onOpen]);

  useFocusEffect(
    useCallback(() => {
      if (from === 'OtherBanks') {
        setError({
          isOpen: false,
          errorCode: '',
          message: {
            title: '',
            content: ''
          }
        })
        clear();
        goBackPath.current = {path: from, isFromTab: false};
      }
    }, [from, clear]),
  );

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
        if (!isBtnDisabled) {
          e.preventDefault();
          onOpen();

          goBackPath.current = {isFromTab: true, path: 'MainScreen'};
        }
      });

      return () => {
        EventRegister.rm(id!);
      };
    }, [isBtnDisabled, onOpen]),
  );

  const handleFocus = () => setSelectOpen(false);

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
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              setSelectOpen(false);
            }}>
            <View style={{flex: 1}}>
              <TextCustom
                style={{marginTop: SEPARATOR_BASE * 2, marginBottom: SEPARATOR_BASE * 1.5}}
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
                  style={{marginTop: SEPARATOR_BASE * 3, marginBottom: SEPARATOR_BASE * 1.5}}
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
                      {...form.inputProps('documentNumber',true)}
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
                  style={{marginBottom: SEPARATOR_BASE * 1.5, marginTop: SEPARATOR_BASE * 3}}
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
                  marginVertical: SEPARATOR_BASE * 2.4,
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
          onPress={async () => {
            onClose();

            await new Promise(res => setTimeout(res, 500));
            navigation.navigate(getMainScreenByName('Main'));
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

      <ModalError
        isOpen={error.isOpen}
        errorCode={error.errorCode}
        title={error.message.title}
        titleButton={
          error.errorCode === '494' ? 'Elegir otra cuenta' : undefined
        }
        content={error.message.content}
        close={() => {
          setError({
            isOpen: false,
            errorCode: '',
            message: {
              title: '',
              content: ''
            }
          })
          clear()
          if(error.errorCode === '-1') navigation.navigate('Main')
        }}
        keepScreen={() => {
          setError({
            isOpen: false,
            errorCode: '',
            message: {
              title: '',
              content: ''
            }
          })
          setLoading(false)
          clear()
        }}
        changeTransfer={() => {
          navigation.navigate('MainOperations',{
            screen: 'SameBank',
            params: {
              fromOtherBanks: true,
            }
          })
          setError({
            isOpen: false,
            errorCode: '',
            message: {
              title: '',
              content: ''
            }
          })
          setLoading(false)
          clear()
        }
        }
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
