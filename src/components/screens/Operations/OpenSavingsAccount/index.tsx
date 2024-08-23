/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ScrollView, StatusBar, View} from 'react-native';
import {OpenSavingsAccountScreenProps} from '@navigations/types';
import BoxView from '@atoms/BoxView';
import {
  FirstStep,
  SecondStep,
  SuccessOpenSavingsAccount,
  ThirdStep,
} from './components';
import Button from '@atoms/extra/Button';
import {useSavingsAccount} from './hooks/useSavingsAccount';
import {HeaderStack} from '@molecules/extra/HeaderStack';
import AlertBasic from '@molecules/extra/AlertBasic';
import LoadingLong from '@molecules/LoadingLong';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {styles} from './styles';

export const OpenSavingsAccount = ({
  navigation,
}: OpenSavingsAccountScreenProps) => {
  const {
    loading,
    step,
    accountType,
    term1,
    term2,
    departments,
    provinces,
    selectedDepartment,
    selectedProvince,
    recommendationCode,
    rCodeValidation,
    loadingButton,
    tokenModalAffiliation,
    tokenModalOpening,
    formatedTimeToken,
    disable,
    disableITem,
    showMainAlert,
    successModal,
    goBack,
    handleChooseAccount,
    handleTerm1,
    handleTerm2,
    selectDepartment,
    selectProvince,
    handleRCode,
    handleContinue,
    handleOpenAccount,
    loadingActionButton1,
    loadingActionButton2,
    closeSuccessModal,
  } = useSavingsAccount();

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
        <>
          <StatusBar
            translucent={true}
            barStyle="default"
            backgroundColor="white"
          />

          <BoxView
            flex={1}
            style={{
              backgroundColor: COLORS.Background.Lightest,
            }}>
            <View style={styles.headerBorder}>
              <HeaderStack
                canGoBack={true}
                onBack={goBack}
                title={
                  step === 0
                    ? 'Cuentas de Ahorros'
                    : step === 1
                    ? 'Conoce más'
                    : 'Abre tu cuenta'
                }
              />
            </View>
            <BoxView flex={1}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  marginBottom: 40,
                  paddingHorizontal: step !== 1 ? SIZES.LG : undefined,
                }}>
                {step <= 0 ? (
                  <FirstStep
                    disableITem={disableITem}
                    handleChooseAccount={handleChooseAccount}
                  />
                ) : step === 1 ? (
                  <SecondStep type={accountType} />
                ) : (
                  <ThirdStep
                    accountType={accountType}
                    departments={departments}
                    provinces={provinces}
                    selectedDepartment={selectedDepartment}
                    selectedProvince={selectedProvince}
                    rCode={recommendationCode}
                    rCodeValidation={rCodeValidation}
                    term1={term1}
                    term2={term2}
                    goTermsAndConditions={goTermsAndConditions}
                    selectDepartment={selectDepartment}
                    selectProvince={selectProvince}
                    handleRCode={handleRCode}
                    handleTerm1={handleTerm1}
                    handleTerm2={handleTerm2}
                  />
                )}
              </ScrollView>
            </BoxView>
            {step > 0 ? (
              <BoxView style={styles.containerBtn}>
                <Button
                  containerStyle={styles.styleBtn}
                  onPress={step === 1 ? handleContinue : handleOpenAccount}
                  loading={loadingButton}
                  orientation="horizontal"
                  type="primary"
                  text={step <= 1 ? 'Continuar' : 'Abrir cuenta'}
                  disabled={disable}
                />
              </BoxView>
            ) : null}
          </BoxView>
        </>
      )}

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

      <SuccessOpenSavingsAccount
        isOpen={successModal.isOpen}
        data={successModal.data}
        closeSuccessModal={closeSuccessModal}
        loadingActionButton1={loadingActionButton1}
        loadingActionButton2={loadingActionButton2}
      />

      <AlertBasic
        isOpen={formatedTimeToken !== null && tokenModalOpening}
        onClose={() => {}}
        title={`Continúa con tu operación\nen 00:${formatedTimeToken || '00'}`}
        description="En unos segundos podrás continuar con el desembolso en curso. ¡No cierres la app!"
        actions={() => []}
      />

      <AlertBasic
        isOpen={formatedTimeToken !== null && tokenModalAffiliation}
        onClose={() => {}}
        title={`Continúa con tu operación\nen 00:${formatedTimeToken || '00'}`}
        description="En unos segundos podrás continuar con tu operación en curso. ¡No cierres la app!"
        actions={() => []}
      />
    </>
  );
};
