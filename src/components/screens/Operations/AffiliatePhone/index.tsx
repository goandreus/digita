import React, {useState} from 'react';
import Button from '@atoms/extra/Button';
import {AffiliatePhoneScreen} from './components/affiliatePhoneScreen';
import AffiliatePhoneTemplate from '@templates/extra/AffiliatePhoneTemplate';
import {AffiliatePhoneSreenProps} from '@navigations/types';
import ModalIcon from '@molecules/ModalIcon';
import {useAffiliatePhone} from './hooks/useAffiliatePhone';
import {SuccessAffiliation} from './components/successAffiliation';
import {indexStyles as styles} from './styles';
import LoadingLong from '@molecules/LoadingLong';
import AlertBasic from '@molecules/extra/AlertBasic';
import BoxView from '@atoms/BoxView';
import {COLORS} from '@theme/colors';

export const AffiliatePhone = ({
  navigation,
  route,
}: AffiliatePhoneSreenProps) => {
  const {showTokenIsActivated, operationType} = route.params;
  const [term, setTerm] = useState(false);

  const {
    successModal,
    errorModal,
    showConfirmButton,
    loading,
    tokenModal,
    formatedTimeToken,
    formData,
    handleAffiliation,
    handleUpdateAffiliation,
    handleDisaffiliation,
    handleGoToHome,
    handleGoToPay,
    setShowConfirmButton,
    closeErrorModal,
  } = useAffiliatePhone({operationName: operationType});

  return (
    <>
      <AlertBasic
        statusBarTranslucent
        isOpen={errorModal.isOpen}
        onClose={() => {}}
        title={errorModal.title}
        description={errorModal.content}
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button
                text={errorModal.button}
                type="primary"
                onPress={closeErrorModal}
              />
            ),
          },
        ]}
      />

      <AlertBasic
        statusBarTranslucent
        isOpen={showConfirmButton}
        onClose={() => {}}
        title={'¿Seguro que quieres desafiliar\ntu cuenta de tu celular?'}
        description={
          'Si continúas, ya no podrás hacer\noperaciones en tu cuenta de ahorros\nusando solo tu número celular.'
        }
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button
                text="Cancelar"
                type="primary"
                onPress={() => setShowConfirmButton(false)}
              />
            ),
          },
          {
            id: 'button2',
            render: (
              <Button
                text="Desafiliar"
                type="primary-inverted"
                haveBorder
                onPress={handleDisaffiliation}
              />
            ),
          },
        ]}
      />

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

      {loading ? (
        <LoadingLong
          text1="Espera un momento por favor ..."
          text2="Espera un momento por favor ..."
        />
      ) : (
        <AffiliatePhoneTemplate
          headerTitle="Paga y cobra con tu celular"
          title="Afilia tu cuenta a tu celular"
          stepLabel={
            operationType === 'updateAffiliation'
              ? 'Tu configuración de'
              : 'Completa la información'
          }
          goBack={() => navigation.goBack()}
          canGoBack={navigation.canGoBack()}
          footer={
            operationType === 'updateAffiliation' ? (
              <BoxView style={styles.containerBtn}>
                <Button
                  containerStyle={styles.styleBtn}
                  onPress={handleUpdateAffiliation}
                  loading={false}
                  orientation="horizontal"
                  type="primary"
                  text={'Actualizar mi configuración'}
                />
                <Button
                  textStyle={{color: COLORS.Primary.Medium}}
                  onPress={() => setShowConfirmButton(true)}
                  loading={false}
                  orientation="horizontal"
                  type="primary-inverted"
                  haveBorder
                  text={'Desafiliar mi cuenta'}
                />
              </BoxView>
            ) : (
              <Button
                containerStyle={styles.containerBtn}
                onPress={handleAffiliation}
                loading={false}
                orientation="horizontal"
                type="primary"
                text={'Afiliar mi cuenta'}
                disabled={!term}
              />
            )
          }>
          <AffiliatePhoneScreen
            operationType={operationType}
            term={term}
            setTerm={setTerm}
            formData={formData}
            action={operationType}
            goToTermsConditions={() =>
              navigation.navigate('TermsAndConditions', {
                type: 'INTEROPERABILITY_CONSENT',
              })
            }
          />
        </AffiliatePhoneTemplate>
      )}

      {/* SuccessModal */}
      <SuccessAffiliation
        isOpen={successModal.isOpen}
        operationType={operationType}
        goToHome={handleGoToHome}
        goToPay={handleGoToPay}>
        <SuccessAffiliation.Content
          operationType={operationType}
          formData={formData}
          successData={{...successModal}}
        />
      </SuccessAffiliation>

      <AlertBasic
        isOpen={formatedTimeToken !== null && tokenModal}
        onClose={() => {}}
        title={`Continúa con tu operación\nen 00:${formatedTimeToken || '00'}`}
        description="En unos segundos podrás continuar con tu operación en curso. ¡No cierres la app!"
        actions={() => []}
      />
    </>
  );
};
