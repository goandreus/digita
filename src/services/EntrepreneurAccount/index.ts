import { ProductDomain } from '@global/information';
import {Fetch} from '@utils/apiFetch';
import { apiGeeStatus, createHeadersApiGee } from '@utils/firebase';
import {getToken} from '@utils/getToken';

type EvaluateEntrepreneurInterface =
  | {
      data: {
        clientUId: number;
        isEvaluationCorrect: true;
      };
      errorCode: '0';
      isSuccess: true;
      isWarning: false;
      message: '';
    }
  | {
      data: {
        title: string;
        content: string;
        button: string;
      };
      errorCode: '0';
      isSuccess: false;
      isWarning: true;
      message: '';
    };

interface IOpenEntrepreneurRequest {
  productUIdTypeOperation: string;
  clientUId: number;
  provinceId: number;
  departmentId: number;
  ipAddress: string;
  deviceOs: string;
  recommendationCode: number;
}

export type IOpenEntrepreneurData =
  | {
      data: {
        accountSaving: string;
        accountSavingName: string;
        cci: string;
        cellPhone: string;
        dateFormatted: string;
        email: string;
        hourFormatted: string;
        firstName: string;
      };
      errorCode: '0';
      isSuccess: true;
      isWarning: false;
      message: '';
    }
  | {
      data: {
        title: string;
        content: string;
        button: string;
      };
      errorCode: '0';
      isSuccess: false;
      isWarning: true;
      message: '';
    };

export const EvaluateEntrepreneurAccount = async ({
  documentType,
  documentNumber,
  screen,
}: {
  documentType: number | undefined;
  documentNumber: string | undefined;
  screen: string;
}): Promise<EvaluateEntrepreneurInterface | never> => {
  const isAPIGee = await apiGeeStatus('mgnt_acc');
  const url = `${isAPIGee ? ProductDomain.account + '/person/evaluation' : '/api/accounts/person/evaluation'}`;
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

export const OpenEntrepreneurAccount = async ({
  payload,
  documentType,
  documentNumber,
  screen,
}: {
  payload: IOpenEntrepreneurRequest;
  documentType: number | undefined;
  documentNumber: string | undefined;
  screen: string;
}): Promise<IOpenEntrepreneurData | never> => {
  const isAPIGee = await apiGeeStatus('mgnt_acc');
  const url = `${isAPIGee ? ProductDomain.account + '/product/associate/interoperability' : '/api/accounts/product/associate/interoperability'}`;
  const data = await Fetch({
    url,
    body: payload,
    method: 'POST',
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
