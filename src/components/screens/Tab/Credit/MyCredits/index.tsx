import React, {useMemo} from 'react';
import DisbursementTemplate from '@templates/extra/DisbursementTemplate';
import {
  EmptyContent,
  MainContent,
  LoadingContent,
  InfoModal,
  LineCreditCard,
} from './components';
import {useMyCredits} from './hook';
import {MyCreditsScreenProps} from '@navigations/types';
import {AdvicesList} from './components';
import {useCreditAdvice, useUserInfo} from '@hooks/common';
import {CreditAdviceType} from '@interface/CreditAdvice';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import ModalIcon from '@molecules/ModalIcon';
import Button from '@atoms/extra/Button';
import AlertBasic from '@molecules/extra/AlertBasic';

export const MyCredits = ({navigation, route}: MyCreditsScreenProps) => {
  const {
    hasCredits,
    loading,
    loadingButton,
    modalError,
    showInfo,
    setShowInfo,
    goDisbursment,
  } = useMyCredits({route});
  const {userLineCredit} = useUserInfo();
  const {creditAdvice} = useCreditAdvice();

  const crediTypes = useMemo(() => {
    let credits: CreditAdviceType[] = [];
    for (const prop in creditAdvice.banners) {
      if (creditAdvice.banners[prop as CreditAdviceType] === true) {
        credits.push(prop as CreditAdviceType);
      }
    }
    return credits.sort((a, b) => {
      if (a === 'CG') return -1;
      if (b === 'CG') return 1;
      else return 0;
    });
  }, [creditAdvice.banners]);

  const totalextraHeight =
    crediTypes.length !== 0 ? 68 * crediTypes.length : undefined;

  return (
    <>
      <DisbursementTemplate
        headerTitle="Mis créditos"
        canGoBack={navigation.canGoBack()}
        containerFlex={1}
        extraTopPadding={totalextraHeight}
        head={<AdvicesList crediTypes={crediTypes} />}
        goBack={() => navigation.goBack()}>
        {loading ? (
          <LoadingContent />
        ) : !hasCredits && !userLineCredit ? (
          <EmptyContent />
        ) : (
          <>
            {userLineCredit && (
              <LineCreditCard loading={loadingButton} onPress={goDisbursment} />
            )}
            {hasCredits ? (
              <MainContent />
            ) : (
              <BoxView flex={1} py={42} align="center" justify="center">
                <Icon name="bill-shiny" size={80} />
                <TextCustom
                  text={'Aquí verás\n tus créditos desembolsados'}
                  variation="h5"
                  align="center"
                  weight="normal"
                  color="neutral-medium"
                  lineHeight="comfy"
                />
              </BoxView>
            )}
          </>
        )}
      </DisbursementTemplate>

      {/* Modals */}
      <InfoModal isOpen={showInfo.show} {...showInfo} />

      {/* Modals */}
      <ModalIcon
        type="SUCCESS"
        message="Token Digital activado"
        open={route.params?.showTokenIsActivated ?? false}
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
              />
            ),
          },
        ]}
      />
    </>
  );
};
