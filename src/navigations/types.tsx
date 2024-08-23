import {Currency, Saving} from '@features/userInfo';
import {IDisbursCredit} from '@interface/Credit';
import {IFavorite} from '@interface/Favorite';
import {StepsProps} from '@molecules/Steps';
import {StepsProps as StepsPropsExtra} from '@molecules/extra/Steps';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AttemptType} from '@screens/InfoAttemptRestriction';
import {PayConstancyPayloadProps} from '@screens/Payments/Constancy/MainContent';
import {IGetContactData} from '@services/Interoperability';

export type RegisterStage = 'ONBOARDING' | 'AGENCY';
export type ScanType = 'DOI' | 'FACE' | 'ALL';
export type ExecuteScanType = 'DOI' | 'FACE';
export type PersonGender = 'F' | 'M';

export type MoreStackParamList = {
  Menu: {showTokenActivatedModal?: boolean};
  UpdatePassword: undefined;
  MyFavorites: undefined;
  MyFavoritesDetail: {
    favorite: IFavorite;
  };
  FavoriteOperations: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  RegisterUserDocument: undefined;
  ModalInactivity: undefined;
  RecoverPassword: undefined;
  InfoActivateToken: {
    redirectTo:
      | 'HOME'
      | 'MORE'
      | 'CREDITS'
      | 'DISBURSEMENT'
      | 'PAYWITHPHONE'
      | 'AFFILIATION'
      | 'NEWSAVEACCOUNT'
      | 'GROUPCREDIT'
      | 'LINECREDIT';
    option?: String;
  };
  LoadingScreen: undefined;
  Login: undefined;
  LoginNormal: undefined;
  LoginSecure: {
    firstName: string;
    documentType: number;
    documentNumber: string;
  };
  Location: undefined;
  VisitRegistration: undefined;
  VisitRegistrationError: undefined;
  InfoAttemptRestriction: {
    attempt: AttemptType;
    firedAt: number;
  };
  InfoAccessBlocked?:
    | {
        description: string;
      }
    | undefined;
  InfoRegisterInLogin: undefined;
  InfoWithoutActiveProduct: {name?: string; gender: PersonGender};
  InfoWithoutMembership: undefined;
  InfoUserExists: undefined;
  InfoScanDNI: {
    flowType: 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';
    gender: PersonGender;
    documentNumber: string;
    documentType: number;
  };
  InfoUpdateAppScreen: undefined;
  InfoSpam: undefined;
  InfoDataUsed: {
    phoneNumber?: string;
    email?: string;
    isSensitiveInfo: boolean;
  };
  InfoRegisterSuccess: {title: string; description: string};
  InfoDNINotRecognizedMaxAttempt: undefined;
  InfoMaxAttemps: undefined;
  InfoFaceBlocked: undefined;
  InfoScanError: {scanType: ScanType; title: string};
  InfoRegisterToken:
    | {
        flowType: 'REGISTER';
        documentType: number;
        documentNumber: string;
        password: string;
        email: string;
        firstName: string;
        secondName?: string;
        firstSurname: string;
        secondSurname: string;
      }
    | {
        flowType: 'FORGOT_PASSWORD';
        documentType: number;
        documentNumber: string;
        password: string;
        email: string;
        firstName: string;
        secondName?: string;
        firstSurname: string;
        secondSurname: string;
      };
  RegisterPassword:
    | {
        flowType: 'REGISTER';
        showTerms: boolean;
        stepProps?: StepsPropsExtra;
        documentType: number;
        documentNumber: string;
        email: string;
        firstName: string;
        secondName?: string;
        firstSurname: string;
        secondSurname: string;
        from?: 'RegisterIdentityInfo';
      }
    | {
        flowType: 'FORGOT_PASSWORD';
        showTerms: boolean;
        stepProps?: StepsPropsExtra;
        documentType: number;
        documentNumber: string;
        email: string;
        firstName: string;
        secondName?: string;
        firstSurname: string;
        secondSurname: string;
        from?: 'RegisterIdentityInfo';
      };
  RegisterIdentityInfo:
    | {
        flowType: 'REGISTER';
        autoExecute?: ExecuteScanType;
        stage: RegisterStage;
        gender: PersonGender;
        documentType: number;
        documentNumber: string;
        email: string;
        stepProps?: StepsPropsExtra;
        faceScanned?: {
          bestImage: string;
          bestImageTemplateRaw: string;
          templateRaw: string;
        };
        documentScanned?: {
          frontDocumentImage: string;
          backDocumentImage: string;
          faceImage: string;
          matchingSidesScore: number;
          tokenOCR: string;
          tokenFaceImage: string;
          documentCaptured: string;
          documentData: {
            documentNumberMRZ: string;
            documentNumber: string;
            dateOfBirth: string;
            dateOfExpiry: string;
          };
        };
        firstName: string;
        secondName?: string;
        firstSurname: string;
        secondSurname: string;
      }
    | {
        flowType: 'LOGIN';
        autoExecute?: ExecuteScanType;
        password: string;
        gender: PersonGender;
        documentType: number;
        documentNumber: string;
        stepProps?: StepsPropsExtra;
        faceScanned?: {
          bestImage: string;
          bestImageTemplateRaw: string;
          templateRaw: string;
        };
        documentScanned?: {
          frontDocumentImage: string;
          backDocumentImage: string;
          faceImage: string;
          matchingSidesScore: number;
          tokenOCR: string;
          tokenFaceImage: string;
          documentCaptured: string;
          documentData: {
            documentNumberMRZ: string;
            documentNumber: string;
            dateOfBirth: string;
            dateOfExpiry: string;
          };
        };
      }
    | {
        flowType: 'FORGOT_PASSWORD';
        autoExecute?: ExecuteScanType;
        gender: PersonGender;
        email: string;
        documentType: number;
        documentNumber: string;
        stepProps?: StepsPropsExtra;
        faceScanned?: {
          bestImage: string;
          bestImageTemplateRaw: string;
          templateRaw: string;
        };
        documentScanned?: {
          frontDocumentImage: string;
          backDocumentImage: string;
          faceImage: string;
          matchingSidesScore: number;
          tokenOCR: string;
          tokenFaceImage: string;
          documentCaptured: string;
          documentData: {
            documentNumberMRZ: string;
            documentNumber: string;
            dateOfBirth: string;
            dateOfExpiry: string;
          };
        };
        firstName: string;
        secondName?: string;
        firstSurname: string;
        secondSurname: string;
      };
  RegisterOTP:
    | {
        type: 'TRANSFERENCY_LOCAL';
        documentType: number;
        documentNumber: string;
        phoneNumberObfuscated: string;
        channel: 'sms';
        isSensitiveInfo: true;
        stepProps?: StepsProps;
        execRestart?: boolean;
        trackingTransaction: string;
        transfer: {
          destinationAccountName: string;
          destinationAccountNumber: string;
          amount: number;
          formatAmount: string;
          operationUId: number;
          concept: string;
        };
      }
    | {
        type: 'REFILL_BIM';
        documentType: number;
        documentNumber: string;
        phoneNumberObfuscated: string;
        channel: 'sms';
        isSensitiveInfo: true;
        stepProps?: StepsProps;
        execRestart?: boolean;
        trackingTransaction: string;
        refillData: {
          amount: number;
          formatAmount: string;
          operationUId: number;
          phoneNumberBim: string;
        };
      }
    | {
        type: 'INTEROPERABILITY';
        documentType: number;
        documentNumber: string;
        phoneNumberObfuscated: string;
        channel: 'sms';
        isSensitiveInfo: true;
        stepProps?: StepsProps;
        execRestart?: boolean;
        trackingTransaction: string;
        payload?: {
          contactSelected: any;
          payloadRecentContacts: any;
        };
      }
    | {
        type: 'TRANSFERENCY_OTHERS';
        documentType: number;
        documentNumber: string;
        phoneNumberObfuscated: string;
        channel: 'sms';
        isSensitiveInfo: true;
        stepProps?: StepsProps;
        execRestart?: boolean;
        trackingTransaction: string;
        transfer: {
          destinationAccountName: string;
          destinationAccountNumber: string;
          amount: number;
          formatAmount: string;
          operationUId: number;
          concept: string;
          originCommission: number;
          destinationCommission: number;
          destinationBankName: string;
          sameHeadLine: boolean;
          favoriteName?: string;
        };
      }
    | {
        type: 'REGISTER';
        showMaxLimit: boolean;
        personId: string | undefined;
        stage: RegisterStage;
        gender: PersonGender;
        documentType: number;
        documentNumber: string;
        phoneNumber: string;
        email: string;
        channel: 'sms' | 'email';
        isSensitiveInfo: boolean;
        stepProps?: StepsProps;
        firstName: string;
        secondName?: string;
        firstSurname: string;
        secondSurname: string;
        execRestart?: boolean;
      }
    | {
        type: 'LOGIN';
        showMaxLimit: boolean;
        documentType: number;
        documentNumber: string;
        password: string;
        phoneNumberObfuscated: string;
        emailObfuscated: string;
        channel: 'sms' | 'email';
        stepProps?: StepsProps;
        isSensitiveInfo: true;
        execRestart?: boolean;
        trackingLogin: string;
      }
    | {
        type: 'FORGOT_PASSWORD';
        showMaxLimit: boolean;
        personId: string | undefined;
        gender: PersonGender;
        documentType: number;
        documentNumber: string;
        email: string;
        channel: 'email';
        isSensitiveInfo: boolean;
        stepProps?: StepsProps;
        firstName: string;
        secondName?: string;
        firstSurname: string;
        secondSurname: string;
        execRestart?: boolean;
      }
    | {
        type: 'PAYMENT';
        documentType: number;
        documentNumber: string;
        phoneNumberObfuscated: string;
        channel: 'sms';
        stepProps?: StepsProps;
        isSensitiveInfo: true;
        execRestart?: boolean;
        trackingTransaction: string;
        payload: any;
      };
  RegisterUserInfo: {
    personId: string;
    documentType: number;
    documentNumber: string;
    gender: PersonGender;
    stepProps?: StepsProps;
    firstName: string;
    secondName?: string;
    firstSurname: string;
    secondSurname: string;
  };
  RegisterUserChannel: {
    personId: string | undefined;
    stage: RegisterStage;
    documentType: number;
    documentNumber: string;
    isSensitiveInfo: boolean;
    stepProps?: StepsProps;
    phoneNumber: string;
    email: string;
    gender: PersonGender;
    firstName: string;
    secondName?: string;
    firstSurname: string;
    secondSurname: string;
  };
  RegisterPasswordInfo: {
    stage: RegisterStage;
    stepProps?: StepsPropsExtra;
    documentType: number;
    documentNumber: string;
    email: string;
    firstName: string;
    secondName?: string;
    firstSurname: string;
    secondSurname: string;
  };
  ScanDocument: {
    flowType: 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';
    gender: PersonGender;
    documentNumber: string;
    documentType: number;
  };
  ScanFace: {
    flowType: 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';
    documentScanned: {
      tokenFaceImage: string;
    };
    sessionId: string;
    operationId: string;
    documentNumber: string;
    documentType: number;
  };
  ConfirmDocument: {
    documentNumber: string;
    documentType: number;
    flowType: 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';
    documentScanned: {
      frontDocumentImage: string;
      backDocumentImage: string;
      faceImage: string;
      matchingSidesScore: number;
      tokenOCR: string;
      tokenFaceImage: string;
      documentCaptured: string;
      documentData: {
        documentNumberMRZ: string;
        documentNumber: string;
        dateOfBirth: string;
        dateOfExpiry: string;
      };
    };
  };
  ConfirmFace: {
    documentNumber: string;
    documentType: number;
    flowType: 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';
    documentScanned: {
      tokenFaceImage: string;
    };
    faceScanned: {
      bestImage: string;
      bestImageCropped: string;
      bestImageTemplateRaw: string;
      templateRaw: string;
    };
    sessionId: string;
    operationId: string;
  };
  Test: undefined;
  Main: {};
  MainTab: any;
  OperationsStack: any;
  MainScreen: {
    showTokenIsActivated?: boolean;
    showPasswordUpdated?: boolean;
  };
  MainOperations: undefined;
  Operations: undefined;
  Transfers: undefined;
  Loading: undefined;
  LoadingFishes: {screenId: string};
  OwnAccounts: {
    from?: string;
  };
  SameBank: {
    from?: string;
    data?: {
      destinationAccount: string;
    };
  };
  OtherBanks:
    | {
        type: 'NONE';
        from?: string;
        data?: {};
      }
    | {
        type: 'TRANSFERENCY_LOCAL';
        destinationAccountName: string;
        destinationAccountNumber: string;
        amount: number;
        formatAmount: string;
        operationUId: number;
        movementId: number;
        itfTax: number;
        concept: string;
        dateTransaction: string;
        hourTransaction: string;
        dateTimeTransaction: string;
        email: string;
        favoriteName?: string;
      }
    | {
        type: 'TRANSFERENCY_OTHERS';
        destinationAccountName: string;
        destinationAccountNumber: string;
        beneficiaryFullName: string;
        amount: number;
        formatAmount: string;
        operationUId: number;
        movementId: number;
        itfTax: number;
        concept: string;
        dateTransaction: string;
        hourTransaction: string;
        dateTimeTransaction: string;
        email: string;
        originCommission: number;
        destinationCommission: number;
        sameHeadLine: boolean;
        transactionType: 'D' | 'I';
        favoriteName?: string;
      };
  RefillBim:
    | {
        type: 'NONE';
        from?: string;
        data?: {};
      }
    | {
        type: 'REFILL_BIM';
        amount: number;
        formatAmount: string;
        operationUId: number;
        phoneNumberBim: string;
        dateTransaction: string;
        hourTransaction: string;
        transactionId: string;
        dateTimeTransaction: string;
        email: string;
      };
  PayServicesRootStack: undefined;
  PayService: undefined;
  PayConstancy: PayConstancyPayloadProps & {
    stage:
      | 'RECHARGE_PHONE'
      | 'PAY_SERVICES_TOTAL'
      | 'PAY_SERVICES_ABIERTO'
      | 'PAY_SERVICES_PARCIAL';
  };
  Debts: {
    businessName: string;
    serviceName: string;
    serviceCode: string;
  };
  PayServiceConfirmation: {
    totalAmount: number;
    companyName: string;
    serviceType: string;
    serviceName: string;
    serviceCode: string;
    serviceAmount: number;
    serviceArrears?: number;
    serviceFee?: number;
    completeName: string;
    accountName: string;
    accountNumber: string;
    operationNumber: string;
    stepsProps: StepsPropsExtra;
    title?: string;
    stage:
      | 'RECHARGE_PHONE'
      | 'PAY_SERVICES_TOTAL'
      | 'PAY_SERVICES_ABIERTO'
      | 'PAY_SERVICES_PARCIAL';
  };
  PayCredits: undefined;
  PhoneRechargeScreen: undefined;
  Cancellation: undefined;
  StartGroupCredit: {
    showTokenIsActivated: boolean;
  };
  GroupCreditContract: undefined;
  LineCreditContract: {
    showTokenIsActivated: boolean;
  };
  KnowMoreLineCredit: {
    amount: number;
  };
  TermsAndConditions: {
    from?: string;
    type?:
      | 'ACCOUNT_OPENING'
      | 'CREDIT_INSURANCE'
      | 'INDIVIDUAL_INSURANCE'
      | 'ECONOMIC_INSURANCE'
      | 'DATAUSE_CONSENT'
      | 'INTEROPERABILITY_CONSENT'
      | 'GROUP_CREDIT_SHORT'
      | 'GROUP_CREDIT_LONG'
      | 'GROUP_INSURANCE'
      | 'LINE_CREDIT_CONTRACT'
      | 'LINE_CREDIT_DISBURSE';
    otherType?: string;
  };
  DestinationOtherBanks: {
    operationUId: number;
    accountCode: string;
    productName: string;
    owner: {
      documentType: string;
      documentNumber: string;
      fullName: string;
    };
  };
  Confirmation: {
    amount: number | null;
    amountValueText: string;
    currency: string;
    originSelectedAccount: string;
    destinationSelectedAccount: string;
    originSelectedName: string;
    destinationSelectedName: string;
  };
  ConfirmationSameBank: {
    destinationAccountName: string;
    destinationAccountNumber: string;
    amount: number;
    formatAmount: string;
    originSelectedName: string;
    operationUId: number;
    itfTax: number;
  };
  ConfirmationOtherBanks: {
    productName: string;
    operationUId: number;
    formatAmount: string;
    itfTax: number;
    ownerFullName: string;
    originCommission: number;
    destinationCommission: number;
    destinationBankName: string;
    transferData: {
      beneficiaryDocumentNumber: string;
      beneficiaryDocumentType: number;
      beneficiaryName: string;
      destinationAccount: string;
      destinationBank: number;
      holderName: string;
      movementAmount: number;
      movementCurrency: Currency;
      originAccount: string;
      concept: string;
      sameHeadLine: boolean;
    };
    owner: {};
  };
  ConfirmationRefillBim: {
    amount: number;
    movementId: number;
    formatAmount: string;
    operationUId: number;
    phoneNumberBim: string;
  };
  SuccessTransfer: {
    movementAmount: string;
    amountText: string;
    currency: string;
    originAccountType: string;
    originSelectedAccount: string;
    destinationAccountName: string;
    destinationSelectedAccount: string;
    movementId: string;
    amountValueText: string;
    originSelectedName: string;
    destinationSelectedName: string;
    dateTransaction: string;
    hourTransaction: string;
  };
  SuccessTransferSameBank: {
    destinationAccountName: string;
    destinationAccountNumber: string;
    amount: number;
    formatAmount: string;
    operationUId: number;
    movementId: number;
    itfTax: number;
    concept: string;
    dateTransaction: string;
    hourTransaction: string;
    favoriteName?: string;
  };
  SuccessTransferOtherBanks: {
    itfTax: number;
    concept: string;
    movementId: number;
    operationUId: number;
    formatAmount: string;
    movementAmount: number;
    ownerFullName: string;
    originCommission: number;
    destinationCommission: number;
    destinationAccount: string;
    destinationBankName: string;
    destinationAccountName: string;
    dateTransaction: string;
    hourTransaction: string;
    favoriteName?: string;
    sameHeadLine?: boolean;
  };
  SuccessRefillBim: {
    amount: number;
    movementId: number;
    formatAmount: string;
    operationUId: number;
    phoneNumberBim: string;
    date: string;
    hour: string;
  };
  MySavings: undefined;
  MyCredits: undefined;
  MyCreditGroups: undefined;
  SavingDetail: {
    from: string;
    productType: string | undefined;
    operationId: number | undefined;
    title: string;
    accountName: string | undefined;
    accountNumber: string | undefined;
    currency: string | undefined;
    sAvailableBalance: string | undefined;
    cci: string | undefined;
  };
  EntrepreneurSavingMovements: {
    operationId: number;
  };
  EntrepreneurSavingDetail: {
    from: string;
    productType: string | undefined;
    operationId: number | undefined;
    title: string;
    accountName: string | undefined;
    accountNumber: string | undefined;
    currency: string | undefined;
    sAvailableBalance: string | undefined;
    cci: string | undefined;
    balance: number | undefined;
  };
  CreditsDetail: {
    status: string;
    accountNumber: string;
    currency: string;
    disbursedCapital: number;
    capitalCanceled: number;
    capitalCanceledAmount: number;
    disbursedCapitalAmount: number;
    advancePercentage: number;
    isPunished: boolean | undefined;
    type: string;
    productName: string;
  };
  GroupCreditDetail: {
    accountNumber: string;
    currency: string;
    productName: string;
    capitalCanceledAmount: string;
    disbursedCapitalAmount: string;
    advancePercentage: number;
  };
  CreditsDetail2: {
    status: string;
    accountNumber: string;
    currency: string;
    disbursedCapital: number;
    capitalCanceled: number;
    capitalCanceledAmount: number;
    disbursedCapitalAmount: number;
    advancePercentage: number;
    isPunished: boolean | undefined;
    type: string;
    productName: string;
  };
  GroupCreditDetail2: {
    accountNumber: string;
    currency: string;
    productName: string;
    capitalCanceledAmount: string;
    disbursedCapitalAmount: string;
    advancePercentage: number;
  };
  ChooseCredit: undefined;
  CreditPayments: {
    status: string;
    accountNumber: string;
    currency: string;
    disbursedCapital: string;
    capitalCanceled: string;
    capitalCanceledAmount: number;
    disbursedCapitalAmount: number;
    advancePercentage: number;
    type: string;
    productName: string;
  };
  OpenEntrepreneurAccount: {showTokenIsActivated: boolean; isCreated: boolean};
  OpenSaveAccount: {showTokenIsActivated: boolean; type: string};
  StartDisbursement: {
    showTokenIsActivated: boolean;
  };
  Disbursement: {
    originAccount: Saving | null;
    hasSavings: boolean;
    hasActiveProducts: boolean;
    hasInsurance: boolean;
    disburseCredit: IDisbursCredit;
  };
  LineSimulation: undefined;
  LineDisbursement: {
    hasSavings: boolean;
    sTea: string;
    sTcea: string;
    sPaymentDay: string;
    sTotalAmount: string;
    sMonthAmount: string;
    sFirstQuoteDate: string;
    sTerms: string;
    sTotalAmountDisbursement: string;
    sAmount: string;
    sCurrentDebtCancellation: string;
  };
  PayWithPhone: {
    showTokenIsActivated: boolean;
    contactsAccessPermission: boolean;
    disablePhoneAlert: {
      isOpen: boolean;
      title: string;
      content: string[];
      button: string;
      button2?: string;
      errorCode?: string;
    };
    from?: string;
  };
  PayWithPhoneForm: {
    data: IGetContactData;
    destinationData: {
      destinationBankCode: string;
      destinationName: string;
      destinationCellPhone: string;
    };
    executeSuccess?: {
      isOpen: true;
      payloadModal: any;
      contactSelected: any;
      payloadRecentContacts: any;
    };
  };
  AffiliatePhone: {
    showTokenIsActivated: boolean;
    operationType: 'affiliation' | 'updateAffiliation';
    from: string;
  };
  SetInteroperability: undefined;
  WebViewScreen: {
    url: string;
  };
  GroupCollectionConstancy: {
    quotaTitle: string;
    groupName: string;
    creditNumber: string;
  };
};

export type ScreenKeyName = keyof RootStackParamList;

export type InfoWithoutActiveProductScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoWithoutActiveProduct'
>;

export type InfoRegisterInLoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoRegisterInLogin'
>;

export type LoadingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LoadingScreen'
>;

export type LoadingFishesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LoadingFishes'
>;

export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;

export type LoginNormalScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LoginNormal'
>;

export type LoginSecureScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LoginSecure'
>;

export type InfoUserExistsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoUserExists'
>;

export type InfoAccessBlockedScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoAccessBlocked'
>;

export type InfoWithoutMembershipScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoWithoutMembership'
>;

export type InfoRegisterSuccessScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoRegisterSuccess'
>;

export type InfoDataUsedScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoDataUsed'
>;

export type InfoEmailSpamScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoSpam'
>;

export type SplashScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Splash'
>;

export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RegisterUserDocument'
>;

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

export type MainScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MainScreen'
>;

export type MyCreditsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MyCredits'
>;

export type MyCreditGroupsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MyCreditGroups'
>;

export type SavingDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'SavingDetail'
>;

export type EntrepreneurSavingMovementsProps = NativeStackScreenProps<
  RootStackParamList,
  'EntrepreneurSavingMovements'
>;

export type EntrepreneurSavingDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'EntrepreneurSavingDetail'
>;

export type MySavingsProps = NativeStackScreenProps<
  RootStackParamList,
  'MySavings'
>;

export type CreditsDetailProps =
  | NativeStackScreenProps<RootStackParamList, 'CreditsDetail'>
  | NativeStackScreenProps<RootStackParamList, 'CreditsDetail2'>;

export type GroupCreditDetailProps =
  | NativeStackScreenProps<RootStackParamList, 'GroupCreditDetail'>
  | NativeStackScreenProps<RootStackParamList, 'GroupCreditDetail2'>;

export type StartDisbursementProps = NativeStackScreenProps<
  RootStackParamList,
  'StartDisbursement'
>;

export type DisbursementProps = NativeStackScreenProps<
  RootStackParamList,
  'Disbursement'
>;

export type LineDisbursementProps = NativeStackScreenProps<
  RootStackParamList,
  'LineDisbursement'
>;

export type LineSimulationProps = NativeStackScreenProps<
  RootStackParamList,
  'LineSimulation'
>;

export type CodeActivationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RegisterOTP'
>;

export type RegisterUserChannelScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RegisterUserChannel'
>;

export type RegisterUserInfoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RegisterUserInfo'
>;

export type InfoAttemptRestrictionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoAttemptRestriction'
>;

export type InfoDNINotRecognizedMaxAttemptScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoDNINotRecognizedMaxAttempt'
>;

export type InfoScanErrorScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoScanError'
>;

export type InfoFaceBlockedScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoFaceBlocked'
>;

export type InfoMaxAttempsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoMaxAttemps'
>;

export type InfoUpdateAppScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoUpdateAppScreen'
>;

export type InfoRegisterTokenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoRegisterToken'
>;

export type RegisterPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RegisterPassword'
>;

export type ModalInactivityScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ModalInactivity'
>;

export type RecoverPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RecoverPassword'
>;

export type RegisterPasswordInfoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RegisterPasswordInfo'
>;

export type RegisterIdentityInfoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RegisterIdentityInfo'
>;

export type InfoScanDNIScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoScanDNI'
>;

export type ScanDocumentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ScanDocument'
>;

export type ScanFaceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ScanFace'
>;

export type ConfirmDocumentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ConfirmDocument'
>;

export type ConfirmFaceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ConfirmFace'
>;

export type TransfersScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Transfers'
>;

export type SameBankScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SameBank'
>;

export type OtherBanksScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OtherBanks'
>;

export type TermsAndConditionsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TermsAndConditions'
>;

export type DestinationOtherBanksScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DestinationOtherBanks'
>;

export type ConfirmationOwnAccountsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Confirmation'
>;

export type ConfirmationSameBankScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ConfirmationSameBank'
>;

export type ConfirmationOtherBanksScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ConfirmationOtherBanks'
>;

export type SuccessTransferScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SuccessTransfer'
>;

export type SuccessSameBankScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SuccessTransferSameBank'
>;

export type SuccessOtherBanksScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SuccessTransferOtherBanks'
>;

export type OwnAccountsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OwnAccounts'
>;

export type RefillScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RefillBim'
>;

export type PayCreditScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PayCredits'
>;

export type PhoneRechargeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PhoneRechargeScreen'
>;

export type PayServicesRootStackScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PayServicesRootStack'
>;

export type PayConstancyScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PayConstancy'
>;

export type PayServiceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PayService'
>;

export type DebtsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Debts'
>;

export type PayServiceConfirmationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PayServiceConfirmation'
>;

export type CancellationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Cancellation'
>;

export type StartGroupCreditScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'StartGroupCredit'
>;

export type GroupCreditContractScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'GroupCreditContract'
>;

export type LineCreditContractScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LineCreditContract'
>;

export type KnowMoreLineCreditScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'KnowMoreLineCredit'
>;

export type ConfirmationRefillScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ConfirmationRefillBim'
>;

export type SuccessRefillBimProps = NativeStackScreenProps<
  RootStackParamList,
  'SuccessRefillBim'
>;

export type MoreMenuScreenProps = NativeStackScreenProps<
  MoreStackParamList,
  'Menu'
>;

export type UpdatePasswordScreenProps = NativeStackScreenProps<
  MoreStackParamList,
  'UpdatePassword'
>;

export type MyFavoritesScreenProps = NativeStackScreenProps<
  MoreStackParamList,
  'MyFavorites'
>;

export type MyFavoritesDetailScreenProps = NativeStackScreenProps<
  MoreStackParamList,
  'MyFavoritesDetail'
>;

export type FavoriteOperationsScreenProps = NativeStackScreenProps<
  MoreStackParamList,
  'FavoriteOperations'
>;

export type InfoActivateTokenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InfoActivateToken'
>;

export type ChooseCreditScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ChooseCredit'
>;

export type CreditPaymentsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CreditPayments'
>;

export type AffiliatePhoneSreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AffiliatePhone'
>;
export type OpenSavingsAccountScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OpenSavingsAccount'
>;
export type OpenSaveAccountSreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OpenSaveAccount'
>;
export type OpenEntrepreneurAccountSreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OpenEntrepreneurAccount'
>;
export type PayWithPhoneSreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PayWithPhone'
>;
export type PayWithPhoneFormSreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PayWithPhoneForm'
>;
export type SetInteroperabilitySreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SetInteroperability'
>;

export type WebViewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WebViewScreen'
>;

export type VisitRegistrationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'VisitRegistration'
>;

export type GroupCollectionConstancyScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'GroupCollectionConstancy'
>;
