export interface IQueryInfo {
  itfTax: number;
  destinationAccountName?: string;
  destinationAccountNumber?: string;
  originCommission?: number;
  destinationCommission?: number;
  transactionType?: 'D' | 'I';
  mpe001IDL?: number;
  transferId?: string;
}
export interface ISuccessModal {
  isOpen: boolean;
  data?: {
    itfTax: number;
    ownerFullName: string;
    dateTransaction: string;
    hourTransaction: string;
    dateTimeTransaction: string;
    email: string;
    movementId: number;
    originCommission?: number;
    destinationCommission?: number;
  };
}

export interface IScheduleModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

export interface IFavoriteModal {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  isOpenFavDisclaimer: boolean;
  setFavDisclaimer: (i: boolean) => void
}

export interface InitialForm {
  amount: number | null;
  formatAmount: string;
  destinationAccount: string;
  operationUId: number;
}

export interface IConfirmationCF {
  concept: string;
}

export interface IConfirmationInmediate {
  concept: string;
  termsAreAccepted: boolean;
}

export interface IConfirmationDeferred {
  concept: string;
  termsAreAccepted: boolean;
  isHolder: boolean | undefined;
}

export interface ICreateFavoriteCF {
  favoriteName: string;
}

export interface IForm<T> {
  values: T;
  form: any;
  clear: () => void;
  onSetField: (field: keyof T, value: any) => void;
}

export type transferencyStatus =
  | 'SUCCESS'
  | 'NEED_AUTHENTICATION'
  | 'BLOCKED'
  | 'UNKNOWN';

export type TransferParams =
  | {
      type: 'TRANSFERENCY_LOCAL';
      destinationAccountName: string;
      destinationAccountNumber: string;
      amount: number;
      formatAmount: string;
      operationUId: number;
      movementId: number;
      itfTax: number;
      concept: string;
      dateTransaction: string;
      hourTransaction: string;
      dateTimeTransaction: string;
      email: string;
      favoriteName?: string;
    }
  | {
      type: 'TRANSFERENCY_OTHERS';
      destinationAccountName: string;
      beneficiaryFullName: string;
      destinationAccountNumber: string;
      amount: number;
      formatAmount: string;
      operationUId: number;
      movementId: number;
      itfTax: number;
      concept: string;
      dateTransaction: string;
      hourTransaction: string;
      dateTimeTransaction: string;
      email: string;
      originCommission: number;
      destinationCommission: number;
      sameHeadLine: boolean;
      transactionType: 'D' | 'I';
      favoriteName?: string;
    };

export interface IFavorite {
  alias: string,
  operationType: number,
  valueOperation: string,
}