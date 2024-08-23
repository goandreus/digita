/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import Input from '@atoms/extra/Input';
import {useUserInfo} from '@hooks/common';
import BoxView from '@atoms/BoxView';
import {useAppSelector} from '@hooks/useAppSelector';
import {COLORS} from '@theme/colors';
import BalanceToggle from '@atoms/extra/BalanceToggle';

interface Props {
  form: any;
}

export const SearchContact = ({form}: Props) => {
  const {userSavings, userInteroperabilityInfo} = useUserInfo();
  const {balanceVisibility} = useAppSelector(state => state.balanceVisibility);
  const affiliatedAccount = userSavings?.savings.savings.find(
    e => `${e.operationUId}` === userInteroperabilityInfo?.operationUId,
  );
  const availableBalance = `${affiliatedAccount?.currency || ''} ${
    balanceVisibility ? affiliatedAccount?.sBalance || '' : '********'
  }`;

  return (
    <>
      <Separator type="medium" />
      <TextCustom
        text="Ingresa el número o nombre de contacto"
        variation="h4"
        weight="normal"
        color="neutral-darkest"
      />
      <Separator type="x-small" />
      <Input
        style={{backgroundColor: COLORS.Background.Lightest}}
        maxLength={50}
        placeholder="Escribe aquí el número o nombre"
        {...form.inputProps('searchContact')}
      />
      <Separator type="small" />
      <BoxView
        style={{borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
        py={12}
        px={24}
        align="center"
        justify="space-between"
        direction="row">
        <BoxView>
          <TextCustom
            text="Saldo disponible "
            variation="c1"
            size={14}
            weight="normal"
            color="neutral-dark"
          />
          <TextCustom
            text={availableBalance}
            variation="h4"
            size={20}
            weight="normal"
            color="neutral-darkest"
          />
        </BoxView>
        <BalanceToggle />
      </BoxView>
    </>
  );
};
