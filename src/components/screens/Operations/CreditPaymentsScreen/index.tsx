/* eslint-disable react-native/no-inline-styles */
import {BackHandler} from 'react-native';
import React, {useCallback} from 'react';
import {CreditPaymentsScreenProps} from '@navigations/types';
import AlertBasic from '@molecules/extra/AlertBasic';
import TextCustom from '@atoms/extra/TextCustom';
import Button from '@atoms/extra/Button';
import UnsupportedAccountModal from './components/UnsupportedAccountModal';
import useCreditPayments from './components/hook/useCreditPayments';
import TransfersTemplate from '@templates/extra/TransfersTemplate';
import ConfirmLoadingFishes from '@molecules/LoadingFishes';
import {PaymentSummary} from './components/PaymentSummary';
import PaymentReceiptModal from './components/PaymentReceiptModal';
import {useFocusEffect} from '@react-navigation/native';
import DeletePayErrorModal from './components/DeletePayErrorModal';
import {PaymentStart} from './components/PaymentStart';
import MessageModal from './components/MessageModal';

export const CreditPaymentsScreen = ({
  navigation,
  route,
}: CreditPaymentsScreenProps) => {
  const {
    styles,
    savings,
    options,
    amountValidate,
    setOptions,
    hasAmountError,
    handleOtherAmountError,
    handleOnSelect,
    handleSubmit,
    creditPayments,
    creditStep,
    setCurrentAmount,
    setCreditStep,
    showModal,
    setShowModal,
    scheduleError,
    setScheduleError,
    operationValue,
    currentAmount,
    setOperationValue,
    loading,
    payCreditValues,
    handlePay,
    clearStates,
    cardInfo,
  } = useCreditPayments({
    navigation,
    route,
  });

  const goBack = () => {
    if (creditStep === 1) {
      options?.option1?.active &&
        setOperationValue(prevState => ({...prevState, amountToPay: null}));
      setCreditStep(0);
    } else navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (creditStep === 1) {
          setCreditStep(0);
          return true;
        }
        return false;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [creditStep]),
  );

  return loading ? (
    <ConfirmLoadingFishes />
  ) : (
    <>
      <TransfersTemplate
        headerTitle="Pagar Crédito"
        title={creditStep === 0 ? 'Opciones de pago' : 'Confirmación de pago'}
        goBack={goBack}
        stepsProps={{current: creditStep, max: 2}}
        canGoBack={navigation.canGoBack()}>
        {creditStep === 0 ? (
          <PaymentStart
            styles={styles}
            creditPayments={creditPayments}
            options={options}
            currentAmount={currentAmount}
            setCurrentAmount={setCurrentAmount}
            setOptions={setOptions}
            hasAmountError={hasAmountError}
            handleOtherAmountError={handleOtherAmountError}
            savings={savings}
            handleOnSelect={handleOnSelect}
            amountValidate={amountValidate}
            handleSubmit={handleSubmit}
            operationValue={operationValue}
            route={route}
            cardInfo={cardInfo}
          />
        ) : (
          <>
            {operationValue && (
              <PaymentSummary
                amountToPay={operationValue.amountToPay ?? 0}
                currencyToPay={operationValue.currencyToPay ?? ''}
                creditProductName={operationValue.creditProductName ?? ''}
                savingProductName={operationValue.savingProductName}
                accountCode={operationValue.accountCode ?? ''}
                accountNumber={operationValue.accountNumber}
                amountInstallments={operationValue.amountInstallments}
                isPayingOtherAmount={
                  operationValue.isPayingOtherAmount ?? false
                }
                installments={operationValue.Installments}
                onPay={() => {
                  handlePay();
                }}
              />
            )}
          </>
        )}
      </TransfersTemplate>

      <UnsupportedAccountModal
        show={showModal.unsupportedAccount}
        onButtonPress={() => {
          setShowModal({...showModal, unsupportedAccount: false});
        }}
      />
      <DeletePayErrorModal
        show={showModal.payError}
        onButtonPress={() => {
          setShowModal({...showModal, payError: false});
        }}
      />

      {/* <MessageModal 
        show={showModal.unsupportedAccount}
        messageTitle={`¡Uy, debes elegir otra cuenta ${'\n'} para continuar!`}
        message={`La cuenta elegida no está disponible para ${'\n'} realizar esta operación.`}
        buttonTitle={"Elegir otra cuenta"}
        onButtonPress={() => {
          setShowModal({...showModal, unsupportedAccount: false});
        }}
      /> */}
      {/* <MessageModal 
        show={showModal.payError}
        messageTitle={"¡Uy, ocurrió un problema!"}
        message={`Estamos trabajando para solucionarlo.${'\n'}Si persiste contáctanos al (01) 313 5000.`}
        ButtonTitle={"Entiendo"}
        onButtonPress={() => {
          setShowModal({...showModal, payError: false});
        }}
      /> */}
      <MessageModal 
        show={showModal.validateAmountError}
        messageTitle={"Pago no disponible"}
        message={`El pago mínimo que puedes hacer desde la${'\n'}app es S/1.00. Te recomendamos realizar${'\n'} el pago en una de nuestras agencias.`}
        buttonTitle={"Entiendo"}
        messageBold={"S/1.00"}
        onButtonPress={() => {
          setShowModal({...showModal, validateAmountError: false});
        }}
      />

      {operationValue && (
        <PaymentReceiptModal
          data={{
            amountToPay: operationValue!.amountToPay ?? 0,
            currencyToPay: operationValue!.currencyToPay ?? '',
            isPayingOtherAmount: operationValue!.isPayingOtherAmount ?? false,
            creditProductName: operationValue!.creditProductName ?? '',
            savingProductName: operationValue!.savingProductName ?? '',
            accountCode: operationValue!.accountCode ?? '',
            accountNumber: operationValue!.accountNumber ?? '',
            amountInstallments: operationValue!.amountInstallments ?? 0,
            installments: operationValue!.Installments,
            email: `${payCreditValues?.emailAddressClient}`,
            date: `${payCreditValues?.dateFormatted} - ${payCreditValues?.hourFormatted}`,
            operationNumber: `${payCreditValues?.operationNumber}`,
          }}
          creditPayment={creditPayments!}
          isOpen={showModal.paymentReceipt}
          closeModal={() => {
            setShowModal({...showModal, paymentReceipt: false});
            setTimeout(() => {
              clearStates();
            });
          }}
          navigation={navigation}
        />
      )}

      <AlertBasic
        isOpen={showModal.scheduleError}
        onClose={() => {}}
        title={scheduleError?.title || ''}
        body={
          <TextCustom
            color="neutral-darkest"
            lineHeight="comfy"
            variation="p4"
            weight="normal"
            align="center">
            {scheduleError?.content.map((text, i) =>
              scheduleError?.schedules?.includes(text) ? (
                <TextCustom
                  key={`errorSchedule-${i}`}
                  text={text}
                  color="neutral-darkest"
                  lineHeight="comfy"
                  variation="p4"
                  weight="bold"
                  align="center"
                />
              ) : (
                text
              ),
            )}
          </TextCustom>
        }
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button
                text="Entiendo"
                type="primary"
                onPress={() => {
                  setShowModal({...showModal, scheduleError: false});
                  setScheduleError(null);
                }}
              />
            ),
          },
        ]}
      />

    </>
  );
};
