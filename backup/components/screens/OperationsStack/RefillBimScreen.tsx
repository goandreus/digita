import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  BackHandler,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import TransfersTemplate from '@templates/TransfersTemplate';
import {Colors} from '@theme/colors';
import {RefillScreenProps} from '@navigations/types';
import PopUp from '@atoms/PopUp';
import useToggle from '@hooks/useToggle';
import {getMainScreenByName} from '@utils/getMainScreenByName';
import DropDownAccount from '@atoms/DropDownAccount';
import {canTransactRefillBim} from '@utils/canTransactRefillBim';
import {DropDownPickerData} from '@atoms/DropDownAccount/types';
import useForm from '@hooks/useForm';
import Input from '@atoms/Input';
import {useFocusEffect} from '@react-navigation/native';
import {EventRegister} from '@utils/EventRegister';
import CurrencyInput from '@atoms/CurrencyInput';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import ModalError from '@molecules/ModalError';
import {IErrorModal} from '@interface/ErrorModal';
import {RefillQuery} from '@services/Transactions';
import { SEPARATOR_BASE, ScreenSize } from '@theme/metrics';
import {useUserInfo} from '@hooks/common';

type From = 'MainScreen' | 'Operations' | 'Confirmation';

interface InitialStateForm {
  phoneNumberBim: string;
  amount: number | null;
  formatAmount: string;
  operationUId: number;
}

const validateAccount = (destinationAccountNumber: string) => {
  const regex = /^[0-9]*$/;
  return regex.test(destinationAccountNumber);
};

const RefillBimScreen = ({route, navigation}: RefillScreenProps) => {
  const from = route.params.from as From | null;

  const {user, userSavings} = useUserInfo();
  const person = user?.person;

  const goBackPath = useRef<From | null>(null);
  const [loading, setLoading] = useState(false);
  const {isOpen, onClose, onOpen} = useToggle();
  const [error, setError] = useState<IErrorModal>({
    isOpen: false,
    errorCode: '',
    message: {
      content: '',
      title: '',
    },
  });

  const allSavingsFilter = useMemo(() => {
    const accs = canTransactRefillBim([
      ...(userSavings?.savings.savings ?? []),
    ]);
    return accs
      ? accs.canTransactInSoles.map(e => ({
          ...e,
          title: e.productName,
          subtitle: e.accountCode,
          value: `${e.currency} ${e.sBalance}`,
        }))
      : ([] as DropDownPickerData[]);
  }, []);

  const {values, ...form} = useForm<InitialStateForm>({
    initialValues: {
      amount: null,
      formatAmount: '',
      phoneNumberBim: '',
      operationUId: allSavingsFilter?.[0].operationUId,
    },
    validate: _values => {
      const errors: Record<string, string> = {};

      if (_values.phoneNumberBim.length !== 9) {
        errors.phoneNumberBim = 'El número ingresado no es correcto';
      }

      if (
        _values.phoneNumberBim.length === 9 &&
        (_values.phoneNumberBim[0] !== '9' ||
          !validateAccount(_values.phoneNumberBim))
      ) {
        errors.phoneNumberBim = 'El número ingresado no es correcto';
      }

      return errors;
    },
  });

  const originAccount = useAccountByOperationUid({
    operationUId: values.operationUId,
  });

  const isBtnDisabled =
    Object.keys(form.touched).length === 0 ||
    Object.keys(form.errors).length !== 0 ||
    values.amount === null ||
    values.amount < 1 ||
    values.amount > 999 ||
    values?.amount > originAccount?.balance!;

  const handlSubmit = async () => {
    setLoading(true);
    const payload = {
      accountNumber: originAccount?.accountCode!,
    };
    // TODO : call service for validation
    const res = await RefillQuery({
      payload,
      documentType: person?.documentTypeId,
      documentNumber: person?.documentNumber,
      screen: route.name,
    });

    setLoading(false);

    if (!res?.isWarning && !res?.isSuccess && res?.errorCode === '') {
      setError({
        errorCode: '-1',
        isOpen: true,
        message: {
          title: '¡Ups, hubo un problema!',
          content:
            'No hemos podido cargar tu información, por favor intenta en unos segundos o vuelve a ingresar.',
        },
      });
      return;
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
      });
      return;
    } else if (res?.data && res?.isSuccess) {
      navigation.navigate('ConfirmationRefillBim', {
        ...values,
        movementId: 757854,
        amount: values.amount!,
      });
    }
  };

  const handlePressBack = () => {
    if (!isBtnDisabled) {
      onOpen();
      return;
    }
    navigation.navigate(from);
  };

  const onPressCloseModal = () => {
    setError({
      isOpen: false,
      errorCode: '',
      message: {
        content: '',
        title: '',
      },
    });
    form.clear();
  };

  useFocusEffect(
    useCallback(() => {
      if (from === 'MainScreen' || from === 'Operations') {
        form.clear();
        goBackPath.current = 'MainScreen';
      }
    }, [from]),
  );

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (!isBtnDisabled) {
            onOpen();
            return false;
          }

          navigation.navigate(from);
          return true;
        },
      );

      return () => backHandler.remove();
    }, [isBtnDisabled]),
  );

  useFocusEffect(
    useCallback(() => {
      const id = EventRegister.on('tabPress', e => {
        if (!isBtnDisabled) {
          e.preventDefault();
          onOpen();

          goBackPath.current = 'MainScreen';
        }
      });

      return () => {
        EventRegister.rm(id!);
      };
    }, [isBtnDisabled, onOpen]),
  );

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />
      
      <TransfersTemplate
        title="Recarga Bim"
        titleSize={24}
        goBack={handlePressBack}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false} bounces={false}>
          <View
            style={{
              flex: 1,
              paddingBottom: SEPARATOR_BASE * 3,
              justifyContent: 'space-between',
              minHeight: '100%',
            }}>
              <View>
                <TextCustom
                  style={{ marginTop: SEPARATOR_BASE * 2.5, marginBottom: SEPARATOR_BASE * 1.5 }}
                  text="Cuenta Origen"
                  variation="p"
                  weight="bold"
                  size={20}
                  color="#83786F"
                />

                <DropDownAccount
                  data={allSavingsFilter!}
                  operationUId={values.operationUId}
                  onSelect={value => form.setField('operationUId', value)}
                />

                <TextCustom
                  style={{marginTop: SEPARATOR_BASE * 4, marginBottom: SEPARATOR_BASE * 1.5}}
                  text="Número de celular Bim"
                  variation="p"
                  weight="bold"
                  size={20}
                  color="#83786F"
                />
                <Input
                  placeholder="Ingresa el número de celular a recargar"
                  keyboardType="decimal-pad"
                  maxLength={9}
                  {...form.inputProps('phoneNumberBim')}
                />

                <CurrencyInput
                  amountValue={values.amount}
                  maxAmountSolesText="999.00"
                  maxAmountSolesNumber={999}
                  currency={originAccount?.currency!}
                  initialValue={originAccount?.balance!}
                  editable={!form.errors.phoneNumberBim}
                  onChangeValue={value => form.setField('amount', value)}
                  onChangeText={text => form.setField('formatAmount', text)}
                />
              </View>

              <Separator type="medium" />

              <View
                style={{
                  width: '80%',
                  alignSelf: 'center',
                }}>
                <Button
                  text="Continuar"
                  textSize={18}
                  type="primary"
                  loading={loading}
                  disabled={loading || isBtnDisabled}
                  onPress={form.onSubmit(handlSubmit)}
                  orientation="vertical"
                />
              </View>
          </View>
          </ScrollView>
        </TouchableWithoutFeedback>
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
          <Separator size={SEPARATOR_BASE * 3} />
          <Button
            containerStyle={{width: '100%'}}
            type="primary"
            text="Sí, cerrar"
            onPress={async () => {
              onClose();

              await new Promise(res => setTimeout(res, 500));
              navigation.navigate(getMainScreenByName(goBackPath.current));

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
        <ModalError
          isOpen={error.isOpen}
          errorCode={error.errorCode}
          title={error.message.title}
          content={error.message.content}
          titleButton={'Elegir otra cuenta'}
          close={onPressCloseModal}
        />
    </>
  );
};

export default RefillBimScreen;
