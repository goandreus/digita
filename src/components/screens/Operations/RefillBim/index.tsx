import React from 'react';
import TransfersTemplate from '@templates/extra/TransfersTemplate';
import Button from '@atoms/extra/Button';
import {indexStyles as styles} from './styles';
import {RefillScreenProps} from '@navigations/types';
import {COLORS} from '@theme/colors';
import {useRefillBim} from './hooks/useRefillBim';
import ConfirmLoadingFishes from '@molecules/LoadingFishes';
import AlertBasic from '@molecules/extra/AlertBasic';
import {FirstStep, SecondStep, SuccessRefillBim} from './components';
import {useLoading} from '@hooks/common';

export const RefillBim = ({navigation, route}: RefillScreenProps) => {
  const {params} = route;
  const {
    step,
    loadingFishes,
    loading,
    formData,
    isBtnDisabled,
    successModal,
    goBack,
    handleGoToHome,
    onCloseSuccessModal,
    handleSubmit,
  } = useRefillBim({params});

  const {displayErrorModal, setDisplayErrorModal} = useLoading();

  let title;
  let btnTitle;

  if (step <= 0) {
    title = 'Recarga Bim';
    btnTitle = 'Siguiente';
  } else {
    title = 'Confirma la recarga Bim';
    btnTitle = 'Recargar Bim';
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
          headerTitle="Recargar BIM"
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
      <SuccessRefillBim
        isOpen={successModal.isOpen}
        onCloseModal={onCloseSuccessModal}
        handleGoToHome={handleGoToHome}>
        <SuccessRefillBim.Content
          formData={formData}
          successModal={successModal}
        />
      </SuccessRefillBim>

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
                onPress={() => {
                  setDisplayErrorModal({
                    isOpen: false,
                    errorCode: '',
                    message: displayErrorModal.message,
                  });
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
};
