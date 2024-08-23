import React from 'react';
import {indexStyles as styles} from './styles';
import TransfersTemplate from '@templates/extra/TransfersTemplate';
import Button from '@atoms/extra/Button';
import {FirstStep, SecondStep, SuccessModalGroupCredit} from './components';
import {
  GroupCreditContractProvider,
  useGroupCreditContractContext,
} from './context';
import {useGroupCreditContract} from './hook';
import ConfirmLoadingFishes from '@molecules/LoadingLong';
import {GroupCreditContractScreenProps} from '@navigations/types';
import AlertBasic from '@molecules/extra/AlertBasic';
import TextCustom from '@atoms/extra/TextCustom';

export const GroupCreditContractContent = ({
  navigation,
  route,
}: GroupCreditContractScreenProps) => {
  const {step, modalError, hasInsurance, terms} =
    useGroupCreditContractContext();
  const {loadingFishes, goBack, handleSubmit} = useGroupCreditContract();

  const subtitle =
    step <= 0 ? 'Detalle del grupo' : 'Confirmación de contratación';
  const btnTitle = step <= 0 ? 'Continuar' : 'Contratar crédito';
  const disabled =
    step <= 0
      ? false
      : hasInsurance
      ? !terms.degravamen || !terms.insurance
      : !terms.degravamen;

  return (
    <>
      {loadingFishes ? (
        <ConfirmLoadingFishes
          text1="Espera un momento por favor..."
          text2="Espera un momento por favor..."
        />
      ) : (
        <TransfersTemplate
          headerTitle={'Contrata tu Crédito Grupal'}
          title={subtitle}
          goBack={goBack}
          stepsProps={{current: step, max: 2}}
          canGoBack={true}
          barColor="transparent"
          footer={
            <Button
              containerStyle={styles.containerBtn}
              onPress={handleSubmit}
              loading={false}
              orientation="horizontal"
              type="primary"
              text={btnTitle}
              disabled={disabled}
            />
          }>
          {step <= 0 ? <FirstStep /> : <SecondStep />}
        </TransfersTemplate>
      )}
      <SuccessModalGroupCredit />

      <AlertBasic
        statusBarTranslucent
        isOpen={modalError.show}
        onClose={() => {}}
        title={modalError.title}
        body={
          <TextCustom
            color="neutral-darkest"
            lineHeight="comfy"
            variation="p4"
            weight="normal"
            text={modalError.content}
            align="center"
          />
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

export const GroupCreditContract = ({
  navigation,
  route,
}: GroupCreditContractScreenProps) => {
  return (
    <GroupCreditContractProvider>
      <GroupCreditContractContent route={route} navigation={navigation} />
    </GroupCreditContractProvider>
  );
};
