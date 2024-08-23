import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {
  setInformativeModal as setInformative,
  setTokenModal as setToken,
} from '@features/modal';
import {ITokenModal, IinformativeModal} from '@interface/Modal';

export const useModals = () => {
  const modals = useAppSelector(state => state.modal);
  const dispatch = useAppDispatch();

  const setTokenModal = (payload: ITokenModal) => dispatch(setToken(payload));
  const setInformativeModal = (payload: Partial<IinformativeModal>) =>
    dispatch(setInformative({...modals.informativeModal, ...payload}));

  return {
    ...modals,
    setTokenModal,
    setInformativeModal,
  };
};
