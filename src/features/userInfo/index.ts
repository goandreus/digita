import {CreditGroupPending, IListLineCredit} from '@interface/Credit';
import {createSlice} from '@reduxjs/toolkit';
import {CreditPendingData} from '@services/Disbursements';
import {IInteroperabilityInfo} from '@services/Interoperability';

export type Currency = 'S/' | '$';
export interface Person {
  applicantTypeId: number;
  documentNumber: string;
  documentTypeId: number;
  existCompartamos: boolean;
  gender: string;
  lastName: string;
  motherLastName: string;
  names: string;
  personUId: number;
}
export interface User {
  hasActiveProduct: boolean;
  isMember: boolean;
  person: Person;
}

export interface Saving {
  accountType?: 'I' | 'C' | 'IND';
  accountCci?: string;
  accountCode?: string;
  balance: number;
  canReceive?: boolean;
  canTransact?: boolean;
  canPay?: boolean;
  currency?: Currency;
  idOperationBT?: string;
  idOperationFmt?: string;
  office?: string;
  operationUId?: number;
  productName?: string;
  productType?: string;
  productUId?: number;
  sBalance?: string;
  status?: string;
  subAccount?: string;
  contable?: any;
  canDisbursement?: boolean;
}

export interface UserSavings {
  savings: {
    savings: Saving[];
  };
  compensations: {
    savings: Saving[];
  };
  investments: {
    savings: Saving[];
  };
  sortAccounts: {
    savings: Saving[];
  };
}
export interface Credit {
  accountCode: string;
  advancePercentage: number;
  amountFeesPaid: number;
  amountInstallments: number;
  capitalAmount: number;
  capitalCanceled: number;
  currency: Currency;
  disbursedCapital: number;
  office: string;
  operationUId: number;
  productName: string;
  sAmountFeesPaid: string;
  sAmountInstallments: string;
  sCapitalAmount: string;
  sCapitalCanceled: string;
  sDisbursedCapital: string;
  isPunished?: boolean;
  status: string;
}
export interface UserCredits {
  individualCredits: Array<Credit>;
  groupCredits: Array<Credit>;
}

export interface EntrepreneurAccount {
  isCreated: boolean,
}

interface InitialState {
  user: User | null;
  userSavings: UserSavings | null;
  userCredits: UserCredits | null;
  userCreditToDisburt: CreditPendingData | null;
  userInteroperabilityInfo: IInteroperabilityInfo | null;
  userEntrepreneurAccount: EntrepreneurAccount | null;
  userGroupCreditToDisburt: CreditGroupPending | null;
  userLineCredit: IListLineCredit | null;
}

const initialState: InitialState = {
  user: null,
  userSavings: null,
  userCredits: null,
  userCreditToDisburt: null,
  userInteroperabilityInfo: null,
  userEntrepreneurAccount: null,
  userGroupCreditToDisburt: null,
  userLineCredit: null,
};

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserSavings: (state, action) => {
      state.userSavings = action.payload;
    },
    setUserCredits: (state, action) => {
      state.userCredits = action.payload;
    },
    setUserCreditToDisburt: (state, action) => {
      state.userCreditToDisburt = action.payload;
    },
    setUserEntrepreneurAccountUser: (state, action) => {
      state.userEntrepreneurAccount = action.payload;
    },
    setUserInteroperabilityInfo: (state, action) => {
      state.userInteroperabilityInfo = action.payload;
    },
    setUserGroupCreditToDisburt: (state, action) => {
      state.userGroupCreditToDisburt = action.payload;
    },
    setUserLineCredit: (state, action) => {
      state.userLineCredit = action.payload;
    },
    purgeUserState: state => (state = initialState),
  },
});

export const {
  purgeUserState,
  setUser,
  setUserCredits,
  setUserSavings,
  setUserCreditToDisburt,
  setUserInteroperabilityInfo,
  setUserEntrepreneurAccountUser,
  setUserGroupCreditToDisburt,
  setUserLineCredit,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
