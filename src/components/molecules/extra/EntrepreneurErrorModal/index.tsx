import React from 'react';
import AlertBasic from '@molecules/extra/AlertBasic';
import TextCustom from '@atoms/TextCustom';
import Button from '@atoms/Button';
import {COLORS} from '@theme/colors';
import {interopSchedule} from '@utils/interopSchedule';

export const InteropEntrepreneurErrorModal = ({
  showEntrepreneurErrorModal,
  closeEntrepreneurErrorModal,
}: {
  showEntrepreneurErrorModal: boolean;
  closeEntrepreneurErrorModal: () => void;
}) => {
  return (
    <AlertBasic
      isOpen={showEntrepreneurErrorModal}
      title={'La afiliación de tu número\nde celular está en proceso'}
      body={
        <TextCustom
          // eslint-disable-next-line react-native/no-inline-styles
          style={{lineHeight: 24}}
          color={COLORS.Neutral.Dark}
          variation="p"
          size={16}
          weight="normal"
          align="center">
          En un minuto podrás realizar pagos con tu{'\n'}número de celular desde la cuenta de{'\n'}ahorro que afiliaste.
        </TextCustom>
      }
      actions={() => [
        {
          id: 'button1',
          render: (
            <Button
              orientation="vertical"
              text="Entendido"
              type="primary"
              onPress={closeEntrepreneurErrorModal}
            />
          ),
        },
      ]}
      onClose={() => {}}
    />
  );
};
