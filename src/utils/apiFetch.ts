import {Platform} from 'react-native';
import {fetch} from 'react-native-ssl-pinning';
import NativeConfig from 'react-native-config';
import {SessionManager} from '@managers/SessionManager';
import {decrypt, encrypt} from './AES';
import {getDecodeToken} from './getToken';
import moment from 'moment';
import crashlytics from '@react-native-firebase/crashlytics';
import chalk from 'chalk';
import {TokenManager} from '@managers/TokenManager';
import {getRemoteValue} from '@utils/firebase';
import {
  BASE_URL,
  BASE_URL_API_GEE,
  CERT,
  CERT_2,
  CERT_GEE,
  KeyEnv,
} from '@constants';
const ctx = new chalk.Instance({level: 3});

interface FetchProps {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: {};
  headers?: {};
  timeout?: number;
  encryptBody?: boolean;
  closeSessionOnError?: boolean;
  user?: string;
  screen?: string;
  base?: 'GW' | 'GEE';
  isSecure?: boolean;
  onError?: (error: string) => void;
}

interface RequestOptions {
  method: string;
  body: any;
  timeout?: number;
  headers?: any;
  user?: string;
  url?: string;
}

const checkIncludeInAPIGee = (value: string, url: string) =>
  url.includes(value);

const URLS_REFETCH_TOKEN = [
  '/api/onboarding/event',
  '/api/onboarding/notification/smsCode',
  '/api/onboarding/forget_password/membership',
  '/api/onboarding/membership',
  '/api/onboarding/forget_password/emailCode',
  '/api/onboarding/forget_password/emailValidateCode',
  '/api/onboarding/membership/validate',
  '/api/onboarding/customer/contactValidate',
  '/api/onboarding/notification/smsValidateCode',
  '/api/onboarding/notification/emailValidateCode',
  '/api/v2/authentication/login',
  '/channels/party-authentication/api-onboarding/v1/event',
  '/channels/party-authentication/api-onboarding/v1/membership/validate',
  '/channels/party-authentication/api-onboarding/v1/customer/contactValidate',
  '/channels/party-authentication/api-onboarding/v1/notification/smsValidateCode',
  '/channels/party-authentication/api-onboarding/v1/notification/emailValidateCode',
  '/channels/party-authentication/api-authentication/v1/login',
  '/channels/party-authentication/api-onboarding/v1/notification/smsCode',
  '/channels/party-authentication/api-onboarding/v1/forget_password/membership',
  '/channels/party-authentication/api-onboarding/v1/membership',
  '/channels/party-authentication/api-onboarding/v1/forget_password/emailCode',
  '/channels/party-authentication/api-onboarding/v1/forget_password/emailValidateCode',
];

const URLS_APIGE = [
  '/apiexp/loans-and-deposit/group-loan/api-credits/v1/cloud/adjustment-memory',
  '/apiexp/loans-and-deposit/group-loan/api-credits/v1/payments/adjustment/cache',
  '/apiexp/loans-and-deposit/group-loan/api-credits/v1/int-qa/cloud/adjustment-memory',
  '/apiexp/loans-and-deposit/group-loan/api-credits/v1/int-qa/payments/adjustment/cache',
  '/channels/specific-ebranch-operations/api-utils/v1/favorites',
  '/channels/specific-ebranch-operations/api-utils/v1/int-qa/favorites',
];

export const getTraceId = (payload: {
  user:
    | {
        documentNumber: string;
        documentType: number;
      }
    | string
    | undefined;
}): string => {
  let userId = '0000000000';
  if (payload.user !== undefined) {
    if (typeof payload.user === 'string') {
      userId = payload.user;
    } else {
      userId = `0${payload.user.documentType}${payload.user.documentNumber}`;
    }
  }

  const timestamp = `${moment(new Date()).format(
    'yyyyMMDDHHmmss',
  )}-${userId}-01`;
  return timestamp;
};

function getOptions({
  method,
  body,
  timeout,
  headers,
  user,
  url,
}: RequestOptions) {
  const options = {
    method,
    body: JSON.stringify(body),
    timeoutInterval: timeout || 60000,
    sslPinning: {
      certs: [
        CERT_2[NativeConfig.ENV as KeyEnv] ?? '',
        CERT[NativeConfig.ENV as KeyEnv] ?? '',
        CERT_GEE[NativeConfig.ENV as KeyEnv] ?? '',
      ],
    },
    headers,
    pkPinning: Platform.OS === 'ios',
    disableAllSecurity: false,
    caseSensitiveHeaders: true,
  };
  const userId = user || '0000000000';
  const date = new Date();
  const timestamp = `${moment(date).format('yyyyMMDDHHmmss')}-${userId}-01`;

  options.headers = {...headers, 'trace-id': timestamp};

  if (
    NativeConfig.ENV === 'dev' ||
    NativeConfig.ENV === 'qas' ||
    NativeConfig.ENV === 'qa'
  ) {
    console.group('Request to ' + ctx.bold(ctx.blue(url)));
    console.log(
      ctx.blue(
        ctx.bold(
          JSON.stringify(
            {
              ...options,
              body: options.body !== undefined ? JSON.parse(options.body) : '',
            },
            null,
            2,
          ),
        ),
      ),
    );
    console.groupEnd();
  }

  return options;
}

export const Fetch = async ({
  url,
  method,
  body,
  headers,
  timeout,
  closeSessionOnError,
  user,
  base = 'GW',
  encryptBody: encryptValue = true,
  isSecure,
  onError,
}: FetchProps) => {
  // verify Session expiration
  const encryptBody = NativeConfig.ENV === 'dev' ? false : encryptValue;
  const decode = getDecodeToken();
  if (decode) {
    const expirationDate = decode.exp * 1000;
    if (expirationDate <= Date.now() && closeSessionOnError) {
      return SessionManager.getInstance().fireError();
    }
  }

  const secure_key = getRemoteValue('secure_key').asString();

  const options = getOptions({method, body, timeout, headers, user, url});

  if (body && encryptBody) {
    const quotes =
      base === 'GW'
        ? '"'
        : URLS_APIGE.some(value => checkIncludeInAPIGee(value, url))
        ? ''
        : '"';

    options.body = `${quotes}${encrypt(options.body, secure_key)}${quotes}`;
    options.headers = {...options.headers, 'content-type': 'text/plain'};
  }

  const base_url =
    base === 'GW'
      ? BASE_URL[NativeConfig.ENV as KeyEnv]
      : BASE_URL_API_GEE[NativeConfig.ENV as KeyEnv];

  try {
    let {bodyString} = await fetch(`${base_url}${url}`, options as any);
    let temp = bodyString;

    if ((bodyString ?? '').split('"').length !== 3 && encryptBody) {
      bodyString = `"${bodyString}"`;
    }
    if (NativeConfig.ENV === 'dev') bodyString = temp;
    const bodyJson = JSON.parse(bodyString?.toString() ?? '');

    const data = encryptBody ? decrypt(bodyJson, secure_key) : bodyJson;

    if (
      NativeConfig.ENV === 'dev' ||
      NativeConfig.ENV === 'qas' ||
      NativeConfig.ENV === 'qa'
    ) {
      console.group('Response from ' + ctx.bold(ctx.green(url)));
      console.log(ctx.green(ctx.bold(JSON.stringify(data, null, 2))));
      console.groupEnd();
    }

    return data;
  } catch (error: any) {
    if (onError !== undefined) {
      onError(JSON.stringify(error?.bodyString || error?.body));
    }
    if (
      NativeConfig.ENV === 'dev' ||
      NativeConfig.ENV === 'qas' ||
      NativeConfig.ENV === 'qa'
    ) {
      console.group('Response from ' + ctx.bold(ctx.red(url)));
      console.log(ctx.red(ctx.bold(JSON.stringify(error, null, 2))));
      console.groupEnd();
    }
    if (error.status === 423) {
      return {
        errorCode: '423',
        isWarning: true,
        isSuccess: false,
      };
    }
    if (error.status === 406) {
      return {
        errorCode: '406',
        isWarning: true,
        isSuccess: false,
        message: JSON.parse(error?.bodyString || error?.body)?.error?.message,
      };
    }

    crashlytics().recordError(
      new Error(
        `URL: ${base_url}${url}, Status: ${error.status} Error: ${error}`,
      ),
    );
    if (error === 'timeout' || error.status === 404 || error.status === 500) {
      return {
        errorCode: '-1',
        isWarning: true,
        isSuccess: false,
      };
    }
    if (
      // closeSessionOnError === true &&
      error?.status !== undefined &&
      typeof error?.status === 'number'
    ) {
      const status: number = error.status;
      if (status === 401) {
        if (!URLS_REFETCH_TOKEN.includes(url)) {
          SessionManager.getInstance().fireError();
        }
      }
    }

    if (typeof error?.status === 'number' && error?.status === 401) {
      let isRefetchToken = false;

      for (const refetchUrl of URLS_REFETCH_TOKEN) {
        if (url.includes(refetchUrl)) {
          isRefetchToken = true;
          break;
        }
      }

      if (isRefetchToken) {
        await TokenManager.getInstance().resetToken('TOKEN_INIT');
        let token1: string = await TokenManager.getInstance().getToken(
          'TOKEN_INIT',
        );
        headers = {
          Authorization: `Bearer ${token1}`,
        };
        const optionsRefresh = getOptions({
          method,
          body,
          timeout,
          headers,
          user,
          url,
        });

        const {bodyString} = await fetch(
          `${base_url}${url}`,
          optionsRefresh as any,
        );
        const bodyJson = JSON.parse(bodyString ?? '');

        const data = encryptBody ? decrypt(bodyJson, secure_key) : bodyJson;

        if (
          NativeConfig.ENV === 'dev' ||
          NativeConfig.ENV === 'qas' ||
          NativeConfig.ENV === 'qa'
        ) {
          console.group('Response from ' + ctx.bold(ctx.green(url)));
          console.log(ctx.green(ctx.bold(JSON.stringify(data, null, 2))));
          console.groupEnd();
        }
        return data;
      }
    }

    if (error.startsWith('java.security.cert.CertPathValidatorException')) {
      // Alert.alert('Tenemos problemas al conectarnos a Compartamos Financiera')
    }
  }
};
