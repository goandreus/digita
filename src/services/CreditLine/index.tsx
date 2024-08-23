import {
  ISimulationLine,
  ISimulationLinePayload,
  ILineCredit,
  IListLineCredit,
  IDisburseLinePayload,
  IDisburseLine,
  IRequestLineCreditPayload,
  IRequestLineCredit,
} from '@interface/Credit';
import {getIpAddress} from '@services/User';
import {NativeModules} from 'react-native';
import {Fetch} from '@utils/apiFetch';
import {getToken} from '@utils/getToken';
import {ProductDomain} from '@global/information';
import { CreditDetailInterface } from '@services/Accounts';
import { apiGeeStatus, createHeadersApiGee } from '@utils/firebase';
const {FingerprintModule} = NativeModules;

export interface IErrorData {
  title: string;
  message: string;
}

export interface IErrorFormat2 {
  title: string;
  content: string;
  messageButton: string;
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

export const ContractLineCredit = async ({
  documentType,
  documentNumber,
  screen,
  payload,
}: {
  documentType?: number;
  documentNumber?: string;
  screen?: string;
  payload: {
    codeVerification: string;
    requestCode: number;
    credit: number;
    payDay: number;
  };
}): Promise<IResponse<ILineCredit, IErrorFormat2>> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${isAPIGee ? ProductDomain.creditsApiGee + '/credit-line/contracting' : '/api/credits/credit-line/contracting'}`;

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
  return data;
};

export const ListLineCredit = async ({
  documentType,
  documentNumber,
  screen,
}: {
  documentType?: number;
  documentNumber?: string;
  screen?: string;
}): Promise<IResponse<IListLineCredit>> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${isAPIGee ? ProductDomain.creditsApiGee + '/credit-line/availableList' : '/api/credits/credit-line/availableList'}`;

  const data = await Fetch({
    url,
    method: 'GET',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    user: `0${documentType}${documentNumber}`,
    base: isAPIGee ? 'GEE' : 'GW',
    screen,
    isSecure: isAPIGee,
  });
  return data;
};

export const SimulatorLineCredit = async ({
  documentType,
  documentNumber,
  screen,
  payload,
}: {
  documentType?: number;
  documentNumber?: string;
  screen?: string;
  payload: ISimulationLinePayload;
}): Promise<IResponse<ISimulationLine>> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${isAPIGee ? ProductDomain.creditsApiGee + '/credit-line/simulator' : '/api/credits/credit-line/simulator'}`;

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

export const CreateRequestLineCredit = async ({
  documentType,
  documentNumber,
  screen,
  payload,
}: {
  documentType?: number;
  documentNumber?: string;
  screen?: string;
  payload: IRequestLineCreditPayload;
}): Promise<IResponse<IRequestLineCredit, IErrorFormat2>> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${isAPIGee ? ProductDomain.creditsApiGee + '/credit-line/createRequest' : '/api/credits/credit-line/createRequest'}`;

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

export const DisburseLineCredit = async ({
  documentType,
  documentNumber,
  screen,
  payload,
}: {
  documentType?: number;
  documentNumber?: string;
  screen?: string;
  payload: IDisburseLinePayload;
}): Promise<IResponse<IDisburseLine>> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${isAPIGee ? ProductDomain.creditsApiGee + '/credit-line/disposition' : '/api/credits/credit-line/disposition'}`;

  const fp = await FingerprintModule.getFingerprint();

  const data = await Fetch({
    url,
    method: 'POST',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    body: {
      ...payload,
      ipAddress: await getIpAddress(),
      fingerPrintDevice: JSON.parse(fp),
    },
    user: `0${documentType}${documentNumber}`,
    closeSessionOnError: true,
    base: isAPIGee ? 'GEE' : 'GW',
    screen,
    isSecure: isAPIGee,
  });
  return data;
};

export const getCreditDetail = async ({
  accountCode,
  user,
  screen,
}: {
  accountCode: number | string;
  user?: string;
  screen?: string;
}): Promise<CreditDetailInterface> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${isAPIGee ? ProductDomain.creditsApiGee + `/operations/${accountCode}` : `/api/credits/operations/${accountCode}`}`;

  const data = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    closeSessionOnError: true,
    user,
    screen,
    isSecure: isAPIGee,
  });

  if (data.isSuccess === false)
    throw new Error(`${data.errorCode}: ${data.message}`);
  else return data.data;
};