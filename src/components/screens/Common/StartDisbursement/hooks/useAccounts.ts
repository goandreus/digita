import {useMemo} from 'react';
import {useUserInfo} from '@hooks/common';
import {canDisburse} from '@utils/canDisburse';
import {CreditPendingData} from '@services/Disbursements';

export const useAccounts = (creditPending: CreditPendingData | null) => {
  const {userSavings, userCredits} = useUserInfo();

  const allSavings = useMemo(() => {
    return [
      ...(userSavings?.savings.savings ?? []),
      ...(userSavings?.compensations.savings ?? []),
      ...(userSavings?.investments.savings ?? []),
      ...(userCredits?.groupCredits ?? []),
      ...(userCredits?.individualCredits ?? []),
    ];
  }, [
    userCredits?.groupCredits,
    userCredits?.individualCredits,
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
      creditPending?.currency === 'S/'
        ? allSavingsFilter?.canDisburseInSoles
        : allSavingsFilter?.canDisburseInDollars;

    return accountsByCurrency
      ?.filter(e => e.currency === creditPending?.currency)
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
    creditPending?.currency,
  ]);

  return {
    accounts,
    canDisbursement: allSavingsFilter?.canDisburse,
    allSavings,
  };
};
