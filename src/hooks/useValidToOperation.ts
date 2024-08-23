import {OperationStackContext} from '@contexts/OperationStackContext';
import {useNavigation} from '@react-navigation/native';
import {canTransactRefillBim} from '@utils/canTransactRefillBim';
import {canTransactWithOwnAcc} from '@utils/canTransactWithOwnAcc';
import {canTransactInteroperability} from '@utils/canTransactInteroperability';
import {useContext, useState} from 'react';
import {
  useToken,
  useLoading,
  useUserInfo,
  useLastUser,
  useModals,
} from './common';

export const useValidToTransfer = () => {
  const navigation = useNavigation();
  const {lastUser} = useLastUser();
  const {userSavings} = useUserInfo();
  const {setTokenModal, setInformativeModal} = useModals();
  const operationStackContext = useContext(OperationStackContext);

  const token = lastUser.secret;

  const allSavings = [
    ...(userSavings?.savings.savings || []),
    ...(userSavings?.compensations.savings || []),
    ...(userSavings?.investments.savings || []),
  ];

  let originSavings = allSavings.filter(e => e.canTransact);
  const savingsInSoles = originSavings?.filter(e => e.currency === 'S/').length;
  const savingsInDollars = originSavings?.filter(
    e => e.currency === '$',
  ).length;

  if (savingsInSoles === 1 && originSavings.length > 1) {
    originSavings = originSavings.filter(e => e.currency !== 'S/');
  }
  if (savingsInDollars === 1 && originSavings.length > 1) {
    originSavings = originSavings.filter(e => e.currency !== '$');
  }

  const allOriginBalances = originSavings
    ?.map(e => e.balance)
    .every(e => e === 0);

  const showInfoModal = () => {
    setInformativeModal({
      show: true,
      data: {
        title: '¡Recuerda!',
        content:
          'Para realizar una transferencia, tu cuenta de origen debe estar habilitada para realizar transferencias y debes contar con saldo suficiente.\nRevisa las condiciones de tus cuentas en nuestra página web o consulta nuestra central telefónica (01) 313 5000.',
      },
    });
  };

  const handleOwnAccounts = () => {
    const data = canTransactWithOwnAcc(allSavings);
    if (!data?.canTransact) {
      return showInfoModal();
    }
    operationStackContext.disableUseFocusEffect = true;
    navigation.navigate('OperationsStack', {
      screen: 'OwnAccounts',
      params: {
        from: 'Transfers',
      },
    });
  };

  const handleOthersAccounts = (data?: any) => {
    if (originSavings.length === 0 || allOriginBalances) {
      if (
        lastUser.hasActiveToken === false ||
        lastUser.tokenIsInCurrentDevice === false ||
        !token
      ) {
        setTokenModal({show: true});
      } else {
        showInfoModal();
      }
    } else if (
      lastUser.hasActiveToken === false ||
      lastUser.tokenIsInCurrentDevice === false ||
      !token
    ) {
      setTokenModal({show: false});
      navigation.navigate('InfoActivateToken', {
        option: 'transfers',
      });
    } else {
      operationStackContext.disableUseFocusEffect = true;
      navigation.navigate('OperationsStack', {
        screen: 'OtherBanks',
        params: {
          from: 'Transfers',
          type: 'NONE',
          ...(data.destinationCCI ? {data} : {}),
        },
      });
    }
  };

  return {
    handleOwnAccounts,
    handleOthersAccounts,
  };
};

export const useValidToRefillBim = () => {
  const navigation = useNavigation();
  const {lastUser} = useLastUser();
  const {userSavings} = useUserInfo();
  const {setTokenModal, setInformativeModal} = useModals();
  const {setTargetScreen} = useLoading();
  const operationStackContext = useContext(OperationStackContext);

  const token = lastUser.secret;

  const showInfoModal = () => {
    setInformativeModal({
      show: true,
      data: {
        title: '¡Recuerda!',
        content:
          'Para realizar una transferencia, tu cuenta de origen debe estar habilitada para realizar transferencias y debes contar con saldo suficiente.\nRevisa las condiciones de tus cuentas en nuestra página web o consulta nuestra central telefónica (01) 313 5000.',
      },
    });
  };

  const handleRefillBim = () => {
    const accs = canTransactRefillBim([
      ...(userSavings?.savings.savings ?? []),
    ]);

    if (accs?.canTransactInSoles.length === 0) {
      if (
        lastUser.hasActiveToken === false ||
        lastUser.tokenIsInCurrentDevice === false ||
        !token
      ) {
        setTokenModal({show: true});
      } else {
        showInfoModal();
      }
    } else if (
      lastUser.hasActiveToken === false ||
      lastUser.tokenIsInCurrentDevice === false ||
      !token
    ) {
      setTokenModal({show: false});
      navigation.navigate('InfoActivateToken');
    } else {
      setTargetScreen({screen: 'RefillBim', from: 'Operations'});
      operationStackContext.disableUseFocusEffect = true;
      navigation.navigate('OperationsStack', {
        screen: 'RefillBim',
        params: {
          from: 'Operations',
        },
      });
    }
  };

  return {
    handleRefillBim,
  };
};

export const useValidToOperation = () => {
  const operationStackContext = useContext(OperationStackContext);
  const {lastUser} = useLastUser();
  const {setBackButton} = useToken();
  const {userSavings} = useUserInfo();

  const {setTargetScreen, setHideTabBar} = useLoading();

  const navigation = useNavigation();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [showModalToken, setShowModalToken] = useState<boolean>(false);

  const token = lastUser.secret;

  const allSavings = [
    ...(userSavings?.savings.savings || []),
    ...(userSavings?.compensations.savings || []),
    ...(userSavings?.investments.savings || []),
  ];
  let originSavings = allSavings.filter(e => e.canTransact);
  /* let destinationSavings = allSavings.filter(e => e.canReceive); */
  const savingsInSoles = originSavings?.filter(e => e.currency === 'S/').length;
  const savingsInDollars = originSavings?.filter(
    e => e.currency === '$',
  ).length;

  if (savingsInSoles === 1 && originSavings.length > 1) {
    originSavings = originSavings.filter(e => e.currency !== 'S/');
  }
  if (savingsInDollars === 1 && originSavings.length > 1) {
    originSavings = originSavings.filter(e => e.currency !== '$');
  }

  /* const set = new Set(
    [...originSavings, ...destinationSavings].map(e => e.accountCode),
  );
  const newArr = [...set]; */

  const allOriginBalances = originSavings
    ?.map(e => e.balance)
    .every(e => e === 0);

  const closeModal = () => setShowModal(false);
  const closeRefillModal = () => setShowRefillModal(false);
  const closeModalToken = () => setShowModalToken(false);

  const onActivateToken = async () => {
    setShowModalToken(false);
    setBackButton(false);
    await new Promise(res => setTimeout(res, 500));
    navigation.navigate('InfoActivateToken');
  };

  const onPressOwnAccounts = () => {
    const data = canTransactWithOwnAcc(allSavings);
    if (!data?.canTransact) {
      return setShowModal(true);
    }
    operationStackContext.disableUseFocusEffect = true;
    navigation.navigate('OperationsStack', {
      screen: 'OwnAccounts',
      params: {
        from: 'Transfers',
      },
    });
  };

  const handleSameBank = (data?: any) => {
    if (originSavings.length === 0 || allOriginBalances) {
      if (
        lastUser.hasActiveToken === false ||
        lastUser.tokenIsInCurrentDevice === false ||
        !token
      ) {
        setShowModalToken(true);
      } else {
        setShowModal(true);
      }
    } else if (
      lastUser.hasActiveToken === false ||
      lastUser.tokenIsInCurrentDevice === false ||
      !token
    ) {
      setShowModalToken(false);
      setBackButton(false);
      navigation.navigate('InfoActivateToken');
    } else {
      navigation.navigate('MainOperations', {
        screen: 'SameBank',
        params: {
          from: 'Transfers',
          ...(data.destinationAccount ? {data} : {}),
        },
        initial: false,
      });
    }
  };

  const handleOthersBank = (data?: any) => {
    if (originSavings.length === 0 || allOriginBalances) {
      if (
        lastUser.hasActiveToken === false ||
        lastUser.tokenIsInCurrentDevice === false ||
        !token
      ) {
        setShowModalToken(true);
      } else {
        setShowModal(true);
      }
    } else if (
      lastUser.hasActiveToken === false ||
      lastUser.tokenIsInCurrentDevice === false ||
      !token
    ) {
      setShowModalToken(false);
      setBackButton(false);
      navigation.navigate('InfoActivateToken', {
        option: 'transfers',
      });
    } else {
      operationStackContext.disableUseFocusEffect = true;
      navigation.navigate('OperationsStack', {
        screen: 'OtherBanks',
        params: {
          from: 'Transfers',
          type: 'NONE',
          ...(data.destinationCCI ? {data} : {}),
        },
      });
    }
  };

  const handleRefillBim = () => {
    const accs = canTransactRefillBim([
      ...(userSavings?.savings.savings ?? []),
    ]);

    if (accs?.canTransactInSoles.length === 0) {
      if (
        lastUser.hasActiveToken === false ||
        lastUser.tokenIsInCurrentDevice === false ||
        !token
      ) {
        setShowModalToken(true);
      } else {
        setShowRefillModal(true);
      }
    } else if (
      lastUser.hasActiveToken === false ||
      lastUser.tokenIsInCurrentDevice === false ||
      !token
    ) {
      setShowModalToken(false);
      setBackButton(false);
      navigation.navigate('InfoActivateToken');
    } else {
      setTargetScreen({screen: 'RefillBim', from: 'Operations'});
      operationStackContext.disableUseFocusEffect = true;
      navigation.navigate('OperationsStack', {
        screen: 'RefillBim',
        params: {
          from: 'Operations',
        },
      });
    }
  };

  return {
    showModal,
    showRefillModal,
    showModalToken,
    closeModal,
    closeRefillModal,
    closeModalToken,
    onActivateToken,
    onPressOwnAccounts,
    handleSameBank,
    handleOthersBank,
    handleRefillBim,
  };
};
