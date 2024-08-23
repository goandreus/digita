import {Fetch} from '@utils/apiFetch';
import {getToken} from '@utils/getToken';
import {
  CancellationInterfaceRes,
  CancellationPayload,
} from '@interface/Cancellation';
import { ProductDomain } from '@global/information';
import { apiGeeStatus, createHeadersApiGee } from '@utils/firebase';

export const CancelAccount = async ({
  documentType,
  documentNumber,
  screen,
  payload,
}: {
  documentType?: number;
  documentNumber?: string;
  screen?: string;
  payload: CancellationPayload;
}): Promise<CancellationInterfaceRes> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_acc');
  const url = `${isAPIGee ? ProductDomain.account + '/cancel' : '/api/accounts/cancel'}`;

  const data = await Fetch({
    url,
    method: 'PUT',
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
