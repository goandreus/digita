import React from 'react';
import StartOperationTemplate from '@templates/extra/StartOperationTemplate';
import {StartGroupCreditScreenProps} from '@navigations/types';
import {useStartGroupCredit} from './hooks/useGroupCredit';
import {indexStyles as styles} from './styles';
import Button from '@atoms/extra/Button';
import ModalIcon from '@molecules/ModalIcon';
import {Content} from './content';

export const StartGroupCredit = ({
  navigation,
  route,
}: StartGroupCreditScreenProps) => {
  const {showTokenIsActivated} = route?.params;
  const {goHome, goConfirmation} = useStartGroupCredit({
    navigation,
    route,
  });

  return (
    <>
      <StartOperationTemplate
        canGoBack={navigation.canGoBack()}
        goBack={goHome}
        footer={
          <Button
            containerStyle={styles.containerBtn}
            onPress={goConfirmation}
            loading={false}
            orientation="horizontal"
            type="secondary"
            text={'Continuar'}
            disabled={false}
          />
        }>
        <Content />
      </StartOperationTemplate>

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
    </>
  );
};
