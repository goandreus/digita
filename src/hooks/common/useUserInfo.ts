import {useCallback} from 'react';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {
  setUser as set,
  setUserSavings as setSavings,
  setUserCredits as setCredists,
  setUserCreditToDisburt as setCreditToDisburt,
  setUserInteroperabilityInfo as setInteroperabilityInfo,
  setUserGroupCreditToDisburt as setGroupCreditToDisburt,
  setUserEntrepreneurAccountUser as setEntrepreneurAccount,
  setUserLineCredit as setLineCredit,
  purgeUserState as purge,
  User,
  UserSavings,
  UserCredits,
  Person,
  EntrepreneurAccount,
} from '@features/userInfo';
import {CreditPendingData} from '@services/Disbursements';
import {CreditGroupPending, IListLineCredit} from '@interface/Credit';
import {IInteroperabilityInfo} from '@services/Interoperability';

export interface IUserPartial {
  hasActiveProduct?: boolean;
  isMember?: boolean;
  person?: Partial<Person>;
}

interface IUserInfoHook {
  user: User | null;
  userSavings: UserSavings | null;
  userCredits: UserCredits | null;
  userCreditToDisburt: CreditPendingData | null;
  userInteroperabilityInfo: IInteroperabilityInfo | null;
  userGroupCreditToDisburt: CreditGroupPending | null;
  userEntrepreneurAccount: EntrepreneurAccount | null;
  userLineCredit: IListLineCredit | null;
  setUser: (payload: IUserPartial) => void;
  setUserSavings: (payload: UserSavings) => void;
  setUserCredits: (payload: UserCredits) => void;
  setUserCreditToDisburt: (payload: CreditPendingData | null) => void;
  setUserInteroperabilityInfo: (payload: IInteroperabilityInfo | null) => void;
  setUserGroupCreditToDisburt: (payload: CreditGroupPending | null) => void;
  setUserEntrepreneurAccount: (payload: EntrepreneurAccount | null) => void;
  setUserLineCredit: (payload: IListLineCredit | null) => void;
  purgeUserState: () => void;
}

interface IUserInfoHookPre {
  user: User | null;
  userCreditToDisburt: CreditPendingData | null;
  setUser: (payload: IUserPartial) => void;
  setUserInteroperabilityInfo: (payload: IInteroperabilityInfo | null) => void;
  setUserCreditToDisburt: (payload: CreditPendingData) => void;
  purgeUserState: () => void;
}

export const useUserInfo = (): IUserInfoHook => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  const setUser = (payload: IUserPartial) => dispatch(set(payload));
  const setUserSavings = useCallback(
    (payload: UserSavings) => dispatch(setSavings(payload)),
    [dispatch],
  );
  const setUserCredits = (payload: UserCredits) =>
    dispatch(setCredists(payload));
  const setUserEntrepreneurAccount = (payload: EntrepreneurAccount | null) => dispatch(setEntrepreneurAccount(payload));

  const setUserCreditToDisburt = useCallback(
    (payload: CreditPendingData | null) =>
      dispatch(setCreditToDisburt(payload)),
    [dispatch],
  );

  const setUserLineCredit = useCallback(
    (payload: IListLineCredit | null) => dispatch(setLineCredit(payload)),
    [dispatch],
  );

  const setUserInteroperabilityInfo = (payload: IInteroperabilityInfo | null) =>
    dispatch(setInteroperabilityInfo(payload));
  const purgeUserState = () => dispatch(purge());

  const setUserGroupCreditToDisburt = useCallback(
    (payload: CreditGroupPending | null) =>
      dispatch(setGroupCreditToDisburt(payload)),
    [dispatch],
  );

  return {
    ...user,
    setUser,
    setUserSavings,
    setUserCredits,
    setUserCreditToDisburt,
    setUserInteroperabilityInfo,
    setUserGroupCreditToDisburt,
    setUserEntrepreneurAccount,
    setUserLineCredit,
    purgeUserState,
  };
};

export const useUserInfoPre = (): IUserInfoHookPre => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  const setUser = (payload: IUserPartial) => dispatch(set(payload));
  
  const setUserCreditToDisburt = (payload: CreditPendingData) =>
    dispatch(setCreditToDisburt(payload));
  const setUserInteroperabilityInfo = (payload: IInteroperabilityInfo | null) =>
    dispatch(setInteroperabilityInfo(payload));
  const purgeUserState = () => dispatch(purge());

  return {
    ...user,
    setUser,
    setUserCreditToDisburt,
    setUserInteroperabilityInfo,
    purgeUserState,
  };
};
