import React, { useState } from 'react';
import TransfersTemplate from '@templates/extra/TransfersTemplate';
import Button from '@atoms/extra/Button';
import {indexStyles as styles} from './styles';
import {OwnAccountsScreenProps} from '@navigations/types';
import {COLORS} from '@theme/colors';
import {useOwnAccounts} from './hooks/useOwnAccounts';
import {FirstStep, SecondStep, SuccessTransferModal} from './components';
import ConfirmLoadingFishes from '@molecules/LoadingFishes';
import AlertBasic from '@molecules/extra/AlertBasic';
import {useLoading} from '@hooks/common';

export const OwnAccounts = ({navigation}: OwnAccountsScreenProps) => {
  const {
    loading,
    loadingFishes,
    step,
    isBtnDisabled,
    formData,
    successModal,
    formatedTimeToken,
    tokenModal,
    onCloseSuccessModal,
    goBack,
    handleSubmit,
    handleGoToHome,
  } = useOwnAccounts();

  const {displayErrorModal, setDisplayErrorModal} = useLoading();

  let title;
  let btnTitle;

  if (step <= 0) {
    title = 'Transfiere dinero';
    btnTitle = 'Siguiente';
  } else {
    title = 'Confirma la transferencia';
    btnTitle = 'Transferir dinero';
  }

  const barColor = successModal.isOpen
    ? COLORS.Primary.Medium
    : COLORS.Background.Lightest;

  return (
    <>
      {loadingFishes ? (
        <ConfirmLoadingFishes />
      ) : (
        <TransfersTemplate
          hasScrollButton={step === 1}
          headerTitle="A cuentas propias"
          title={title}
          goBack={goBack}
          stepsProps={{current: step, max: 2}}
          canGoBack={navigation.canGoBack()}
          barColor={barColor}
          footer={
            <Button
              containerStyle={styles.containerBtn}
              onPress={handleSubmit}
              loading={loading}
              orientation="horizontal"
              type="primary"
              text={btnTitle}
              disabled={isBtnDisabled}
            />
          }>
          {step <= 0 ? (
            <FirstStep data={formData} />
          ) : (
            <SecondStep data={formData} />
          )}
        </TransfersTemplate>
      )}

      {/* SuccessModal */}
      <SuccessTransferModal
        isOpen={successModal.isOpen}
        onCloseModal={onCloseSuccessModal}
        handleGoToHome={handleGoToHome}>
        <SuccessTransferModal.Content
          formData={formData}
          successModal={successModal}
        />
      </SuccessTransferModal>

      {/* ErrorModal */}
      <AlertBasic
        isOpen={displayErrorModal.isOpen}
        onClose={() => {}}
        title={displayErrorModal.message.title}
        description={displayErrorModal.message.content}
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button
                text={'Entiendo'}
                type="primary"
                onPress={() =>
                  setDisplayErrorModal({
                    isOpen: false,
                    errorCode: '',
                    message: displayErrorModal.message,
                  })
                }
              />
            ),
          },
        ]}
      />

      {/* TokenExpiration Modal */}
      <AlertBasic
        isOpen={formatedTimeToken !== null && tokenModal}
        onClose={() => {}}
        title={`Continúa con tu operación\nen 00:${formatedTimeToken || '00'}`}
        description="En unos segundos podrás continuar con la operación en curso. ¡No cierres la app!"
        actions={() => []}
      />
    </>
  );
};
