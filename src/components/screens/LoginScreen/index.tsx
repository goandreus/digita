import {useLastUser} from '@hooks/common';
import {LoginScreenProps} from '@navigations/types';
import {StackActions} from '@react-navigation/native';
import React, {useLayoutEffect} from 'react';

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const {lastUser} = useLastUser();
  useLayoutEffect(() => {
    if (
      lastUser === undefined ||
      lastUser.firstName === undefined ||
      lastUser.document === undefined
    )
      return navigation.dispatch(StackActions.replace('LoginNormal'));
    return navigation.dispatch(
      StackActions.replace('LoginSecure', {
        firstName: lastUser.firstName,
        documentType: lastUser.document.type,
        documentNumber: lastUser.document.number,
      }),
    );
  }, [lastUser]);

  return null;
};

export default LoginScreen;
