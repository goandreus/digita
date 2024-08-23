import {ErrorResponse} from '@global/information';
import {useLoading, useTimer, useUserInfo} from '@hooks/common';
import {storeOTP} from '@hooks/useStoreOTP';
import {useAddAccountToFavorite} from '@molecules/AddAccountToFavorite';
import {StackActions, useNavigation, useRoute} from '@react-navigation/native';
import {sameBankExecute} from '@services/Transactions';
import {getRemoteValue} from '@utils/firebase';
import {useEffect, useRef} from 'react';
import {useOtherAccountsContext} from '../contexts';
import {transferencyStatus} from '../contexts/types';
import {saveFavorite} from '@services/Favorite';

export const useConfirmationCF = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {user} = useUserInfo();
  const person = user?.person;
  const {lastTokenUsed, setDisplayErrorModal, setLastTokenUsed} = useLoading();
  const {
    initialForm,
    confirmationCF,
    originAccount,
    originProductName,
    queryInfo,
    favoritePayload,
    updateUserSavings,
    setStep,
    setLoadingFishes,
    setSuccessModal,
    setTokenModal,
    favoriteModalUtils,
  } = useOtherAccountsContext();
  const {restart} = useTimer();
  const {
    values: {amount, destinationAccount, formatAmount, operationUId},
    clear: clearInitialForm,
  } = initialForm;
  const {
    values: {concept},
    clear: clearConfirmationCF,
    form,
  } = confirmationCF;

  const {accountToFavorite} = useAddAccountToFavorite();
  const isValidAccountFav = accountToFavorite.enable && accountToFavorite.ok;
  const hasFavorites = getRemoteValue('active_favs').asBoolean();

  const timerRef = useRef<any>(null);

  const hasErrors = Object.keys(form.errors).length !== 0;

  const isBtnConfirmationCFDisabled = hasFavorites
    ? accountToFavorite.enable
      ? !accountToFavorite.ok
      : hasErrors
    : hasErrors;

  const handleSubmitConfirmationCF = async () => {
    // Verify if token already used
    if (lastTokenUsed === storeOTP.getOtpState().currentToken) {
      setTokenModal(true);
      return;
    }

    const payload = {
      concept: concept,
      movementAmount: amount,
      codeVerification: String(storeOTP.getOtpState().currentToken),
      originAccount: originAccount?.accountCode!,
      destinationAccount: destinationAccount,
      movementCurrency: originAccount?.currency === 'S/' ? 1 : 2,
      name: person?.names,
      typeOriginAccount: originProductName,
    };

    try {
      // setLoadingFishess
      setLoadingFishes(true);

      const res = await sameBankExecute({
        payload,
        documentType: person?.documentTypeId,
        documentNumber: person?.documentNumber,
        screen: route.name,
      });

      let status: transferencyStatus = 'UNKNOWN';
      if (res?.isSuccess === true) {
        if (res?.errorCode === '100') {
          status = 'SUCCESS';
        }
      } else {
        if (res?.errorCode === '102') {
          status = 'BLOCKED';
        } else if (res?.errorCode === '101') {
          status = 'NEED_AUTHENTICATION';
        }
      }

      if (res === 499) {
        // goBack & show token modal
        setStep(prevStep => prevStep - 1);
        /* setShowTokenModal(true); */
      } else {
        switch (status) {
          case 'UNKNOWN':
            /* setStep(prevStep => prevStep - 1); */
            const modalMessage =
              res?.data?.message !== undefined && res?.data?.title !== undefined
                ? {
                    errorCode: res.errorCode,
                    isOpen: true,
                    message: {
                      title: res.data.title,
                      content: res.data.message,
                    },
                  }
                : {
                    errorCode: ErrorResponse.UNCONTROLLED,
                    isOpen: true,
                    message: {
                      title: '¡Lo sentimos!',
                      content:
                        'Ocurrió un inconveniente. Por favor inténtalo nuevamente en unos segundos.',
                    },
                  };
            setDisplayErrorModal(modalMessage);
            break;
          case 'NEED_AUTHENTICATION':
            if (person !== undefined) {
              restart({
                documentNumber: person.documentNumber,
                documentType: person.documentTypeId,
              });
              navigation.dispatch(
                StackActions.push('RegisterOTP', {
                  type: 'TRANSFERENCY_LOCAL',
                  documentType: person.documentTypeId,
                  documentNumber: person.documentNumber,
                  phoneNumberObfuscated: res?.data?.cellphone,
                  channel: 'sms',
                  isSensitiveInfo: true,
                  stepProps: undefined,
                  trackingTransaction: res?.data?.trackingTransaction,
                  transfer: {
                    amount,
                    operationUId,
                    formatAmount,
                    destinationAccountName: queryInfo.destinationAccountName,
                    concept: concept,
                    destinationAccountNumber:
                      queryInfo.destinationAccountNumber,
                  },
                }),
              );
            }
            break;
          case 'BLOCKED':
            navigation.dispatch(StackActions.replace('InfoAccessBlocked'));
            break;
          case 'SUCCESS':
            /* clearConfirmationCF();
            clearInitialForm(); */
            if (favoritePayload !== undefined) {
              const payload = {...favoritePayload, operationType: 2};
              const res = await saveFavorite({
                payload,
                documentType: person?.documentTypeId,
                documentNumber: person?.documentNumber,
                screen: route.name,
              });
              if (res.type === 'SUCCESS')
                favoriteModalUtils?.setFavDisclaimer(true);
            }
            setLastTokenUsed(storeOTP.getOtpState().currentToken!);
            setSuccessModal(prev => ({...prev, isOpen: true, data: res.data}));
            updateUserSavings();
            break;
        }
      }
    } catch (err: any) {
      /* setStep(prevStep => prevStep - 1); */
      setDisplayErrorModal({
        errorCode: ErrorResponse.UNCONTROLLED,
        isOpen: true,
        message: {
          title: '¡Lo sentimos!',
          content:
            'Ocurrió un inconveniente. Por favor inténtalo nuevamente en unos segundos.',
        },
      });
    } finally {
      timerRef.current = setTimeout(() => {
        setLoadingFishes(false);
      }, 1000);
    }
  };

  // Clear the interval when the component unmounts
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return {
    isBtnConfirmationCFDisabled,
    handleSubmitConfirmationCF,
  };
};
