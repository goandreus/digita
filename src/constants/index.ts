import DeviceInfo from 'react-native-device-info';

export const CHECK_ROOT = true;

export const urlIOS =
  'https://apps.apple.com/pe/app/compartamos-m%C3%B3vil-per%C3%BA/id1373822958';
export const urlAndroid =
  'https://play.google.com/store/apps/details?id=pe.com.compartamos.bancamovil';
export const urlHuawei = 'https://appgallery.huawei.com/app/C107767017';

export const checkIfHuaweiOS = async () => {
  return false;
};

export const CHANNEL = 'APP';

export const BUNDLE_ID = {
  dev: 'pe.com.compartamos.bancamovil.dev',
  qa: 'pe.com.compartamos.bancamovil.qa',
  qas: 'pe.com.compartamos.bancamovil.qas',
  prod: 'pe.com.compartamos.bancamovil',
};
export const BASE_URL = {
  dev: 'https://apinoprdbdm.compartamos.com.pe/dev',
  qa: 'https://apinoprdbdm.compartamos.com.pe/qa',
  qas: 'https://cf-bancadigital-gateway2-qa-6wd642mf.ue.gateway.dev',
  prod: 'https://apibdmprd.compartamos.com.pe',
};
export const BASE_URL_API_GEE = {
  dev: 'https://apimngdev.compartamos.com.pe',
  qa: 'https://apimngqa.compartamos.com.pe',
  qas: 'https://apimngdev.compartamos.com.pe',
  prod: 'https://api.compartamos.com.pe',
};
export const CERT = {
  dev: 'apinoprdbdm',
  qa: 'apinoprdbdm',
  qas: 'apinoprdbdm',
  prod: 'apibdmprd_compartamos_com_pe',
};
export const CERT_GEE = {
  dev: 'apimngdev',
  qa: 'apimngqa',
  qas: 'apimngqa',
  prod: 'apimng',
};
export const CERT_2 = {
  dev: 'apibdmprd_compartamos_com_pe_2',
  qa: 'apibdmprd_compartamos_com_pe_2',
  qas: 'apibdmprd_compartamos_com_pe_2',
  prod: 'apibdmprd_compartamos_com_pe_2',
};
export const DYNATRACE_BEACON_URL = {
  dev: 'https://bf48910glg.bf.dynatrace.com/mbeacon',
  qa: 'https://bf48910glg.bf.dynatrace.com/mbeacon',
  qas: 'https://bf48910glg.bf.dynatrace.com/mbeacon',
  prod: 'https://bf48910glg.bf.dynatrace.com/mbeacon',
};
export const APPLICATIONID = {
  dev: '04920f58-6444-42ef-a286-494d0f5ade94',
  qa: '6cfa4926-82a7-488d-aeaf-a5560f0a99b3',
  qas: '04920f58-6444-42ef-a286-494d0f5ade94',
  prod: 'af2629b2-9162-42a5-b74f-b2c938c3c82d',
};
export const QY_QR = {
  dev: 'MG1ei01NCJ4y+YG7/aG9HZiDeEkzFM7W',
  qa: 'MG1ei01NCJ4y+YG7/aG9HZiDeEkzFM7W',
  qas: 'MG1ei01NCJ4y+YG7/aG9HZiDeEkzFM7W',
  prod: '7CmWATuChuy6wAmKOg3GrPyZwuHkgY9S',
};
export const CT_QR = {
  dev: '956736f54616d6f7',
  qa: '956736f54616d6f7',
  qas: '956736f54616d6f7',
  prod: '952336f52916d6f1',
};
export const AMPLITUDE_API_KEY = '68f0f7dfbee9351270ed9f357becd95d';

export const WHITE_LIST = [
  'solucionesdev.compartamos.com.pe',
  'solucionesqa.compartamos.com.pe',
  'soluciones.compartamos.com.pe',
];

export type KeyEnv = keyof typeof BUNDLE_ID;

export const URL_WEBVIEW_KEY: Record<KeyEnv, string> = {
  dev: 'X13SwZB9VNnUJtGwmSPOJ8RAXkzJlUjv',
  qa: 'Axgbzc5ALgg2iM4SBUImlgF8bHHjNRYs',
  qas: 'Axgbzc5ALgg2iM4SBUImlgF8bHHjNRYs',
  prod: 'QYnlplalKia75V5olwgPCwHYX1uSTYKQ',
};

export const APP_WEBVIEW_URL: Record<KeyEnv, string> = {
  dev: 'https://solucionesdev.compartamos.com.pe',
  qa: 'https://solucionesqa.compartamos.com.pe',
  qas: 'https://solucionesqa.compartamos.com.pe',
  prod: 'https://soluciones.compartamos.com.pe',
};

export const CLIENT_ID_GEE: Record<KeyEnv, string> = {
  dev: 'TTeGsElE0hJGACAvjTvukRT4lIxVJs8gyBgQZ5fVHkC5QLWR',
  qa: '5nM7jzkyM3PU3svBXGBKLdPsl0YRd4LMT9phGbE3NQkkq6kS',
  qas: '5nM7jzkyM3PU3svBXGBKLdPsl0YRd4LMT9phGbE3NQkkq6kS',
  prod: '6Drz31lgBBG3nPaGN33dKHISySX3Eryye7ASYGbkt6gydAM3',
};

export const API_KEY_BANCA: Record<KeyEnv, string> = {
  dev: 'vxUFgzej14D4TDmMvwF7doashuLWmQcMVULrjxEW80JcaONr',
  qa: 'SMfaeLfId3Go63zu73yoAR1RD136QDBGAgCs3KYCnnOaXEKe',
  qas: 'SMfaeLfId3Go63zu73yoAR1RD136QDBGAgCs3KYCnnOaXEKe',
  prod: 'GAF71Lsow3Ax8CCeWNHY3N6U1nx2vbKOtNmJS8J6AXRRcNo4',
};
