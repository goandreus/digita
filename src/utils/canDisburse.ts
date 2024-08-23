import {Saving} from '@features/userInfo';

export const canDisburse = (allSavings?: Saving[]) => {
  if (!allSavings) {
    return null;
  }

  const allowedSavings = new Set<Saving>();
  const canDisburseInSoles = new Set<Saving>();
  const canDisburseInDollars = new Set<Saving>();

  for (const saving of allSavings) {
    if (saving.canDisbursement) {
      allowedSavings.add(saving);
    }
    if (saving.currency === 'S/' && saving.canDisbursement) {
      canDisburseInSoles.add(saving);
    }
    if (saving.currency === '$' && saving.canDisbursement) {
      canDisburseInDollars.add(saving);
    }
  }

  const canSavingsDisburse = allowedSavings.size > 0;

  return {
    canDisburse: canSavingsDisburse,
    canDisburseInSoles: [...canDisburseInSoles],
    canDisburseInDollars: [...canDisburseInDollars],
  };
};
