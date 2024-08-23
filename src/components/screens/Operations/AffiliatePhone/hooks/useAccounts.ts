import {useMemo} from 'react';
import {useUserInfo} from '@hooks/common';

export const useAccounts = () => {
  const {userSavings, userInteroperabilityInfo} = useUserInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const savings = userSavings?.savings?.savings ?? [];
  const allSavings = useMemo(() => [...savings!], [savings]);
  const allowedAccounts = allSavings?.filter(
    e =>
      e.balance >= 0 &&
      e.status === 'Normal' &&
      e.accountType === 'I' &&
      e.currency === 'S/',
  );
  let formatedAccounts = useMemo(() => {
    return allowedAccounts
      ?.map(e => ({
        ...e,
        label:
          String(e.operationUId) === userInteroperabilityInfo?.operationUId
            ? 'Afiliada'
            : undefined,
        title: e.productName,
        subtitle: `${'*'.repeat(
          e.accountCode?.length || 10 - 4,
        )}${e.accountCode?.slice(-4)}`,
        value: `${e.currency} ${e.sBalance}`,
      }))
      .sort((a: any, b: any) => b.balance - a.balance);
  }, [allowedAccounts, userInteroperabilityInfo?.operationUId]);

  const affiliateAccount = formatedAccounts.find(
    e => String(e.operationUId) === userInteroperabilityInfo?.operationUId,
  );
  const index = formatedAccounts.findIndex(
    e => String(e.operationUId) === userInteroperabilityInfo?.operationUId,
  );

  if (userInteroperabilityInfo) {
    if (affiliateAccount) {
      formatedAccounts.splice(index, 1);
    } else {
      const payload = {
        accountCci: userInteroperabilityInfo.cci,
        accountCode: userInteroperabilityInfo.accountSaving,
        operationUId: parseInt(userInteroperabilityInfo.operationUId),
        balance: parseFloat(userInteroperabilityInfo.sAvailableBalance),
        sBalance: userInteroperabilityInfo.sAvailableBalance,
        label: 'Afiliada',
        title: userInteroperabilityInfo.accountSavingName,
        subtitle: `${'*'.repeat(
          userInteroperabilityInfo.accountSaving?.length || 10 - 4,
        )}${userInteroperabilityInfo.accountSaving?.slice(-4)}`,
        value: `S/ ${userInteroperabilityInfo.sAvailableBalance}`,
      };
      formatedAccounts = [payload, ...formatedAccounts];
    }
  }

  const accounts =
    userInteroperabilityInfo && affiliateAccount
      ? [affiliateAccount, ...formatedAccounts]
      : formatedAccounts;

  return {
    accounts,
  };
};
