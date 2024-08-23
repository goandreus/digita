import React, { useCallback, useEffect } from 'react';
import {PayWithPhoneFormSreenProps} from '@navigations/types';
import {SuccessPayWithPhoneModal} from '../../components/successModal';
import AlertBasic from '@molecules/extra/AlertBasic';
import Button from '@atoms/extra/Button';
import TextCustom from '@atoms/extra/TextCustom';
import LoadingLong from '@molecules/LoadingLong';
import TransfersTemplate from '@templates/extra/TransfersTemplate';
import {indexStyles as styles} from './styles';
import BoxView from '@atoms/BoxView';
import CurrencyInput from '@atoms/extra/CurrencyInput';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import Icon from '@atoms/Icon';
import Separator from '@atoms/extra/Separator';
import Checkbox from '@atoms/extra/Checkbox';
import {useTransaction} from './hooks/useTransaction';
import {InteropScheduleModal} from '@molecules/extra/InteropScheduleModal';
import recentContacts from '@features/recentContacts';
import {getUserSavings} from '@services/User';
import {useUserInfo} from '@hooks/common';

export const PayWithPhoneForm = ({
  navigation,
  route,
}: PayWithPhoneFormSreenProps) => {
  const {params} = route;
  const {data, destinationData, executeSuccess} = params;
  const {
    maxAmoutModal,
    successModal,
    isBtnDisabled,
    formData,
    loading,
    showScheduleModal,
    formatedTimeToken,
    tokenModal,
    handleGoToTransfer,
    closeMaxAmountModal,
    setShowScheduleModal,
    handlePayWithPhone,
    setSuccessModal
  } = useTransaction({params});
  const {isOpen, title, content, button, button2} = maxAmoutModal;
  const {values, onSetField, originAccount} = formData;
  const {setUserSavings} = useUserInfo();
  const formatedPhoneNumber =
    destinationData &&
    destinationData?.destinationCellPhone
      .toString()
      .replace(/(\d{3})(?=\d)/g, '$1 ');

  const updateUserSavings = useCallback(async () => {
    await getUserSavings().then(res => setUserSavings(res)); 
  }, [setUserSavings]);
  
  const handleGoToHome = () => {
    updateUserSavings()
    navigation.navigate('MainTab', {
      screen: 'Main',
    });
  };

  useEffect(() => {
    if (executeSuccess === undefined) return;
    if(executeSuccess.isOpen){
      typeof executeSuccess.contactSelected === 'string'
            ? recentContacts.add(executeSuccess.payloadRecentContacts)
            : recentContacts.add(executeSuccess.contactSelected);
      setSuccessModal({
        isOpen: true,
        ...executeSuccess.payloadModal
      });
    }
  }, [executeSuccess]);

  return (
    <>
      {/* Modals */}
      <SuccessPayWithPhoneModal
        isOpen={successModal.isOpen}
        goToHome={handleGoToHome}>
        <SuccessPayWithPhoneModal.Content successData={{...successModal}} />
      </SuccessPayWithPhoneModal>

      <AlertBasic
        statusBarTranslucent
        isOpen={isOpen}
        onClose={() => {}}
        title={title}
        body={
          content?.map((text, i) => (
            !text.startsWith("§") ? 
              <TextCustom
                key={`${text}${i}`}
                color="neutral-darkest"
                align="center"
                lineHeight="comfy"
                variation="p4"
                text={text}/> : 
              <TextCustom
                key={`${text}${i}`}
                variation="p4"
                align="center"
                lineHeight="comfy"
                color="neutral-darkest"
                weight="bold"
                text={text.slice(1)}/>
          ))
        }
        actions={() => {
          let actionsArray = [
            {
              id: 'button1',
              render: (
                <Button
                  text={button}
                  type="primary"
                  onPress={closeMaxAmountModal}
                />
              ),
            },
          ]
          button2 && actionsArray.push(
            {
              id: 'button2',
              render: (
                <Button
                  text={button2}
                  type="primary-inverted"
                  haveBorder={true}
                  onPress={handleGoToTransfer}
                />
              ),
            },
          )
          return actionsArray
        }}
      />

      {loading ? (
        <LoadingLong
          text1="Espera un momento por favor ..."
          text2="Espera un momento por favor ..."
        />
      ) : (
        <>
          <TransfersTemplate
            headerTitle="Paga con tu celular"
            title="¿A quién pagarás?"
            stepLabel="Al instante"
            topDisclaimer={{
              text: 'Máximo S/ 500 por operación y hasta S/ 5,000 diarios.',
              icon: 'exclamation-triangle',
              background: 'warning-lightest',
            }}
            goBack={() => navigation.pop()}
            canGoBack={navigation.canGoBack()}
            footer={
              <Button
                containerStyle={styles.containerBtn}
                onPress={handlePayWithPhone}
                loading={loading}
                orientation="horizontal"
                type="primary"
                text={'Pagar'}
                disabled={isBtnDisabled}
              />
            }>
            <BoxView>
              <TextCustom
                text={data?.beneficiaryFullName ?? ''}
                color="neutral-darkest"
                variation="h2"
                weight="normal"
                lineHeight="fair"
              />
              <TextCustom
                text={`${destinationData?.destinationName}: ${formatedPhoneNumber}`}
                color="neutral-darkest"
                variation="h5"
                weight="normal"
                lineHeight="fair"
              />
            </BoxView>
            <CurrencyInput
              align="left"
              alignErrorText="left"
              design="tight"
              newErrorText={true}
              amountValue={values.amount}
              integerDigitsAmount={3}
              currency={'S/'}
              initialValue={originAccount?.balance!}
              editable={true}
              maxAmountSolesText={'500.00'}
              maxAmountSolesNumber={500}
              onChangeValue={value => onSetField('amount', value)}
              onChangeText={text => onSetField('formatAmount', text)}
            />
            <Separator type="large" />
            <BoxView
              direction="row"
              align="center"
              background="informative-lightest"
              p={SIZES.MD}
              style={styles.containerInfo}>
              <Icon
                name="protected"
                size="small"
                fill={COLORS.Informative.Medium}
              />
              <TextCustom
                style={styles.text}
                color="informative-dark"
                variation="h6"
                lineHeight="fair"
                weight="normal"
                text={'Esta operación se validará con tu Token Digital'}
              />
            </BoxView>
            <Separator type="large" />
            <BoxView direction="row" align="center">
              <BoxView ml={SIZES.XS}>
                <TextCustom
                  weight="normal"
                  variation="h5"
                  color="neutral-darkest"
                  lineHeight="tight">
                  Conoce los{' '}
                  <TextCustom
                    decoration="underline"
                    weight="normal"
                    variation="h5"
                    color="primary-dark"
                    lineHeight="tight"
                    onPress={() => {
                      navigation.navigate('TermsAndConditions', {
                        type: 'INTEROPERABILITY_CONSENT',
                      });
                    }}>
                    Términos y Condiciones
                  </TextCustom>{' '}
                  de uso aquí.
                </TextCustom>
              </BoxView>
            </BoxView>
          </TransfersTemplate>

          {showScheduleModal ? (
            <InteropScheduleModal
              showScheduleModal={showScheduleModal}
              closeScheduleModal={() => {
                setShowScheduleModal(false);
                navigation.navigate('MainScreen');
              }}
            />
          ) : null}
        </>
      )}

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
