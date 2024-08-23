import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import TransfersTemplate from '@templates/TransfersTemplate';
import {Colors} from '@theme/colors';
import {ownAccountsQuery} from '@services/Transactions';
import {OwnAccountsScreenProps} from '@navigations/types';
import PopUp from '@atoms/PopUp';
import CurrencyInput from '@atoms/CurrencyInput';
import {useFocusEffect} from '@react-navigation/native';
import {EventRegister} from '@utils/EventRegister';
import useToggle from '@hooks/useToggle';
import {getMainScreenByName} from '@utils/getMainScreenByName';
import {canTransactWithOwnAcc} from '@utils/canTransactWithOwnAcc';
import DropDownAccount from '@atoms/DropDownAccount';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import ModalError from '@molecules/ModalError';
import {getUserSavings} from '@services/User';
import {SEPARATOR_BASE} from '@theme/metrics';
import {useLoading, useUserInfo} from '@hooks/common';

type From = 'MainScreen' | 'Transfers' | 'Confirmation' | 'errorModal';
interface errorMessage {
  isOpen: boolean;
  errorCode: string;
  message: {
    title: string;
    content: string;
  };
}

const OwnAccounts = ({route, navigation}: OwnAccountsScreenProps) => {
  const from = route.params.from as From | null;

  const [error, setError] = useState<errorMessage>({
    isOpen: false,
    errorCode: '',
    message: {
      content: '',
      title: '',
    },
  });

  const goBackPath = useRef<From | null>(null);
  const {isOpen, onClose, onOpen} = useToggle();
  const {user, userSavings, setUserSavings} = useUserInfo();
  const person = user?.person;

  const allSavingsFilter = useMemo(() => {
    return canTransactWithOwnAcc([
      ...(userSavings?.savings.savings ?? []),
      ...(userSavings?.compensations.savings ?? []),
    ]);
  }, [userSavings?.compensations.savings, userSavings?.savings.savings]);

  const originSavings = useMemo(() => {
    return allSavingsFilter?.accountsCanTransact
      .map(e => ({
        ...e,
        title: e.productName,
        subtitle: e.accountCode,
        value: `${e.currency} ${e.sBalance}`,
      }))
      .sort((a, b) => {
        if (a.currency === 'S/' && b.currency !== 'S/') {
          return -1;
        }
        if (a.currency !== 'S/' && b.currency === 'S/') {
          return 1;
        }
        return b.balance - a.balance;
      });
  }, [allSavingsFilter?.accountsCanTransact]);

  const destinationInSoles = useMemo(() => {
    return allSavingsFilter?.accountsCanReceiveInSoles
      .map(e => ({
        ...e,
        title: e.productName,
        subtitle: e.accountCode,
        value: `${e.currency} ${e.sBalance}`,
      }))
      .sort((a, b) => b.balance - a.balance);
  }, [allSavingsFilter?.accountsCanReceiveInSoles]);

  const destinationInDollars = useMemo(() => {
    return allSavingsFilter?.accountsCanReceiveInDollars
      .map(e => ({
        ...e,
        title: e.productName,
        subtitle: e.accountCode,
        value: `${e.currency} ${e.sBalance}`,
      }))
      .sort((a, b) => b.balance - a.balance);
  }, [allSavingsFilter?.accountsCanReceiveInDollars]);

  const [originAccountUId, setOriginAccountUId] = useState(
    originSavings?.[0].operationUId!,
  );
  const originAccount = useAccountByOperationUid({
    operationUId: originAccountUId,
  });

  const destinationSavings = useMemo(() => {
    if (originAccount?.currency === '$') {
      return destinationInDollars?.filter(d => {
        return d.operationUId !== originAccount.operationUId;
      });
    }

    return destinationInSoles?.filter(d => {
      return d.operationUId !== originAccount?.operationUId;
    });
  }, [originAccount?.operationUId]);

  const [destinationAccountUId, setDestinationAccountUId] = useState(
    destinationSavings?.[0]?.operationUId,
  );
  const destinationAccount = useAccountByOperationUid({
    operationUId: destinationAccountUId,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [amountValueText, setAmountValueText] = useState<string>('');
  const [amountValue, setAmountValue] = useState<number | null>(null);

  const {confirmPopUp, isConfirmPopUp} = useLoading();

  const deviceHeight = Dimensions.get('screen').height;
  const isFill = amountValue !== null;

  const onSubmit = async () => {
    setLoading(true);
    const payload = {
      concept: '',
      movementAmount: amountValue,
      originAccount: originAccount?.accountCode!,
      destinationAccount: destinationAccount?.accountCode!,
      movementCurrency: originAccount?.currency === 'S/' ? 1 : 2,
    };
    try {
      const res = await ownAccountsQuery({
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
        navigation.navigate('Confirmation', {
          amountValueText,
          amount: amountValue,
          currency: originAccount?.currency!,
          originSelectedName: originAccount?.productName!,
          originSelectedAccount: originAccount?.accountCode!,
          destinationSelectedName: destinationAccount?.productName!,
          destinationSelectedAccount: destinationAccount?.accountCode!,
        });
      }
    } catch (error: any) {
      setError({
        errorCode: '-1',
        isOpen: true,
        message: {
          title: '¡Ups, hubo un problema!',
          content:
            'No hemos podido cargar tu información, por favor intenta en unos segundos o vuelve a ingresar.',
        },
      });
      setLoading(false);
    }
  };

  const clear = useCallback(() => {
    setAmountValueText('');
    setAmountValue(null);
  }, []);

  useEffect(() => {
    setDestinationAccountUId(destinationSavings?.[0]?.operationUId);
  }, [destinationSavings, originAccount?.currency]);

  const handlePressBack = useCallback(() => {
    if (isFill) {
      onOpen();
      return false;
    }

    navigation.navigate(getMainScreenByName(goBackPath.current));
    return true;
  }, [isFill, onOpen, navigation]);

  useFocusEffect(
    useCallback(() => {
      if (from === 'MainScreen' || from === 'Transfers') {
        setError({
          isOpen: false,
          errorCode: '',
          message: {
            title: '',
            content: '',
          },
        });
        clear();
        goBackPath.current = from;
        // goBackPath.current = 'MainScreen';
      }
      if (from === 'errorModal') {
        setAmountValueText('');
        setAmountValue(null);
        setError({
          isOpen: false,
          errorCode: '',
          message: {
            title: '',
            content: '',
          },
        });
      }
    }, [from, clear]),
  );

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
        if (isFill) {
          e.preventDefault();
          onOpen();

          goBackPath.current = 'MainScreen';
        }
      });

      return () => {
        EventRegister.rm(id!);
      };
    }, [isFill, onOpen]),
  );

  const updateUserSavings = async () => {
    await getUserSavings({personUid: person?.personUId}).then(res => {
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
      <TransfersTemplate
        title="A Cuentas Propias"
        titleSize={24}
        goBack={handlePressBack}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View
            style={{
              flex: 1,
              paddingBottom: SEPARATOR_BASE * 3,
              justifyContent: 'space-between',
              minHeight: '100%',
            }}>
            <View>
              <TextCustom
                style={{
                  marginTop: SEPARATOR_BASE * 3,
                  marginBottom: SEPARATOR_BASE * 3,
                }}
                text="Cuenta Origen"
                variation="p"
                weight="bold"
                size={20}
                color="#83786F"
              />

              <DropDownAccount
                data={originSavings!}
                operationUId={originAccountUId}
                onSelect={value => {
                  setOriginAccountUId(value);
                }}
              />

              {destinationSavings?.length > 0 && (
                <>
                  <TextCustom
                    style={{marginTop: 36, marginBottom: 12}}
                    text="Cuenta Destino"
                    variation="p"
                    weight="bold"
                    size={20}
                    color="#83786F"
                  />

                  <DropDownAccount
                    data={destinationSavings!}
                    operationUId={destinationAccountUId!}
                    onSelect={value => {
                      setDestinationAccountUId(value);
                    }}
                  />

                  <CurrencyInput
                    editable
                    amountValue={amountValue}
                    currency={originAccount?.currency!}
                    initialValue={originAccount?.balance ?? null}
                    onChangeValue={value => setAmountValue(value)}
                    onChangeText={text => setAmountValueText(text)}
                  />
                </>
              )}
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
                disabled={
                  loading ||
                  (amountValue &&
                    originAccount?.balance &&
                    amountValue > originAccount?.balance) ||
                  !(
                    destinationSavings?.length > 0 &&
                    amountValue &&
                    amountValue >= 1 &&
                    ((amountValue <= 10000 &&
                      originAccount?.currency === 'S/') ||
                      (amountValue <= 3000 && originAccount?.currency === '$'))
                  )
                }
                type="primary"
                loading={loading}
                onPress={onSubmit}
                orientation="vertical"
              />
            </View>
          </View>
        </ScrollView>

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
              errorCode: '',
              message: {
                title: '',
                content: '',
              },
            });
            setAmountValueText('');
            setAmountValue(null);
            if (error.errorCode === '-1') {
              navigation.navigate('Main');
            }
          }}
        />

        {confirmPopUp?.isVisible && (
          <PopUp open={confirmPopUp?.isVisible}>
            <TextCustom
              text={confirmPopUp?.message}
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
      </TransfersTemplate>
    </>
  );
};

export default OwnAccounts;
