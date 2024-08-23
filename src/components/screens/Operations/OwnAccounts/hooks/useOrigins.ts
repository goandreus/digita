import {useEffect, useMemo, useState} from 'react';
import {useUserInfo} from '@hooks/common';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import {canTransactWithOwnAcc} from '@utils/canTransactWithOwnAcc';
import {Saving} from '@features/userInfo';

export interface IOriginsHook {
  originSavings?: Saving[];
  originAccount: Saving | null;
  originAccountUId: number;
  destinationSavings?: Saving[];
  destinationAccountUId?: number;
  destinationAccount: Saving | null;
  setOriginAccountUId: (originAccountUId: number) => void;
  setDestinationAccountUId: (destinationAccountUId: number) => void;
}

export const useOrigins = (): IOriginsHook => {
  const {userSavings} = useUserInfo();

  const allSavingsFilter = useMemo(() => {
    return canTransactWithOwnAcc([
      ...(userSavings?.savings.savings ?? []),
      ...(userSavings?.compensations.savings ?? []),
    ]);
  }, [userSavings?.compensations.savings, userSavings?.savings.savings]);

  const originSavings: Saving[] | undefined = useMemo(() => {
    return allSavingsFilter?.accountsCanTransact
      .map(e => ({
        ...e,
        title: e.productName,
        subtitle: e.accountCode,
        value: `${e.currency} ${e.sBalance}`,
      }))
      .sort((a, b) => {
        if (a.currency === 'S/' && b.currency !== 'S/') {
          return -1;
        }
        if (a.currency !== 'S/' && b.currency === 'S/') {
          return 1;
        }
        return b.balance - a.balance;
      });
  }, [allSavingsFilter?.accountsCanTransact]);

  const [originAccountUId, setOriginAccountUId] = useState(
    originSavings?.[0].operationUId!,
  );
  const originAccount = useAccountByOperationUid({
    operationUId: originAccountUId,
  });

  const destinationInSoles = useMemo(() => {
    return allSavingsFilter?.accountsCanReceiveInSoles
      .map(e => ({
        ...e,
        title: e.productName,
        subtitle: e.accountCode,
        value: `${e.currency} ${e.sBalance}`,
      }))
      .sort((a, b) => b.balance - a.balance);
  }, [allSavingsFilter?.accountsCanReceiveInSoles]);

  const destinationInDollars = useMemo(() => {
    return allSavingsFilter?.accountsCanReceiveInDollars
      .map(e => ({
        ...e,
        title: e.productName,
        subtitle: e.accountCode,
        value: `${e.currency} ${e.sBalance}`,
      }))
      .sort((a, b) => b.balance - a.balance);
  }, [allSavingsFilter?.accountsCanReceiveInDollars]);

  const destinationSavings: Saving[] | undefined = useMemo(() => {
    if (originAccount?.currency === '$') {
      return destinationInDollars?.filter(d => {
        return d.operationUId !== originAccount.operationUId;
      });
    }

    return destinationInSoles?.filter(d => {
      return d.operationUId !== originAccount?.operationUId;
    });
  }, [
    destinationInDollars,
    destinationInSoles,
    originAccount?.currency,
    originAccount?.operationUId,
  ]);

  const [destinationAccountUId, setDestinationAccountUId] = useState(
    destinationSavings?.[0]?.operationUId,
  );
  const destinationAccount = useAccountByOperationUid({
    operationUId: destinationAccountUId!,
  });

  useEffect(() => {
    setDestinationAccountUId(destinationSavings?.[0]?.operationUId);
  }, [destinationSavings, originAccount?.currency]);

  return {
    originSavings,
    originAccount,
    originAccountUId,
    destinationSavings,
    destinationAccountUId,
    destinationAccount,
    setOriginAccountUId,
    setDestinationAccountUId,
  };
};
