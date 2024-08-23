import axios from 'axios';
import {NativeModules, Platform} from 'react-native';
import {PersonGender} from '@navigations/types';
import {getManufacturer, getModel, getUniqueId} from 'react-native-device-info';
import _ from 'lodash';
import {Fetch, getTraceId} from '@utils/apiFetch';
import {TokenManager} from '@managers/TokenManager';
import {getToken} from '@utils/getToken';
import {Dynatrace} from '@dynatrace/react-native-plugin';
import {capitalizeFull} from '@helpers/StringHelper';
import {getRemoteValue} from '@utils/firebase';
import {
  CreditPayments,
  CustomCredits,
  PaymentInterfaceReq,
} from '@interface/Credit';
import {ProductDomain} from '@global/information';
import {apiGeeStatus, createHeadersApiGee} from '@utils/firebase';
import {
  IGetMembershipProps,
  IGetMembership_ForgotPasswordProps,
  TGetMembershipResult,
  TGetMembershipServiceResult,
  TGetMembership_ForgotPasswordResult,
  TGetMembership_ForgotPasswordServiceResult,
  TPaymentEvaluateOtpFromPhoneFunctionResult,
  TPaymentEvaluateOtpFromPhoneServiceResult,
  TPaymentSendOtpToPhoneFunctionResult,
  TPaymentSendOtpToPhoneServiceResult,
} from 'src/types';
const {FingerprintModule} = NativeModules;

// const getUniqueId = () => '1C28C18D-E689-4722-8E51-D870FE21AB3C'
const formatName = (name?: string) =>
  name === undefined ? '' : capitalizeFull(_.toLower(name));

const processScreenName = (screenName: string, suffix?: string) =>
  suffix === undefined ? `${screenName}` : `${screenName}-${suffix}`;
export interface Savings {
  compensations: {
    savings: [];
  };
  investments: {
    savings: [];
  };
  savings: {
    savings: [];
  };
}
interface Credits {
  individualCredits: [];
  groupCredits: [];
}

export const authenticationAccess = async (): Promise<{token: string}> => {
  const isAPIGee = await apiGeeStatus('mgnt_auh');
  const url = `${
    isAPIGee
      ? ProductDomain.authentication + '/access'
      : '/api/authentication/access'
  }`;

  let myAction = Dynatrace.enterAction('* Service /api/authentication/access');

  const data: {
    data: {
      token: string;
    };
    errorCode: string;
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      ...createHeadersApiGee(isAPIGee),
    },
    body: {
      uuid: getUniqueId(),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    isSecure: isAPIGee,
    timeout: 60000,
    onError: error => {
      myAction.reportStringValue(
        'request',
        JSON.stringify({
          url,
          method: 'POST',
          headers: {...createHeadersApiGee(isAPIGee)},
          body: {
            uuid: getUniqueId(),
          },
          base: isAPIGee ? 'GEE' : 'GW',
          timeout: 60000,
        }),
      );
      myAction.reportStringValue('response', JSON.stringify(error));
      myAction.leaveAction();
    },
  });

  myAction.reportStringValue(
    'request',
    JSON.stringify({
      url,
      method: 'POST',
      headers: {
        ...createHeadersApiGee(isAPIGee),
      },
      body: {
        uuid: getUniqueId(),
      },
      base: isAPIGee ? 'GEE' : 'GW',
      timeout: 60000,
      isSecure: isAPIGee,
    }),
  );
  myAction.reportStringValue('response', JSON.stringify(data));
  myAction.leaveAction();

  if (data.isSuccess === true) return {token: data.data.token};
  else throw new Error('No se puedo obtener el token.');
};

export const getIpAddress = async (
  maxCharacters: number = 9999,
): Promise<string> => {
  try {
    var urlIpify = getRemoteValue('url_ipify').asString();
    if (urlIpify === null || urlIpify === undefined || urlIpify == '') {
      urlIpify = 'https://api.ipify.org/';
    }
    const {data} = await axios.get<{ip: string}>(urlIpify, {
      params: {format: 'json'},
      timeout: 30000,
    });
    if (data.ip.length <= maxCharacters) return data.ip;
    else return '0.0.0.0';
  } catch (error) {
    return '0.0.0.0';
  }
};

export const GetMembership_ForgotPassword = async (
  props: IGetMembership_ForgotPasswordProps,
): Promise<TGetMembership_ForgotPasswordResult> => {
  const TOKEN: string = await TokenManager.getInstance().getToken('TOKEN_INIT');
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/forget_password/membership'
      : '/api/onboarding/forget_password/membership'
  }`;

  const data: TGetMembership_ForgotPasswordServiceResult = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: {
      documentNumber: props.documentNumber,
      documentType: props.documentType,
      cellPhone: props.phoneNumber,
      ipAddress: await getIpAddress(),
      screenName: props.screenName,
      uniqueId: getUniqueId(),
      deviceOS: Platform.OS,
      eventDetailCode: '1',
      eventId: '6',
    },
    user: `0${props.documentType}${props.documentNumber}`,
    screen: props.screenName,
    timeout: 60000,
  });

  if (data.errorCode === '0' && data.isSuccess === true) {
    if (data.data !== null) {
      return {
        type: 'SUCCESS',
        email: data.data.email,
        firstName: data.data.firstName,
      };
    } else {
      return {
        type: 'MAX_LIMIT_ATTEMPTS',
      };
    }
  } else if (data.errorCode === '1') {
    return {
      type: 'USER_DOESNT_HAVE_MEMBERSHIP',
    };
  } else if (data.errorCode === '-1') {
    return {
      type: 'USER_DOESNT_EXIST',
    };
  } else throw new Error('Ocurrió un error en el servicio.');
};

export const GetMembership = async (
  props: IGetMembershipProps,
): Promise<TGetMembershipResult> => {
  const FINGERPRINT = await FingerprintModule.getFingerprint();
  const TOKEN: string = await TokenManager.getInstance().getToken('TOKEN_INIT');
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/membership'
      : '/api/onboarding/membership'
  }`;

  const data: TGetMembershipServiceResult = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: {
      documentNumber: props.documentNumber,
      documentType: props.documentType,
      cellPhone: props.phoneNumber,
      deviceOS: Platform.OS,
      eventDetailCode: '1',
      eventId: '6',
      ipAddress: await getIpAddress(),
      screenName: props.screenName,
      uniqueId: getUniqueId(),
      fingerPrintDevice: JSON.parse(FINGERPRINT),
    },
    user: `0${props.documentType}${props.documentNumber}`,
    screen: props.screenName,
    timeout: 60000,
  });

  if (data.errorCode === '0') {
    if (data.data !== null) {
      if (data.data.isMember === false) return {type: 'USER_IS_NOT_A_MEMBER'};
      else if (
        data.data.hasActiveProduct === false &&
        data.data.hasDisbursement === false
      )
        return {
          type: 'USER_DOESNT_HAVE_AN_ACTIVE_PRODUCT',
          firstName: formatName(data.data.firstName),
          gender: data.data.gender,
        };
      else if (data.data.hasMembership === false)
        return {
          type: 'GO_TO_ONBOARDING',
          firstName: formatName(data.data.firstName),
          gender: data.data.gender,
          personId: data.data.personId,
        };
      else if (data.data.membershipComplete === false)
        return {
          type: 'GO_TO_PRE_AGENCY',
          gender: data.data.gender,
          email: data.data.email,
          phoneNumber: data.data.phone,
          firstName: data.data.firstName,
        };
      else if (data.data.membershipComplete === true)
        return {
          type: 'USER_EXISTS',
        };
      else throw new Error('Ocurrió un error en el servicio.');
    } else
      return {
        type: 'MAX_LIMIT_ATTEMPTS',
      };
  } else if (data.errorCode === '102') {
    return {
      type: 'USER_FRAUDULENT',
    };
  } else throw new Error('Ocurrió un error en el servicio.');
};

export const validateUser = async (
  documentType: number,
  documentNumber: string,
  screen: string,
): Promise<
  | {
      type: 'USER_IS_NOT_A_MEMBER';
    }
  | {
      type: 'USER_FRAUDULENT';
    }
  | {
      type: 'USER_DOESNT_HAVE_AN_ACTIVE_PRODUCT';
      firstName: string;
      gender: PersonGender;
    }
  | {
      type: 'GO_TO_ONBOARDING';
      firstName: string;
      firstSurname: string;
      secondName: string;
      secondSurname: string;
      gender: PersonGender;
      personUId: number;
    }
  | {
      type: 'GO_TO_PRE_AGENCY';
      personUId: number;
      gender: PersonGender;
      email: string;
      phoneNumber: string;
      firstName: string;
      firstSurname: string;
      secondName: string;
      secondSurname: string;
    }
  | {
      type: 'USER_EXISTS';
    }
> => {
  const fp = await FingerprintModule.getFingerprint();
  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/membership/validate'
      : '/api/onboarding/membership/validate'
  }`;

  const data: {
    errorCode: '102' | '-1' | '100' | '0';
    data:
      | {
          isMember: false;
          hasActiveProduct: false;
          hasDisbursement: boolean;
          hasMembership: false;
        }
      | {
          isMember: true;
          hasActiveProduct: boolean;
          hasDisbursement: boolean;
          hasMembership: false;
          person: {
            applicantTypeId: number;
            documentNumber: string;
            documentTypeId: number;
            existCompartamos: boolean;
            lastName: string;
            motherLastName: string;
            firstName: string;
            middleName: string;
            personUId: number;
            gender: PersonGender;
          };
        }
      | {
          isMember: true;
          hasActiveProduct: boolean;
          hasDisbursement: boolean;
          hasMembership: true;
          membership: {
            channel: string;
            dateBirth: string;
            email: string;
            enrollmentStatus: 'PE' | 'AC';
            firstName: string;
            firstSurname: string;
            highDate: string;
            idUniqueDigitalBanking: number;
            personUID: number;
            phone: string;
            secondName: string;
            secondSurname: string;
          };
          person: {
            applicantTypeId: number;
            documentNumber: string;
            documentTypeId: number;
            existCompartamos: boolean;
            lastName: string;
            motherLastName: string;
            firstName: string;
            middleName: string;
            personUId: number;
            gender: PersonGender;
          };
        };
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      documentNumber: documentNumber,
      documentType: documentType,
      ipAddress: await getIpAddress(),
      fingerPrintDevice: JSON.parse(fp),
    },
    user: `0${documentType}${documentNumber}`,
    screen,
    timeout: 60000,
    isSecure: isAPIGee,
  });

  if (data.data.isMember === false) return {type: 'USER_IS_NOT_A_MEMBER'};
  else if (
    data.data.hasActiveProduct === false &&
    data.data.hasDisbursement === false
  )
    return {
      type: 'USER_DOESNT_HAVE_AN_ACTIVE_PRODUCT',
      firstName: formatName(data.data.person.firstName),
      gender: data.data.person.gender,
    };
  else if (data.data.hasMembership === false)
    if (data.errorCode === '0')
      return {
        type: 'GO_TO_ONBOARDING',
        firstName: formatName(data.data.person.firstName),
        firstSurname: formatName(data.data.person.lastName),
        secondName: formatName(data.data.person.middleName),
        secondSurname: formatName(data.data.person.motherLastName),
        gender: data.data.person.gender,
        personUId: data.data.person.personUId,
      };
    else throw new Error("errorCode doesn't have a correct value.");
  else if (data.data.membership.enrollmentStatus === 'PE')
    if (data.errorCode === '100')
      return {
        type: 'GO_TO_PRE_AGENCY',
        email: data.data.membership.email,
        phoneNumber: data.data.membership.phone,
        firstName: formatName(data.data.membership.firstName),
        firstSurname: formatName(data.data.membership.firstSurname),
        secondName: formatName(data.data.membership.secondName),
        secondSurname: formatName(data.data.membership.secondSurname),
        gender: data.data.person.gender,
        personUId: data.data.membership.personUID,
      };
    else if (data.errorCode === '102') return {type: 'USER_FRAUDULENT'};
    else throw new Error("errorCode doesn't have a correct value.");
  else if (data.data.membership.enrollmentStatus === 'AC')
    return {type: 'USER_EXISTS'};
  else throw new Error("Enrollment Status doesn't have a correct value.");
};

export const getIsUserInfoValid = async ({
  phone,
  email,
  user,
  userInfo,
  screen,
}: {
  phone: string;
  email: string;
  user: string;
  userInfo: {documentType: number; documentNumber: string};
  screen: string;
}):
  | Promise<
      | {phoneIsValid: boolean; emailIsValid: boolean; type: 'SUCCESS'}
      | {type: 'BLOCKED'}
      | {type: 'UNKNOWN_ERROR'}
    >
  | never => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/customer/contactValidate'
      : '/api/onboarding/customer/contactValidate'
  }`;

  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );

  const fp = await FingerprintModule.getFingerprint();
  const data:
    | {
        errorCode: '100';
        data: {
          emailValidationModel: {
            exist: boolean;
            message: string;
          };
          phoneValidationModel: {
            exist: boolean;
            message: string;
          };
        };
        isSuccess: true;
        isWarning: false;
        message: string;
      }
    | {
        errorCode: '102';
        data: null;
        isSuccess: false;
        isWarning: true;
        message: string;
      }
    | {
        errorCode: '-1';
        data: null;
        isSuccess: false;
        isWarning: false;
        message: string;
      } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      documentType: userInfo.documentType.toString(),
      documentNumber: userInfo.documentNumber,
      email: email,
      phone: phone,
      ipAddress: await getIpAddress(),
      fingerPrintDevice: JSON.parse(fp),
    },
    user,
    screen,
    timeout: 60000,
    isSecure: isAPIGee,
  });

  if (data.isSuccess === true) {
    return {
      type: 'SUCCESS',
      emailIsValid: data.data.emailValidationModel.exist === false,
      phoneIsValid: data.data.phoneValidationModel.exist === false,
    };
  } else if (data.errorCode === '102') {
    return {type: 'BLOCKED'};
  } else if (data.errorCode === '-1') {
    return {type: 'UNKNOWN_ERROR'};
  } else {
    throw new Error('Ocurrió un error desconocido.');
  }
};

export const getIsEmailSpam = async (
  email: string,
): Promise<boolean> | never => {
  if (email === 'spam@gmail.com') return false;
  return true;
};

export const sendOtpToEmail_ForgotPassword = async (
  email: string,
  screen: string,
  user: {
    documentNumber?: string;
    documentType?: number;
  },
): Promise<{type: 'SUCCESS'} | {type: 'MAX_LIMIT'}> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/forget_password/emailCode'
      : '/api/onboarding/forget_password/emailCode'
  }`;

  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );
  const userFormatted =
    user.documentNumber === undefined || user.documentType === undefined
      ? undefined
      : `0${user.documentType}${user.documentNumber}`;
  const data:
    | {
        errorCode: '0';
        data: true;
        isSuccess: true;
        isWarning: false;
        message: string;
      }
    | {
        errorCode: '102';
        data: false;
        isSuccess: false;
        isWarning: true;
        message: string;
      }
    | {
        errorCode: '-1';
        data: null;
        isSuccess: false;
        isWarning: false;
        message: string;
      } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      documentNumber: user.documentNumber,
      documentType: user.documentType,
    },
    user: userFormatted,
    screen,
    timeout: 60000,
  });

  if (data.isSuccess === true) return {type: 'SUCCESS'};
  else if (data.errorCode === '102') return {type: 'MAX_LIMIT'};
  else throw new Error('Error inesperado');
};

export const sendOtpToEmail = async (
  email: string,
  screen: string,
  user: {
    documentNumber?: string;
    documentType?: number;
  },
): Promise<{type: 'SUCCESS'} | {type: 'MAX_LIMIT'}> | never => {
  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/notification/emailCode'
      : '/api/onboarding/notification/emailCode'
  }`;

  const userFormatted =
    user.documentNumber === undefined || user.documentType === undefined
      ? undefined
      : `0${user.documentType}${user.documentNumber}`;
  const data:
    | {
        errorCode: '0';
        data: true;
        isSuccess: true;
        isWarning: false;
        message: string;
      }
    | {
        errorCode: '102';
        data: false;
        isSuccess: false;
        isWarning: true;
        message: string;
      }
    | {
        errorCode: '-1';
        data: null;
        isSuccess: false;
        isWarning: false;
        message: string;
      } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      documentNumber: user.documentNumber,
      documentType: user.documentType,
    },
    user: userFormatted,
    screen,
    timeout: 60000,
    isSecure: isAPIGee,
  });

  if (data.isSuccess === true) return {type: 'SUCCESS'};
  else if (data.errorCode === '102') return {type: 'MAX_LIMIT'};
  else throw new Error('Error inesperado');
};

export const sendOtpToPhone_Transference = async ({
  user,
  trackingTransaction,
  screen,
}: {
  user: {documentType: number; documentNumber: string};
  trackingTransaction: string;
  screen: string;
}): Promise<'ERROR' | 'BLOCKED' | 'SUCCESS'> => {
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${
    isAPIGee
      ? ProductDomain.transfer + '/authorization/smsCode'
      : '/api/transfers/authorization/smsCode'
  }`;

  const data:
    | {
        errorCode: '0';
        data: true;
        isSuccess: true;
        isWarning: boolean;
      }
    | {
        errorCode: '102';
        data: false;
        isSuccess: false;
        isWarning: true;
      }
    | {
        errorCode: '-1';
        data: false;
        isSuccess: false;
        isWarning: true;
      } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {trackingTransaction: trackingTransaction},
    user: `0${user.documentType}${user.documentNumber}`,
    screen,
    timeout: 60000,
    isSecure: isAPIGee,
  });
  if (data.isSuccess === true) return 'SUCCESS';
  else if (data.errorCode === '102') return 'BLOCKED';
  return 'ERROR';
};

export const sendOtpToPhone_Payment = async ({
  user,
  trackingTransaction,
  screen,
}: {
  user: {documentType: number; documentNumber: string};
  trackingTransaction: string;
  screen: string;
}): Promise<TPaymentSendOtpToPhoneFunctionResult> => {
  const isAPIGee = await apiGeeStatus('mgnt_pay');
  const url = `${
    isAPIGee
      ? ProductDomain.payments + '/authorization/smsCode'
      : '/api/payments/authorization/smsCode'
  }`;

  const data: TPaymentSendOtpToPhoneServiceResult = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {trackingTransaction: trackingTransaction},
    user: `0${user.documentType}${user.documentNumber}`,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });
  if (data.isSuccess === true) return {type: 'SUCCESS'};
  else if (data.errorCode === '102') return {type: 'BLOCKED'};
  return {type: 'ERROR'};
};
export const sendOtp_Authentication = async ({
  user,
  trackingLogin,
  screen,
  channelType,
}: {
  user: {documentType: number; documentNumber: string};
  trackingLogin: string;
  screen: string;
  channelType: 'sms' | 'email';
}): Promise<'ERROR' | 'MAX_LIMIT' | 'SUCCESS'> => {
  const isAPIGee = await apiGeeStatus('mgnt_auh');
  const url = `${
    isAPIGee
      ? ProductDomain.authentication + '/authorization/sendCode'
      : '/api/authentication/authorization/sendCode'
  }`;

  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );

  const data:
    | {
        errorCode: '0';
        data: true;
        isSuccess: true;
        isWarning: boolean;
      }
    | {
        errorCode: '102';
        data: null;
        isSuccess: false;
        isWarning: true;
      }
    | {
        errorCode: '-1';
        data: null;
        isSuccess: false;
        isWarning: true;
      } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {trackingTransaction: trackingLogin, type: channelType},
    user: `0${user.documentType}${user.documentNumber}`,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });
  if (data.isSuccess === true) return 'SUCCESS';
  else if (data.errorCode === '102') return 'MAX_LIMIT';
  return 'ERROR';
};
export const evaluateOtpFromEmail_FORGOT_PASSWORD = async (
  otp: string,
  user: {
    phoneNumber: string | undefined;
    documentNumber: string;
    documentType: number;
    email: string;
    personId: string | undefined;
  },
  screen: string,
): Promise<boolean> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/forget_password/emailValidateCode'
      : '/api/onboarding/forget_password/emailValidateCode'
  }`;

  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );

  const data: {
    errorCode: string;
    data: {
      token: string;
    };
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      documentNumber: user.documentNumber,
      documentType: user.documentType.toString(),
      otp: otp,
    },
    user: `0${user?.documentType}${user?.documentNumber}`,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === true) {
    TokenManager.getInstance().updateToken('TOKEN_BIOMETRY', data.data.token);
    return true;
  }

  return false;
};
export const evaluateOtpFromEmail = async (
  otp: string,
  user: {
    phoneNumber: string | undefined;
    documentNumber: string;
    documentType: number;
    email: string;
    personId: string | undefined;
  },
  screen: string,
): Promise<boolean> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/notification/emailValidateCode'
      : '/api/onboarding/notification/emailValidateCode'
  }`;

  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );

  const data: {
    errorCode: string;
    data: {
      token: string;
    };
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      documentNumber: user.documentNumber,
      documentType: user.documentType.toString(),
      otp: otp,
    },
    user: `0${user?.documentType}${user?.documentNumber}`,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === true) {
    TokenManager.getInstance().updateToken('TOKEN_BIOMETRY', data.data.token);
    return true;
  }

  return false;
};

export const sendOtpToPhone = async (
  phoneNumber: string,
  screen: string,
  user: {
    documentNumber?: string;
    documentType?: number;
  },
): Promise<{type: 'SUCCESS'} | {type: 'MAX_LIMIT'}> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/notification/smsCode'
      : '/api/onboarding/notification/smsCode'
  }`;

  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );
  const userFormatted =
    user.documentNumber === undefined || user.documentType === undefined
      ? undefined
      : `0${user.documentType}${user.documentNumber}`;
  const data:
    | {
        errorCode: '0';
        data: true;
        isSuccess: true;
        isWarning: false;
        message: string;
      }
    | {
        errorCode: '102';
        data: false;
        isSuccess: false;
        isWarning: true;
        message: string;
      }
    | {
        errorCode: '-1';
        data: null;
        isSuccess: false;
        isWarning: false;
        message: string;
      } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      documentNumber: user.documentNumber,
      documentType: user.documentType,
    },
    user: userFormatted,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === true) return {type: 'SUCCESS'};
  else if (data.errorCode === '102') return {type: 'MAX_LIMIT'};
  else throw new Error('Error inesperado');
};
export const evaluateOtpFromPhone_Transferency = async (
  otp: string,
  trackingTransaction: string,
  user: {
    documentNumber: string;
    documentType: number;
  },
  screen: string,
):
  | Promise<
      | {
          type: 'LOCAL';
          payload: {
            dateTransaction: string;
            hourTransaction: string;
            itfTax: number;
            movementId: number;
            dateTimeTransaction: string;
            email: string;
            ownerFullName: string;
          };
        }
      | {
          type: 'OTHERS';
          payload: {
            dateTransaction: string;
            destinationCommission: number;
            hourTransaction: string;
            itfTax: number;
            movementId: number;
            ownerFullName: string;
          };
        }
      | {
          type: 'BIM';
          payload: {
            date: string;
            hour: string;
            dateTimeTransaction: string;
            transactionId: number;
            email: string;
          };
        }
      | {
          type: 'INTEROPERABILITY';
          payload: any;
        }
      | 'UNKNOWN'
      | 'BLOCKED'
    >
  | never => {
  const isAPIGee = await apiGeeStatus('mgnt_trx');
  const url = `${
    isAPIGee
      ? ProductDomain.transfer + '/authorization/smsValidateCode'
      : '/api/transfers/authorization/smsValidateCode'
  }`;

  const data:
    | {
        errorCode: '100';
        data: {
          dateTransaction: string;
          hourTransaction: string;
          itfTax: number;
          movementId: number;
          ownerFullName: string;
        };
        isSuccess: true;
        isWarning: boolean;
        message: string;
      }
    | {
        errorCode: '100';
        data: {
          dateTransaction: string;
          destinationCommission: number;
          hourTransaction: string;
          itfTax: number;
          movementId: number;
          ownerFullName: string;
        };
        isSuccess: true;
        isWarning: boolean;
        message: string;
      }
    | {
        errorCode: '100';
        data: {
          date: string;
          hour: string;
          transactionId: number;
        };
        isSuccess: true;
        isWarning: boolean;
        message: string;
      }
    | {
        errorCode: string;
        data: null;
        isSuccess: false;
        isWarning: boolean;
        message: string;
      } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      otp: otp,
      trackingTransaction: trackingTransaction,
    },
    user: `0${user?.documentType}${user?.documentNumber}`,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === true) {
    if (trackingTransaction.includes('TRXBANKS')) {
      return {
        type: 'OTHERS',
        payload: data.data as {
          dateTransaction: string;
          destinationCommission: number;
          hourTransaction: string;
          itfTax: number;
          movementId: number;
          ownerFullName: string;
        },
      };
    } else if (trackingTransaction.includes('TRXBIM')) {
      const resPayload = data.data as {
        date: string;
        hour: string;
        datetime: string;
        transactionId: number;
        email: string;
      };
      return {
        type: 'BIM',
        payload: {
          date: resPayload.date,
          hour: resPayload.hour,
          dateTimeTransaction: resPayload.datetime,
          transactionId: resPayload.transactionId,
          email: resPayload.email,
        },
      };
    } else if (trackingTransaction.includes('TRXINTEROP')) {
      const resPayload = data.data;
      return {
        type: 'INTEROPERABILITY',
        payload: resPayload,
      };
    } else if (trackingTransaction.includes('TRXLOCAL')) {
      const resPayload = data.data;
      return {
        type: 'INTEROPERABILITY',
        payload: resPayload,
      };
    } else
      return {
        type: 'LOCAL',
        payload: data.data as {
          dateTransaction: string;
          hourTransaction: string;
          dateTimeTransaction: string;
          email: string;
          itfTax: number;
          movementId: number;
          ownerFullName: string;
        },
      };
  } else if (data.errorCode === '102' || data.errorCode === '498')
    return 'BLOCKED';
  return 'UNKNOWN';
};

export const evaluateOtpFromPhone_Payment = async (
  otp: string,
  trackingTransaction: string,
  user: {
    documentNumber: string;
    documentType: number;
  },
  screen: string,
): Promise<TPaymentEvaluateOtpFromPhoneFunctionResult> => {
  const isAPIGee = await apiGeeStatus('mgnt_pay');
  const url = `${
    isAPIGee
      ? ProductDomain.payments + '/authorization/smsValidateCode'
      : '/api/payments/authorization/smsValidateCode'
  }`;

  const data: TPaymentEvaluateOtpFromPhoneServiceResult = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      otp: otp,
      trackingTransaction: trackingTransaction,
    },
    user: `0${user?.documentType}${user?.documentNumber}`,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === true) {
    return {
      type: 'SUCCESS',
      payload: {
        ...data.data,
        btTransactionId: data.data.btTransactionId.toString(),
        hasGlosa: typeof data.data.gloss === 'string' && data.data.gloss !== '',
        gloss: typeof data.data.gloss === 'string' ? data.data.gloss : '',
      },
    };
  } else if (data.isSuccess === false && data.errorCode === '102') {
    return {type: 'BLOCKED'};
  }
  return {type: 'ERROR'};
};
export const evaluateOtpFromPhone = async (
  otp: string,
  user: {
    phoneNumber: string;
    documentNumber: string;
    documentType: number;
    email: string;
    personId: string | undefined;
  },
  screen: string,
): Promise<'SUCCESS' | 'UNKNOWN_ERROR' | 'MAX_LIMIT'> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/notification/smsValidateCode'
      : '/api/onboarding/notification/smsValidateCode'
  }`;

  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );

  const data: {
    errorCode: '-1' | '102';
    data: {
      token: string;
    };
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      documentNumber: user.documentNumber,
      documentType: user.documentType.toString(),
      otp: otp,
    },
    user: `0${user?.documentType}${user?.documentNumber}`,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === true) {
    TokenManager.getInstance().updateToken('TOKEN_BIOMETRY', data.data.token);
    return 'SUCCESS';
  } else {
    switch (data.errorCode) {
      case '102':
        return 'MAX_LIMIT';
      case '-1':
      default:
        return 'UNKNOWN_ERROR';
    }
  }
};

export const evaluateOtp_Authentication = async (
  otp: string,
  trackingLogin: string,
  user: {
    documentNumber: string;
    documentType: number;
  },
  screen: string,
  channelType: 'sms' | 'email',
):
  | Promise<
      | {
          type: 'SUCCESS';
          firstName: string;
          gender: PersonGender;
          hasActiveToken: boolean;
          tokenIsInCurrentDevice: boolean;
          token: string;
        }
      | {type: 'UNKNOWN_ERROR'}
      | {type: 'MAX_LIMIT'}
    >
  | never => {
  const isAPIGee = await apiGeeStatus('mgnt_auh');
  const url = `${
    isAPIGee
      ? ProductDomain.authentication + '/authorization/validateCode'
      : '/api/authentication/authorization/validateCode'
  }`;

  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );

  const data:
    | {
        errorCode: '-1' | '102';
        data: null;
        isSuccess: false;
        isWarning: boolean;
        message: string;
      }
    | {
        errorCode: '100';
        data: {
          firstName: string;
          gender: PersonGender;
          hasToken: boolean;
          isTokenDevice: boolean;
          token: string;
        };
        isSuccess: true;
        isWarning: boolean;
        message: string;
      } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      otp: otp,
      trackingTransaction: trackingLogin,
      type: channelType,
    },
    user: `0${user?.documentType}${user?.documentNumber}`,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === true) {
    TokenManager.getInstance().updateToken('TOKEN_BIOMETRY', data.data.token);
    return {
      type: 'SUCCESS',
      firstName: data.data.firstName,
      gender: data.data.gender,
      hasActiveToken: data.data.hasToken,
      tokenIsInCurrentDevice: data.data.isTokenDevice,
      token: data.data.token,
    };
  } else {
    switch (data.errorCode) {
      case '102':
        return {type: 'MAX_LIMIT'};
      case '-1':
      default:
        return {type: 'UNKNOWN_ERROR'};
    }
  }
};
export const updateDeviceAndCounters = async (
  obj: {
    document: {
      type: number;
      number: string;
    };
  },
  screen: string,
): Promise<boolean> | never => {
  const token: string = await TokenManager.getInstance().getToken(
    'TOKEN_BIOMETRY',
  );
  const isAPIGee = await apiGeeStatus('mgnt_auh');
  const url = `${
    isAPIGee
      ? ProductDomain.authentication + '/device/secure'
      : '/api/authentication/device/secure'
  }`;

  const data: {
    data: boolean;
    errorCode: '0' | '-1';
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    body: {
      uniqueId: getUniqueId(),
      brand: await getManufacturer(),
      phoneModel: getModel(),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${obj.document.type}${obj.document.number}`,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === false)
    throw new Error(`${data.errorCode}: ${data.message}`);
  else
    return (
      data.isWarning === false && data.errorCode === '0' && data.data === true
    );
};

export const registerEvent = async (
  documentType: number,
  documentNumber: string,
  phoneNumber: string,
  screenName: string,
  suffix?: string,
): Promise<string> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee ? ProductDomain.onboarding + '/event' : '/api/onboarding/event'
  }`;

  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );

  const data: {
    data: string;
    errorCode: string;
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      cellPhoneNumber: phoneNumber,
      deviceOS: Platform.OS,
      documentNumber: documentNumber,
      documentType: documentType,
      eventDetailCode: '1',
      eventId: '6',
      ipAddress: await getIpAddress(),
      screenName: processScreenName(screenName, suffix),
      uniqueId: getUniqueId(),
    },
    user: `0${documentType}${documentNumber}`,
    screen: processScreenName(screenName, suffix),
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === false)
    throw new Error(`${data.errorCode}: ${data.message}`);
  else return data.data;
};

export const registerEventAgency = async (
  documentType: number,
  documentNumber: string,
  phoneNumber: string,
  screenName: string,
  suffix?: string,
): Promise<string> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee ? ProductDomain.onboarding + '/event' : '/api/onboarding/event'
  }`;

  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );

  const data: {
    data: string;
    errorCode: string;
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      cellPhoneNumber: phoneNumber,
      deviceOS: Platform.OS,
      documentNumber: documentNumber,
      documentType: documentType,
      eventDetailCode: '1',
      eventId: '11',
      ipAddress: await getIpAddress(),
      screenName: processScreenName(screenName, suffix),
      uniqueId: getUniqueId(),
    },
    user: `0${documentType}${documentNumber}`,
    screen: processScreenName(screenName, suffix),
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === false)
    throw new Error(`${data.errorCode}: ${data.message}`);
  else return data.data;
};

export const login = async (
  documentType: number,
  documentNumber: string,
  password: string,
  screen: string,
):
  | Promise<
      | {
          type: 'SUCCESS';
          firstName: string;
          gender: PersonGender;
          token: string;
          hasActiveToken: boolean;
          tokenIsInCurrentDevice: boolean;
          cellphoneNumber: string;
          personId: string;
        }
      | {
          type: 'DEVICE_IS_NOT_SECURE';
          token: string;
        }
      | {
          type: 'SESSION_ACTIVE_ANOTHER_DEVICE';
          title: string;
          content: string;
          button: string;
        }
      | {
          type: 'INVALID_SESSION';
          title: string;
          content: string;
        }
      | {
          type: 'UNKNOWN_ERROR_BY_MP';
        }
      | {
          type: 'MAX_ATTEMPTS';
          title: string;
          content: string;
        }
      | {
          type: 'ACCESS_BLOCKED';
        }
      | {
          type: 'ACCESS_BLOCKED_BY_MP';
        }
      | {
          type: 'IS_NOT_AN_MEMBER_AND_DOESNT_HAVE_ACTIVE_PRODUCTS';
          gender: 'F' | 'M';
        }
      | {
          type: 'IS_NOT_AN_MEMBER_AND_HAS_ACTIVE_PRODUCTS';
        }
      | {
          type: 'NEED_AUTHENTICATION_BY_MP';
          phoneOfuscated: string;
          emailOfuscated: string;
          trackingLogin: string;
        }
    >
  | never => {
  let token1: string = await TokenManager.getInstance().getToken('TOKEN_INIT');
  const isAPIGee = await apiGeeStatus('mgnt_auh');
  const url = `${
    isAPIGee
      ? ProductDomain.authentication + '/login'
      : '/api/v2/authentication/login'
  }`;

  const fp = await FingerprintModule.getFingerprint();
  const data:
    | {
        data: {
          firstName: string;
          gender: PersonGender;
          hasToken: boolean;
          isTokenDevice: boolean;
          token: string;
          personId: string;
        };
        errorCode: '100' | '0';
        isSuccess: true;
        isWarning: false;
        message: string;
      }
    | {
        data: {
          token: string;
        };
        errorCode: '100';
        isSuccess: true;
        isWarning: true;
        message: string;
      }
    | {
        data: {
          cellphone: string;
          email: string;
          trackingLogin: string;
        };
        errorCode: '101';
        isSuccess: false;
        isWarning: true;
        message: string;
      }
    | {
        data: null;
        errorCode: '102';
        isSuccess: false;
        isWarning: true;
        message: string;
      }
    | {
        data: {
          title: string;
          message: string;
          messageButton: string;
        };
        errorCode: '103';
        isSuccess: true;
        isWarning: true;
        message: string;
      }
    | {
        data: {
          message: {
            title: string;
            content: string;
          };
        };
        errorCode: '-1';
        isSuccess: false;
        isWarning: true;
        message: string;
      }
    | {
        data: null;
        errorCode: '-1';
        isSuccess: false;
        isWarning: false;
        message: string;
      }
    | {
        data: {
          message: {
            title: string;
            content: string;
          };
        };
        errorCode: '-2';
        isSuccess: false;
        isWarning: true;
        message: string;
      }
    | {
        errorCode: '423';
        isSuccess: false;
        isWarning: true;
      }
    | {
        errorCode: '470';
        isSuccess: false;
        isWarning: true;
      }
    | {
        data: {
          gender: PersonGender;
        };
        errorCode: '471';
        isSuccess: false;
        isWarning: true;
      } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      password: password,
      username: `${_.padStart(
        documentType.toString(),
        3,
        '0',
      )}${documentNumber}`,
      uniqueId: getUniqueId(),
      ipAddress: await getIpAddress(),
      fingerPrintDevice: JSON.parse(fp),
    },
    user: `0${documentType}${documentNumber}`,
    timeout: 60000,
    isSecure: isAPIGee,
    screen,
  });

  if (data.errorCode === '-1') {
    if (data.data === null) {
      return {type: 'UNKNOWN_ERROR_BY_MP'};
    } else {
      return {
        type: 'INVALID_SESSION',
        title: data.data.message.title,
        content: data.data.message.content,
      };
    }
  } else if (data.errorCode === '-2') {
    return {
      type: 'MAX_ATTEMPTS',
      title: data.data.message.title,
      content: data.data.message.content,
    };
  } else if (data.errorCode === '103') {
    return {
      type: 'SESSION_ACTIVE_ANOTHER_DEVICE',
      title: data.data.title,
      content: data.data.message,
      button: data.data.messageButton,
    };
  } else {
    if (data.isSuccess === true)
      if (data.isWarning === false)
        return {
          type: 'SUCCESS',
          token: data.data.token,
          hasActiveToken: data.data.hasToken,
          tokenIsInCurrentDevice: data.data.isTokenDevice,
          firstName: formatName(data.data.firstName),
          gender: data.data.gender,
          cellphoneNumber: data.data.cellphoneNumber,
          personId: data.data.personId,
        };
      else {
        TokenManager.getInstance().updateToken(
          'TOKEN_BIOMETRY',
          data.data.token,
        );
        return {
          type: 'DEVICE_IS_NOT_SECURE',
          token: data.data.token,
        };
      }
    else {
      if (data.errorCode === '423') {
        return {
          type: 'ACCESS_BLOCKED',
        };
      } else if (data.errorCode === '102') {
        return {
          type: 'ACCESS_BLOCKED_BY_MP',
        };
      } else if (data.errorCode === '470') {
        return {
          type: 'IS_NOT_AN_MEMBER_AND_HAS_ACTIVE_PRODUCTS',
        };
      } else if (data.errorCode === '471') {
        return {
          type: 'IS_NOT_AN_MEMBER_AND_DOESNT_HAVE_ACTIVE_PRODUCTS',
          gender: data.data.gender || 'F',
        };
      } else if (data.errorCode === '101') {
        return {
          type: 'NEED_AUTHENTICATION_BY_MP',
          phoneOfuscated: data.data.cellphone,
          trackingLogin: data.data.trackingLogin,
          emailOfuscated: data.data.email,
        };
      } else {
        throw new Error('Ocurrió un error desconocido');
      }
    }
  }
};

export const saveInStorage = async (
  document: {
    documentNumber: string;
    documentType: number;
  },
  serviceName: string,
  images: string[],
): Promise<{
  isSuccess: boolean;
}> => {
  try {
    const isAPIGee = await apiGeeStatus('mgnt_onb');
    const url = `${
      isAPIGee
        ? ProductDomain.onboarding + '/biometrics/imageStorage'
        : '/api/onboarding/biometrics/imageStorage'
    }`;

    const token2: string = await TokenManager.getInstance().getToken(
      'TOKEN_INIT',
    );

    const customerId =
      _.padStart(document.documentType.toString(), 3, '0') +
      document.documentNumber;

    const data: {
      data: boolean;
      errorCode: number;
      isSuccess: boolean;
      isWarning: boolean;
      message: string;
    } = await Fetch({
      url,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token2}`,
        ...(isAPIGee ? createHeadersApiGee() : {}),
      },
      base: isAPIGee ? 'GEE' : 'GW',
      body: {
        data: images,
        name_service: serviceName,
        trace_id: getTraceId({
          user: {
            documentNumber: document.documentNumber,
            documentType: document.documentType,
          },
        }),
        username: customerId,
      },
      user: `0${document.documentType}${document.documentNumber}`,
      isSecure: isAPIGee,
      timeout: 60000,
    });

    if (data.isSuccess === true) return {isSuccess: true};
    else return {isSuccess: false};
  } catch (error) {
    return {isSuccess: false};
  }
};

export const evaluatePassiveLiveness = async (
  screenName: string,
  faceScanned: {
    bestImageTemplateRaw: string;
  },
  document: {
    documentNumber: string;
    documentType: number;
  },
  operationId: string,
  suffix?: string,
): Promise<{
  isSuccess: boolean;
  error?: {
    type: 'OTHER' | 'LIMIT_ATTEMPTS' | 'UNKNOWN' | 'SPOOF';
    title: string;
  };
}> => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/biometrics/evaluatePassiveLivenessToken'
      : '/api/onboarding/biometrics/evaluatePassiveLivenessToken'
  }`;

  const token2: string = await TokenManager.getInstance().getToken(
    'TOKEN_BIOMETRY',
  );

  const tokenTracking: string = await TokenManager.getInstance().getToken(
    'TOKEN_TRACKING',
  );

  const customerId =
    _.padStart(document.documentType.toString(), 3, '0') +
    document.documentNumber;

  const data: {
    errorCode: '0' | '-1' | '1';
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token2}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      livenessTokenProvider: {
        imageBuffer: faceScanned.bestImageTemplateRaw, // result.bestImageTemplateRaw
        tracking: {
          extraData: tokenTracking,
          operationId: operationId,
        },
      },
      event: {
        deviceOS: Platform.OS,
        eventId: '',
        eventDetailCode: '',
        ipAddress: await getIpAddress(),
        result: '',
        screenName: processScreenName(screenName, suffix),
        uniqueId: getUniqueId(),
      },
    },
    user: `0${document?.documentType}${document?.documentNumber}`,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === true) return {isSuccess: true};
  else {
    if (data.isWarning === true)
      switch (data.errorCode) {
        case '0':
          return {
            isSuccess: false,
            error: {
              title: data.message,
              type: 'OTHER',
            },
          };
          break;
        case '-1':
          return {
            isSuccess: false,
            error: {
              title: data.message,
              type: 'LIMIT_ATTEMPTS',
            },
          };
          break;
        case '1':
          return {
            isSuccess: false,
            error: {
              title: data.message,
              type: 'SPOOF',
            },
          };
          break;
      }
    else
      return {
        isSuccess: false,
        error: {
          title: data.message,
          type: 'UNKNOWN',
        },
      };
  }
};

export const logout = async (
  document: {
    documentNumber: string;
    documentType: number;
  },
  screen: string,
): Promise<{
  isSuccess: boolean;
}> => {
  const isAPIGee = await apiGeeStatus('mgnt_auh');
  const url = `${
    isAPIGee
      ? ProductDomain.authentication + '/logout'
      : '/api/authentication/logout'
  }`;

  const data:
    | {
        data: null;
        errorCode: '0';
        isSuccess: true;
        isWarning: false;
        message: string;
      }
    | {
        data: false;
        errorCode: '-1';
        isSuccess: false;
        isWarning: false;
        message: string;
      } = await Fetch({
    url,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${document?.documentType}${document?.documentNumber}`,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  return {isSuccess: data.isSuccess};
};

export const getIsAllowedToAttempt = async (
  personId: string,
  user: string,
  screen: string,
): Promise<{
  isSuccess: boolean;
  error?: {
    type: 'OTHER' | 'LIMIT_ATTEMPTS' | 'UNKNOWN';
    title: string;
  };
}> => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding +
        `/counter?eventId=${0}&eventDetailCode=${0}&personId=${personId}`
      : `/api/onboarding/counter?eventId=${0}&eventDetailCode=${0}&personId=${personId}`
  }`;

  const _token: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );

  const data: {
    data: boolean | object;
    errorCode: '0' | '-1' | '';
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${_token}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess) {
    if (data.data === true) return {isSuccess: true};
    else
      return {
        isSuccess: false,
        error: {
          title: data.message,
          type: 'LIMIT_ATTEMPTS',
        },
      };
  } else {
    return {
      isSuccess: false,
      error: {
        title: data.message,
        type: 'UNKNOWN',
      },
    };
  }
};

export const evaluateMatchingDocumentSidesScore = async (
  documentData: {
    documentNumber: string;
    dateOfBirth: string;
    dateOfExpiry: string;
    matchingSidesScore: number;
    documentCaptured: string;
  },
  screenName: string,
  document: {
    documentNumber: string;
    documentType: number;
  },
  suffix?: string,
): Promise<{
  isSuccess: boolean;
  error?: {
    type: 'OTHER' | 'LIMIT_ATTEMPTS' | 'UNKNOWN';
    title: string;
  };
}> => {
  const fp = await FingerprintModule.getFingerprint();
  const token2: string = await TokenManager.getInstance().getToken(
    'TOKEN_BIOMETRY',
  );

  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/biometrics/matchingDocumentSideScore'
      : '/api/onboarding/biometrics/matchingDocumentSideScore'
  }`;

  const customerId =
    _.padStart(document.documentType.toString(), 3, '0') +
    document.documentNumber;

  const data: {
    errorCode: '0' | '-1';
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token2}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      deviceOS: Platform.OS,
      documentVersion: documentData.documentCaptured,
      ipAddress: await getIpAddress(),
      matchingScore: documentData.matchingSidesScore,
      screenName: processScreenName(screenName, suffix),
      uniqueId: getUniqueId(),
      documentNumber: documentData.documentNumber,
      birthDate: documentData.dateOfBirth,
      expirationDate: documentData.dateOfExpiry,
      fingerPrintDevice: JSON.parse(fp),
    },
    user: `0${document?.documentType}${document?.documentNumber}`,
    timeout: 60000,
  });

  if (data.isSuccess === true) return {isSuccess: true};
  else {
    if (data.isWarning === true)
      switch (data.errorCode) {
        case '0':
          return {
            isSuccess: false,
            error: {
              title: data.message,
              type: 'OTHER',
            },
          };
          break;
        case '-1':
          return {
            isSuccess: false,
            error: {
              title: data.message,
              type: 'LIMIT_ATTEMPTS',
            },
          };
          break;
      }
    else
      return {
        isSuccess: false,
        error: {
          title: data.message,
          type: 'UNKNOWN',
        },
      };
  }
};

export const evaluateMatchingDocument = async (
  documentData: {
    documentNumber: string;
    dateOfBirth: string;
    dateOfExpiry: string;
  },
  screenName: string,
  document: {
    documentNumber: string;
    documentType: number;
  },
  suffix?: string,
): Promise<{
  isSuccess: boolean;
  error?: {
    type: 'OTHER' | 'LIMIT_ATTEMPTS' | 'UNKNOWN';
    title: string;
  };
}> => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/biometrics/matchingDocument'
      : '/api/onboarding/biometrics/matchingDocument'
  }`;

  const token2: string = await TokenManager.getInstance().getToken(
    'TOKEN_BIOMETRY',
  );

  const customerId =
    _.padStart(document.documentType.toString(), 3, '0') +
    document.documentNumber;

  const data: {
    errorCode: '0' | '-1';
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token2}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      deviceOS: Platform.OS,
      ipAddress: await getIpAddress(),
      screenName: processScreenName(screenName, suffix),
      uniqueId: getUniqueId(),
      documentNumber: documentData.documentNumber,
      birthDate: documentData.dateOfBirth,
      expirationDate: documentData.dateOfExpiry,
    },
    user: `0${document?.documentType}${document?.documentNumber}`,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === true) return {isSuccess: true};
  else {
    if (data.isWarning === true)
      switch (data.errorCode) {
        case '0':
          return {
            isSuccess: false,
            error: {
              title: data.message,
              type: 'OTHER',
            },
          };
          break;
        case '-1':
          return {
            isSuccess: false,
            error: {
              title: data.message,
              type: 'LIMIT_ATTEMPTS',
            },
          };
          break;
      }
    else
      return {
        isSuccess: false,
        error: {
          title: data.message,
          type: 'UNKNOWN',
        },
      };
  }
};

export const evaluateMatchingSideScore = async (
  matchingSidesScore: number,
  screenName: string,
  documentCaptured: string,
  document: {
    documentNumber: string;
    documentType: number;
  },
  suffix?: string,
): Promise<{
  isSuccess: boolean;
  error?: {
    type: 'OTHER' | 'LIMIT_ATTEMPTS' | 'UNKNOWN';
    title: string;
  };
}> => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/biometrics/matchingSidesScore'
      : '/api/onboarding/biometrics/matchingSidesScore'
  }`;

  const token2: string = await TokenManager.getInstance().getToken(
    'TOKEN_BIOMETRY',
  );

  const customerId =
    _.padStart(document.documentType.toString(), 3, '0') +
    document.documentNumber;

  const data: {
    errorCode: '0' | '-1';
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token2}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      deviceOS: Platform.OS,
      ipAddress: await getIpAddress(),
      matchingScore: matchingSidesScore,
      screenName: processScreenName(screenName, suffix),
      uniqueId: getUniqueId(),
      documentVersion: documentCaptured,
    },
    user: `0${document?.documentType}${document?.documentNumber}`,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === true) return {isSuccess: true};
  else {
    if (data.isWarning === true)
      switch (data.errorCode) {
        case '0':
          return {
            isSuccess: false,
            error: {
              title: data.message,
              type: 'OTHER',
            },
          };
          break;
        case '-1':
          return {
            isSuccess: false,
            error: {
              title: data.message,
              type: 'LIMIT_ATTEMPTS',
            },
          };
          break;
      }
    else
      return {
        isSuccess: false,
        error: {
          title: data.message,
          type: 'UNKNOWN',
        },
      };
  }
};

export const authenticateFacial = async (
  documentScanned: {
    tokenFaceImage: string;
  },
  faceScanned: {
    templateRaw: string;
  },
  screenName: string,
  document: {
    documentNumber: string;
    documentType: number;
  },
  operationId: string,
  suffix?: string,
): Promise<{
  isSuccess: boolean;
  error?: {
    type: 'OTHER' | 'LIMIT_ATTEMPTS' | 'UNKNOWN';
    title: string;
  };
}> => {
  const fp = await FingerprintModule.getFingerprint();
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/biometrics/authenticateFacial'
      : '/api/onboarding/biometrics/authenticateFacial'
  }`;

  const token2: string = await TokenManager.getInstance().getToken(
    'TOKEN_BIOMETRY',
  );

  const tokenTracking: string = await TokenManager.getInstance().getToken(
    'TOKEN_TRACKING',
  );

  const customerId =
    _.padStart(document.documentType.toString(), 3, '0') +
    document.documentNumber;

  const data: {
    errorCode: '0' | '-1';
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token2}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      authFacialProvider: {
        token1: documentScanned.tokenFaceImage,
        token2: faceScanned.templateRaw, // result.templateRaw | configurar..
        method: 5,
        tracking: {
          extraData: tokenTracking,
          operationId: operationId,
        },
      },
      event: {
        deviceOS: Platform.OS,
        eventId: '',
        eventDetailCode: '',
        ipAddress: await getIpAddress(),
        result: '',
        screenName: processScreenName(screenName, suffix),
        uniqueId: getUniqueId(),
      },
      ipAddress: await getIpAddress(),
      fingerPrintDevice: JSON.parse(fp),
    },
    user: `0${document?.documentType}${document?.documentNumber}`,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === true) return {isSuccess: true};
  else {
    if (data.isWarning === true)
      switch (data.errorCode) {
        case '0':
          return {
            isSuccess: false,
            error: {
              title: data.message,
              type: 'OTHER',
            },
          };
          break;
        case '-1':
          return {
            isSuccess: false,
            error: {
              title: data.message,
              type: 'LIMIT_ATTEMPTS',
            },
          };
          break;
      }
    else
      return {
        isSuccess: false,
        error: {
          title: data.message,
          type: 'UNKNOWN',
        },
      };
  }
};

export const civilValidation = async (
  screenName: string,
  faceScanned: {
    templateRaw: string;
    bestImage: string;
    bestImageTemplateRaw: string;
  },
  documentScanned: {
    tokenOCR: string;
  },
  documentData: {
    documentNumberMRZ: string;
  },
  document: {
    documentNumber: string;
    documentType: number;
  },
  operationId: string,
  suffix?: string,
): Promise<{
  isSuccess: boolean;
  error?: {
    type: 'OTHER' | 'LIMIT_ATTEMPTS' | 'UNKNOWN';
    title: string;
  };
}> => {
  const fp = await FingerprintModule.getFingerprint();
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/biometrics/civilValidation'
      : '/api/onboarding/biometrics/civilValidation'
  }`;

  const token2: string = await TokenManager.getInstance().getToken(
    'TOKEN_BIOMETRY',
  );

  const tokenTracking: string = await TokenManager.getInstance().getToken(
    'TOKEN_TRACKING',
  );

  const customerId =
    _.padStart(document.documentType.toString(), 3, '0') +
    document.documentNumber;

  const data: {
    errorCode: '0' | '-1';
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token2}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      civilProvider: {
        documentNumber: documentData.documentNumberMRZ,
        countryCode: 'PER',
        operation: 'FULL',
        platform: 'MOBILE',
        returnPII: true,
        templateRaw: faceScanned.templateRaw, // result.templateRaw ! Se puede utilizar
        tokenOcr: documentScanned.tokenOCR,
        tracking: {
          extraData: tokenTracking,
          operationId: operationId,
        },
      },
      event: {
        deviceOS: Platform.OS,
        eventId: '',
        eventDetailCode: '',
        ipAddress: await getIpAddress(),
        result: '',
        screenName: processScreenName(screenName, suffix),
        uniqueId: getUniqueId(),
      },
      ipAddress: await getIpAddress(),
      fingerPrintDevice: JSON.parse(fp),
    },
    user: `0${document?.documentType}${document?.documentNumber}`,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === true) return {isSuccess: true};
  else {
    if (data.isWarning === true)
      switch (data.errorCode) {
        case '0':
          return {
            isSuccess: false,
            error: {
              title: data.message,
              type: 'OTHER',
            },
          };
          break;
        case '-1':
          return {
            isSuccess: false,
            error: {
              title: data.message,
              type: 'LIMIT_ATTEMPTS',
            },
          };
          break;
      }
    else
      return {
        isSuccess: false,
        error: {
          title: data.message,
          type: 'UNKNOWN',
        },
      };
  }
};

export const updatePassword = async (
  user: {
    codeVerification: string;
    currentPassword: string;
    newPassword: string;
  },
  screen?: string,
): Promise<{type: 'SUCCESS'} | {type: 'USER_IS_BLOCKED'}> => {
  const isAPIGee = await apiGeeStatus('mgnt_auh');
  const url = `${
    isAPIGee
      ? ProductDomain.authentication + '/change_password/login'
      : '/api/v2/authentication/change_password/login'
  }`;

  const data:
    | {
        errorCode: '0';
        data: true;
        isSuccess: true;
        isWarning: boolean;
        message: string;
      }
    | {
        errorCode: '-2' | '-1';
        data: false;
        isSuccess: false;
        isWarning: boolean;
        message: string;
      } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      codeVerification: user.codeVerification,
      current_password: user.currentPassword,
      new_password: user.newPassword,
      uniqueId: getUniqueId(),
      ipAddress: await getIpAddress(),
    },
    timeout: 60000,
    isSecure: isAPIGee,
    screen,
  });

  if (data.isSuccess === true) {
    return {
      type: 'SUCCESS',
    };
  } else {
    switch (data.errorCode) {
      case '-1':
        throw new Error('Ocurrió un error desconocido.');
        break;
      case '-2':
        return {type: 'USER_IS_BLOCKED'};
        break;
    }
  }
};

export const getInfoFromUser = async (
  user: {
    documentNumber: string;
    documentType: number;
  },
  screen?: string,
): Promise<
  | {
      type: 'SUCCESS';
      email: string;
      firstName: string;
      secondName?: string;
      firstSurname: string;
      secondSurname: string;
    }
  | {type: 'USER_DOESNT_HAVE_MEMBERSHIP'}
  | {type: 'USER_DOESNT_EXIST'}
> => {
  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_INIT',
  );
  const isAPIGee = await apiGeeStatus('mgnt_auh');
  const url = `${
    isAPIGee
      ? ProductDomain.authentication +
        `/membership/email?documentType=${user.documentType}&documentNumber=${user.documentNumber}`
      : `/api/authentication/membership/email?documentType=${user.documentType}&documentNumber=${user.documentNumber}`
  }`;

  const data:
    | {
        errorCode: '0';
        data: {
          email: string;
          firstName: string;
          secondName: string;
          firstSurname: string;
          secondSurname: string;
        };
        isSuccess: true;
        isWarning: boolean;
        message: string;
      }
    | {
        errorCode: '1' | '-1';
        data: null;
        isSuccess: false;
        isWarning: boolean;
        message: string;
      } = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${user?.documentType}${user?.documentNumber}`,
    timeout: 60000,
    isSecure: isAPIGee,
    screen,
  });

  if (data.isSuccess === true) {
    return {
      type: 'SUCCESS',
      email: data.data.email,
      firstName: formatName(data.data.firstName),
      secondName:
        data.data.secondName === ''
          ? undefined
          : formatName(data.data.secondName),
      firstSurname: formatName(data.data.firstSurname),
      secondSurname: formatName(data.data.secondSurname),
    };
  } else {
    switch (data.errorCode) {
      case '1':
        return {
          type: 'USER_DOESNT_HAVE_MEMBERSHIP',
        };
        break;
      case '-1':
        return {
          type: 'USER_DOESNT_EXIST',
        };
        break;
    }
  }
};

export const updatePassword_ForgotPasswordFlow = async (
  user: {
    password: string;
  },
  screen?: string,
  documentType?: number,
  documentNumber?: string,
): Promise<{hasToken: boolean; isSecure: boolean}> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_auh');
  const url = `${
    isAPIGee
      ? ProductDomain.authentication + '/membership/password'
      : '/api/authentication/membership/password'
  }`;

  const token: string = await TokenManager.getInstance().getToken(
    'TOKEN_BIOMETRY',
  );

  const data:
    | {
        errorCode: string;
        data: {hasToken: boolean; isSecure: boolean};
        isSuccess: true;
        isWarning: boolean;
        message: string;
      }
    | {
        errorCode: string;
        data: null;
        isSuccess: false;
        isWarning: boolean;
        message: string;
      } = await Fetch({
    url,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      password: user.password,
      uniqueId: getUniqueId(),
    },
    timeout: 60000,
    user: `0${documentType}${documentNumber}`,
    isSecure: isAPIGee,
    screen,
  });

  if (data.isSuccess === true) {
    return {
      hasToken: data.data.hasToken,
      isSecure: data.data.isSecure,
    };
  } else throw new Error('Error intento al intentar actualizar la contraseña.');
};

export const getSecret = async (
  user: {
    documentNumber: string;
    documentType: number;
    password: string;
    email: string;
    firstName: string;
    secondName?: string;
    firstSurname: string;
    secondSurname: string;
  },
  screen?: string,
): Promise<{secret: string; seedId: string}> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/onboarding/token'
      : '/api/onboarding/onboarding/token'
  }`;

  const token2: string = await TokenManager.getInstance().getToken(
    'TOKEN_BIOMETRY',
  );

  const data:
    | {
        errorCode: '100';
        data: {secret: string; seedId: string};
        isSuccess: true;
        isWarning: false;
        message: string;
      }
    | {
        errorCode: '-1';
        data: null;
        isSuccess: false;
        isWarning: false;
        message: string;
      } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token2}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      password: user.password,
      brand: await getManufacturer(),
      phoneModel: getModel(),
      uniqueId: getUniqueId(),
      ipAddress: await getIpAddress(),
    },
    user: `0${user?.documentType}${user?.documentNumber}`,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === false || data.data === null)
    throw new Error(`${data.errorCode}: ${data.message}`);
  else
    return {
      secret: data.data.secret,
      seedId: data.data.seedId,
    };
};

export const finishTracking = async (
  status: 'Error' | 'Succeeded' | 'Denied' | 'Cancelled',
  user: {
    documentNumber: string;
    documentType: number;
  },
  screen?: string,
): Promise<boolean> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/biometrics/finishTracking'
      : '/api/onboarding/biometrics/finishTracking'
  }`;

  const token1: string = await TokenManager.getInstance().getToken(
    'TOKEN_BIOMETRY',
  );

  const tokenTracking: string = await TokenManager.getInstance().getToken(
    'TOKEN_TRACKING',
  );

  const data: {
    errorCode: string;
    data: {
      result: string;
      ptr: number;
      trackingStatus: number;
      trackingMessage: string;
      transactionId: string;
      timestamp: string;
    } | null;
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    body: {
      status: status,
      reason: status === 'Cancelled' ? 'UserChanged' : 'None',
      extraData: tokenTracking,
    },
    headers: {
      Authorization: `Bearer ${token1}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${user.documentType}${user.documentNumber}`,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === false)
    throw new Error(`${data.errorCode}: ${data.message}`);
  else return data.isSuccess;
};

export const activateToken = async (
  token: string,
  screen?: string,
  user?: string,
): Promise<{secret: string; seedId: string}> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_auh');
  const url = `${
    isAPIGee
      ? ProductDomain.authentication + '/token'
      : '/api/v2/authentication/token'
  }`;

  const data:
    | {
        errorCode: '100';
        data: {secret: string; seedId: string};
        isSuccess: true;
        isWarning: false;
        message: string;
      }
    | {
        errorCode: '-1';
        data: null;
        isSuccess: false;
        isWarning: false;
        message: string;
      } = await Fetch({
    url,
    method: 'POST',
    body: {
      brand: await getManufacturer(),
      phoneModel: getModel(),
      uniqueId: getUniqueId(),
      ipAddress: await getIpAddress(),
    },
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    closeSessionOnError: true,
    user,
    screen,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === false || data.data === null)
    throw new Error(`${data.errorCode}: ${data.message}`);
  else
    return {
      secret: data.data.secret,
      seedId: data.data.seedId,
    };
};

export const sendNotificationSuccess = async (
  user: {
    password: string;
  },
  screen?: string,
  documentType?: number,
  documentNumber?: string,
) => {
  const isAPIGee = await apiGeeStatus('mgnt_onb');
  const url = `${
    isAPIGee
      ? ProductDomain.onboarding + '/onboarding'
      : '/api/onboarding/onboarding'
  }`;

  const token2: string = await TokenManager.getInstance().getToken(
    'TOKEN_BIOMETRY',
  );
  const data: {
    errorCode: string;
    data: any;
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token2}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      brand: await getManufacturer(),
      password: user.password,
      phoneModel: getModel(),
      uniqueId: getUniqueId(),
    },
    timeout: 60000,
    user: `0${documentType}${documentNumber}`,
    isSecure: isAPIGee,
    screen,
  });
  if (data.isSuccess === false) {
    if (data.data.content) return data.data;
    else throw new Error(`${data.errorCode}: ${data.message}`);
  } else {
    return data.data;
  }
};

export const getUserInfo = async ({
  ntip,
  nin,
}: {
  ntip: string;
  nin: string;
}):
  | Promise<{
      isMember: boolean;
      hasActiveProduct: boolean;
      person: {
        applicantTypeId: number;
        documentNumber: string;
        documentTypeId: number;
        existCompartamos: boolean;
        lastName: string;
        motherLastName: string;
        firstName: string;
        middleName: string;
        personUId: number;
        gender: PersonGender;
      } | null;
    }>
  | never => {
  const isAPIGee = await apiGeeStatus('mgnt_auh');
  const url = `${
    isAPIGee
      ? ProductDomain.authentication +
        `/person?documentNumber=${nin}&documentType=${ntip}`
      : `/api/authentication/person?documentNumber=${nin}&documentType=${ntip}`
  }`;

  const data = await Fetch({
    url,
    method: 'GET',
    headers: {
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${ntip}${nin}`,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === false)
    throw new Error(`${data.errorCode}: ${data.message}`);
  else return data.data;
};

export const getUserSavings = async (
  documentType?: number,
  documentNumber?: string,
): Promise<Savings> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_acc');
  const url = `${
    isAPIGee ? ProductDomain.account + '/accounts' : '/api/accounts/accounts'
  }`;

  const data = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${documentType}${documentNumber}`,
    closeSessionOnError: true,
    isSecure: isAPIGee,
    timeout: 60000,
  });

  if (data.isSuccess === false)
    throw new Error(`${data.errorCode}: ${data.message}`);
  else return data.data;
};

export const getUserCredits = async (
  documentType?: number,
  documentNumber?: string,
  screen?: string,
): Promise<Credits> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');

  const url = `${isAPIGee ? ProductDomain.creditsApiGee : '/api/credits/'}`;

  const data = await Fetch({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    user: `0${documentType}${documentNumber}`,
    closeSessionOnError: true,
    timeout: 60000,
    isSecure: isAPIGee,
    screen,
  });

  if (data.isSuccess === false)
    throw new Error(`${data.errorCode}: ${data.message}`);
  else return data.data;
};

export const disaffiliation = async ({
  screen,
  documentType,
  documentNumber,
}: {
  screen: string;
  documentType: number;
  documentNumber: string;
}) => {
  const isAPIGee = await apiGeeStatus('mgnt_auh');
  const url = `${
    isAPIGee
      ? ProductDomain.authentication + '/disaffiliation'
      : '/api/authentication/disaffiliation'
  }`;

  const token: string = await TokenManager.getInstance().getToken('TOKEN_INIT');

  const data: {
    data: boolean;
    errorCode: '0' | '-1';
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
  } = await Fetch({
    url,
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {
      uniqueId: getUniqueId(),
    },
    user: `0${documentType}${documentNumber}`,
    timeout: 60000,
    screen,
    isSecure: isAPIGee,
  });

  if (data.isSuccess === false)
    throw new Error(`${data.errorCode}: ${data.message}`);
  else
    return (
      data.isWarning === false && data.errorCode === '0' && data.data === true
    );
};

export const getCreditPayments = async ({
  accountCode,
  user,
  screen,
}: {
  accountCode: number | string;
  user?: string;
  screen?: string;
}): Promise<CreditPayments> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${
    isAPIGee
      ? ProductDomain.creditsApiGee + `/payment/installments/${accountCode}`
      : `/api/credits/payment/installments/${accountCode}`
  }`;

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

  if (data.isSuccess === false) {
    throw new Error(`${data.errorCode}: ${data.message}`);
  } else {
    return data.data;
  }
};
export const getCustomCredits = async ({
  user,
  screen,
}: {
  user?: string;
  screen?: string;
}): Promise<CustomCredits> | never => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${
    isAPIGee
      ? ProductDomain.creditsApiGee + '/payment'
      : '/api/credits/payment/'
  }`;

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

  if (data.isSuccess === false) {
    throw new Error(`${data.errorCode}: ${data.message}`);
  } else {
    return data.data;
  }
};

/* DEBUG - 1 */
export const validatePooledAccount = async ({
  accountCode,
  user,
  screen,
}: {
  accountCode: number | string;
  user?: string;
  screen?: string;
}) => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${
    isAPIGee
      ? ProductDomain.creditsApiGee + '/payment'
      : '/api/credits/payment/'
  }`;

  const data = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {accountCode},
    closeSessionOnError: true,
    user,
    screen,
    isSecure: isAPIGee,
  });
  console.log('data :>>', data);
  if (data.isSuccess === false) {
    if (data.data.content) return data.data;
    else throw new Error(`${data.errorCode}: ${data.message}`);
  } else {
    return data.data;
  }
};

export const validatePaymentOperation = async ({
  accountCode,
  typeOperation,
  user,
  screen,
}: {
  accountCode?: number | string;
  typeOperation: 'DC' | 'LC' | 'DL';
  user?: string;
  screen?: string;
}) => {
  const isAPIGee = await apiGeeStatus('mgnt_cre');
  const url = `${
    isAPIGee
      ? ProductDomain.creditsApiGee + '/payment/validate/operation'
      : '/api/credits/payment/validate/operation'
  }`;

  const data = await Fetch({
    url,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isAPIGee ? createHeadersApiGee() : {}),
    },
    base: isAPIGee ? 'GEE' : 'GW',
    body: {accountCode, typeOperation},
    closeSessionOnError: true,
    user,
    screen,
    isSecure: isAPIGee,
  });
  if (data.isSuccess === false) {
    if (data.data.content) return data.data;
    else throw new Error(`${data.errorCode}: ${data.message}`);
  } else {
    return data.data;
  }
};

export const payCredit = async ({
  payload,
  user,
  screen,
}: {
  payload: PaymentInterfaceReq;
  user?: string;
  screen?: string;
}) => {
  const fp = await FingerprintModule.getFingerprint();
  const isAPIGee = await apiGeeStatus('mgnt_pay');
  const url = `${
    isAPIGee
      ? ProductDomain.payments + '/installments'
      : '/api/payments/installments'
  }`;

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
  if (data.isSuccess === false) {
    if (data.data.content) return data.data;
    else throw new Error(`${data.errorCode}: ${data.message}`);
  } else {
    return data.data;
  }
};
