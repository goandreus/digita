import {Fetch} from '@utils/apiFetch';
import {apiGeeStatus, createHeadersApiGee} from '@utils/firebase';
import {getToken} from '@utils/getToken';
import {ProductDomain} from '@global/information';
export interface SavingDetailInterface {
  availableBalance: number;
  sAvailableBalance?: string;
  sCountableBalance?: string;
  btOperationId: string;
  cci: string;
  chargetInterest: string;
  confirmBalance: number;
  countableBalance: number;
  coverageBalance: number;
  descriptionPackage: string;
  executive: string;
  fmtOperationId: string;
  frequencyEmissionEC: string;
  lockedBalance: number;
  office: string;
  openingDate: string;
  operationUId: number;
  overdraftDays: number;
  packages: string;
  payCommissionBelowAverage: string;
  payCommissionQuantityOfMovements: string;
  payCommissionStatementsAccount: string;
  producto: {
    moneda: string;
    nombre: string;
    papel: string;
    productoUId: number;
  };
  status: string;
}

export interface SavingOperationInterface {
  currencyType: string;
  income: number;
  outlay: number;
  sincome: string;
  soutlay: string;
}

export interface InvestmentDetailInterface {
  agreedInterestAmount: number;
  sAgreedInterestAmount?: string;
  availableBalance: number;
  sAvailableBalance?: string;
  descriptionInstruction: string;
  expirationDate: string;
  highDate: string;
  interestRate: number;
  sInterestRate?: string;
  moneyDPF: number;
  numberDaysTerm: number;
  sNumberDaysTerm?: string;
  operationUId: number;
  productCode: string;
  productName: string;
}

export interface CreditDetailInterface {
  advancePercentage?: number;
  clientUId: number;
  expirationDate: string;
  expirationDateString: string;
  groupAccountId: string;
  groupCanceledAmount: number;
  groupFeeNumber: number;
  groupInstallmentAmount: number;
  groupOverdueAmount: number;
  groupTotalFeeNumber: number;
  individualAccountId: number;
  individualCanceledAmount: number;
  individualCreditAccountAmount: number;
  individualFeeNumber: number;
  individualInstallmentAmount: number;
  individualInstallmentCurrency: string;
  individualOverdueAmount: number;
  individualTotalFeeNumber: number;
  operationUId: number;
  personUId: number;
  productModule: number;
  productName: string;
  productOperationType: number;
  sgroupCapitalOriginal?: string;
  sgroupAmountBalanceCapital?: string;
  groupDateFirstInstallmentUnpaid?: string;
  sgroupInstallmentAmount?: string;
  sgroupOverdueAmount?: string;
  sindividualAmountBalanceCapital?: string;
  sindividualCapitalOriginal?: string;
  sindividualInstallmentAmount?: string;
  sindividualOverdueAmount?: string;
  GroupName?: string;
}

export interface OwnerDetail {
  documentNumber: string;
  documentType: number;
  fullName: string;
}

export type Movement = {
  amount: number;
  concept: string;
  date: string;
  dayString: string;
  debitCredit: string;
  monthString: string;
  movementUId: number;
  samount: string;
  time: string;
  yearString: string;
};

export interface Movements {
  currency: string;
  dateFrom: string;
  dateTo: string;
  movements: Movement[];
}

export interface SavingMovementsInterface {
  accountMovementsDetailsDto: {
    cFLSSMovimientoCA: [];
  };
}

export const getSavingDetail = async ({
  operationUId,
  user,
  screen,
}: {
  operationUId: number | undefined;
  user?: string;
  screen?: string;
}): Promise<SavingDetailInterface> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_acc');
  const url = `${
    isAPIGee
      ? ProductDomain.account + `/savings/${operationUId}`
      : `/api/accounts/savings/${operationUId}`
  }`;
  const data = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user,
    screen,
    isSecure: isAPIGee,
    closeSessionOnError: true,
  });

  if (data.isSuccess === false) throw new Error(data.message);
  else return data.data;
};

export const getInvestmentDeatil = async ({
  accountCode,
  user,
  screen,
}: {
  accountCode: number | undefined;
  user?: string;
  screen?: string;
}): Promise<InvestmentDetailInterface> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_acc');
  const url = `${
    isAPIGee
      ? ProductDomain.account + `/investments/${accountCode}`
      : `/api/accounts/investments/${accountCode}`
  }`;

  const data = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user,
    screen,
    isSecure: isAPIGee,
    closeSessionOnError: true,
  });

  if (data.isSuccess === false)
    throw new Error(`${data.errorCode} ${data.message}`);
  else return data.data;
};

export const getSavingMovements = async ({
  operationUId,
  user,
  screen,
  payload,
}: {
  operationUId: number | undefined;
  user?: string;
  screen?: string;
  payload?: {
    numberOfMovements?: string;
    numberOfDays?: string;
  };
}): Promise<Movements> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_acc');
  const url = `${
    isAPIGee
      ? ProductDomain.account + `/savings/transactions/${operationUId}`
      : `/api/accounts/savings/transactions/${operationUId}`
  }`;

  const data = await Fetch({
    url,
    method: 'POST',
    body: {
      numberOfMovements: payload?.numberOfMovements ?? '',
      numberOfDays: payload?.numberOfDays ?? '',
    },
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user,
    screen,
    isSecure: isAPIGee,
    closeSessionOnError: true,
  });

  if (data.isSuccess === false)
    throw new Error(`${data.errorCode} ${data.message}`);
  else return data.data;
};

export const getInvestmenMovements = async ({
  operationUId,
  user,
  screen,
}: {
  operationUId: number | undefined;
  user?: string;
  screen?: string;
}): Promise<Movements> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_acc');
  const url = `${
    isAPIGee
      ? ProductDomain.account + `/investments/transactions/${operationUId}`
      : `/api/accounts/investments/transactions/${operationUId}`
  }`;

  const data = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user,
    screen,
    isSecure: isAPIGee,
    closeSessionOnError: true,
  });

  if (data.isSuccess === false)
    throw new Error(`${data.errorCode} ${data.message}`);
  else return data.data;
};

export const getOwner = async ({
  accountCode,
  screen,
  documentType,
  documentNumber,
}: {
  accountCode: string;
  screen?: string;
  documentType?: number;
  documentNumber?: string;
}) => {
  const isAPIGee = await apiGeeStatus('mgnt_acc');
  const url = `${
    isAPIGee
      ? ProductDomain.account + `/owner/${accountCode}`
      : `/api/accounts/owner/${accountCode}`
  }`;

  const data = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    closeSessionOnError: true,
    user: `0${documentType}${documentNumber}`,
    screen,
    isSecure: isAPIGee,
  });
  return data;
};

export const getSavingsOperations = async ({
  operationUId,
  user,
  screen,
}: {
  operationUId: number | undefined;
  user?: string;
  screen?: string;
}): Promise<SavingOperationInterface> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_acc');
  const url = `${
    isAPIGee
      ? ProductDomain.account + `/savings/operations/${operationUId}`
      : `/api/accounts/savings/operations/${operationUId}`
  }`;

  const data = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user,
    screen,
    isSecure: isAPIGee,
    closeSessionOnError: true,
  });

  if (data.isSuccess === false) throw new Error(data.message);
  else return data.data;
};

export const getSavingsMovements = async ({
  operationUId,
  user,
  screen,
}: {
  operationUId: number | undefined;
  user?: string;
  screen?: string;
}): Promise<SavingMovementsInterface> | never => {
  const data = await Fetch({
    url: `/api/accounts/savings/movements/${operationUId}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    user,
    screen,
    closeSessionOnError: true,
  });

  if (data.isSuccess === false)
    throw new Error(`${data.errorCode} ${data.message}`);
  else return data.data;
};
