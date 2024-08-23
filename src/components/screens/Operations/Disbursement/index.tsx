import React, {ReactNode} from 'react';
import DisbursementTemplate from '@templates/extra/DisbursementTemplate';
import {DisbursementProps} from '@navigations/types';
import Button from '@atoms/extra/Button';
import {indexStyles as styles} from './styles';
import {SecondStep, FirstStep, SuccessDisbursementModal} from './components';
import {useDisbursement} from './hook';
import AlertBasic from '@molecules/extra/AlertBasic';
import TransfersTemplate from '@templates/extra/TransfersTemplate';
import {useCreditAdvice} from '@hooks/common/useCreditAdvice';
import LoadingLong from '@molecules/LoadingLong';
import TextCustom from '@atoms/extra/TextCustom';
import {ScrollView} from 'react-native';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';
import {useUserInfo} from '@hooks/common';

interface TemplateProps {
  hasSavings: boolean;
  children?: ReactNode;
  headerTitle: string;
  title: string;
  step: number;
  footer: ReactNode;
  canGoBack: boolean;
  goBack: () => void;
}

const Template = ({
  hasSavings,
  canGoBack,
  headerTitle,
  title,
  step,
  children,
  footer,
  goBack,
}: TemplateProps) => {
  return hasSavings ? (
    <DisbursementTemplate
      headerTitle={headerTitle}
      title={title}
      goBack={goBack}
      canGoBack={canGoBack}
      footer={footer}>
      {children}
    </DisbursementTemplate>
  ) : (
    <TransfersTemplate
      headerTitle={headerTitle}
      title={title}
      goBack={goBack}
      stepsProps={{current: step, max: 2}}
      canGoBack={canGoBack}
      barColor="transparent"
      extraTopSpace={false}
      footer={footer}>
      {children}
    </TransfersTemplate>
  );
};

export const Disbursement = ({navigation, route}: DisbursementProps) => {
  const {
    originAccount,
    hasSavings,
    hasInsurance,
    disburseCredit,
    hasActiveProducts,
  } = route?.params;
  const {showCreditAdvice} = useCreditAdvice();
  const {setUserCreditToDisburt} = useUserInfo();
  const {
    tokenModal,
    loading,
    step,
    terms,
    confirmToExit,
    formatedTimeToken,
    showSuccessModal,
    setShowSuccessModal,
    successData,
    modalError,
    closeConfirmToExit,
    handleSubmit,
    goBack,
  } = useDisbursement({
    hasSavings,
    hasActiveProducts,
    originAccount,
    disburseCredit,
  });

  let btnTitle;
  let title;

  if (step <= 0 && !hasSavings) {
    btnTitle = 'Abrir cuenta y continuar';
    title = 'Abre tu cuenta de ahorros';
  } else {
    btnTitle = 'Desembolsar crédito';
    title = 'Confirmación de desembolso';
  }

  const goTermsAndConditions = (
    type:
      | 'ACCOUNT_OPENING'
      | 'CREDIT_INSURANCE'
      | 'INDIVIDUAL_INSURANCE'
      | 'ECONOMIC_INSURANCE',
  ) => {
    navigation.navigate('TermsAndConditions', {
      type,
    });
  };

  const handleGoToHome = () => {
    showCreditAdvice(false);
    navigation.navigate('MainTab', {
      screen: 'Main',
      params: {
        screen: 'MainScreen',
      },
    });
    setShowSuccessModal(false);
    setUserCreditToDisburt(null);
  };

  const handleShowDisbursement = () => {
    showCreditAdvice(false);
    if (originAccount) {
      navigation.navigate('MainTab', {
        screen: 'Main',
        params: {
          screen: 'SavingDetail',
          params: {
            from: 'Disbursement',
            title: 'Ahorros',
            accountName: originAccount?.productName,
            accountNumber: originAccount?.accountCode,
            cci: originAccount?.accountCci,
            currency: originAccount?.currency,
            operationId: originAccount?.operationUId,
            productType: originAccount?.productType,
            sAvailableBalance: originAccount?.sBalance,
          },
        },
      });
      setShowSuccessModal(false);
      setUserCreditToDisburt(null);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingLong />
      ) : (
        <Template
          headerTitle="Desembolsa tu crédito"
          title={title}
          hasSavings={hasSavings}
          step={step}
          goBack={goBack}
          canGoBack={navigation.canGoBack()}
          footer={
            <Button
              containerStyle={styles.containerBtn}
              onPress={handleSubmit}
              loading={false}
              orientation="horizontal"
              type="primary"
              text={btnTitle}
              disabled={
                hasSavings
                  ? !terms.termsDegravamen ||
                    (hasInsurance && !terms.termsInsurance)
                  : step !== 1
                  ? !terms.declaration
                  : !terms.termsDegravamen ||
                    !terms.termsEntrepreneur ||
                    (hasInsurance && !terms.termsInsurance)
              }
            />
          }>
          {step <= 0 && !hasSavings ? (
            <FirstStep terms={terms} />
          ) : (
            <SecondStep
              formatedTimeToken={formatedTimeToken}
              showModal={tokenModal}
              originAccount={originAccount}
              terms={terms}
              hasSavings={hasSavings}
              disburseCredit={disburseCredit}
              goTermsAndConditions={goTermsAndConditions}
            />
          )}
        </Template>
      )}

      <SuccessDisbursementModal
        isOpen={showSuccessModal}
        goToHome={handleGoToHome}
        showDisbursement={handleShowDisbursement}>
        <SuccessDisbursementModal.Content
          data={disburseCredit}
          successData={successData}
          originAccount={originAccount}
        />
      </SuccessDisbursementModal>

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
                loading={modalError.loading}
              />
            ),
          },
        ]}
      />
    </>
  );
};
