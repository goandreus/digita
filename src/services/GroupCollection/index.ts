import {
  APP_WEBVIEW_URL,
  CLIENT_ID_GEE,
  KeyEnv,
  URL_WEBVIEW_KEY,
} from '@constants';
import {decryptText, encrypt} from '@utils/AES';
import {Fetch} from '@utils/apiFetch';
import {apiGeeStatus, createHeadersApiGee, getRemoteValue} from '@utils/firebase';
import {getToken} from '@utils/getToken';
import NativeConfig from 'react-native-config';
import {Buffer} from 'buffer';
import { ProductDomain } from '@global/information';

export async function getMemberRoleAndGroupCode() {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${isAPIGee ? ProductDomain.creditsApiGee + '/group/approved' : '/api/credits/group/approved'}`;

  const response = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    isSecure: isAPIGee,
  });
  const {cargoIntegrante: role, codigoSolGrupal: groupCode} = response.data;

  return {role, groupCode};
}

interface GroupCollectionRequest {
  token: string;
  memberRole: string;
  operationID: string;
  groupCode: string;
  dueDate: string;
  quota: string;
  clientName: string;
  identityDocument: string;
  groupQuotaAmount: string;
  quotasNumber: string;
}

export async function saveDataGroupCollection(request: GroupCollectionRequest) {
  const response = await Fetch({
    url: '/apiexp/loans-and-deposit/group-loan/api-credits/v1/cloud/adjustment-memory',
    method: 'POST',
    base: 'GEE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'x-api-key': CLIENT_ID_GEE[NativeConfig.ENV as KeyEnv],
      client_id: CLIENT_ID_GEE[NativeConfig.ENV as KeyEnv],
      'x-fuse-flag': 'ON',
    },
    body: request,
  });

  const {data} = response;

  return data;
}

export async function getURLGroupCollection() {
  const baseUrl = APP_WEBVIEW_URL[NativeConfig.ENV as KeyEnv];
  const keyEncrypted = getRemoteValue('kle_wv').asString();

  const urlWebViewKey = URL_WEBVIEW_KEY[NativeConfig.ENV as KeyEnv];
  const secretKey = decryptText(keyEncrypted, urlWebViewKey) ?? '';

  const token = getToken() ?? '';
  const [, payload] = token.split('.');
  const dataToken = Buffer.from(payload, 'base64').toString();
  const {sub} = JSON.parse(dataToken);

  const value = encrypt(`_PAYMENTS_GROUP_${sub}`, secretKey) ?? '';
  const encodedValue = encodeURIComponent(value);
  const url = `${baseUrl}/auth/callback?value=${encodedValue}`;

  return url;
}

export async function getIsProcessingPaymentContribution(operationId: number) {
  const response = await Fetch({
    url: `/apiexp/loans-and-deposit/group-loan/api-credits/v1/payments/adjustment/cache/${operationId}`,
    method: 'GET',
    base: 'GEE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'x-api-key': CLIENT_ID_GEE[NativeConfig.ENV as KeyEnv],
      client_id: CLIENT_ID_GEE[NativeConfig.ENV as KeyEnv],
      'x-fuse-flag': 'ON',
    },
  });

  const {data} = response;

  return data;
}
