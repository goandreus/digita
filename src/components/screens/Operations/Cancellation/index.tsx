import React from 'react';
import {useCancellation} from './hook';
import ConfirmLoadingFishes from '@molecules/LoadingLong';
import DisbursementTemplate from '@templates/extra/DisbursementTemplate';
import {CancellationScreenProps} from '@navigations/types';
import Button from '@atoms/extra/Button';
import {indexStyles as styles} from './styles';
import {RequestStep, SuccessModal} from './components';
import AlertBasic from '@molecules/extra/AlertBasic';

export const Cancellation = ({navigation}: CancellationScreenProps) => {
  const {
    loading,
    showSuccessModal,
    accounts,
    cancellationData,
    confirmToContinue,
    onPressContinue,
    closeConfirmToContinue,
    setOriginAccountUId,
    handleGoHome,
    originAccount,
  } = useCancellation();

  return (
    <>
      {loading ? (
        <ConfirmLoadingFishes
          text1="Espera un momento por favor..."
          text2="Espera un momento por favor..."
        />
      ) : (
        <DisbursementTemplate
          headerTitle={'Solicitud de anulación'}
          goBack={() => navigation.goBack()}
          canGoBack={navigation.canGoBack()}
          footer={
            <Button
              containerStyle={styles.containerBtn}
              onPress={onPressContinue}
              loading={false}
              orientation="horizontal"
              type="primary"
              text="Continuar"
              disabled={false}
            />
          }>
          <RequestStep
            data={accounts}
            setOriginAccountUId={setOriginAccountUId}
          />
        </DisbursementTemplate>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        cancellationData={cancellationData}
        account={originAccount}
        goHome={handleGoHome}
      />

      <AlertBasic
        isOpen={confirmToContinue.isOpen}
        onClose={closeConfirmToContinue}
        title="¿Seguro que quieres anular tu cuenta de ahorros ?"
        description="Si continúas, se generará la solicitud y perderás los beneficios de tu cuenta Ahorro Emprendedores."
        actions={utils => [
          {
            id: 'button1',
            render: (
              <Button
                text="Quiero conservar mi cuenta"
                type="primary"
                onPress={() => utils.close()}
              />
            ),
          },
          {
            id: 'button2',
            render: (
              <Button
                text="Solicitar anulación"
                type="primary-inverted"
                haveBorder={true}
                onPress={() => {
                  if (confirmToContinue.isOpen === true) {
                    confirmToContinue.onAccept();
                  } else {
                    utils.close();
                  }
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
};
