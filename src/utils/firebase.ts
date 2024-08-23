import { PermissionsAndroid, Platform } from 'react-native';
import remoteConfig from '@react-native-firebase/remote-config';
import perf from '@react-native-firebase/perf';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import chalk from 'chalk';
import {Fetch} from './apiFetch';
import { ProductDomain } from '@global/information';
import { decrypt, decryptText } from './AES';
import { KeyEnv, URL_WEBVIEW_KEY } from '@constants';
import NativeConfig from 'react-native-config';

type RemoteKeys = {
  elastic_url?: string;
  elastic_api_key?: string;
  auth_zero_client_id?: string;
  auth_zero_client_secret?: string;
  auth_zero_base_url?: string;
  secure_key?: string;
  bck_api_key?: string;
  trx_bim?: boolean;
  active_favs?: boolean;
  trx_own?: boolean;
  trx_others?: boolean;
  trx_banks?: boolean;
  trx_pay_credit?: boolean;
  trx_others_disclaimer_show?: boolean;
  trx_dsbrmnt_ci: boolean;
  trx_interop: boolean;
  show_savings?: boolean;
  show_credits?: boolean;
  active_channel?: boolean;
  disabled_channel_title?: string;
  disabled_channel_content?: string;
  mandatory_update?: boolean;
  main_title?: string;
  url_banner?: string;
  kff_ap?: string;
  kff_an?: string;
  fphi_url?: string;
  fphi_tnt_id?: string;
  fphi_client_id?: string;
  fphi_client_secret?: string;
  fphi_lic_ios?: string;
  fphi_lic_android?: string;
  active_interop?: string;
  terms_conds_interop?: string;
  trx_apimanagement?: boolean;
  trx_srv_pay?: boolean;
  active_srv_pay?: string;
  allow_srv_pay?: string | null;
  allow_interop?: string | null;
  min_amount_srv_pay?: number;
  max_amount_srv_pay?: number;
  terms_conds_open_sav_entrpnr?: string;
  book_open_sav_entrpnr_url?: string;
  contract_savings_url?: string;
  saving_opening_app_product?: string;
  saving_opening_app_product_wow?: string;
  active_visitor_qr?: string;
  trx_credit_line?: boolean;
  trx_credit_line_disbursement?: boolean;
  terms_conds_interop_url?: string;
  active_open_sav_entrpnr?: boolean;
  kle_wv: string;
  trx_credit_group_payments?: boolean;
  mgnt_auh?: boolean;
  mgnt_cre?: boolean;
  mgnt_acc?: boolean;
  mgnt_onb?: boolean;
  mgnt_pay?: boolean;
  mgnt_trx?: boolean;
  mgnt_cus?: boolean;
  mgnt_uti?: boolean;
  eip_qw_tmng?: string;
  url_ipify?: string;
};

export type HeadersApiKey = {
  [key: string]: string;
};

const ctx = new chalk.Instance({ level: 3 });

export async function activateRemoteConfig() {
  await remoteConfig().setConfigSettings({
    minimumFetchIntervalMillis: 0,
  });
  await remoteConfig()
    .fetchAndActivate()
    .then(() => {
      console.group(ctx.bold(ctx.magentaBright('Remote Variables')));
      console.log(
        ctx.magentaBright(
          ctx.bold(JSON.stringify(remoteConfig().getAll(), null, 2)),
        ),
      );
      console.groupEnd();
    });
}

export function getRemoteValue(keyName: keyof RemoteKeys) {
  return remoteConfig().getValue(keyName);
}

export async function getRequest(url: any, method: any) {
  const metric = await perf().newHttpMetric(url, method);

  await metric.start();

  const response = await fetch(url);
  metric.setHttpResponseCode(response.status);

  await metric.stop();
}

export async function requestUserPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS');
  }
  const authStatus = await messaging().requestPermission();
  const enable =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enable;
}

export function initBackgroundMessageHandler(): void {
  messaging().setBackgroundMessageHandler(Promise.resolve);
}

async function displayForegroundNotification(remoteMessage) {
  const channelId = await notifee.createChannel({
    id: 'high-priority',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PRIVATE,
  });

  await notifee.displayNotification({
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,
    android: {
      channelId,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_launcher',
      badgeIconType: 2,
      visibility: AndroidVisibility.PRIVATE,
      sound: 'default',
      importance: AndroidImportance.HIGH,
      vibrationPattern: [300, 500],
    },
  });
}

export async function initForegroundMessageHandler(): Promise<() => void> {
  const unSubscribe = messaging().onMessage(message => {
    if (Platform.OS === 'android') {
      displayForegroundNotification(message);
      return unSubscribe;
    }
  });
  return unSubscribe;
}

export async function subscribeToTopic(topicId: string): Promise<void> {
  return messaging().subscribeToTopic(topicId);
}

export async function unSubscribeToTopic(topicId: string): Promise<void> {
  return messaging().unsubscribeFromTopic(topicId);
}

interface SubscribeFirebaseParams {
  hasCG: boolean;
  hasCI: boolean;
  hasCompensations: boolean;
  hasInvestments: boolean;
  hasSavingProducts: boolean;
  registrationToken: string[];
  token: string;
}

export const subscribeFirebase = async ({
  hasCG,
  hasCI,
  hasCompensations,
  hasInvestments,
  hasSavingProducts,
  registrationToken,
  token,
}: SubscribeFirebaseParams) => {
  const isAPIGee = await apiGeeStatus('mgnt_uti')
  const url = `${isAPIGee ? ProductDomain.utils + '/fcm/suscribe' : '/api/utils/fcm/suscribe'}`;
  const data = await Fetch({
    url,
    method: 'POST',
    body: {
      hasCG,
      hasCI,
      hasCompensations,
      hasInvestments,
      hasSavingProducts,
      registrationToken,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isAPIGee ? createHeadersApiGee() : {})
    },
    base: isAPIGee ? 'GEE' : 'GW',
    isSecure: isAPIGee,
  });
  return data;
};

export async function apiGeeStatus(remoteKey: keyof RemoteKeys): Promise<boolean> {
  const apiKeyRemote = await getRemoteValue(remoteKey).asBoolean() ?? false;
  const apiKeyAll = await getRemoteValue('trx_apimanagement').asBoolean() ?? false;

  return apiKeyAll ? false : apiKeyRemote;
}

export function decryptApiGee(remoteKey : keyof RemoteKeys) {
  const apiKey = getRemoteValue(remoteKey).asString() ?? '';
  const urlWebViewKey = URL_WEBVIEW_KEY[NativeConfig.ENV as KeyEnv];
  const secretKey = decryptText(apiKey, urlWebViewKey) ?? '';

  return secretKey;
}

export function createHeadersApiGee(isApiGee : boolean = true): HeadersApiKey {
  const apiGeeKey =  isApiGee ?  decryptApiGee('eip_qw_tmng') : getRemoteValue('bck_api_key').asString();

  return { ['x-api-key'] : apiGeeKey }
}
