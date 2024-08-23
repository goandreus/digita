import {useMemo} from 'react';
import {useUserInfo} from '@hooks/common';
import {canDisburse} from '@utils/canDisburse';
import {Currency} from '@features/userInfo';

export const useAccounts = ({currency}: {currency: Currency}) => {
  const {userSavings} = useUserInfo();

  const allSavings = useMemo(() => {
    return [
      ...(userSavings?.savings.savings ?? []),
      ...(userSavings?.compensations.savings ?? []),
      ...(userSavings?.investments.savings ?? []),
    ];
  }, [
    userSavings?.compensations.savings,
    userSavings?.investments.savings,
    userSavings?.savings.savings,
  ]);

  const allSavingsFilter = useMemo(() => {
    return canDisburse([
      ...(userSavings?.savings.savings ?? []),
      ...(userSavings?.compensations.savings ?? []),
    ]);
  }, [userSavings?.compensations.savings, userSavings?.savings.savings]);

  const accounts = useMemo(() => {
    const accountsByCurrency =
      currency === 'S/'
        ? allSavingsFilter?.canDisburseInSoles
        : allSavingsFilter?.canDisburseInDollars;

    return accountsByCurrency
      ?.filter(e => e.currency === currency && e.accountType === 'I')
      .map(e => ({
        ...e,
        title: e.productName,
        subtitle: e.accountCode,
        value: `${e.currency} ${e.sBalance}`,
      }))
      .sort((a, b) => b.balance - a.balance);
  }, [
    allSavingsFilter?.canDisburseInSoles,
    allSavingsFilter?.canDisburseInDollars,
    currency,
  ]);

  return {
    accounts,
    canDisbursement: allSavingsFilter?.canDisburse,
    allSavings,
  };
};
