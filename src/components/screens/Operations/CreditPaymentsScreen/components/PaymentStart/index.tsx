import {Text, View} from 'react-native';
import React, {FC} from 'react';
import Picker from '@molecules/extra/Picker';
import {PickerItemProps} from '@molecules/extra/Picker/types';
import Button from '@atoms/extra/Button';
import PaymentOption from '../PaymentOption';
import PaymentOptionV2 from '../PaymentOptionv2';
import {Announcement} from '../announcement';
import {PaySkeleton} from '../paySkeleton';
import {ICardInfo} from '../hook/useCreditPayments';

interface IProps {
  styles: any;
  creditPayments: any;
  options: any;
  currentAmount: any;
  setCurrentAmount: any;
  setOptions: any;
  hasAmountError: any;
  handleOtherAmountError: any;
  savings: PickerItemProps[] | null;
  handleOnSelect: any;
  amountValidate: any;
  handleSubmit: any;
  operationValue: any;
  route: any;
  cardInfo: ICardInfo;
}

export const PaymentStart: FC<IProps> = ({
  styles,
  creditPayments,
  options,
  currentAmount,
  setCurrentAmount,
  setOptions,
  hasAmountError,
  handleOtherAmountError,
  savings,
  handleOnSelect,
  amountValidate,
  handleSubmit,
  operationValue,
  route,
  cardInfo,
}) => {
  const handlePosition = () => {
    const getPosition =
      savings &&
      savings.findIndex(
        res => res.accountCode === operationValue?.accountNumber,
      );
    const position = getPosition && getPosition === -1 ? null : getPosition;
    return position;
  };

  return (
    <>
      {/* //!mainContent */}
      <View>
        <View>
          <Text style={{...styles.subtitle, marginBottom: 16}}>
            ¿Cuánto pagarás?
          </Text>
          {creditPayments ? (
            <PaymentOption
              active={options.option1.active}
              title={cardInfo.title}
              subtitle={cardInfo.subtitle}
              amountLabel={cardInfo.ammountLabel}
              amount={cardInfo.amount}
              onPress={() => {
                setCurrentAmount(cardInfo.nAmount);
                setOptions({
                  ...options,
                  option1: {...options.option1, active: true},
                  option2: {...options.option2, active: false},
                });
              }}
              disabled={options.option1.disabled}
              hideRadioButton={false}
            />
          ) : (
            <PaySkeleton />
          )}
          <View style={{marginTop: 8}}>
            {creditPayments ? (
              <PaymentOptionV2
                active={options.option2.active}
                title={'Otro monto'}
                subtitle={`Hasta ${
                  creditPayments
                    ? `${route.params.currency} ${creditPayments.sSumAmountInstallments}`
                    : ''
                }`}
                onPress={() => {
                  setCurrentAmount(options.option2.value ?? 0);
                  setOptions({
                    ...options,
                    option1: {...options.option1, active: false},
                    option2: {...options.option2, active: true},
                  });
                }}
                disabled={options.option2.disabled}
                hideRadioButton={false}
                showInput={options.option2.active}
                currency={route.params.currency ?? 'S/'}
                value={operationValue?.amountToPay ?? null}
                onChangeValue={val => {
                  setCurrentAmount(val ?? 0);
                  setOptions({
                    ...options,
                    option2: {...options.option2, value: val ?? 0},
                  });
                }}
                error={hasAmountError(
                  options.option2.value,
                  creditPayments ? creditPayments.sumAmountInstallments : 0,
                )}
              />
            ) : (
              <PaySkeleton />
            )}
            {options.option2.active &&
              handleOtherAmountError({
                amount: options.option2.value,
                maxAmount: creditPayments
                  ? creditPayments.sumAmountInstallments
                  : 0,
              })}
          </View>
        </View>
        <View style={{marginVertical: 40}}>
          <Text style={{...styles.subtitle, marginBottom: 8}}>
            Pagarás con la cuenta
          </Text>
          {savings && savings.length > 0 ? (
            <Picker
              text="Elige una cuenta"
              dataPosition={handlePosition()}
              data={savings || []}
              onSelect={value => handleOnSelect(value)}
              error={amountValidate}
              errorText="Esta cuenta no tiene saldo suficiente."
            />
          ) : (
            <PaySkeleton />
          )}
        </View>
      </View>

      {/* //!disclaimer */}
      <Announcement />

      {/* //!btn siguiente */}
      <View style={{marginTop: 40, paddingHorizontal: 24}}>
        <Button
          onPress={() => {
            handleSubmit();
          }}
          loading={false}
          orientation="horizontal"
          type="primary"
          text="Siguiente"
          disabled={
            currentAmount !== 0
              ? !amountValidate
                ? options.option2.active &&
                  hasAmountError(
                    options.option2.value,
                    creditPayments ? creditPayments.sumAmountInstallments : 0,
                  )
                : amountValidate
              : true
          }
        />
      </View>
    </>
  );
};
