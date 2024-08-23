import {Fetch} from '@utils/apiFetch';
import {getToken} from '@utils/getToken';
import {getIpAddress} from '@services/User';
import {NativeModules} from 'react-native';
import { ProductDomain } from '@global/information';
import { apiGeeStatus, createHeadersApiGee } from '@utils/firebase';
const {FingerprintModule} = NativeModules;

interface Response<T> {
  data: T;
  errorCode: string;
  isSuccess: boolean;
  isWarning: boolean;
  message: string;
}

export interface DestinationListInterface {
  bankCode: string;
  destinationName: string;
}

export interface GetCustomersDataInterface {
  TransactionId: string;
  dateHour: string;
  destinationList: Array<DestinationListInterface>;
}

export interface IDataError {
  title: string;
  content: string;
  button: string;
  button2?: string;
}
export interface IGetContactData {
  beneficiaryFullName: string;
  destinationAccount: string;
  dateTransaction: string;
  destinationCommission: number;
  hourTransaction: string;
  operationUId: number;
  originAccount: string;
  typeOriginAccount: string;
}
export interface IAffiliateInterop {
  accountSaving: string;
  accountSavingName: string;
  cellPhone: string;
  dateFormatted: string;
  email: string;
  hourFormatted: string;
}

export interface IInteroperabilityExecutePayload {
  destinationBankCode: string;
  destinationCellPhone: string;
  isCheckTermsAndConditions: boolean;
  movementAmount: number;
  movementCurrency: number;
  codeVerification: string;
}
export interface IInteroperabilityExecuteData {
  beneficiaryBankName: string;
  beneficiaryCellPhone: number;
  beneficiaryDocumentNumber: string;
  beneficiaryDocumentType: number;
  beneficiaryFullName: string;
  dateTransaction: string;
  email: string;
  hourTransaction: string;
  movementAmount: number;
  movementAmountFormat: string;
  movementCurrency: number;
  numberOperation: number;
}

export interface IInteroperabilityInfo {
  accountSaving: string;
  accountSavingName: string;
  cci: string;
  operationUId: string;
  formatCurrency: string;
  sAvailableBalance: string;
}

export interface IAffilliatePayload {
  accountSaving: string;
  accountSavingName: string;
  cci: string;
  operationUId: string;
  currentAccountSaving?: string;
}

export const getCustomers = async ({
  phoneNumber,
  user,
  screen,
}: {
  phoneNumber: string;
  user: string;
  screen: string;
}): Promise<Response<GetCustomersDataInterface | IDataError> | never> => {
  const isAPIGee = await apiGeeStatus('mgnt_cus');
  const url = `${isAPIGee ? ProductDomain.customer + `/customers/interoperability/${phoneNumber}` : `/api/customers/interoperability/${phoneNumber}`}`;

  const res = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Cookie:
        'incap_ses_129_2909229=z84rLcQ+Civ7Afc+Ek3KAYKzJWUAAAAAA3nbsfWOAs1q6o1YTDnMVQ==; visid_incap_2909229=02k23x3lT4y675plhohyhIU3TGQAAAAAQUIPAAAAAAC6Lx/8tMLVIPE8RPMCoeXz',
        ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    closeSessionOnError: true,
    user,
    screen,
    isSecure: isAPIGee,
  });

  return res;
};

export const getContactData = async ({
  payload,
  user,
  screen,
}: {
  payload: any;
  user: string;
  screen: string;
}): Promise<Response<IGetContactData | IDataError> | never> => {
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/savings/query/interoperability' : '/api/transfers/savings/query/interoperability'}`;

  const data = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      ...payload,
    },
    closeSessionOnError: true,
    user,
    screen,
    isSecure: isAPIGee,
  });
  if (data.isSuccess === false) {
    if (data.data.content) {
      return data;
    } else {
      throw new Error(`${data.errorCode}: ${data.message}`);
    }
  } else {
    return data;
  }
};

export const interoperabilityExecute = async ({
  payload,
  user,
  screen,
}: {
  payload: IInteroperabilityExecutePayload;
  user: string;
  screen: string;
}): Promise<
  | {
      errorCode: '0';
      data: IInteroperabilityExecuteData;
      isSuccess: true;
      isWarning: false;
      message: string;
    }
  | {
      errorCode: '-1' | '101' | '102';
      data: IDataError;
      isSuccess: false;
      isWarning: true;
      message: string;
    }
  | never
> => {
  const fp = await FingerprintModule.getFingerprint();
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/savings/transaction/interoperability' : '/api/transfers/savings/transaction/interoperability'}`;

  const data = await Fetch({
    url,
    method: 'POST',
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
    closeSessionOnError: true,
    user,
    screen,
    isSecure: isAPIGee,
  });
  return data;
};

export const getInteroperabilityInfo = async ({
  user,
  screen,
}: {
  user: string;
  screen: string;
}): Promise<Response<IInteroperabilityInfo | {} | null> | never> => {
  const isAPIGee = await apiGeeStatus('mgnt_cus');
  const url = `${isAPIGee ? ProductDomain.customer + '/interoperability/exists' : '/api/customers/interoperability/exists'}`;

  const data = await Fetch({
    url,
    method: 'GET',
    timeout: 60000,
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
  return data;
};

export const affiliateInteroperability = async ({
  payload,
  user,
  screen,
}: {
  payload: IAffilliatePayload;
  user: string;
  screen: string;
}): Promise<
  | {
      errorCode: '0';
      data: IAffiliateInterop;
      isSuccess: true;
      isWarning: false;
      message: string;
    }
  | {
      errorCode: '0';
      data: IDataError;
      isSuccess: false;
      isWarning: true;
      message: string;
    }
  | never
> => {
  const ipAddress = await getIpAddress();
  const isAPIGee = await apiGeeStatus('mgnt_cus');
  const url = `${isAPIGee ? ProductDomain.customer + '/interoperability' : '/api/customers/interoperability'}`;

  const data = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      ...payload,
      ipAddress,
    },
    closeSessionOnError: true,
    user,
    screen,
    isSecure: isAPIGee,
  });
  return data;
};

export const updateAffiliation = async ({
  payload,
  user,
  screen,
}: {
  payload: IAffilliatePayload;
  user: string;
  screen: string;
}): Promise<
  | {
      errorCode: '0';
      data: IAffiliateInterop;
      isSuccess: true;
      isWarning: false;
      message: string;
    }
  | {
      errorCode: '0';
      data: IDataError;
      isSuccess: false;
      isWarning: true;
      message: string;
    }
  | never
> => {
  const isAPIGee = await apiGeeStatus('mgnt_cus');
  const url = `${isAPIGee ? ProductDomain.customer + '/interoperability' : '/api/customers/interoperability'}`;

  const data = await Fetch({
    url,
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      ...payload,
    },
    closeSessionOnError: true,
    user,
    screen,
    isSecure: isAPIGee,
  });
  return data;
};

export const disaffiliation = async ({
  user,
  screen,
  payload,
}: {
  user: string;
  screen: string;
  payload: {
    accountSaving: string;
    accountSavingName: string;
  };
}): Promise<
  | {
      errorCode: '0';
      data: IAffiliateInterop;
      isSuccess: true;
      isWarning: false;
      message: string;
    }
  | {
      errorCode: '0';
      data: IDataError;
      isSuccess: false;
      isWarning: true;
      message: string;
    }
  | never
> => {
  const isAPIGee = await apiGeeStatus('mgnt_cus');
  const {accountSaving, accountSavingName} = payload;
  const url = `${isAPIGee ? ProductDomain.customer + `/interoperability?accountSaving=${accountSaving}&accountSavingName=${accountSavingName}` : `/api/customers/interoperability?accountSaving=${accountSaving}&accountSavingName=${accountSavingName}`}`;

  const data = await Fetch({
    url: encodeURI(
      url
    ),
    method: 'DELETE',
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
  return data;
};
