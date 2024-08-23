/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable curly */
import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import yup from '@yup';
import Button from '@atoms/extra/Button';
import FormBasicTemplate from '@templates/extra/FormBasicTemplate';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import {SIZES} from '@theme/metrics';
import {TouchableWithoutFeedback, View} from 'react-native';
import {COLORS} from '@theme/colors';
import DebtItem from './DebtsComponents/DebtItem';
import {PickerSimple} from '@atoms/extra/PickerSimple';
import {
  AsubstractB,
  convertToCurrency,
  convertToCurrencyWithoutRounding,
} from '@utils/convertCurrency';
import {capitalizeFull} from '@helpers/StringHelper';
import {useUserInfo} from '@hooks/common';
import {DebtsScreenProps} from '@navigations/types';
import {useAppSelector} from '@hooks/useAppSelector';
import {IDebts} from '@features/categoryInPayment/types';
import moment from 'moment';
import _ from 'lodash';
import SimpleCurrencyInput from 'react-native-currency-input';
import {getRemoteValue} from '@utils/firebase';
import MessageModal from '@screens/Operations/CreditPaymentsScreen/components/MessageModal';

interface IValues {
  debtId?: string;
  accountId?: string;
}

interface IErrors {
  debtId: string | undefined;
  accountId: string | undefined;
  partialPayment: string | undefined;
  freePayment: string | undefined;
}

export const DebtsScreen = ({navigation, route}: DebtsScreenProps) => {
  const debts = useAppSelector(
    state => state.categoryInPayment?.debts,
  ) as IDebts;

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [debtIdSelected, setDebtIdSelected] = useState<string | undefined>(
    undefined,
  );
  const [accountIdSelected, setAccountIdSelected] = useState<
    string | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [partialPayment, setPartialPayment] = useState({
    active: false,
    value: 0,
    error: false,
    touched: false,
  });
  const [freePayment, setFreePayment] = useState({
    active: false,
    value: 0,
    error: false,
    touched: false,
  });
  const {businessName, serviceCode, serviceName} = route.params;
  const {userSavings} = useUserInfo();
  const userFullName = debts.clientname.trim();
  const [showModal, setShowModal] = useState({
    maxValue: false,
    minValue: false,
  });

  const min = getRemoteValue('min_amount_srv_pay').asNumber();
  const max = getRemoteValue('max_amount_srv_pay').asNumber();

  function formatNumber(number: number): string {
    // Split into integer and decimal parts
    const parts = number.toString().split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const decimalPart = parts[1] || '00';

    return `${integerPart}.${decimalPart}`;
  }

  const accountsFormattedArray = useMemo(() => {
    if (userSavings === null) return [];
    return [...userSavings.savings.savings]
      .filter(i => i.currency === 'S/' && i.accountType !== 'C')
      .sort((a, b) => b.balance - a.balance)
      .map((item, index) => ({
        id: index.toString(),
        accountTitle: item.productName,
        accountNumber: item.accountCode,
        accountAmount: item.balance,
      }));
  }, [userSavings]);

  const defaultAccountId = useMemo(() => {
    if (accountsFormattedArray.length > 0) return accountsFormattedArray[0].id;
  }, [accountsFormattedArray]);

  useLayoutEffect(() => {
    setAccountIdSelected(defaultAccountId);
  }, [defaultAccountId]);

  useEffect(() => {
    if (debts.list.length > 0 && debts.list[0].paymentMethod === 'ABIERTO') {
      setFreePayment({...freePayment, active: true});
    }
  }, [debts.list]);

  useEffect(() => {
    if (freePayment.active) {
      setDebtIdSelected('0');
    } else {
      setDebtIdSelected(undefined);
    }
  }, [freePayment]);

  const debtsFormattedArray = useMemo(() => {
    return [...debts.list]
      .sort((a, b) => a.order - b.order)
      .map((debt, index) => ({
        id: index.toString(),
        expiredAt: moment(debt.expiryDate, 'YYYYMMDD').toDate(),
        debtId: debt.invoiceNumber,
        amount: debt.totalAmount,
      }));
  }, []);

  const debtsFiltered = useMemo(() => {
    return isCollapsed ? debtsFormattedArray.slice(0, 1) : debtsFormattedArray;
  }, [debtsFormattedArray, isCollapsed]);

  const handleSubmit = () => {
    try {
      setIsSubmitting(true);
      const _id = debtIdSelected ? parseInt(debtIdSelected, 10) : 0;

      const account = accountsFormattedArray.find(
        e => e.id === accountIdSelected,
      );

      let total = 0;

      if (partialPayment.active) {
        total = partialPayment.value;
      } else if (freePayment.active) {
        total = freePayment.value;
      } else {
        total = debts.list[_id].totalAmount;
      }

      let amount = 0;

      if (partialPayment.active) {
        amount =
          partialPayment.value -
          debts.list[_id].delay -
          debts.list[_id].totalCommission;
      } else if (freePayment.active) {
        amount =
          freePayment.value -
          debts.list[_id].delay -
          debts.list[_id].totalCommission;
      } else {
        amount = debts.list[_id].debtAmount;
      }

      let stage:
        | 'PAY_SERVICES_TOTAL'
        | 'PAY_SERVICES_ABIERTO'
        | 'PAY_SERVICES_PARCIAL';
      switch (debts.list[_id].paymentMethod) {
        case 'TOTAL':
          stage = 'PAY_SERVICES_TOTAL';
          break;
        case 'ABIERTO':
          stage = 'PAY_SERVICES_ABIERTO';
          break;
        case 'PARCIAL':
          stage = 'PAY_SERVICES_PARCIAL';
          break;
        default:
          throw 'No se reconoce el tipo de pago.';
      }

      if (!freePayment.active && !partialPayment.active) {
        if (total > max) {
          setShowModal({...showModal, maxValue: true});
        } else if (total < min) {
          setShowModal({...showModal, minValue: true});
        } else {
          navigation.navigate('PayServiceConfirmation', {
            stage: stage,
            totalAmount: total,
            companyName: businessName,
            serviceType: serviceName,
            serviceName: serviceName,
            serviceCode: serviceCode,
            serviceAmount: amount,
            serviceArrears: debts.list[_id].delay,
            serviceFee: debts.list[_id].totalCommission,
            completeName: debts.clientname,
            accountName: account?.accountTitle ?? '',
            accountNumber: account?.accountNumber ?? '',
            operationNumber: debts.list[_id].invoiceNumber,
            stepsProps: {current: 2, max: 3, previous: 1},
          });
        }
      } else {
        navigation.navigate('PayServiceConfirmation', {
          stage: stage,
          totalAmount: total,
          companyName: businessName,
          serviceType: serviceName,
          serviceName: serviceName,
          serviceCode: serviceCode,
          serviceAmount: amount,
          serviceArrears: debts.list[_id].delay,
          serviceFee: debts.list[_id].totalCommission,
          completeName: debts.clientname,
          accountName: account?.accountTitle ?? '',
          accountNumber: account?.accountNumber ?? '',
          operationNumber: debts.list[_id].invoiceNumber,
          stepsProps: {current: 2, max: 3, previous: 1},
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const errors: IErrors = useMemo(() => {
    const errors: IErrors = {
      debtId: undefined,
      accountId: undefined,
      partialPayment: undefined,
      freePayment: undefined,
    };

    if (debtIdSelected === undefined)
      errors.debtId = 'Es obligatorio completar este dato.';

    if (accountIdSelected === undefined)
      errors.accountId = 'Es obligatorio completar este dato.';

    if (accountIdSelected !== undefined && debtIdSelected !== undefined) {
      const account = accountsFormattedArray.find(
        item => item.id === accountIdSelected,
      );
      const debt = debtsFormattedArray.find(item => item.id === debtIdSelected);
      const _mainDebt = debts.list[parseInt(debtIdSelected, 10)];

      if (account === undefined)
        errors.accountId = 'Es obligatorio completar este dato.';
      if (!freePayment.active && debt === undefined)
        errors.debtId = 'Es obligatorio completar este dato.';

      if (account !== undefined && debt !== undefined) {
        if (partialPayment.active) {
          if (AsubstractB(account.accountAmount, partialPayment.value) < 0) {
            errors.accountId =
              'No hay saldo suficiente para realizar esta operación';
          }

          if (_mainDebt) {
            if (
              _mainDebt.maximumAmount < partialPayment.value ||
              max < partialPayment.value
            ) {
              errors.partialPayment = `El monto máximo que puedes ingresar es S/ ${formatNumber(
                _mainDebt.maximumAmount > max ? max : _mainDebt.maximumAmount,
              )}`;
            } else if (
              _mainDebt.minimumAmount > partialPayment.value ||
              min > partialPayment.value
            ) {
              errors.partialPayment = `El monto mínimo que puedes ingresar es S/ ${formatNumber(
                _mainDebt.minimumAmount < min ? min : _mainDebt.minimumAmount,
              )}`;
            }
          }
        } else if (freePayment.active) {
          if (AsubstractB(account.accountAmount, freePayment.value) < 0) {
            errors.accountId =
              'No hay saldo suficiente para realizar esta operación';
          }

          if (_mainDebt) {
            if (_mainDebt.maximumAmount < freePayment.value) {
              errors.freePayment = `El monto máximo que puedes ingresar es S/ ${formatNumber(
                _mainDebt.maximumAmount > max ? max : _mainDebt.maximumAmount,
              )}`;
            } else if (_mainDebt.minimumAmount > freePayment.value) {
              errors.freePayment = `El monto mínimo que puedes ingresar es S/ ${formatNumber(
                _mainDebt.minimumAmount < min ? min : _mainDebt.minimumAmount,
              )}`;
            }
          }
        } else {
          if (AsubstractB(account.accountAmount, debt.amount) < 0) {
            errors.accountId =
              'No hay saldo suficiente para realizar esta operación';
          }
        }
      }
    }
    return errors;
  }, [
    debtIdSelected,
    accountIdSelected,
    accountsFormattedArray,
    debtsFormattedArray,
    partialPayment,
    freePayment,
  ]);

  const isValid =
    errors.accountId === undefined &&
    errors.debtId === undefined &&
    errors.partialPayment === undefined &&
    errors.freePayment === undefined;

  return (
    <>
      <FormBasicTemplate
        title={freePayment.active ? 'Pago pendiente' : 'Recibos pendientes'}
        stepsProps={{current: 1, max: 3, previous: 0}}
        footer={
          <Button
            onPress={handleSubmit}
            loading={isSubmitting}
            orientation="horizontal"
            type="primary"
            text="Continuar"
            disabled={!isValid}
          />
        }>
        <TextCustom variation="h2" color="neutral-darkest" lineHeight="tight">
          {_.capitalize(businessName)}
        </TextCustom>
        <Separator size={SIZES.XS} />
        <TextCustom variation="h5" color="neutral-darkest" lineHeight="tight">
          Servicio de {_.lowerCase(serviceName)}
        </TextCustom>
        <Separator size={SIZES.XS} />
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TextCustom
            style={{marginRight: SIZES.XS / 2}}
            variation="h5"
            color="neutral-dark"
            lineHeight="tight">
            Titular
          </TextCustom>
          <TextCustom
            style={{
              flexShrink: 1,
            }}
            variation="h5"
            color="neutral-darkest"
            lineHeight="tight">
            {capitalizeFull(_.toLower(userFullName))}
          </TextCustom>
        </View>
        <Separator size={SIZES.XS} />
        <TextCustom variation="h5" color="neutral-darkest" lineHeight="tight">
          {serviceCode}
        </TextCustom>
        <Separator size={SIZES.LG} />
        <View
          style={{
            borderColor: COLORS.Neutral.Light,
            borderBottomWidth: 1,
          }}
        />
        {!freePayment.active ? (
          <View>
            <Separator size={SIZES.XS * 5} />
            <TextCustom
              variation="h4"
              color="neutral-darkest"
              lineHeight="tight">
              Selecciona un recibo
            </TextCustom>
            <Separator size={SIZES.XS} />
            {debtsFiltered.map((item, index, arr) => (
              <React.Fragment key={item.id}>
                <DebtItem
                  amount={item.amount}
                  debtNumber={item.debtId}
                  expiredAt={item.expiredAt}
                  isDisabled={index === 0 ? false : true}
                  isChecked={debtIdSelected === item.id}
                  onToggle={state => {
                    if (state) {
                      setDebtIdSelected(item.id);
                    } else {
                      setDebtIdSelected(undefined);
                    }
                    setPartialPayment({
                      value: 0,
                      active: false,
                      error: false,
                      touched: false,
                    });
                  }}
                  allowPartialPayment={
                    index === 0 && debts.list[index].paymentMethod === 'PARCIAL'
                  }
                  hasError={!!errors.partialPayment && partialPayment.touched}
                  errorMessage={errors.partialPayment}
                  onPartialToogle={v => {
                    setPartialPayment({
                      ...partialPayment,
                      touched: false,
                      active: v,
                      value: 0,
                    });
                  }}
                  isPartialChecked={partialPayment.active}
                  partialValue={partialPayment.value}
                  onPartialValueChange={v => {
                    setPartialPayment({
                      ...partialPayment,
                      value: v,
                      touched: true,
                    });
                  }}
                />
                {index + 1 < arr.length && <Separator size={SIZES.XS} />}
              </React.Fragment>
            ))}

            {debtsFormattedArray.length > 1 && (
              <>
                <Separator size={SIZES.XS * 2} />
                <TouchableWithoutFeedback
                  onPress={() => setIsCollapsed(prev => !prev)}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: SIZES.XS * 5,
                    }}>
                    <TextCustom
                      decoration="underline"
                      weight="normal"
                      variation="h5"
                      color="primary-medium"
                      lineHeight="tight">
                      {isCollapsed === true && 'Ver más recibos'}
                      {isCollapsed === false && 'Ver menos recibos'}
                    </TextCustom>
                  </View>
                </TouchableWithoutFeedback>
              </>
            )}
          </View>
        ) : (
          <View>
            {debts && debts.list[0].totalCommission ? (
              <>
                <TextCustom
                  text="Comisión"
                  variation="h4"
                  weight="normal"
                  style={{marginBottom: 8, marginTop: 28, color: '#97A3B6'}}
                />
                <SimpleCurrencyInput
                  textAlign={'left'}
                  style={{
                    borderColor: '#97A3B6',
                    color: '#97A3B6',
                    borderWidth: 1,
                    borderRadius: 4,
                    height: 56,
                    padding: 16,
                  }}
                  value={debts.list[0].totalCommission}
                  onChangeValue={() => {}}
                  onChangeText={() => {}}
                  prefix="S/ "
                  delimiter=","
                  separator="."
                  precision={2}
                  selectionColor={'#97A3B6'}
                  placeholder="S/ 00.00"
                  placeholderTextColor={COLORS.Neutral.Dark}
                  editable={false}
                />
              </>
            ) : null}
            <Separator size={SIZES.XS * 2} />
            <TextCustom
              text="Monto"
              variation="h4"
              weight="normal"
              color="neutral-darkest"
              style={{marginBottom: 8}}
            />
            <SimpleCurrencyInput
              textAlign={'left'}
              maxValue={99999999999999.99}
              style={{
                borderColor:
                  errors.freePayment && freePayment.touched
                    ? '#E42525'
                    : '#97A3B6',
                borderWidth: 1,
                borderRadius: 4,
                height: 56,
                padding: 16,
                color: 'black',
              }}
              value={freePayment.value}
              onChangeValue={val => {
                setFreePayment({
                  ...freePayment,
                  touched: true,
                  value: val ?? 0,
                });
              }}
              onChangeText={() => {}}
              prefix="S/ "
              delimiter=","
              separator="."
              precision={2}
              selectionColor={'#97A3B6'}
              placeholder="S/ 00.00"
              placeholderTextColor={COLORS.Neutral.Dark}
              /* maxValue={debts!.list[0].maximumAmount}
          minValue={debts!.list[0].minimumAmount} */
              editable={true}
            />
            {errors.freePayment && freePayment.touched ? (
              <TextCustom
                text={errors.freePayment}
                variation="p5"
                weight="normal"
                color="error-medium"
                style={{marginTop: 8}}
              />
            ) : undefined}
          </View>
        )}
        <Separator size={SIZES.XS * 5} />
        <TextCustom variation="h4" color="neutral-darkest" lineHeight="tight">
          Pagarás con la cuenta
        </TextCustom>
        <Separator size={SIZES.XS} />
        <PickerSimple
          errorMessage={
            debtIdSelected !== undefined ? errors.accountId : undefined
          }
          modalTitle="Elige una cuenta"
          data={accountsFormattedArray}
          defaultId={defaultAccountId}
          onSelectItem={item => {
            setAccountIdSelected(item.id);
          }}
          onRenderItemSelected={item => (
            <View
              style={{
                paddingVertical: SIZES.LG,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 1,
                flexGrow: 1,
              }}>
              <View
                style={{
                  flexShrink: 1,
                  marginRight: SIZES.XS,
                }}>
                <TextCustom
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  variation="h5"
                  color="neutral-darkest"
                  lineHeight="tight">
                  {item.accountTitle}
                </TextCustom>
                <Separator size={SIZES.XS / 2} />
                <TextCustom
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  variation="h6"
                  color="neutral-dark"
                  lineHeight="tight">
                  {item.accountNumber}
                </TextCustom>
              </View>
              <TextCustom
                variation="h4"
                color="neutral-darkest"
                lineHeight="tight">
                S/ {convertToCurrencyWithoutRounding(item.accountAmount)}
              </TextCustom>
            </View>
          )}
          onRenderItem={item => (
            <View
              style={{
                paddingVertical: SIZES.LG,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexShrink: 1,
                  marginRight: SIZES.XS / 2,
                }}>
                <TextCustom
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  variation="h5"
                  color="neutral-darkest"
                  lineHeight="tight">
                  {item.accountTitle}
                </TextCustom>
                <Separator size={SIZES.XS / 2} />
                <TextCustom
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  variation="h6"
                  color="neutral-dark"
                  lineHeight="tight">
                  {item.accountNumber}
                </TextCustom>
              </View>
              <TextCustom
                variation="h4"
                color="neutral-darkest"
                lineHeight="tight">
                S/ {convertToCurrencyWithoutRounding(item.accountAmount)}
              </TextCustom>
            </View>
          )}
        />
        <MessageModal
          show={showModal.maxValue || showModal.minValue}
          messageTitle={`¡Monto ${
            showModal.maxValue ? 'máximo' : 'mínimo'
          } alcanzado!`}
          message={`El monto ${
            showModal.maxValue ? 'máximo' : 'mínimo'
          } que puedes ingresar ${'\n'} es S/${convertToCurrency(
            showModal.maxValue ? max : min,
          )}`}
          buttonTitle={'Entiendo'}
          onButtonPress={() => {
            setShowModal({...showModal, maxValue: false, minValue: false});
          }}
        />
      </FormBasicTemplate>
    </>
  );
};
