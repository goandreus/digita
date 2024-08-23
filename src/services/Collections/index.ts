import {Fetch} from '@utils/apiFetch';
import {TokenManager} from '@managers/TokenManager';
import { ProductDomain } from '@global/information';
import { apiGeeStatus, createHeadersApiGee } from '@utils/firebase';


export const getDepartments = async (): Promise<any> | never => {
  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${isAPIGee ? ProductDomain.onboarding + '/catalogue/countries/604/departments' : '/api/onboarding/catalogue/countries/604/departments'}`;

  const data = await Fetch({
    url,
    method: 'GET',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    closeSessionOnError: false,
    isSecure: isAPIGee,
  });
  return data;
};

export const getProvinces = async (
  departmentId: number,
): Promise<any> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${isAPIGee ? ProductDomain.onboarding + `/catalogue/countries/604/departments/${departmentId}/provinces` : `/api/onboarding/catalogue/countries/604/departments/${departmentId}/provinces`}`;

  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );
  const data = await Fetch({
    url,
    method: 'GET',
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    closeSessionOnError: true,
    isSecure: isAPIGee,
  });
  return data;
};
