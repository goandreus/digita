import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {setTerms as set} from '@features/terms';

interface ITermsHook {
  terms: boolean;
  setTerms: (payload: boolean) => void;
}

export const useTerms = (): ITermsHook => {
  const termsState = useAppSelector(state => state.terms);
  const dispatch = useAppDispatch();

  const setTerms = (payload: boolean) => dispatch(set(payload));

  return {
    ...termsState,
    setTerms,
  };
};
