import React from 'react';
import {OtherBanksScreenProps} from '@navigations/types';
import TransfersTemplate from '@templates/extra/TransfersTemplate';
import Button from '@atoms/extra/Button';
import AlertBasic from '@molecules/extra/AlertBasic';
import ConfirmLoadingFishes from '@molecules/LoadingFishes';
import {indexStyles as styles} from './styles';
import {OtherAccountsProvider, useOtherAccountsContext} from './contexts';
import {
  ConfirmationCF,
  ConfirmationDeferred,
  ConfirmationInmediate,
  InitialForm,
  SuccessTransferCF,
  SuccessTransferDeferred,
  SuccessTransferInmediate,
} from './components';
import {useOtherAccounts} from './hooks';
import {COLORS} from '@theme/colors';
import Input from '@atoms/extra/Input';
import FavoriteModal from '@molecules/extra/FavoriteModal';

const OtherAccountsContent = ({route, navigation}: OtherBanksScreenProps) => {
  const {
    confirmToExit,
    formatedTimeToken,
    isBtnDisabled,
    errorModalBtnTitle,
    loadingInitialForm,
    displayErrorModal,
    isBtnFavoriteDisable,
    onCloseErrorModal,
    closeConfirmToExit,
    goBack,
    handleSubmit,
    handleSaveFavorite,
  } = useOtherAccounts({
    route,
    navigation,
  });

  const {
    step,
    transferType,
    tokenModal,
    loadingFishes,
    successModal,
    createFavorite,
    favoriteModalUtils,
  } = useOtherAccountsContext();

  const {form, clear: clearNameFavorite} = createFavorite;

  let title;
  let btnTitle;
  let loading;

  if (step <= 0) {
    title = 'Transfiere dinero';
    btnTitle = 'Siguiente';
    loading = loadingInitialForm;
  } else {
    title = 'Confirma la transferencia';
    btnTitle = 'Transferir dinero';
    loading = loadingInitialForm;
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
          headerTitle="A otras cuentas"
          title={title}
          goBack={goBack}
          stepsProps={{current: step, max: 2}}
          canGoBack={navigation.canGoBack()}
          barColor={barColor}
          hasDisclaimer
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
            <InitialForm />
          ) : (
            (() => {
              switch (transferType) {
                case 'CF':
                  return <ConfirmationCF />;
                case 'Inmediate-CCI':
                  return <ConfirmationInmediate />;
                case 'Deferred-CCI':
                  return <ConfirmationDeferred />;
              }
            })()
          )}

          {/* FavoriteAdd Modal */}
          <FavoriteModal
            isOpen={favoriteModalUtils.isOpen}
            closeOnTouchBackdrop
            onClose={() => {
              clearNameFavorite();
              favoriteModalUtils.onClose();
            }}
            title="Ponle un nombre a tu operación favorita y guárdala"
            description="Al guardar esta operación como favorita, ya no te pediremos la cuenta de destino."
            body={
              <Input
                maxLength={14}
                placeholder="Ingrese un nombre"
                /* onFocus={handleFocus} */
                {...form.inputProps('favoriteName')}
              />
            }
            actions={() => [
              {
                id: 'button1',
                render: (
                  <Button
                    text={'Guardar'}
                    type="primary"
                    disabled={!isBtnFavoriteDisable}
                    onPress={() => {
                      handleSaveFavorite();
                      favoriteModalUtils.onClose();
                      clearNameFavorite();
                    }}
                  />
                ),
              },
            ]}
          />
        </TransfersTemplate>
      )}

      {/* BackPressHandler Modal */}
      <AlertBasic
        isOpen={confirmToExit.isOpen}
        onClose={closeConfirmToExit}
        title="¿Seguro que deseas retroceder?"
        description="Recuerda, si retrocedes perderás toda la información ingresada."
        actions={utils => [
          {
            id: 'button1',
            render: (
              <Button
                text="Quedarme aquí"
                type="primary"
                onPress={() => utils.close()}
              />
            ),
          },
          {
            id: 'button2',
            render: (
              <Button
                text="Retroceder"
                type="primary-inverted"
                haveBorder={true}
                onPress={() => {
                  if (confirmToExit.isOpen === true) {
                    confirmToExit.onAccept();
                  } else {
                    utils.close();
                  }
                }}
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
        description="En unos segundos podrás continuar con tu operación en curso. ¡No cierres la app!"
        actions={() => []}
      />

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
                text={errorModalBtnTitle}
                type="primary"
                onPress={() => onCloseErrorModal()}
              />
            ),
          },
        ]}
      />

      {/* SuccessModal */}
      {(() => {
        switch (transferType) {
          case 'CF':
            return <SuccessTransferCF />;
          case 'Inmediate-CCI':
            return <SuccessTransferInmediate />;
          case 'Deferred-CCI':
            return <SuccessTransferDeferred />;
        }
      })()}
    </>
  );
};

export const OtherAccounts = ({route, navigation}: OtherBanksScreenProps) => {
  let transferValuesDefault;
  if (
    route?.params?.type === 'TRANSFERENCY_LOCAL' ||
    route?.params?.type === 'TRANSFERENCY_OTHERS'
  ) {
    transferValuesDefault = {
      ...route.params,
    };
  }

  const isFavoriteOperation = (route.params as any).isFavoriteOperation;
  const favorite = (route.params as any).favorite;

  return (
    <OtherAccountsProvider
      params={transferValuesDefault}
      isFavoriteOperation={isFavoriteOperation}
      favorite={favorite}>
      <OtherAccountsContent route={route} navigation={navigation} />
    </OtherAccountsProvider>
  );
};
