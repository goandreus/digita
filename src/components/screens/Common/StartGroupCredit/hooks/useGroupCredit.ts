import {useCallback, useState} from 'react';
import {useLastUser} from '@hooks/common';
import {StartGroupCreditScreenProps} from '@navigations/types';
import {useFocusEffect} from '@react-navigation/native';
import {BackHandler} from 'react-native';

interface IHookStartGroupCredit {
  loading: boolean;
  goHome: () => void;
  goConfirmation: () => void;
}

export const useStartGroupCredit = ({
  navigation,
  route,
}: StartGroupCreditScreenProps): IHookStartGroupCredit => {
  const {lastUser} = useLastUser();
  const [loading, setLoading] = useState(false);

  const handleGroupCredit = async () => {
    setLoading(false);
    navigation.navigate('OperationsStack', {
      screen: 'GroupCreditContract',
    });
  };

  const goHome = useCallback(() => {
    navigation.navigate('MainTab', {
      screen: 'Main',
      params: {
        screen: 'MainScreen',
      },
    });
  }, [navigation]);

  const goConfirmation = async () => {
    setLoading(true);
    const token = lastUser.secret;

    if (
      lastUser.hasActiveToken === false ||
      lastUser.tokenIsInCurrentDevice === false ||
      !token
    ) {
      setLoading(false);
      return navigation.navigate('InfoActivateToken', {
        redirectTo: 'GROUPCREDIT',
      });
    }

    // Group Credit
    await handleGroupCredit();
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          goHome();
          return true;
        },
      );

      return () => backHandler.remove();
    }, [goHome]),
  );

  return {
    loading,
    goHome,
    goConfirmation,
  };
};
