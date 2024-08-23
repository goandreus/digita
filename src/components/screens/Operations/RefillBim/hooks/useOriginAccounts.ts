import {useMemo} from 'react';
import {useUserInfo} from '@hooks/common';
import {canTransactRefillBim} from '@utils/canTransactRefillBim';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';

export const useOriginAccounts = () => {
  const {userSavings} = useUserInfo();

  const allSavingsFilter = useMemo(() => {
    const accs = canTransactRefillBim([
      ...(userSavings?.savings.savings ?? []),
    ]);
    return accs
      ? accs.canTransactInSoles.map(e => ({
          ...e,
          title: e.productName,
          subtitle: e.accountCode,
          value: `${e.currency} ${e.sBalance}`,
        }))
      : [];
  }, [userSavings?.savings.savings]);

  const originAccount = useAccountByOperationUid({
    operationUId: allSavingsFilter[0].operationUId,
  });

  return {
    allSavingsFilter,
    originAccount,
  };
};
