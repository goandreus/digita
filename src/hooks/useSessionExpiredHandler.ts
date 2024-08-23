import {setSessionModal} from '@features/modal';
import {useCreditAdvice, useLoading, useTerms, useUserInfo} from './common';
import {SessionManager} from '@managers/SessionManager';
import {useNavigation} from '@react-navigation/native';
import {TokenRegister} from '@utils/TokenRegister';
import {useEffect} from 'react';
import {useAppDispatch} from './useAppDispatch';
import {update} from '@features/activity';

export const useSessionExpiredHandler = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {setTerms} = useTerms();
  const {setShowExpiredTokenSession, setShowSessionStatus} = useLoading();
  const {purgeUserState} = useUserInfo();
  const {purgeCreditAdviceState} = useCreditAdvice();

  const handleCloseSession = (props?: {navigateToHome: boolean}) => {
    purgeUserState();
    setTerms(false);
    setShowSessionStatus(false);
    setShowExpiredTokenSession(false);
    dispatch(setSessionModal({show: false}));
    purgeCreditAdviceState();
    TokenRegister.updateToken('LOGIN', null);
    dispatch(update({isTokenExpired: false}));
    if (props === undefined || props.navigateToHome === true) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
  };

  useEffect(() => {
    SessionManager.getInstance().onError(() => {
      setShowExpiredTokenSession(true);
      dispatch(update({isTokenExpired: true}));
    });
  }, [setShowExpiredTokenSession]);

  return {
    handleCloseSession,
  };
};
