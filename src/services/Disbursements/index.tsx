import {
  DisbursCreditExecutePayload,
  DisbursCreditPayload,
  IDisbursCredit,
  CreditGroupPending,
  IContractedCredit,
} from '@interface/Credit';
import {Fetch} from '@utils/apiFetch';
import {getToken} from '@utils/getToken';
import {getIpAddress} from '@services/User';
import {NativeModules} from 'react-native';
import {apiGeeStatus, createHeadersApiGee, getRemoteValue} from '@utils/firebase';
import {ProductDomain} from '@global/information';
const {FingerprintModule} = NativeModules;

export interface Query<T> {
  data: T;
  errorCode: string;
  isSuccess: boolean;
  isWarning: boolean;
  message: string;
}

export interface IErrorData {
  title: string;
  message: string;
}

export interface CreditPendingData {
  account: number;
  agency: number;
  credit: number;
  currency: string;
  payDay: string;
  module: number;
  paymentMonth: number;
  payments: string;
  product: string;
  requestCode: number;
  sCreditFormat1: string;
  sCreditFormat2: string;
  sCreditDeposit: string;
  sPaymentMonth: string;
  insurance: string;
  insuranceName: string;
  insuranceAmount: number;
  sInsuranceAmount: string;
  insuranceCode: number;
  insuranceRequestCode: number;
  insuranceSubsidiary: number;
  insuranceTypeFinancing: string;
  tcea: string;
  tea: string;
}
type IResponse<T, E = IErrorData> =
  | {
      data: T | null;
      errorCode: string;
      isSuccess: true;
      isWarning: boolean;
      message: string;
    }
  | {
      data: E | null;
      errorCode: string;
      isSuccess: false;
      isWarning: boolean;
      message: string;
    };

export interface DisbursedCreditData {
  ITF: number;
  canceledAmount: number;
  disbursedAmount: number;
  loanAmount: number;
  operationNumber: number;
  typeAccount: string;
  disburseAccount: string;
  optionalInsurance: number;
  paymentDate: string;
  dateTransaction: string;
  hourTransaction: string;
  email: string;
}

export interface DisbursedCredit {
  data: DisbursedCreditData | null;
  errorCode: string;
  isSuccess: boolean;
  isWarning: boolean;
  message: string;
}

export const haveCreditPending = async ({
  documentType,
  documentNumber,
  screen,
}: {
  documentType?: number;
  documentNumber?: string;
  screen?: string;
}): Promise<IResponse<CreditPendingData>> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${isAPIGee ? ProductDomain.creditsApiGee + '/pending-disbursement' : '/api/credits/pending-disbursement'}`;

  const data = await Fetch({
    url,
    method: 'GET',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${documentType}${documentNumber}`,
    closeSessionOnError: true,
    screen,
    isSecure: isAPIGee,
  });
  return data;
};

export const DisbursCredit = async ({
  documentType,
  documentNumber,
  screen,
  payload,
}: {
  documentType?: number;
  documentNumber?: string;
  screen?: string;
  payload: DisbursCreditPayload;
}): Promise<IResponse<IDisbursCredit> | null> => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${isAPIGee ? ProductDomain.creditsApiGee + '/rules/disburse' : '/api/credits/rules/disburse'}`;

  const data = await Fetch({
    url,
    method: 'POST',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: payload,
    user: `0${documentType}${documentNumber}`,
    closeSessionOnError: true,
    screen,
    isSecure: isAPIGee,
  });
  if (data) return data;
  return null;
};

export const DisbursCreditExecute = async ({
  documentType,
  documentNumber,
  screen,
  payload,
}: {
  documentType?: number;
  documentNumber?: string;
  screen?: string;
  payload: DisbursCreditExecutePayload;
}): Promise<Query<DisbursedCreditData | null>> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${isAPIGee ? ProductDomain.creditsApiGee + '/disburse-credit' : '/api/credits/disburse-credit'}`;

  const fp = await FingerprintModule.getFingerprint();
  const data = await Fetch({
    url,
    method: 'POST',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      ...payload,
      ipAddress: await getIpAddress(),
      fingerPrintDevice: JSON.parse(fp),
    },
    user: `0${documentType}${documentNumber}`,
    closeSessionOnError: true,
    screen,
    isSecure: isAPIGee,
  });
  return data;
};

export const haveGroupCreditPending = async ({
  documentType,
  documentNumber,
  screen,
}: {
  documentType?: number;
  documentNumber?: string;
  screen?: string;
}): Promise<IResponse<CreditGroupPending>> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${isAPIGee ? ProductDomain.creditsApiGee + '/group/credit-requests-group' : '/api/credits/group/credit-requests-group' }`;

  const data = await Fetch({
    url,
    method: 'GET',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    user: `0${documentType}${documentNumber}`,
    closeSessionOnError: true,
    base: isAPIGee ? 'GEE' : 'GW',
    screen,
    isSecure: isAPIGee,
  });
  return data;
};

export const ContractGroupCredit = async ({
  documentType,
  documentNumber,
  screen,
  payload,
}: {
  documentType?: number;
  documentNumber?: string;
  screen?: string;
  payload: {codeVerification: string};
}): Promise<IResponse<IContractedCredit>> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${isAPIGee ? ProductDomain.creditsApiGee + '/group/contracting' : '/api/credits/group/contracting'}`;

  const data = await Fetch({
    url,
    method: 'POST',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    body: payload,
    user: `0${documentType}${documentNumber}`,
    closeSessionOnError: true,
    base: isAPIGee ? 'GEE' : 'GW',
    screen,
    isSecure: isAPIGee,
  });
  return data;
};
