import {useEffect, useRef} from 'react';
import {useAddAccountToFavorite} from '@molecules/AddAccountToFavorite';
import {getRemoteValue} from '@utils/firebase';
import {storeOTP} from '@hooks/useStoreOTP';
import {useOtherAccountsContext} from '../contexts';
import {StackActions, useNavigation, useRoute} from '@react-navigation/native';
import {useLoading, useTimer, useUserInfo} from '@hooks/common';
import {otherBanksExecute, OtherBanksProps} from '@services/Transactions';
import {transferencyStatus} from '../contexts/types';
import {ErrorResponse} from '@global/information';
import { saveFavorite } from '@services/Favorite';

export const useConfirmationDeferred = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {user} = useUserInfo();
  const person = user?.person;
  const {lastTokenUsed, setDisplayErrorModal, setLastTokenUsed} = useLoading();
  const {
    initialForm,
    confirmationDeferred,
    bankCodes,
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
  const timerRef = useRef<any>(null);

  const {
    values: {amount, destinationAccount, formatAmount, operationUId},
  } = initialForm;

  const {
    values: {concept, isHolder, termsAreAccepted},
    form,
  } = confirmationDeferred;

  const {accountToFavorite /* , handleToggle, handleChangeText */} =
    useAddAccountToFavorite();

  const hasFavorites = getRemoteValue('active_favs').asBoolean();

  const hasErrors = Object.keys(form.errors).length !== 0;
  const isValidAccountFav = accountToFavorite.enable && accountToFavorite.ok;
  const isBtnConfirmationDeferredDisabled =
    !termsAreAccepted || hasFavorites
      ? !isValidAccountFav || hasErrors
      : hasErrors;

  const handleSubmitConfirmationDeferred = async () => {
    // Verify if token already used
    if (lastTokenUsed === storeOTP.getOtpState().currentToken) {
      setTokenModal(true);
      return;
    }

    const bankCode = parseInt(destinationAccount.slice(0, 3));
    const bankName = bankCodes?.current?.get(bankCode)!;

    const payload: OtherBanksProps = {
      beneficiaryDocumentNumber: person?.documentNumber!,
      beneficiaryDocumentType: person?.documentTypeId!,
      beneficiaryName: queryInfo?.destinationAccountName!,
      operationUId,
      destinationAccount: destinationAccount,
      destinationBank: bankCode,
      holderName: '',
      movementAmount: amount!,
      originAccount: originAccount?.accountCode!,
      sameHeadLine: isHolder!,
      codeVerification: String(storeOTP.getOtpState().currentToken),
      typeOriginAccount: originProductName,
      movementCurrency: originAccount?.currency === 'S/' ? 1 : 2,
      concept: concept,
      transactionType: 'D',
    };

    try {
      setLoadingFishes(true);

      const res = await otherBanksExecute({
        payload,
        documentType: person?.documentTypeId,
        documentNumber: person?.documentNumber,
        screen: route.name,
      });

      let status: transferencyStatus = 'UNKNOWN';
      if (res?.isSuccess === true) {
        if (res?.errorCode === '100') status = 'SUCCESS';
      } else {
        if (res?.errorCode === '102') status = 'BLOCKED';
        else if (res?.errorCode === '101') status = 'NEED_AUTHENTICATION';
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
                    errorCode: res?.errorCode,
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
                  type: 'TRANSFERENCY_OTHERS',
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
                    concept,
                    formatAmount,
                    originCommission: queryInfo.originCommission,
                    destinationCommission: queryInfo.destinationCommission,
                    destinationBankName: bankName,
                    destinationAccountName: queryInfo.destinationAccountName,
                    destinationAccountNumber: destinationAccount,
                    sameHeadLine: isHolder,
                    ...(isValidAccountFav && {
                      favoriteName: accountToFavorite.data?.accountName,
                    }),
                  },
                }),
              );
            }
            break;
          case 'BLOCKED':
            navigation.dispatch(StackActions.replace('InfoAccessBlocked'));
            break;
          case 'SUCCESS':

            if (favoritePayload !== undefined){
              const payload = {...favoritePayload, operationType: 1}
              const res = await saveFavorite({
                payload,
                documentType: person?.documentTypeId,
                documentNumber: person?.documentNumber,
                screen: route.name,
              });
              if(res.type === 'SUCCESS') favoriteModalUtils?.setFavDisclaimer(true)
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
    isBtnConfirmationDeferredDisabled,
    handleSubmitConfirmationDeferred,
  };
};
