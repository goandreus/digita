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
import {useAppSelector} from '@hooks/useAppSelector';
import TransfersTemplate from '@templates/TransfersTemplate';
import {Colors} from '@theme/colors';
import {ownAccountsQuery} from '@services/Transactions';
import {OwnAccountsScreenProps} from '@navigations/types';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {isConfirmPopUp} from '@features/loading';
import PopUp from '@atoms/PopUp';
import DropDownPicker from '@atoms/DropDownPicker';
import {Currency} from '@features/userInfo';
import {useArrangeDropDownData} from './hooks/useArrangeDropDownData';
import CurrencyInput from '@atoms/CurrencyInput';
import {useFocusEffect} from '@react-navigation/native';
import {EventRegister} from '@utils/EventRegister';
import useToggle from '@hooks/useToggle';
import { getMainScreenByName } from '@utils/getMainScreenByName';
import { canTransactWithOwnAcc } from '@utils/canTransactWithOwnAcc';

type From = 'MainScreen' | 'Operations' | 'Confirmation';

const OwnAccounts = ({route, navigation}: OwnAccountsScreenProps) => {
  const from = route.params.from as From | null;

  const goBackPath = useRef<From | null>(null);
  const {isOpen, onClose, onOpen} = useToggle();
  const userSavings = useAppSelector(state => state.user.userSavings);
  const allSavings = [
    ...(userSavings?.savings.savings || []),
    ...(userSavings?.compensations.savings || []),
  ];

  const allSavingsFilter = canTransactWithOwnAcc(allSavings);
  const originSavings = allSavingsFilter?.accountsCanTransact;

  // let originSavings = allSavings.filter(e => e.canTransact && e.balance > 0);
  // let destinationSavings = allSavings.filter(e => e.canReceive);

  // const savingsInSoles = originSavings?.filter(e => e.currency === 'S/').length;
  /*
  const savingsInDollars = originSavings?.filter(
    e => e.currency === '$',
  ).length;

  const destinationSavingsInSoles = destinationSavings?.filter(
    e => e.currency === 'S/',
  ).length;
  const destinationSavingsInDollars = destinationSavings?.filter(
    e => e.currency === '$',
  ).length;

  if (
    ((savingsInSoles === 1 && destinationSavingsInSoles === 0) ||
      (destinationSavingsInSoles === 1 && savingsInSoles === 0) ||
      (savingsInSoles === 1 &&
        destinationSavingsInSoles === 1 &&
        originSavings?.filter(e => e.currency === 'S/')[0].accountCode ===
          destinationSavings?.filter(e => e.currency === 'S/')[0]
            .accountCode)) &&
    originSavings.length > 1
  )
    originSavings = originSavings.filter(e => e.currency !== 'S/');
  if (
    ((savingsInDollars === 1 && destinationSavingsInDollars === 0) ||
      (destinationSavingsInDollars === 1 && savingsInDollars === 0) ||
      (savingsInDollars === 1 &&
        destinationSavingsInDollars === 1 &&
        originSavings?.filter(e => e.currency === '$')[0].accountCode ===
          destinationSavings?.filter(e => e.currency === '$')[0]
            .accountCode)) &&
    originSavings.length > 1
  )
    originSavings = originSavings.filter(e => e.currency !== '$');
  

  const [originCurrency, setOriginCurrency] = useState<Currency>(
    firstOriginSaving.currency,
  );
  const originSavingsDropDownData = useArrangeDropDownData(
    allSavingsFilter?.accountsCanTransact,
    originCurrency,
  );

  const [originSelectedAccount, setOriginSelectedAccount] = useState<string>(
    firstOriginSaving.accountCode,
  );
  const [originSelectedName, setOriginSelectedName] = useState<string>(
    firstOriginSaving.productName,
  );
  const [destinationSelectedAccount, setDestinationSelectedAccount] =
    useState<string>(destinationSavings[0]?.accountCode);
  const [destinationSelectedName, setDestinationSelectedName] =
    useState<string>(destinationSavings[0]?.productName);
  destinationSavings = destinationSavings.filter(
    e =>
      e.currency === originCurrency && e.accountCode !== originSelectedAccount,
  );

  const destinationSavingsDropData = useArrangeDropDownData(
    destinationSavings,
    originCurrency,
  );

  const [openOriginSelect, setOpenOriginSelect] = useState(false);
  const [originAccountValue, setOriginAccountValue] = useState<number | null>(
    firstOriginSaving.balance,
  );
  const [originAccountSvalue, setOriginAccountSvalue] = useState<string | null>(
    firstOriginSaving.sBalance,
  );

  useEffect(() => {
    setFirstOriginSavings(originSavings[0]);
  }, [userSavings]);

  useEffect(() => {
    setOriginAccountSvalue(firstOriginSaving.sBalance);
  }, [firstOriginSaving]);

  const [openDestinationSelect, setOpenDestinationSelect] = useState(false);
  const [destinationAccountSvalue, setDestinationAccountSvalue] = useState<
    string | null
  >(destinationSavings[0]?.sBalance);

  const [showDestinationSelect, setShowDestinationSelect] = useState(false);

  const [showInput, setShowInput] = useState<boolean>(false);
  const [amountValue, setAmountValue] = useState<number | null>(null);
  const [amountValueText, setAmountValueText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const showPopUp = useAppSelector(state => state.loading.confirmPopUp);

  const deviceHeight = Dimensions.get('screen').height;

  const onSubmit = async () => {
    setLoading(true);
    await ownAccountsQuery({
      concept: '',
      destinationAccount: destinationSelectedAccount,
      movementAmount: amountValue,
      movementCurrency: originCurrency === 'S/' ? 1 : 2,
      originAccount: originSelectedAccount,
    })
      .then(res => {
        setLoading(false);
        if (res?.isWarning && !res?.isSuccess) {
          dispatch(
            isConfirmPopUp({
              isVisible: true,
              message: res?.message,
            }),
          );
        } else if (res?.data && res?.isSuccess) {
          navigation.navigate('Confirmation', {
            amount: amountValue,
            amountValueText,
            currency: originCurrency,
            originSelectedAccount,
            destinationSelectedAccount,
            originSelectedName,
            destinationSelectedName,
          });
        }
      })
      .catch(error => console.log(error));
  };

  const isFill = showDestinationSelect && showInput && amountValue !== null;

  const clear = useCallback(() => {
    setShowDestinationSelect(false);
    setShowInput(false);
    setAmountValueText('');
    setAmountValue(null);
  }, []);

  useEffect(() => {
    originCurrency &&
      setDestinationSelectedAccount(destinationSavings[0]?.accountCode);
    setDestinationAccountSvalue(destinationSavings[0]?.sBalance);
    setAmountValue(null);
    setAmountValueText('');
  }, [originCurrency]);

  useEffect(() => {
    setDestinationSelectedAccount(destinationSavings[0]?.accountCode);
    setDestinationAccountSvalue(destinationSavings[0]?.sBalance);
  }, [originAccountValue, originAccountSvalue]);

  const handlePressBack = useCallback(() => {
    if (isFill) {
      onOpen();
      return false;
    }

    navigation.navigate(from);
    return true;
  }, [isFill, onOpen, navigation]);

  useFocusEffect(
    useCallback(() => {
      if (from === 'MainScreen' || from === 'Operations') {
        clear();
        // goBackPath.current = from;
        goBackPath.current = 'MainScreen';
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
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              paddingBottom: 18,
              justifyContent: 'space-between',
              minHeight:
                Platform.OS === 'android'
                  ? deviceHeight - 245
                  : showDestinationSelect && !showInput
                  ? deviceHeight * 0.62
                  : showDestinationSelect && showInput
                  ? deviceHeight * 0.69
                  : deviceHeight * 0.54,
              flexDirection: 'column',
            }}>
            <View>
              <TextCustom
                style={{marginTop: 18, marginBottom: 12}}
                text="Cuenta Origen"
                variation="p"
                weight="bold"
                size={20}
                color="#83786F"
              />

              <DropDownPicker
                data={originSavingsDropDownData}
                onSelect={e => {
                  setShowDestinationSelect(true);
                  setOriginSelectedAccount(e.accountCode);
                  setOriginCurrency(e.currency);
                  setOriginSelectedName(e.productName);
                  setOriginAccountValue(e.balance);
                  setOriginAccountSvalue(e.sBalance);
                }}
                pickerButtonData={{
                  title: originSelectedName,
                  subtitle: originSelectedAccount,
                  value: `${originCurrency} ${originAccountSvalue}`,
                }}
              />
              {showDestinationSelect && destinationSavings?.length > 0 && (
                <>
                  <TextCustom
                    style={{marginTop: 36, marginBottom: 12}}
                    text="Cuenta Destino"
                    variation="p"
                    weight="bold"
                    size={20}
                    color="#83786F"
                  />

                  <DropDownPicker
                    data={destinationSavingsDropData}
                    onSelect={e => {
                      setShowDestinationSelect(true);
                      setDestinationSelectedName(e.productName);
                      setDestinationSelectedAccount(e.accountCode);
                      setDestinationAccountSvalue(e.sBalance);
                      setShowInput(true);
                      setOpenOriginSelect(false);
                      setOpenDestinationSelect(!openDestinationSelect);
                    }}
                    pickerButtonData={{
                      title: destinationSelectedName,
                      subtitle: destinationSelectedAccount,
                      value: `${originCurrency} ${destinationAccountSvalue}`,
                    }}
                  />
                </>
              )}
              {showInput && destinationSavings?.length > 0 && (
                <CurrencyInput
                  initialValue={originAccountValue}
                  amountValue={amountValue}
                  currency={originCurrency}
                  editable={!openOriginSelect}
                  onChangeValue={value => setAmountValue(value)}
                  onChangeText={text => setAmountValueText(text)}
                />
              )}
            </View>

            <View
              style={{
                width: '80%',
                alignSelf: 'center',
                marginTop: Dimensions.get('screen').height > 732 ? 90 : 40,
              }}>
              <Button
                text="Continuar"
                textSize={18}
                disabled={
                  (amountValue &&
                    originAccountValue &&
                    amountValue > originAccountValue) ||
                  !(
                    showInput &&
                    destinationSavings?.length > 0 &&
                    amountValue &&
                    amountValue >= 1 &&
                    ((amountValue <= 10000 && originCurrency === 'S/') ||
                      (amountValue <= 3000 && originCurrency === '$'))
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
                dispatch(
                  isConfirmPopUp({
                    isVisible: false,
                    message: '',
                  }),
                );
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
