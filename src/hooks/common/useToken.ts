import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {setBackButton as setBack} from '@features/token';

export const useToken = () => {
  const token = useAppSelector(state => state.token);
  const dispatch = useAppDispatch();

  const setBackButton = (payload: boolean) => dispatch(setBack(payload));

  return {
    token,
    setBackButton,
  };
};
