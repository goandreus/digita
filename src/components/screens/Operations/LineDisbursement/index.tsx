import React, {ReactNode} from 'react';
import DisbursementTemplate from '@templates/extra/DisbursementTemplate';
import TransfersTemplate from '@templates/extra/TransfersTemplate';
import LoadingLong from '@molecules/LoadingLong';
import {useLineDisbursement} from './hooks/useLineDisbursement';
import {LineDisbursementProps} from '@navigations/types';
import Button from '@atoms/extra/Button';
import {indexStyles as styles} from './styles';
import AlertBasic from '@molecules/extra/AlertBasic';
import {
  Confirmation,
  OpenAccount,
  SuccessDisburseLineModal,
} from './components';
import {LineDisbursementProvider, useLineDisbursementContext} from './context';
import TextCustom from '@atoms/extra/TextCustom';

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

export const LineDisbursementContent = ({
  navigation,
  route,
}: LineDisbursementProps) => {
  const {hasSavings} = route?.params;

  const {step, modalError} = useLineDisbursementContext();
  const {
    loadingFishes,
    confirmToExit,
    goBack,
    closeConfirmToExit,
    handleSubmit,
    isDisabled,
  } = useLineDisbursement({hasSavings});

  let btnTitle;
  let title;
  if (step <= 0 && !hasSavings) {
    btnTitle = 'Abrir cuenta y continuar';
    title = 'Abre tu cuenta de ahorros';
  } else {
    btnTitle = 'Desembolsar de mi Línea';
    title = 'Confirma tu desembolso';
  }

  return (
    <>
      {loadingFishes ? (
        <LoadingLong
          text1="Desembolsando a tu cuenta de ahorros..."
          text2="Desembolsando a tu cuenta de ahorros..."
        />
      ) : (
        <Template
          headerTitle="Desembolsa de tu Línea"
          title={title}
          step={step}
          hasSavings={hasSavings}
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
              disabled={isDisabled}
            />
          }>
          {step <= 0 && !hasSavings ? (
            <OpenAccount />
          ) : (
            <Confirmation params={route.params} />
          )}
        </Template>
      )}

      <SuccessDisburseLineModal />

      <AlertBasic
        statusBarTranslucent
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

export const LineDisbursement = ({
  navigation,
  route,
}: LineDisbursementProps) => {
  return (
    <LineDisbursementProvider>
      <LineDisbursementContent route={route} navigation={navigation} />
    </LineDisbursementProvider>
  );
};
