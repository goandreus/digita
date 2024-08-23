import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {
  setShowCreditAdvice,
  setAmountCreditAdvice,
  setShowDisbursement,
  setBanners,
  purgeState,
} from '@features/creditAdvice';
import {ICreditAdvice, CreditAdviceType} from '@interface/CreditAdvice';
import {useCallback} from 'react';

interface ICreditAdviceHook {
  creditAdvice: ICreditAdvice;
  showCreditAdvice: (payload: boolean) => void;
  updateAmountCreditAdvice: (payload: string) => void;
  showDisbursement: (payload: boolean) => void;
  updateBanners: (payload: {[key in CreditAdviceType]?: boolean}) => void;
  purgeCreditAdviceState: () => void;
}

export const useCreditAdvice = (): ICreditAdviceHook => {
  const creditAdvice = useAppSelector(state => state.creditAdvice);
  const dispatch = useAppDispatch();

  const showCreditAdvice = (payload: boolean) =>
    dispatch(setShowCreditAdvice(payload));
  const updateAmountCreditAdvice = useCallback(
    (payload: string) => dispatch(setAmountCreditAdvice(payload)),
    [dispatch],
  );
  const showDisbursement = useCallback(
    (payload: boolean) => dispatch(setShowDisbursement(payload)),
    [dispatch],
  );

  const updateBanners = useCallback(
    (payload: {[key in CreditAdviceType]?: boolean}) =>
      dispatch(setBanners(payload)),
    [dispatch],
  );

  const purgeCreditAdviceState = () => dispatch(purgeState());

  return {
    creditAdvice,
    showCreditAdvice,
    showDisbursement,
    updateAmountCreditAdvice,
    updateBanners,
    purgeCreditAdviceState,
  };
};
