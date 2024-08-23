import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ScrollView,
  Keyboard,
  Pressable,
  StatusBar,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  Platform,
  BackHandler,
} from 'react-native'

import TransfersTemplate from '@templates/TransfersTemplate'

import { Colors } from '@theme/colors'
import TextCustom from '@atoms/TextCustom'
import { SameBankScreenProps } from '@navigations/types'
import Input from '@atoms/Input'
import Button from '@atoms/Button'
import { sameBankQuery } from '@services/Transactions'
import CurrencyInput from '@atoms/CurrencyInput'
import useForm, { FormError } from '@hooks/useForm'
import PopUp from '@atoms/PopUp'
import Separator from '@atoms/Separator'
import DropDownAccount from '@atoms/DropDownAccount'
import useAccountByOperationUid from '@hooks/useAccountByOperationUid'
import useToggle from '@hooks/useToggle'
import { useFocusEffect } from '@react-navigation/native'
import { EventRegister } from '@utils/EventRegister'
import { getMainScreenByName } from '@utils/getMainScreenByName'
import ModalError from '@molecules/ModalError'
import { getUserSavings } from '@services/User'
import { SEPARATOR_BASE } from '@theme/metrics'
import { useUserInfo } from '@hooks/common'


type From = 'MainScreen' | 'Transfers' | 'ConfirmationSameBank' | 'errorModal'

interface InitialStateForm {
  terms: boolean
  amount: number | null
  formatAmount: string
  destinationAccount: string
  operationUId: number
}
interface errorMessage {
  isOpen: boolean
  errorCode: string
  message: {
    title: string
    content: string
  }
}

const validateAccount = (destinationAccount: string) => {
  const regex = /^[0-9]*$/
  return regex.test(destinationAccount)
}

export const SameBank = ({ route, navigation }: SameBankScreenProps) => {
  const from = route.params.from as From;
  const fromOtherBanks: boolean = route.params.fromOtherBanks;
  const defaultDestinationAccount = route.params.data?.destinationAccount;

  const goBackPath = useRef<From | null>(null)
  const {isOpen, onOpen, onClose} = useToggle();
  const {user, userSavings, setUserSavings} = useUserInfo();
  const person = user?.person;

  const originSavings = useMemo(
    () =>
      [
        ...(userSavings?.savings.savings ?? []),
        ...(userSavings?.compensations.savings ?? [])
      ]
        .filter((e) => e.canTransact && e.balance > 0)
        .map((e) => ({
          ...e,
          title: e.productName,
          subtitle: e.accountCode,
          value: `${e.currency} ${e.sBalance}`
        })),
    [userSavings?.savings.savings, userSavings?.compensations.savings]
  )

  const { values, clear, ...form } = useForm<InitialStateForm>({
    initialValues: {
      terms: true,
      amount: null,
      formatAmount: '',
      destinationAccount: defaultDestinationAccount ?? '',
      operationUId: originSavings[0]?.operationUId,
    },
    validate: (rawValues) => {
      const errors: FormError<InitialStateForm> = {}

      if (rawValues.destinationAccount.trim().length !== 14) {
        errors.destinationAccount = 'La cuenta destino debe tener 14 dígitos.'
      }
      if (!validateAccount(rawValues.destinationAccount)) {
        errors.destinationAccount = 'El número de cuenta no es válido.'
      }
      if (
        rawValues.destinationAccount.trim().length === 14 &&
        isNaN(+rawValues.destinationAccount)
      ) {
        errors.destinationAccount = 'Debe ingresar solo números.'
      }

      return errors
    }
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<errorMessage>({
    isOpen: false,
    errorCode: '',
    message: {
      content: '',
      title: '',
    }
  })
  const originAccount = useAccountByOperationUid({ operationUId: values.operationUId })
  const [originProductName, setOriginProductName] = useState(originSavings[0]?.title)

  const deviceHeight = Dimensions.get('screen').height

  const isBtnDisabled =
    Object.keys(form.errors).length !== 0 ||
    !values.terms ||
    !values.amount ||
    values?.amount < 1 ||
    values?.amount > originAccount?.balance! ||
    (originAccount?.currency === 'S/' && values.amount > 10000) ||
    (originAccount?.currency === '$' && values.amount > 3000)

  const handleSubmit = async () => {
    setLoading(true)
    const payload = {
      concept: '',
      movementAmount: values.amount!,
      originAccount: originAccount?.accountCode!,
      destinationAccount: values.destinationAccount,
      movementCurrency: originAccount?.currency === 'S/' ? 1 : 2
    }
    try {
      const res = await sameBankQuery({payload, documentType: person?.documentTypeId, documentNumber: person?.documentNumber, screen: route.name})
      setLoading(false)

      if(!res?.isWarning && !res?.isSuccess && res?.errorCode === '') {
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
      if(res?.isWarning && !res?.isSuccess && res?.errorCode === '406') {
        setError({
          errorCode: '406',
          isOpen: true,
          message: {
            title: 'Cuenta destino incorrecta',
            content: 'La cuenta de destino ingresada no puede ser una cuenta propia'
          }
        })
        return
      }

      if (res?.isWarning && !res?.isSuccess && res?.errorCode === '0') {
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

      if ((res?.isWarning && !res?.isSuccess) || (!res?.isWarning && !res?.isSuccess && res?.errorCode === '')) {
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
          errorCode: res.errorCode
        })
        return
      } else if (res?.data && res?.isSuccess) {
        const payloadNextScreen = {
          itfTax: res.data.itfTax,
          amount: values.amount!,
          formatAmount: values.formatAmount,
          operationUId: values.operationUId,
          destinationAccountName: res.data.ownerFullName,
          destinationAccountNumber: values.destinationAccount,
          originSelectedName: originProductName,
        }
        navigation.navigate('ConfirmationSameBank', payloadNextScreen)
      }
    } catch (error: any) {
      setError({
        errorCode: '-1',
        isOpen: true,
        message: {
          title: '¡Ups, hubo un problema!',
          content: 'No hemos podido cargar tu información, por favor intenta en unos segundos o vuelve a ingresar.'
        }
      })
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (from === 'MainScreen' || from === 'Transfers') {
        clear();
        setError({
          isOpen: false,
          errorCode: '',
          message: {
            title: '',
            content: ''
          }
        })
        goBackPath.current = from;
        // goBackPath.current = 'MainScreen';
      }
      if(from === 'errorModal') {
        form.setField('destinationAccount', '')
        form.setField('amount', null)
        setError({
          isOpen: false,
          errorCode: '',
          message: {
            title: '',
            content: ''
          }
        })
      }
    }, [from, clear]),
  );

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if(fromOtherBanks && isBtnDisabled) {
          navigation.navigate('Operations')
          return
        }

        if (!isBtnDisabled) {
          onOpen()
          return false
        }
  
         navigation.navigate(from)
         return true
        },
      );

      return () => backHandler.remove();
    }, [isBtnDisabled, navigation, onOpen])
  );

  useFocusEffect(
    useCallback(() => {
      const id = EventRegister.on('tabPress', (e) => {
        if (!isBtnDisabled) {
          e.preventDefault()
          onOpen()

          goBackPath.current = 'MainScreen'
        }
      })

      return () => {
        EventRegister.rm(id!)
      };
    }, [isBtnDisabled, onOpen])
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
      translucent={true}
    />

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <TransfersTemplate
        titleSize={24}
        title="A Otras Cuentas Compartamos"
        goBack={() => {
          if(isBtnDisabled && fromOtherBanks) {
            navigation.navigate('Operations')
            return
          }

          if (!isBtnDisabled) {
            onOpen()
            return
          }

          navigation.navigate(from)
        }}
      >
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false} bounces={false}>
          <View
            style={{
              flex: 1,
              paddingBottom: SEPARATOR_BASE * 3,
              justifyContent: 'space-between',
              minHeight: '100%',
            }}
          >
            <View>
              <TextCustom
                style={{ marginTop: SEPARATOR_BASE * 3, marginBottom: SEPARATOR_BASE * 2 }}
                text="Cuenta Origen"
                variation="p"
                weight="bold"
                size={20}
                color="#83786F"
              />
              <DropDownAccount
                data={originSavings}
                operationUId={values.operationUId}
                onSelect={(value) => {
                  setOriginProductName(originSavings.filter(e => e.operationUId === value)[0].title)
                  form.setField('operationUId', value)
                }}
              />

              <TextCustom
                style={{ marginTop: SEPARATOR_BASE * 6, marginBottom: SEPARATOR_BASE * 2 }}
                text="Cuenta Destino"
                variation="p"
                weight="bold"
                size={20}
                color="#83786F"
              />
              <Input
                placeholder="Ingrese número de cuenta Compartamos"
                keyboardType="decimal-pad"
                maxLength={14}
                {...form.inputProps('destinationAccount')}
              />

              <CurrencyInput
                amountValue={values.amount}
                currency={originAccount?.currency!}
                initialValue={originAccount?.balance!}
                editable={values.destinationAccount.trim().length !== 0}
                onChangeValue={(value) => form.setField('amount', value)}
                onChangeText={(text) => form.setField('formatAmount', text)}
              />
            </View>

            <Separator type="medium" />

            <View
              style={{
                width: '80%',
                alignSelf: 'center',
              }}
            >
              <Button
                text="Continuar"
                textSize={18}
                type="primary"
                loading={loading}
                orientation="vertical"
                disabled={loading || isBtnDisabled}
                onPress={form.onSubmit(handleSubmit)}
              />
            </View>
          </View>
        </ScrollView>
      </TransfersTemplate>
    </TouchableWithoutFeedback>

    <ModalError
      isOpen={error.isOpen}
      errorCode={error.errorCode}
      title={error.message.title}
      content={error.message.content}
      titleButton={
        error.errorCode === '494' ? 'Elegir otra cuenta' : undefined
      }
      close={() => {
        setError({
          isOpen: false,
          message: {
            title: '',
            content: ''
          },
          errorCode: ''
        })
        form.setField('destinationAccount', '')
        form.setField('amount', null)
        if(error.errorCode === '-1') navigation.navigate('Main')
      }}
      changeTransfer={() => {
        setError({
          isOpen: false,
          message: {
            title: '',
            content: ''
          },
          errorCode: ''
        })
        form.setField('amount', null)
        form.setField('destinationAccount', '')
        navigation.navigate('MainOperations', {
          screen: 'OwnAccounts',
          params: {from,},
        });
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
        containerStyle={{ width: '100%' }}
        type="primary"
        text="Sí, cerrar"
        onPress={async () => {
          onClose()

          await new Promise(res => setTimeout(res, 500));
          navigation.navigate(getMainScreenByName(goBackPath.current))

          clear()
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
  )
}
