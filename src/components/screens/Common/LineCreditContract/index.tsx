import React from 'react';
import {useLineCreditContract} from './hook';
import ConfirmLoadingFishes from '@molecules/LoadingLong';
import {MainContent, SuccessLineContract} from './components';
import {indexStyles as styles} from './styles';
import Button from '@atoms/extra/Button';
import {
  LineCreditContractProvider,
  useLineCreditContractContext,
} from './context';
import {LineCreditContractScreenProps} from '@navigations/types';
import ModalIcon from '@molecules/ModalIcon';
import LineCreditTemplate from '@templates/extra/LineCreditTemplate';
import {useUserInfo} from '@hooks/common';
import AlertBasic from '@molecules/extra/AlertBasic';
import TextCustom from '@atoms/extra/TextCustom';
import {ScrollView} from 'react-native';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';

const LineCreditContractContent = ({
  navigation,
  route,
}: LineCreditContractScreenProps) => {
  const {terms} = useLineCreditContractContext();
  const {userCreditToDisburt} = useUserInfo();
  const {
    loading,
    loadingFishes,
    formatedTimeToken,
    tokenModal,
    modalError,
    handleSubmit,
    goBack,
  } = useLineCreditContract();
  const {showTokenIsActivated} = route?.params;

  return (
    <>
      {loadingFishes ? (
        <ConfirmLoadingFishes
          text1="Creando tu Línea de Crédito..."
          text2="Creando tu Línea de Crédito..."
        />
      ) : (
        <LineCreditTemplate
          amount={userCreditToDisburt?.sCreditFormat1}
          canGoBack={navigation.canGoBack()}
          goBack={goBack}
          footer={
            <Button
              containerStyle={styles.containerBtn}
              onPress={handleSubmit}
              loading={loading}
              orientation="horizontal"
              type="primary"
              text="Crear mi Línea"
              disabled={!terms && !loading}
            />
          }>
          <MainContent />
        </LineCreditTemplate>
      )}
      <SuccessLineContract />

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

      {/* TokenExpiration Modal */}
      <AlertBasic
        statusBarTranslucent
        isOpen={formatedTimeToken !== null && tokenModal}
        onClose={() => {}}
        title={`Continua en 00:${formatedTimeToken || '00'}`}
        description={
          'En unos segundos podrás continuar con la creación de tu Línea de Crédito en curso.\n¡No cierres la app!'
        }
        actions={() => []}
      />

      {/* Error Modal */}

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
    </>
  );
};

export const LineCreditContract = ({
  navigation,
  route,
}: LineCreditContractScreenProps) => {
  return (
    <LineCreditContractProvider>
      <LineCreditContractContent route={route} navigation={navigation} />
    </LineCreditContractProvider>
  );
};
