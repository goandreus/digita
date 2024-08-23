/* eslint-disable react-hooks/exhaustive-deps */
import {useLoading, useUserInfo} from '@hooks/common';
import {CreditsDetailProps} from '@navigations/types';
import {StackActions, useFocusEffect} from '@react-navigation/native';
import {CreditDetailInterface} from '@services/Accounts';
import {getCreditDetail} from '@services/CreditLine';
import {useCallback, useEffect, useContext, useState} from 'react';
import {OperationStackContext} from '@contexts/OperationStackContext';
import useSavings from '@hooks/useSavings';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {
  setShowCreditPunishedModal,
  setShowNeedSavingModal,
} from '@features/appConfig';

export const useCreditDetail = ({navigation, route}: CreditsDetailProps) => {
  const [showModal, setShowModal] = useState(false);
  const [creditDetail, setCreditDetail] =
    useState<CreditDetailInterface | null>(null);
  const {user} = useUserInfo();
  const {hasAccountForTransact} = useSavings();
  const {targetScreen, setTargetScreen} = useLoading();
  const dispatch = useAppDispatch();
  const person = user?.person;

  const getAccountDetail = useCallback(async () => {
    const _creditDetail = await getCreditDetail({
      accountCode: route?.params?.accountNumber,
      user: `0${person?.documentTypeId}${person?.documentNumber}`,
      screen: route.name,
    });
    setCreditDetail(_creditDetail);
    if (_creditDetail?.individualOverdueAmount !== 0) {
      setShowModal(true);
    }
  }, [
    person?.documentNumber,
    person?.documentTypeId,
    route.name,
    route?.params?.accountNumber,
    setCreditDetail,
  ]);

  const mainStackNavigator = navigation.getParent(
    'MainStackNavigator' as never,
  );
  const operationStackContext = useContext(OperationStackContext);

  const goBack = () => {
    const isFromCredits = targetScreen?.CreditsDetail === 'MyCredits';
    if (isFromCredits) {
      // clear target screen
      setTargetScreen({
        screen: 'CreditsDetail',
        from: undefined,
      });
      navigation.goBack();
      return;
    }
    mainStackNavigator?.dispatch(
      StackActions.push('MainTab', {
        screen: 'Main',
        params: {
          screen: 'MainScreen',
          params: {},
        },
      }),
    );
  };

  const handlePayQuota = () => {
    setTargetScreen({
      screen: 'CreditPayments',
      from: 'CreditsDetail',
    });

    if (!hasAccountForTransact()) {
      dispatch(setShowNeedSavingModal(true));
    } else {
      if (route?.params?.isPunished === false) {
        operationStackContext.disableUseFocusEffect = true;
        mainStackNavigator?.dispatch(
          StackActions.push('OperationsStack', {
            screen: 'CreditPayments',
            params: {
              status: route?.params?.status,
              productName: route?.params?.productName,
              advancePercentage: route?.params?.advancePercentage,
              disbursedCapital: route?.params?.disbursedCapital,
              disbursedCapitalAmount: route?.params?.disbursedCapitalAmount,
              currency: route?.params?.currency,
              accountNumber: route?.params?.accountNumber,
              capitalCanceled: route?.params?.capitalCanceled,
              capitalCanceledAmount: route?.params?.capitalCanceledAmount,
              type: 'Individual',
              from: 'CreditsDetail',
            },
          }),
        );
      } else {
        dispatch(setShowCreditPunishedModal(true));
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      operationStackContext.disableUseFocusEffect = false;
    }, []),
  );

  useEffect(() => {
    getAccountDetail();
  }, [getAccountDetail]);

  return {
    showModal,
    creditDetail,
    setShowModal,
    goBack,
    handlePayQuota,
  };
};
