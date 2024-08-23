export interface ICompany {
  code: string;
  groupId: string;
  id: number;
  name: string;
}

export interface IService {
  attentionSchedule: string;
  codeName: string;
  commission: number;
  dataType: string;
  id: string;
  label: string;
  length: string;
  name: string;
  serviceId: string;
  isAvailable: boolean;
}
export interface ICategory {
  businessName: string;
  services: IService[];
  company: ICompany;
  debts?: IDebts;
}

export interface IDebtsServiceResultItem {
  currencyCode: number;
  debtAmount: number;
  delay: number;
  expiryDate: string;
  invoiceNumber: string;
  maximumAmount: number;
  minimumAmount: number;
  order: number;
  paymentMethod: string;
  totalAmount: number;
  totalCommission: number;
  referenceCommission: number;
}

export interface IDebtsServiceResult {
  clientname: string;
  list: IDebtsServiceResultItem[];
}


export interface IDebt {
  currencyCode: number;
  debtAmount: number;
  delay: number;
  expiryDate: string;
  invoiceNumber: string;
  maximumAmount: number;
  minimumAmount: number;
  order: number;
  paymentMethod: string;
  totalAmount: number;
  totalCommission: number;
}

export interface IDebts {
  clientname: string;
  list: IDebt[];
}
