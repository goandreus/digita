/* eslint-disable curly */
import {IDebts, IDebtsServiceResult, IService} from '@features/categoryInPayment/types';
import { ProductDomain } from '@global/information';
import {IFavoriteDTO, IFavoriteUpdate} from '@interface/Favorite';
import {getIpAddress} from '@services/User';
import {Fetch} from '@utils/apiFetch';
import { apiGeeStatus, createHeadersApiGee } from '@utils/firebase';
import {getToken} from '@utils/getToken';
import {NativeModules} from 'react-native';
const {FingerprintModule} = NativeModules;


export interface Query<T> {
  data: T;
  message: string;
  errorCode: string;
  isSuccess: boolean;
  isWarning: boolean;
}

interface LocalBankProps {
  concept: string;
  destinationAccount: string;
  movementAmount: number | null;
  movementCurrency: number;
  originAccount: string;
  codeVerification?: string;
  destinationBankCode?: string;
  destinationCellPhone?: string;
}

interface LocalBankConfirmationProps {
  concept: string;
  destinationAccount: string;
  movementAmount: number | null;
  movementCurrency: number;
  originAccount: string;
  typeDestinationAccount: string;
  typeOriginAccount: string;
}

export interface LocalBankData {
  itfTax: number;
  movementId: number;
  ownerFullName: string;
  dateTransaction: string;
  hourTransaction: string;
}

export interface OtherBanksProps {
  beneficiaryDocumentNumber: string;
  beneficiaryDocumentType: number;
  beneficiaryName: string;
  destinationAccount: string;
  operationUId: number;
  destinationBank: number;
  holderName: string;
  movementAmount: number;
  movementCurrency: number;
  originAccount: string;
  concept: string;
  sameHeadLine?: boolean;
  typeOriginAccount?: string;
  codeVerification?: string;
  transactionType?: 'I' | 'D';
  mpe001IDL?: number;
  transferId?: string;
}

export interface OtherBanksData {
  destinationCommission: number;
  itfTax: number;
  movementId: number;
  originCommission: number;
  ownerFullName: string;
  dateTransaction: string;
  hourTransaction: string;
}

export interface RefillBanksProps {
  amount: number;
  accountType: string;
  receivingfri: string;
  accountNumber: string;
  codeVerification: string;
  documentType: number | undefined;
  documentNumber: string | undefined;
}

export interface RefillBanksData {
  date: string;
  hour: string;
  transactionId: number;
  message: {
    title: string;
    content: string;
  };
}

export interface RefillQueryProps {
  accountNumber: string;
}

export const ownAccountsQuery = async ({
  payload,
  documentType,
  documentNumber,
  screen,
}: {
  payload: LocalBankProps;
  documentType?: number;
  documentNumber?: string;
  screen?: string;
}) => {
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/savings/query/local' : '/api/transfers/savings/query/local'}`;

  const data = await Fetch({
    url,
    method: 'POST',
    body: payload,
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

export const GetDebts = async (props: {
  company: {groupId: string; code: string};
  service: {serviceId: string; supplyNumber: string;};
  user: {documentType: number; documentNumber: string};
  screeName: string;
}): Promise<IDebts> => {
  const isAPIGee = await apiGeeStatus('mgnt_pay');
  const url = `${isAPIGee ? ProductDomain.payments + '/services/query' : '/api/payments/services/query'}`;

  const data: {
    data: IDebtsServiceResult | null | undefined;
    errorCode: string;
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    body: {
      companyCode: props.company.code,
      groupId: props.company.groupId,
      serviceId: props.service.serviceId,
      supplyNumber: props.service.supplyNumber,
    },
    method: 'POST',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${props.user.documentType}${props.user.documentNumber}`,
    screen: props.screeName,
    isSecure: isAPIGee,
  });
  if (data.isSuccess === true && data.data !== undefined && data.data !== null) {
    return {
      ...data.data,
      list: Array.isArray(data.data.list) ?
        data.data.list.map((item) => ({
          ...item,
          totalCommission: item.totalCommission + item.referenceCommission,
          debtAmount: item.debtAmount - item.referenceCommission
        }))
        : []
    };
  }
  else if (data.message.toLocaleLowerCase() === 'no tiene deuda')
    return {clientname: '', list: []};
  else if (data.errorCode === '35') {
    return {clientname: '', list: []};
  } else throw new Error('No se obtuvieron servicios');
};

export const PayDebt = async (props: {
  payload: {
    accountNumber: string;
    accountType: string;
    amount: number;
    invoiceNumber: string;
    supplyNumber: string;
    codeVerification: string;
  };
  user: {documentType: number; documentNumber: string};
  screeName: string;
}): Promise<TPayDebtsFunctionResult> => {
  const fp = await FingerprintModule.getFingerprint();
  const isAPIGee = await apiGeeStatus('mgnt_pay');
  const url = `${isAPIGee ? ProductDomain.payments + '/services/transaction' : '/api/payments/services/transaction'}`;

  const data: TPayDebtsServiceResult = await Fetch({
    url,
    body: {
      accountType: props.payload.accountType,
      accountNumber: props.payload.accountNumber,
      amount: props.payload.amount,
      invoiceNumber: props.payload.invoiceNumber,
      currency: 1,
      supplyNumber: props.payload.supplyNumber,
      terminalId: "A",
      ipAddress: await getIpAddress(),
      fingerPrintDevice: JSON.parse(fp),
      codeVerification: props.payload.codeVerification
    },
    method: 'POST',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${props.user.documentType}${props.user.documentNumber}`,
    screen: props.screeName,
    isSecure: isAPIGee,
  });
  if (data.isSuccess === true)
    return {
      type: 'SUCCESS',
      payload: {
        ...data.data,
        btTransactionId: data.data.btTransactionId.toString(),
        hasGlosa: typeof data.data.gloss === 'string' && data.data.gloss !== '',
        gloss: typeof data.data.gloss === 'string' ? data.data.gloss : '',
      }
    };
  else {
    if(data.errorCode === '101'){
      return {
        type: 'NEED_AUTHENTICATION_BY_MP',
        payload: {
          phoneOfuscated: data.data.cellphone,
          trackingTransaction: data.data.trackingTransaction
        }
      }
    }
    else if(data.errorCode === '102'){
      return {
        type: 'BLOCKED_BY_MP'
      }
    }
    else {
      return {
        type: 'UNKNOWN_ERROR'
      }
    }
  }
};

export const GetCompanyDetail = async (props: {
  company: {groupId: string; code: string; businessName: string};
  user: {documentType: number; documentNumber: string};
  screeName: string;
}): Promise<{
  businessName: string;
  services: IService[];
}> => {
  const isAPIGee = await apiGeeStatus('mgnt_pay');
  const url = `${isAPIGee ? ProductDomain.payments + `/company/services?groupId=${props.company.groupId}&code=${props.company.code}` : `/api/payments/company/services?groupId=${props.company.groupId}&code=${props.company.code}`}`;

  const data: {
    data?: {
      attentionSchedule: string;
      codeName: string;
      commission: string;
      dataType: string;
      length: string;
      name: string;
      serviceId: string;
    }[];
    errorCode: string;
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'GET',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${props.user.documentType}${props.user.documentNumber}`,
    screen: props.screeName,
    isSecure: isAPIGee,
  });
  if (
    data.isSuccess === true &&
    data.data !== undefined &&
    Array.isArray(data.data)
  )
    return {
      businessName: props.company.businessName,
      services: data.data.map((item, index) => ({
        ...item,
        label: item.name,
        id: index.toString(),
        codeName: item.codeName,
      })),
    };
  else throw new Error('No se obtuvieron servicios');
};

export const GetCategories = async ({
  documentType,
  documentNumber,
  screenName,
}: {
  documentType: number;
  documentNumber: string;
  screenName: string;
}) => {
  const isAPIGee = await apiGeeStatus('mgnt_pay');
  const url = `${isAPIGee ? ProductDomain.payments + '/categories' : '/api/payments/categories'}`;

  const data: {
    data?: {
      id: number;
      name: string;
    }[];
    errorCode: string;
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'GET',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${documentType}${documentNumber}`,
    screen: screenName,
    isSecure: isAPIGee,
  });
  return data;
};

export const RefillQuery = async ({
  payload,
  documentType,
  documentNumber,
  screen,
}: {
  payload: RefillQueryProps;
  documentType?: number;
  documentNumber?: string;
  screen?: string;
}) => {
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/bim/query' : '/api/transfers/bim/query'}`;

  const data = await Fetch({
    url,
    method: 'POST',
    body: payload,
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

export const ownAccountsExecute = async ({
  payload,
  documentType,
  documentNumber,
  screen,
}: {
  payload: LocalBankConfirmationProps;
  documentType?: number;
  documentNumber?: string;
  screen?: string;
}) => {
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/savings/transaction/local' : '/api/transfers/savings/transaction/local'}`;

  const data = await Fetch({
    url,
    method: 'POST',
    body: payload,
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

export const sameBankQuery = async ({
  payload,
  documentType,
  documentNumber,
  screen,
}: {
  payload: LocalBankProps;
  documentType?: number;
  documentNumber?: string;
  screen?: string;
}) => {
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/savings/query/local/others' : '/api/transfers/savings/query/local/others'}`;

  const data = await Fetch({
    url,
    method: 'POST',
    body: payload,
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

export const sameBankExecute = async ({
  payload,
  documentType,
  documentNumber,
  screen,
}: {
  payload: LocalBankProps;
  documentType?: number;
  documentNumber?: string;
  screen?: string;
}) => {

  const fp = await FingerprintModule.getFingerprint();
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/savings/transaction/local/others' : '/api/transfers/savings/transaction/local/others'}`;

  const data = await Fetch({
    url,
    method: 'POST',
    body: {
      ...payload,
      ipAddress: await getIpAddress(),
      fingerPrintDevice: JSON.parse(fp),
    },
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

export const otherBanksQuery = async ({
  payload,
  documentType,
  documentNumber,
  screen,
}: {
  payload: OtherBanksProps;
  documentType?: number;
  documentNumber?: string;
  screen?: string;
}) => {
  console.log({
    token: getToken(),
    otp: payload.codeVerification,
  });
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/savings/query/banks' : '/api/transfers/savings/query/banks'}`;

  const data = await Fetch({
    url,
    method: 'POST',
    body: payload,
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

export const otherBanksExecute = async ({
  payload,
  documentType,
  documentNumber,
  screen,
}: {
  payload: OtherBanksProps;
  documentType?: number;
  documentNumber?: string;
  screen?: string;
}) => {
  console.log({
    token: getToken(),
    otp: payload.codeVerification,
  });

  const fp = await FingerprintModule.getFingerprint();
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/savings/transaction/banks' : '/api/transfers/savings/transaction/banks'}`;

  const data = await Fetch({
    url,
    method: 'POST',
    body: {
      ...payload,
      ipAddress: await getIpAddress(),
      fingerPrintDevice: JSON.parse(fp),
    },
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

export const refillBimExecute = async (props: RefillBanksProps) => {
  const fp = await FingerprintModule.getFingerprint();
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/bim' : '/api/transfers/bim'}`;

  const data = await Fetch({
    url,
    method: 'POST',
    body: {
      accountNumber: props.accountNumber,
      accountType: props.accountType,
      amount: props.amount,
      codeVerification: props.codeVerification,
      receivingfri: props.receivingfri,
      ipAddress: await getIpAddress(),
      fingerPrintDevice: JSON.parse(fp),
    },
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${props.documentType}${props.documentNumber}`,
    closeSessionOnError: true,
    isSecure: isAPIGee,
  });
  return data;
};

export const retrieveFavorites = async () => {
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/favorites' : '/api/transfers/favorites'}`;

  const data = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    isSecure: isAPIGee,
  });

  if (data?.isSuccess === false) {
    throw new Error(`${data.errorCode} ${data.message}`);
  } else {
    return data?.data;
  }
};

export const addFavorite = async (body: IFavoriteDTO) => {
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/favorites' : '/api/transfers/favorites'}`;

  const data = await Fetch({
    url,
    method: 'POST',
    body: body,
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    isSecure: isAPIGee,
  });

  if (data?.isSuccess === false) return null;
  return data?.data;
};

export const updateFavorite = async (body: IFavoriteUpdate) => {
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + '/favorites' : '/api/transfers/favorites'}`;

  const data = await Fetch({
    url,
    method: 'PUT',
    body: body,
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {})
    },
    base: isAPIGee ? 'GEE' : 'GW',
    isSecure: isAPIGee,
  });

  if (data?.isSuccess === false) return null;
  return data?.data;
};

export const removeFavorite = async (id: number) => {
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${isAPIGee ? ProductDomain.transfer + `/favorites/${id}` : `/api/transfers/favorites/${id}`}`;

  const data = await Fetch({
    url,
    method: 'DELETE',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {})
    },
    base: isAPIGee ? 'GEE' : 'GW',
    isSecure: isAPIGee,
  });

  if (data?.isSuccess === false) return null;
  return data?.data;
};

export const getTransferCompanies = async ({
  documentType,
  documentNumber,
  screenName,
}: {
  documentType: number;
  documentNumber: string;
  screenName: string;
}) => {
  const isAPIGee = await apiGeeStatus('mgnt_pay');
  const url = `${isAPIGee ? ProductDomain.payments + '/companies' : '/api/payments/companies'}`;

  const data = await Fetch({
    url,
    method: 'GET',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {})
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${documentType}${documentNumber}`,
    screen: screenName,
    isSecure: isAPIGee,
  });

  if (data?.isSuccess === false) {
    return null;
  }
  return data?.data;
};

export const getTransferCategories = async ({
  documentType,
  documentNumber,
  screenName,
}: {
  documentType: number;
  documentNumber: string;
  screenName: string;
}) => {
  const isAPIGee = await apiGeeStatus('mgnt_pay');
  const url = `${isAPIGee ? ProductDomain.payments + '/categories' : '/api/payments/categories'}`;

  const data = await Fetch({
    url,
    method: 'GET',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {})
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${documentType}${documentNumber}`,
    screen: screenName,
    isSecure: isAPIGee,
  });

  if (data?.isSuccess === false) {
    return null;
  }
  return data?.data;
};

export const getRechargeCompanies = async ({
  documentType,
  documentNumber,
  screenName,
}: {
  documentType: number;
  documentNumber: string;
  screenName: string;
}) => {
  const isAPIGee = await apiGeeStatus('mgnt_pay');
  const url = `${isAPIGee ? ProductDomain.payments + '/collection/services?categoryId=1' : '/api/payments/collection/services?categoryId=1'}`;

  const data = await Fetch({
    url,
    method: 'GET',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {})
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${documentType}${documentNumber}`,
    screen: screenName,
    isSecure: isAPIGee,
  });

  if (data?.isSuccess === false) {
    return null;
  }
  return data?.data;
};
