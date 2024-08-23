import {Saving} from '@features/userInfo';

export const canTransactRefillBim = (allSavings?: Saving[]) => {
  if (!allSavings) return null;

  const canTransactInSoles = new Set<Saving>();

  for (const saving of allSavings) {
    if (saving.currency === 'S/' && saving.canTransact && saving.balance > 0) {
      canTransactInSoles.add(saving);
    }
  }

  const canTransact = canTransactInSoles.size > 0;

  return {
    canTransact,
    canTransactInSoles: [...canTransactInSoles],
  };
};
