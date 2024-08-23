import { PersonGender } from "@navigations/types";

interface IServiceBaseResult {
    errorCode: string;
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
}

type TPayDebtsServiceResult =  IPayDebtsServiceResult1 | IPayDebtsServiceResult2 | IPayDebtsServiceResult3
type TPayDebtsFunctionResult =  IPayDebtsFunctionResult1 | IPayDebtsFunctionResult2 | IPayDebtsFunctionResult3
type TPaymentSendOtpToPhoneServiceResult =  IPaymentSendOtpToPhoneServiceResult1 | IPaymentSendOtpToPhoneServiceResult2
type TPaymentSendOtpToPhoneFunctionResult = IPaymentSendOtpToPhoneFunctionResult1
type TPaymentEvaluateOtpFromPhoneServiceResult = IPaymentEvaluateOtpFromPhoneServiceResult1 | IPaymentEvaluateOtpFromPhoneServiceResult2
type TPaymentEvaluateOtpFromPhoneFunctionResult = IPaymentEvaluateOtpFromPhoneFunctionResult1 | IPaymentEvaluateOtpFromPhoneFunctionResult2
interface IPayDebtsFunctionResult3 {
    type: 'BLOCKED_BY_MP' | 'UNKNOWN_ERROR';
    payload?: undefined;
}

interface IPayDebtsFunctionResult1 {
    type: 'SUCCESS';
    payload: {
        accountNumber: string;
        date: string;
        datetime: string;
        documentNumber: string;
        fullName: string;
        hour: string;
        operationNumber: string;
        email: string;
        btTransactionId: string;
        gloss: string;
        hasGlosa: boolean;
        tracePayment: string;
    };
}

interface IPayDebtsFunctionResult2 {
    type: 'NEED_AUTHENTICATION_BY_MP';
    payload: {
        phoneOfuscated: string;
        trackingTransaction: string;
    };
}

interface IPayDebtsServiceResult1 extends IServiceBaseResult {
    data: {
        accountNumber: string;
        date: string;
        datetime: string;
        documentNumber: string;
        fullName: string;
        hour: string;
        operationNumber: string;
        email: string;
        btTransactionId: number;
        gloss: string | undefined | null;
        tracePayment: string;
    };
    errorCode: "100" | "0";
    isSuccess: true;
    isWarning: false;
}

interface IPayDebtsServiceResult2 extends IServiceBaseResult {
    data: {
        cellphone: string;
        trackingTransaction: string;
    };
    errorCode: "101";
    isSuccess: false;
    isWarning: true;
}

interface IPayDebtsServiceResult3 extends IServiceBaseResult {
    data: null;
    errorCode: "102" | "-1";
    isSuccess: false;
    isWarning: true;
}

interface IPaymentSendOtpToPhoneServiceResult1 extends IServiceBaseResult {
    data: true;
    errorCode: '0';
    isSuccess: true;
    isWarning: false;
}

interface IPaymentSendOtpToPhoneServiceResult2 extends IServiceBaseResult {
    data: false;
    errorCode: '102' | '-1';
    isSuccess: false;
    isWarning: true;
}

interface IPaymentSendOtpToPhoneFunctionResult1 {
    type: 'SUCCESS' | 'BLOCKED' | 'ERROR';
}

interface IPaymentEvaluateOtpFromPhoneFunctionResult1 {
    type: 'SUCCESS';
    payload: {
        accountNumber: string;
        date: string;
        datetime: string;
        documentNumber: string;
        fullName: string;
        hour: string;
        operationNumber: string;
        email: string;
        btTransactionId: string;
        gloss: string;
        hasGlosa: boolean;
        tracePayment: string;
    };
}

interface IPaymentEvaluateOtpFromPhoneFunctionResult2 {
    type: 'BLOCKED' | 'ERROR';
}

interface IPaymentEvaluateOtpFromPhoneServiceResult1 extends IServiceBaseResult {
    data: {
        accountNumber: string;
        btTransactionId: number;
        date: string;
        datetime: string;
        documentNumber: string;
        fullName: string;
        hour: string;
        operationNumber: string;
        email: string;
        gloss: string | undefined | null;
        tracePayment: string;
    };
    errorCode: '100';
    isSuccess: true;
    isWarning: false;
}

interface IPaymentEvaluateOtpFromPhoneServiceResult2 extends IServiceBaseResult {
    data: false;
    errorCode: '102' | '-1';
    isSuccess: false;
    isWarning: true;
}

interface IAuthBiometry {
    extraData?: string;
}
interface IGetMembershipProps {
    documentNumber: string;
    documentType: number;
    phoneNumber: string;
    screenName: string;
}

interface IGetMembershipResult1 {
    type: 'USER_IS_NOT_A_MEMBER';
}

interface IGetMembershipResult2 {
    type: 'USER_FRAUDULENT';
}

interface IGetMembershipResult3 {
    type: 'USER_DOESNT_HAVE_AN_ACTIVE_PRODUCT';
    firstName: string;
    gender: PersonGender;
}

interface IGetMembershipResult4 {
    type: 'GO_TO_ONBOARDING';
    firstName: string;
    gender: PersonGender;
    personId: string;
}

interface IGetMembershipResult5 {
    type: 'GO_TO_PRE_AGENCY';
    gender: PersonGender;
    email: string;
    phoneNumber: string;
    firstName: string;
}

interface IGetMembershipResult6 {
    type: 'USER_EXISTS';
}

interface IGetMembershipResult7 {
    type: 'MAX_LIMIT_ATTEMPTS';
}

type TGetMembershipResult = IGetMembershipResult1 | IGetMembershipResult2 | IGetMembershipResult3 | IGetMembershipResult4 | IGetMembershipResult5 | IGetMembershipResult6 | IGetMembershipResult7;
type TGetMembershipServiceResult = IGetMembershipServiceResult1 | IGetMembershipServiceResult2 | IGetMembershipServiceResult3 | IGetMembershipServiceResult4;
interface IGetMembershipServiceResult1 extends IServiceBaseResult {
    data: {
        personId: string;
        hasActiveProduct: boolean;
        hasDisbursement: boolean;
        hasMembership: boolean;
        isMember: boolean;
        membershipComplete: boolean;
        email: string;
        firstName: string;
        phone: string;
        gender: PersonGender;
    };
    errorCode: "0";
    isSuccess: true;
    isWarning: false;
}


interface IGetMembershipServiceResult2 extends IServiceBaseResult {
    data: null;
    errorCode: "0";
    isSuccess: true;
    isWarning: false;
}

interface IGetMembershipServiceResult3 extends IServiceBaseResult {
    data: false;
    errorCode: "-1";
    isSuccess: false;
    isWarning: false;
}

interface IGetMembershipServiceResult4 extends IServiceBaseResult {
    errorCode: "102";
}
interface IGetMembership_ForgotPasswordProps {
    documentNumber: string;
    documentType: number;
    phoneNumber: string;
    screenName: string;
}

interface IGetMembership_ForgotPasswordResult1 {
    type: 'USER_DOESNT_HAVE_MEMBERSHIP';
}

interface IGetMembership_ForgotPasswordResult2 {
    type: 'USER_DOESNT_EXIST';
}


interface IGetMembership_ForgotPasswordResult3 {
    type: 'SUCCESS';
    email: string;
    firstName: string;
}

interface IGetMembership_ForgotPasswordResult4 {
    type: 'MAX_LIMIT_ATTEMPTS';
}

type TGetMembership_ForgotPasswordResult = IGetMembership_ForgotPasswordResult1 | IGetMembership_ForgotPasswordResult2 | IGetMembership_ForgotPasswordResult3 | IGetMembership_ForgotPasswordResult4;
type TGetMembership_ForgotPasswordServiceResult = IGetMembership_ForgotPasswordServiceResult1 | IGetMembership_ForgotPasswordServiceResult2 | IGetMembership_ForgotPasswordServiceResult3;
interface IGetMembership_ForgotPasswordServiceResult1 extends IServiceBaseResult {
    data: {
        email: string;
        firstName: string;
    };
    errorCode: "0";
    isSuccess: true;
    isWarning: false;
}


interface IGetMembership_ForgotPasswordServiceResult2 extends IServiceBaseResult {
    data: null;
    errorCode: "1" | "-1";
    isSuccess: false;
}

interface IGetMembership_ForgotPasswordServiceResult3 extends IServiceBaseResult {
    data: null;
    errorCode: "0";
    isSuccess: true;
    isWarning: false;
}