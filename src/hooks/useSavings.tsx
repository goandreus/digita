import {Saving} from '@features/userInfo';
import {useUserInfo} from './common';

const useSavings = () => {
  const {userSavings} = useUserInfo();

  const hasAccountForTransact = () => {
    let sav: Saving[] = [];

    if (userSavings && userSavings.savings.savings) {
      sav = userSavings.savings.savings.filter((e: Saving) => e.canPay);
    }

    return sav.length > 0;
  };

  const hasAccountForServices = () => {
    let _hasAccountForServices = false;
    if (userSavings && userSavings.savings.savings) {
      const savings = userSavings.savings.savings;
      _hasAccountForServices = savings.some(
        s =>
          s.status.toLowerCase() === 'normal' &&
          !s.subAccount.includes('CTS') &&
          !s.subAccount.includes('DPF') &&
          s.currency === 'S/' &&
          s.accountType !== 'C',
      );
    }
    return _hasAccountForServices;
  };

  return {hasAccountForTransact, hasAccountForServices, userSavings};
};

export default useSavings;
