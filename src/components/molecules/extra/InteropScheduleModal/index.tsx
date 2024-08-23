import React from 'react';
import AlertBasic from '@molecules/extra/AlertBasic';
import TextCustom from '@atoms/TextCustom';
import Button from '@atoms/Button';
import {COLORS} from '@theme/colors';
import {interopSchedule} from '@utils/interopSchedule';

export const InteropScheduleModal = ({
  showScheduleModal,
  closeScheduleModal,
}: {
  showScheduleModal: boolean;
  closeScheduleModal: () => void;
}) => {
  return (
    <AlertBasic
      isOpen={showScheduleModal}
      title={'Pago no disponible'}
      body={
        <TextCustom
          // eslint-disable-next-line react-native/no-inline-styles
          style={{lineHeight: 24}}
          color={COLORS.Neutral.Dark}
          variation="p"
          size={16}
          weight="normal"
          align="center">
          {'¡Recuerda! puedes realizar pagos a un número celular de'}
          <TextCustom
            text={interopSchedule().startHour}
            color={COLORS.Neutral.Darkest}
            variation="p"
            weight="bold"
            align="center"
          />
          a
          <TextCustom
            text={interopSchedule().endHour}
            color={COLORS.Neutral.Darkest}
            variation="p"
            weight="bold"
            align="center"
          />
        </TextCustom>
      }
      actions={() => [
        {
          id: 'button1',
          render: (
            <Button
              orientation="vertical"
              text="Entiendo"
              type="primary"
              onPress={closeScheduleModal}
            />
          ),
        },
      ]}
      onClose={() => {}}
    />
  );
};
