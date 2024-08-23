import React from 'react';
import Button from '@atoms/extra/Button';
import BoxView from '@atoms/BoxView';
import TransfersTemplate from '@templates/extra/TransfersTemplate';
import LoadingLong from '@molecules/LoadingLong';
import {
  FirstStep,
  SecondStep,
  SuccessOpenEntrepreneurModal,
} from './components';
import {useEntrepreneurAccount} from './hooks/useEntrepreneurAccount';
import {OpenEntrepreneurAccountSreenProps} from '@navigations/types';
import AlertBasic from '@molecules/extra/AlertBasic';
import {styles} from './styles';

export const OpenEntrepreneurAccount = ({
  navigation,
}: OpenEntrepreneurAccountSreenProps) => {
  const {
    goBack,
    loading,
    step,
    departments,
    provinces,
    selectedDepartment,
    selectedProvince,
    term1,
    term2,
    disable,
    successModal,
    showMainAlert,
    loadingButton,
    loadingActionButton1,
    loadingActionButton2,
    selectDepartment,
    selectProvince,
    handleTerm1,
    handleTerm2,
    handleContinue,
    handleOpenEntrepreneurAccount,
    closeSuccessModal,
  } = useEntrepreneurAccount();

  const goTermsAndConditions = ({
    type,
    otherType,
  }: {
    type?:
      | 'ACCOUNT_OPENING'
      | 'CREDIT_INSURANCE'
      | 'INDIVIDUAL_INSURANCE'
      | 'ECONOMIC_INSURANCE'
      | 'DATAUSE_CONSENT'
      | 'INTEROPERABILITY_CONSENT'
      | undefined;
    otherType?: string;
  }) => {
    navigation.navigate('TermsAndConditions', {type, otherType});
  };

  return (
    <>
      {loading ? (
        <LoadingLong
          text1="Espera un momento por favor ..."
          text2="Espera un momento por favor ..."
        />
      ) : (
        <TransfersTemplate
          stepsProps={{max: 2, current: step}}
          headerTitle="Apertura de cuenta"
          title="Abre tu cuenta 100% digital"
          subtitle={
            step <= 0
              ? 'Sin tener que ir a la agencia'
              : 'Y recibe dinero en tu cuenta con tu número celular'
          }
          goBack={goBack}
          canGoBack={navigation.canGoBack()}
          footer={
            <BoxView style={styles.containerBtn}>
              <Button
                containerStyle={styles.styleBtn}
                onPress={
                  step <= 0 ? handleContinue : handleOpenEntrepreneurAccount
                }
                loading={loadingButton}
                orientation="horizontal"
                type="primary"
                text={step <= 0 ? 'Continuar' : 'Abrir cuenta'}
                disabled={disable}
              />
            </BoxView>
          }>
          {step <= 0 ? (
            <FirstStep />
          ) : (
            <SecondStep
              departments={departments}
              provinces={provinces}
              selectedDepartment={selectedDepartment}
              selectedProvince={selectedProvince}
              term1={term1}
              term2={term2}
              goTermsAndConditions={goTermsAndConditions}
              selectDepartment={selectDepartment}
              selectProvince={selectProvince}
              handleTerm1={handleTerm1}
              handleTerm2={handleTerm2}
            />
          )}
        </TransfersTemplate>
      )}

      <SuccessOpenEntrepreneurModal
        isOpen={successModal.isOpen}
        data={successModal.data}
        closeSuccessModal={closeSuccessModal}
        loadingActionButton1={loadingActionButton1}
        loadingActionButton2={loadingActionButton2}
      />

      <AlertBasic
        isOpen={showMainAlert.isOpen}
        title={showMainAlert.title}
        description={showMainAlert.content}
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button
                text={showMainAlert.button}
                type="primary"
                onPress={showMainAlert.action}
              />
            ),
          },
        ]}
      />
    </>
  );
};
