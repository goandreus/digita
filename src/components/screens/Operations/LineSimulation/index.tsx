import React from 'react';
import {Content, Loading, Modal} from './components';
import DisbursementTemplate from '@templates/extra/DisbursementTemplate';
import {LineSimulationProvider, useLineSimulationContext} from './context';
import {LineSimulationProps} from '@navigations/types';
import Button from '@atoms/extra/Button';
import {indexStyles as styles} from './styles';
import {useLineSimulation} from './hooks/useLineSimulation';
import {Keyboard, ScrollView} from 'react-native';
import {useUserInfo} from '@hooks/common';
import AlertBasic from '@molecules/extra/AlertBasic';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';

export const LineSimulationContent = ({navigation}: LineSimulationProps) => {
  const {userLineCredit} = useUserInfo();
  const loadingData = userLineCredit === null;
  const {loading, showModal, setShowModal, modalError, goCredits} =
    useLineSimulationContext();
  const {btnDisabled, handleSubmit, handleGoDisbursement} = useLineSimulation();

  return (
    <>
      <DisbursementTemplate
        headerTitle="Simula tus cuotas"
        canGoBack={navigation.canGoBack()}
        goBack={goCredits}
        containerFlex={1}
        footer={
          loadingData ? undefined : (
            <Button
              containerStyle={styles.containerBtn}
              onPress={() => {
                Keyboard.dismiss();
                handleSubmit();
              }}
              loading={loading}
              orientation="horizontal"
              type="primary"
              text={'Simular cuotas'}
              disabled={btnDisabled || loading}
            />
          )
        }>
        {loadingData ? <Loading /> : <Content />}
      </DisbursementTemplate>

      <Modal
        isOpen={showModal}
        handle={handleGoDisbursement}
        onClose={() => setShowModal(false)}
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
              text={modalError.content}
              align="center"
            />

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

export const LineSimulation = ({route, navigation}: LineSimulationProps) => {
  return (
    <LineSimulationProvider>
      <LineSimulationContent route={route} navigation={navigation} />
    </LineSimulationProvider>
  );
};
