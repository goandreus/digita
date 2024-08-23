import React from 'react';
import Separator from '@atoms/Separator';
import {SavingItem} from './savingItem';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import {AccountType} from '../types';

interface FirstStepProps {
  disableITem: boolean;
  handleChooseAccount: (type: AccountType) => Promise<void>;
}

export const FirstStep = ({
  disableITem,
  handleChooseAccount,
}: FirstStepProps) => {
  return (
    <>
      <BoxView pb={6} mt={36}>
        <TextCustom
          text="Te damos más por tus ahorros"
          color="primary-medium"
          variation="h2"
          weight="normal"
          lineHeight="tight"
        />
        <TextCustom
          color="neutral-darkest"
          lineHeight="comfy"
          weight="normal"
          variation="h4"
          text="Abre aquí tu cuenta sin tener que ir a agencia"
        />
        <Separator size={32} />
        <SavingItem
          disabled={disableITem}
          action={() => handleChooseAccount('entrepreneur')}
          type="entrepreneur"
        />
        <Separator size={40} />
        <SavingItem
          disabled={disableITem}
          action={() => handleChooseAccount('wow')}
          type="wow"
        />
      </BoxView>
    </>
  );
};
