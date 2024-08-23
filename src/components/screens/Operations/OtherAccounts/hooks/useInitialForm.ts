import {ErrorResponse} from '@global/information';
import {useLoading, useUserInfo} from '@hooks/common';
import {useRoute} from '@react-navigation/native';
import {otherBanksQuery, sameBankQuery} from '@services/Transactions';
import {useEffect, useRef, useState} from 'react';
import {useOtherAccountsContext} from '../contexts';
import {getRemoteValue} from '@utils/firebase';

export const useInitialForm = () => {
  const route = useRoute();
  const {
    originAccount,
    initialForm,
    setQueryInfoData,
    setStep,
    scheduleModal,
    setTransferType,
  } = useOtherAccountsContext();
  const {values, form} = initialForm;
  const {user} = useUserInfo();
  const person = user?.person;
  const {displayErrorModal, setDisplayErrorModal} = useLoading();
  const [loadingInitialForm, setLoadingInitialForm] = useState(false);

  const canTransactToSameBanks = getRemoteValue('trx_others').asBoolean();
  const canTransactToOtherBanks = getRemoteValue('trx_banks').asBoolean();

  const timerRef = useRef<any>(null);

  const isBtnInitialFormDisabled =
    Object.keys(form.errors).length !== 0 ||
    values.destinationAccount.length === 0 ||
    !values.amount ||
    values?.amount < 1 ||
    values?.amount > originAccount?.balance! ||
    (originAccount?.currency === 'S/' && values.amount > 10000) ||
    (originAccount?.currency === '$' && values.amount > 5000);

  const isCF = (input: string): boolean => {
    if (input.length !== 14) {
      return false;
    }
    if (/^0+$/.test(input)) {
      return false;
    }
    setTransferType('CF');
    return true;
  };

  const code = parseInt(values.destinationAccount.slice(0, 3));
  const payloadSameBank = {
    concept: '',
    movementAmount: values.amount!,
    originAccount: originAccount?.accountCode!,
    destinationAccount: values.destinationAccount,
    movementCurrency: originAccount?.currency === 'S/' ? 1 : 2,
  };

  const payloadOtherBanks = {
    beneficiaryDocumentNumber: person?.documentNumber!,
    beneficiaryDocumentType: person?.documentTypeId!,
    beneficiaryName: `${person?.names} ${person?.motherLastName}`,
    destinationAccount: values.destinationAccount,
    operationUId: values.operationUId,
    destinationBank: code,
    holderName: '',
    movementAmount: values.amount!,
    movementCurrency: originAccount?.currency === 'S/' ? 1 : 2,
    originAccount: originAccount?.accountCode!,
    concept: '',
    sameHeadLine: false,
  };

  const handleSubmitInitialForm = async () => {
    setLoadingInitialForm(true);
    if (isCF(values.destinationAccount)) {
      if (canTransactToSameBanks) {
        try {
          const res = await sameBankQuery({
            payload: payloadSameBank,
            documentType: person?.documentTypeId,
            documentNumber: person?.documentNumber,
            screen: route.name,
          });
          if (!res.isSuccess && res?.data?.message && res?.data?.title) {
            setDisplayErrorModal({
              isOpen: true,
              message: {
                title: res.data.title,
                content: res.data.message,
              },
              errorCode: res.errorCode,
            });
          } else if (res?.data && res?.isSuccess) {
            setQueryInfoData({
              itfTax: res.data.itfTax,
              destinationAccountName: res.data.ownerFullName,
              destinationAccountNumber: values.destinationAccount,
              originCommission: res.data.originCommission,
              destinationCommission: res.data.destinationCommission,
            });
            setStep(prevStep => prevStep + 1);
          } else {
            setDisplayErrorModal({
              isOpen: true,
              errorCode: ErrorResponse.UNCONTROLLED,
              message: {
                title: '¡Lo sentimos!',
                content:
                  'Ocurrió un inconveniente. Por favor inténtalo nuevamente en unos segundos.',
              },
            });
          }
        } catch (error) {
          setDisplayErrorModal({
            isOpen: true,
            errorCode: ErrorResponse.UNCONTROLLED,
            message: {
              title: '¡Lo sentimos!',
              content:
                'Ocurrió un inconveniente. Por favor inténtalo nuevamente en unos segundos.',
            },
          });
        } finally {
          setLoadingInitialForm(false);
        }
      } else {
        setLoadingInitialForm(false);
        setDisplayErrorModal({
          isOpen: true,
          errorCode: ErrorResponse.UNCONTROLLED,
          message: {
            title: '¡Lo sentimos!',
            content:
              'Ocurrió un inconveniente. Por favor inténtalo nuevamente en unos segundos.',
          },
        });
      }
    } else {
      // Other Banks
      if (canTransactToOtherBanks) {
        try {
          const res = await otherBanksQuery({
            payload: {
              ...payloadOtherBanks,
              transactionType: 'I',
            },
            documentType: person?.documentTypeId,
            documentNumber: person?.documentNumber,
          });
          if (!res.isSuccess && res?.data?.message && res?.data?.title) {
            setDisplayErrorModal({
              isOpen: true,
              message: {
                title: res.data.title,
                content: res.data.message,
              },
              errorCode: res.errorCode,
            });
          } else if (res?.data && res?.isSuccess) {
            if (res.data.transactionType === 'I')
              setTransferType('Inmediate-CCI');
            else setTransferType('Deferred-CCI');

            setQueryInfoData({
              itfTax: res.data.itfTax,
              destinationAccountName: res.data.beneficiaryFullName,
              destinationAccountNumber: values.destinationAccount,
              originCommission: res.data.originCommission,
              destinationCommission: res.data.destinationCommission,
              transactionType: res.data.transactionType,
              mpe001IDL: res.data.mpe001IDL,
              transferId: res.data.transferId,
            });

            setStep(prevStep => prevStep + 1);
            timerRef.current = setTimeout(() => {
              scheduleModal.onOpen();
            }, 1000);
          } else {
            setDisplayErrorModal({
              isOpen: true,
              errorCode: ErrorResponse.UNCONTROLLED,
              message: {
                title: '¡Uy, ocurrió un problema!',
                content:
                  'Estamos trabajando para solucionarlo. Si persiste contáctanos al (01) 313 5000.',
              },
            });
          }
        } catch (error) {
          setDisplayErrorModal({
            isOpen: true,
            errorCode: ErrorResponse.UNCONTROLLED,
            message: {
              title: '¡Uy, ocurrió un problema!',
              content:
                'Estamos trabajando para solucionarlo. Si persiste contáctanos al (01) 313 5000.',
            },
          });
        } finally {
          setLoadingInitialForm(false);
        }
      } else {
        setLoadingInitialForm(false);
        setDisplayErrorModal({
          isOpen: true,
          errorCode: ErrorResponse.UNCONTROLLED,
          message: {
            title: '¡Lo sentimos!',
            content:
              'Ocurrió un inconveniente. Por favor inténtalo nuevamente en unos segundos.',
          },
        });
      }
    }
  };

  // Clear the interval when the component unmounts
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return {
    loadingInitialForm,
    displayErrorModal,
    isBtnInitialFormDisabled,
    handleSubmitInitialForm,
  };
};
