import {CancellationScreenProps} from '@navigations/types';
import {useUserInfo} from '@hooks/common';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useMemo, useRef, useState} from 'react';
import {CancelAccount} from '@services/Cancellation';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import {CancellationData} from '@interface/Cancellation';

type ConfirmToContinue =
  | {
      isOpen: false;
    }
  | {
      isOpen: true;
      onAccept: () => void;
    };

export const useCancellation = () => {
  const navigation = useNavigation<CancellationScreenProps['navigation']>();
  const {user, userSavings} = useUserInfo();
  const [cancellationData, setCancellationData] = useState<CancellationData>({
    email: '',
    hour: '',
    date: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const person = user?.person;
  const [confirmToContinue, setConfirmToContinue] = useState<ConfirmToContinue>(
    {
      isOpen: false,
    },
  );
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const timerRef = useRef<any>(null);
  const closeConfirmToContinue = () => setConfirmToContinue({isOpen: false});

  const accounts = useMemo(
    () =>
      [
        ...(userSavings?.savings.savings ?? []),
        ...(userSavings?.compensations.savings ?? []),
      ]
        .filter(e => e.canDisbursement /* && e.balance > 0 */)
        .map(e => ({
          ...e,
          title: e.productName,
          subtitle: e.accountCode,
          value: `${e.currency} ${e.sBalance}`,
        }))
        .sort((a, b) => {
          if (a.currency === 'S/' && b.currency !== 'S/') {
            return -1;
          }
          if (a.currency !== 'S/' && b.currency === 'S/') {
            return 1;
          }
          return b.balance - a.balance;
        }),
    [userSavings?.savings.savings, userSavings?.compensations.savings],
  );

  const [originAccountUId, setOriginAccountUId] = useState(
    accounts?.[0].operationUId!,
  );
  const originAccount = useAccountByOperationUid({
    operationUId: originAccountUId,
  });

  const onPressContinue = () =>
    setConfirmToContinue({
      isOpen: true,
      onAccept: () => {
        handleSubmit();
        closeConfirmToContinue();
      },
    });

  const handleGoHome = () => {
    setShowSuccessModal(false);
    navigation.navigate('MainTab', {
      screen: 'Main',
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await CancelAccount({
        documentNumber: person?.documentNumber,
        documentType: person?.documentTypeId,
        payload: {
          accountName: originAccount!.productName,
          accountNumber: originAccount!.accountCode,
        },
      });

      if (res.isSuccess && res.data) {
        setShowSuccessModal(true);
        setCancellationData(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      timerRef.current = setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  // Clear the interval when the component unmounts
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return {
    loading,
    showSuccessModal,
    accounts,
    confirmToContinue,
    cancellationData,
    originAccount,
    onPressContinue,
    setOriginAccountUId,
    closeConfirmToContinue,
    handleGoHome,
  };
};
