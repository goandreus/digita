import {Saving} from '@features/userInfo';

export const canTransactWithOwnAcc = (allSavings?: Saving[]) => {
  if (!allSavings) return null;

  const canOnlyReceiveInSoles = new Set<Saving>();
  const canOnlyTransactInSoles = new Set<Saving>();
  const canReceiveAndTransactInSoles = new Set<Saving>();

  const canOnlyReceiveInDollars = new Set<Saving>();
  const canOnlyTransactInDollars = new Set<Saving>();
  const canReceiveAndTransactInDollars = new Set<Saving>();

  for (const saving of allSavings) {
    if (saving.currency === '$') {
      // ON DOLLAR
      if (saving.canTransact && saving.canReceive && saving.balance > 0) {
        canReceiveAndTransactInDollars.add(saving);
        continue;
      }

      if (saving.canReceive) {
        canOnlyReceiveInDollars.add(saving);
      }
      if (saving.canTransact && saving.balance > 0) {
        canOnlyTransactInDollars.add(saving);
      }
    }

    if (saving.currency === 'S/') {
      // ON SOL
      if (saving.canTransact && saving.canReceive && saving.balance > 0) {
        canReceiveAndTransactInSoles.add(saving);
        continue;
      }

      if (saving.canReceive) {
        canOnlyReceiveInSoles.add(saving);
      }
      if (saving.canTransact && saving.balance > 0) {
        canOnlyTransactInSoles.add(saving);
      }
    }
  }

  let canTransact = false;

  if (
    (canOnlyReceiveInSoles.size > 0 && canOnlyTransactInSoles.size > 0) ||
    (canOnlyReceiveInDollars.size > 0 && canOnlyTransactInDollars.size > 0)
  ) {
    // Tiene al menos una que puede recibir y una que puede transaccionar
    canTransact = true;
  }

  if (
    (canOnlyReceiveInSoles.size > 0 && canReceiveAndTransactInSoles.size > 0) ||
    (canOnlyReceiveInDollars.size > 0 &&
      canReceiveAndTransactInDollars.size > 0)
  ) {
    // Tiene al menos una que puede recibir y una que puede transaccionar y recibir
    canTransact = true;
  }

  if (
    (canOnlyTransactInSoles.size > 0 &&
      canReceiveAndTransactInSoles.size > 0) ||
    (canOnlyTransactInDollars.size > 0 &&
      canReceiveAndTransactInDollars.size > 0)
  ) {
    // Tiene al menos una que puede transaccionar y una que puede transaccionar y recibir
    canTransact = true;
  }

  if (
    canReceiveAndTransactInSoles.size > 1 ||
    canReceiveAndTransactInDollars.size > 1
  ) {
    // Tiene dos o mas que pueden transaccionar y recibir
    canTransact = true;
  }

  return {
    canTransact,
    accountsCanTransact: [
      ...canOnlyTransactInSoles,
      ...canReceiveAndTransactInSoles,
      ...canOnlyTransactInDollars,
      ...canReceiveAndTransactInDollars,
    ],
    accountsCanReceiveInSoles: [
      ...canOnlyReceiveInSoles,
      ...canReceiveAndTransactInSoles,
    ],
    accountsCanReceiveInDollars: [
      ...canOnlyReceiveInDollars,
      ...canReceiveAndTransactInDollars,
    ],
  };
};
