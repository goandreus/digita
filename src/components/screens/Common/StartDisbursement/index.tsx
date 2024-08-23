import React from 'react';
import {ScrollView, StatusBar} from 'react-native';
import {COLORS} from '@theme/colors';
import {indexStyles as styles} from './styles';
import TextCustom from '@atoms/extra/TextCustom';
import {StartDisbursementProps} from '@navigations/types';
import {useStartDisbursement} from './hooks/useDisbursement';
import Button from '@atoms/extra/Button';
import AlertBasic from '@molecules/extra/AlertBasic';
import ModalIcon from '@molecules/ModalIcon';
import {Content} from './components';
import Separator from '@atoms/extra/Separator';
import StartOperationTemplate from '@templates/extra/StartOperationTemplate';
import BoxView from '@atoms/BoxView';
import {SIZES} from '@theme/metrics';
import Icon from '@atoms/Icon';

export const StartDisbursement = ({
  navigation,
  route,
}: StartDisbursementProps) => {
  const {showTokenIsActivated} = route?.params;
  const {
    accounts,
    defaultOpenPicker,
    selectedQuota,
    updatedCredit,
    setDefaultOpenPicker,
    loading,
    modalError,
    modalInfo,
    hasSavings,
    hasInsurance,
    isPreApproved,
    isDisableButton,
    originAccountUId,
    setOriginAccountUId,
    updateSelectedQuota,
    goHome,
    goConfirmation,
  } = useStartDisbursement({
    navigation,
    route,
  });

  const pickerValues = {
    open: defaultOpenPicker,
    value: originAccountUId,
    onChange: () => setDefaultOpenPicker(false),
  };

  const updateAmountBody = (
    <>
      <TextCustom
        text="Cuota mensual"
        color="neutral-darkest"
        lineHeight="tight"
        variation="h5"
        weight="normal"
        align="center"
      />
      <Separator type="xx-small" />
      <TextCustom
        text={updatedCredit?.sPaymentMonth}
        color="primary-dark"
        variation="h1"
        weight="normal"
        lineHeight="tight"
        align="center"
      />
      <TextCustom
        text={`TEA: ${updatedCredit?.stea} `}
        color="neutral-darkest"
        variation="h5"
        weight="normal"
        lineHeight="tight"
        align="center"
      />
      <Separator type="small" />
      <TextCustom
        text={
          hasInsurance
            ? 'La cuota mensual y el monto del Seguro Protección pueden variar al modificar el dia de pago o el dia en que desembolsas.'
            : 'La cuota mensual puede variar al modificar el dia de pago o el dia en que desembolsas tu crédito solicitado.'
        }
        color="neutral-darkest"
        variation="p4"
        weight="normal"
        lineHeight="comfy"
        align="center"
      />
    </>
  );

  return (
    <>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor={COLORS.Primary.Medium}
      />
      <StartOperationTemplate
        canGoBack={navigation.canGoBack()}
        goBack={goHome}
        footer={
          <Button
            containerStyle={styles.containerBtn}
            onPress={goConfirmation}
            loading={loading}
            orientation="horizontal"
            type="secondary"
            text={'Iniciar desembolso'}
            disabled={isDisableButton}
          />
        }>
        <Content
          hasSavings={hasSavings}
          isPreApproved={isPreApproved}
          actions={
            <>
              <Content.Quotas
                selectedQuota={selectedQuota}
                updateSelectedQuota={updateSelectedQuota}
              />
              {hasSavings && (
                <Content.Accounts
                  accounts={accounts}
                  setOriginAccountUId={setOriginAccountUId}
                  defaultPicker={pickerValues}
                />
              )}
            </>
          }
        />
      </StartOperationTemplate>

      {/* Modals */}
      <ModalIcon
        type="SUCCESS"
        message="Token Digital activado"
        open={showTokenIsActivated}
        onRequestClose={() => {}}
        actions={
          <>
            <Button
              onPress={() => {
                navigation.setParams({
                  showTokenIsActivated: false,
                });
              }}
              orientation="horizontal"
              type="primary"
              text="Aceptar"
            />
          </>
        }
      />

      <AlertBasic
        statusBarTranslucent
        isOpen={modalError.show}
        onClose={() => {}}
        title={modalError.title}
        body={
          <>
            <TextCustom
              color="neutral-darkest"
              lineHeight="comfy"
              variation="p4"
              weight="normal"
              align="center">
              {modalError.content.map((text, i) =>
                modalError.underlined?.includes(text) ? (
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
            {modalError.errors && (
              <ScrollView
                style={{marginTop: SIZES.LG, maxHeight: 144}}
                bounces={false}>
                <BoxView alignSelf="center">
                  {modalError.errors.map((error, i) =>
                    error.trim() !== '' ? (
                      <BoxView
                        key={`modalError-${i}`}
                        direction="row"
                        align="center">
                        <Icon
                          name="warning-circle"
                          size={14}
                          style={{marginRight: SIZES.XS}}
                        />
                        <TextCustom
                          text={error}
                          color="neutral-darkest"
                          lineHeight="comfy"
                          variation="p4"
                          weight="normal"
                        />
                      </BoxView>
                    ) : null,
                  )}
                </BoxView>
              </ScrollView>
            )}
          </>
        }
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button
                text={modalError.btnText}
                type="primary"
                onPress={() => modalError.onClose()}
              />
            ),
          },
        ]}
      />

      <AlertBasic
        statusBarTranslucent
        isOpen={modalInfo.show}
        onClose={() => {
          modalInfo.onPressBtn2;
        }}
        title={modalInfo.title}
        body={
          modalInfo.body === 'OpenAccount' ? (
            <TextCustom
              text={
                'Tu cuenta de ahorros es mancomunada. \n Para obtener tu crédito abre una nueva \n cuenta dónde solo tú seas el titular.'
              }
              color="neutral-darkest"
              lineHeight="comfy"
              variation="p4"
              weight="normal"
              align="center"
            />
          ) : (
            updateAmountBody
          )
        }
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button
                text={modalInfo.btnText1}
                type="primary"
                onPress={() => modalInfo.onPressBtn1()}
              />
            ),
          },
          {
            id: 'button2',
            render: (
              <Button
                text={modalInfo.btnText2}
                type="primary-inverted"
                haveBorder
                onPress={() => modalInfo.onPressBtn2()}
              />
            ),
          },
        ]}
      />
    </>
  );
};
