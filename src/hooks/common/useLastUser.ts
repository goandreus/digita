import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {update, clean} from '@features/lastUser';
import {IUser} from '@interface/User';

interface ILastUserHook {
  lastUser: IUser;
  updateLastUser: (payload: IUser) => void;
  cleanLastUser: () => void;
}

export const useLastUser = (): ILastUserHook => {
  const lastUser = useAppSelector(state => state.lastUser);
  const dispatch = useAppDispatch();

  const updateLastUser = (payload: IUser) => dispatch(update(payload));
  const cleanLastUser = () => dispatch(clean());

  return {
    lastUser,
    updateLastUser,
    cleanLastUser,
  };
};
