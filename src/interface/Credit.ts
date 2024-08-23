export interface Installment {
  amount: number;
  amountOverdue: number;
  amountTotPay: number;
  expirationDate: string;
  interestAmount: number;
  isDue: boolean;
  number: number;
  sAmount: string;
  sAmountOverdue: string;
  sAmountTotPay: string;
  sInterestAmount: string;
  type: string;
}

export interface CreditPayments {
  accountCredit: string;
  currentDate: string;
  existsInstallmentDue: boolean;
  listInstallments: Installment[];
  quantityAllInstallments: number;
  sSumAmountInstallments: string;
  sumAmountInstallments: number;
  textAllInstallments: string;
}

export interface CustomCredits {
  groupCredits: any;
  individualCredits: IndividualCredit[];
}

export interface IndividualCredit {
  accountCode: string;
  amountFeesPaid: number;
  amountInstallments: number;
  currency: string;
  disbursedCapital: number;
  existsInstallmentDue: boolean;
  installmentToBePaidAmountTotPay: number;
  installmentToBePaidExpirationDate: string;
  installmentToBePaidNumber: number;
  isPunished: boolean;
  productName: string;
  sDisbursedCapital: string;
  sInstallmentToBePaidAmountTotPay: string;
  sSumAmountInstallments: string;
  status: string;
  sumAmountInstallments: number;
  textAllInstallments: string;
}

export interface PaymentInterfaceReq {
  creditNumber: string;
  accountSaving: string;
  amountPay: number;
  currency: number;
  isAnotherAmountPay: boolean;
  typeAccountSaving: string;
  totalInstallments: number;
  typeCredit: string;
}

export interface PaymentInterfaceRes {
  account: string;
  accountCredit: string;
  amountCapital: number;
  amountCharges: number;
  amountCommission: number;
  amountInterests: number;
  amountItf: number;
  amountMandatoryInsurance: number;
  amountOptionalInsurance: number;
  clientName: string;
  date: string;
  dateFormatted: string;
  description: string;
  descriptionTypeOperation: string;
  emailAddressClient: string;
  expirationDate: string;
  hour: string;
  hourFormatted: string;
  installmentsPaid: string;
  operationNumber: number;
  productName: string;
  remainingInstallments: number;
  result: string;
  rounding: number;
  sAmountCapital: string;
  sAmountCharges: string;
  sAmountCommission: string;
  sAmountInterests: string;
  sAmountItf: string;
  sAmountMandatoryInsurance: string;
  sAmountOptionalInsurance: string;
  sRounding: string;
}

export interface DisbursCreditPayload {
  requestCode: number;
  disbursementDate: string;
  payDay: number;
  customerAccount: number;
  isPreApproved: string;
  timeEntered: number;
  insuranceCoverageDeduction: number;
  amountDisbursed: number;
  insuranceRequest: number;
  currency: number;
  financingType: string;
  insuranceCode: number;
  installments: number;
}

export interface DisbursCreditExecutePayload {
  requestCode: number;
  payDay: number;
  sendStatement?: string;
  advancedPayment?: string;
  disburseAccount: string;
  insuranceRequest: number;
  currency: number;
  financingType: string;
  insuranceCode: number;
  installments: number;
  office: number;
  accountNumber: number;
  module: number;
  amountCredit: number;
  typeCredit: string;
  amountMounth: number;
  tea: number;
  tcea: number;
  payDate: string;
  amountInsurance: number;
}
export interface IDisbursCredit {
  amountDisbursed: number;
  amountInsurance: number;
  amountInsurancePrima: number;
  paymentMonth: number;
  dateFirstPayment: string;
  sAmountDisbursed: string;
  sAmountInsurance: string;
  sAmountInsurancePrima: string;
  sPaymentMonth: string;
  stcea: string;
  stea: string;
  stotalToPay: string;
  tcea: number;
  tea: number;
  totalToPay: number;
}

export interface CreditGroupPending {
  amountInsuranceGroup: number;
  dateFirstPayment: string;
  groupCreditAmount: number;
  groupAmountDisburse: number;
  groupAmountTotal: number;
  groupName: string;
  groupPayFrequency: number;
  groupPaymentFee: number;
  groupPayments: number;
  groupRequestCode: string;
  hasInsuranceGroup: string;
  participant: IParticipant[];
  sAmountInsuranceGroup: string;
  sDateFirstPayment: string;
  sGroupAmountDisburse: string;
  sGroupCreditAmount: string;
  sGroupAmountTotal: string;
  sGroupPayFrequency: string;
  sGroupPaymentFee: string;
  sGroupPayments: string;
  sTcea: string;
  sTea: string;
  tcea: number;
  tea: number;
}

export interface IParticipant {
  amountApproved: number;
  amountFinancedInsurance: number;
  amountRequested: number;
  amountSavings: number;
  clientCode: string;
  codeInsurance: number;
  descriptionInsurance: string;
  fullNameParticipant: string;
  hasInsurance: boolean;
  individualRequestCode: string;
  lastNameParticipant: string;
  nameParticipant: string;
  sAmountApproved: string;
  sAmountFinancedInsurance: string;
  sAmountRequested: string;
  sAmountSavings: string;
}

export interface IContractedCredit {
  amountInsuranceGroup: number;
  codeRequestGroup: string;
  dateTransaction: string;
  hourTransaction: string;
  email: string;
  hasInsuranceGroup: string;
}

export interface ILineCredit {
  dateEffective: string;
  dateTransaction: string;
  disbursedAmount: number;
  hourTransaction: string;
  operationNumber: number;
  sDisbursedAmount: string;
  email: string;
}

export interface IListLineCredit {
  credits: IListLineCreditDetail[];
  deadlines: IElmentList[];
  limitAmounts: IElmentList[];
}
export interface IListLineCreditDetail {
  amountCreditLineUsed: number;
  sAmountCreditLineUsed: string;
  availableCreditLineAmount: number;
  sAvailableCreditLineAmount: string;
  creditLineAmount: number;
  creditType: number;
  sCreditLineAmount: string;
  debtTotalCreditLine: number;
  sDebtTotalCreditLine: string;
  hiringDate: string;
  sEffectiveDate: string;
  sHiringDate: string;
  lineStateCode: number;
  operationType: number;
  paymentDay: number;
  isFirstDisposition: boolean;
  quantityProvisions: number;
}

export interface IDisburseLinePayload {
  codeVerification: string;
  dispositionAccount: string;
}

export interface IDisburseLine {
  loanAmount: number;
  dateAccountingValue: string;
  operationNumber: number;
  transaction: number;
  deliveredAmount: number;
  relation: number;
  itf: number;
  subOperationNumber: number;
  module: number;
  sLoanAmount: string;
  dateTransaction: string;
  hourTransaction: string;
  email: string;
  sDeliveredAmount: string;
  paymentMonth: string;
  payments: string;
  dateFirstPayment: string;
  payDay: string;
  tea: string;
  tcea: string;
  currentDebtCancellation: string;
  totalAmountRequested: string;
  amountAvailable: string;
  dispositionAccount: string;
  IsFirstDisposition: boolean;
}

export interface ISimulationLinePayload {
  requiredAmount: number;
  requiredTerms: number;
  paymentDay: number;
}

export interface ISimulationLine {
  firstQuoteDate: string;
  quoteAmount: number;
  quotesNumber: number;
  sQuoteAmount: string;
  sTotalAmount: string;
  tea: number;
  tem: number;
  totalAmount: number;
  sTotalAmountRequest: string;
  sAmountAccount: string;
  sCurrentDebtCancellation: string;
}

export interface IRequestLineCreditPayload {
  amount: number;
  paymentDay: number;
  tem: number;
  terms: number;
}

export interface IRequestLineCredit {
  dataResult: boolean;
  firstQuoteDate: string;
  monthAmount: number;
  paymentDay: number;
  requestCode: number;
  tcea: number;
  tea: number;
  terms: number;
  totalAmount: number;
  sTea: string;
  sTcea: string;
  sPaymentDay: string;
  sTotalAmount: string;
  sMonthAmount: string;
  sFirstQuoteDate: string;
  sTerms: string;
  sTotalAmountDisbursement: string;
  sAmount: string;
  sCurrentDebtCancellation: string;
}

export interface IElmentList {
  name: string;
  order: number;
  value: string;
}

export interface IDetailTermsAndConditions {
  acceptanceType: number;
  value: boolean;
}
export interface ITermsAndConditionsPayload {
  personId: number;
  productType: string;
  identifierCode: number;
  channel: string;
  detail: IDetailTermsAndConditions[];
}

export interface ITermsAndConditionsRes {
  success?: boolean;
  warning?: boolean;
  message?: string;
  errorCode?: string;
}
