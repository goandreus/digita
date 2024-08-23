export type CreditAdviceType = 'CI' | 'CG' | 'LC';

export interface ICreditAdvice {
  showAdvice: boolean;
  showDisbursement: boolean;
  amount: string;
  banners: {
    [key in CreditAdviceType]: boolean;
  };
}
