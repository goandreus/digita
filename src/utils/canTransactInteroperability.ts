import {Saving} from '@features/userInfo';

export const canTransactInteroperability = (allSavings?: Saving[]) => {
  if (!allSavings) return null;

  const canTransactInSoles = new Set<Saving>();

  for (const saving of allSavings) {
    if (saving.currency === 'S/' && saving.status === 'Normal' && saving.accountType === 'I') {
      canTransactInSoles.add(saving);
    }
  }

  const canTransact = canTransactInSoles.size > 0;

  return {
    canTransact,
    canTransactInSoles: [...canTransactInSoles],
  };
};
