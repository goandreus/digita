import React from 'react';
import AlertBasic from '@molecules/extra/AlertBasic';
import TextCustom from '@atoms/extra/TextCustom';
import Button from '@atoms/extra/Button';

export interface IOpeningAccountsErrorModal {
  isOpen: boolean;
  title: string;
  description: string;
  button1: {
    title: string;
    action: () => void;
  };
  button2?: {
    title: string;
    action: () => void;
  };
}

export const OpeningAccountsErrorModal = ({
  isOpen,
  title,
  description,
  button1,
  button2,
}: IOpeningAccountsErrorModal) => {
  return (
    <AlertBasic
      isOpen={isOpen}
      title={title}
      body={
        <TextCustom
          lineHeight="comfy"
          variation="p4"
          color="neutral-darkest"
          weight="normal"
          align="center">
          {description}
        </TextCustom>
      }
      actions={() => [
        {
          id: 'button1',
          render: (
            <Button
              orientation="vertical"
              text={button1.title}
              type="primary"
              onPress={button1.action}
            />
          ),
        },
        {
          id: 'button2',
          render: (
            <Button
              orientation="vertical"
              text={button2?.title}
              type="primary-inverted"
              haveBorder
              onPress={button2?.action!}
            />
          ),
        },
      ]}
      onClose={() => {}}
    />
  );
};
