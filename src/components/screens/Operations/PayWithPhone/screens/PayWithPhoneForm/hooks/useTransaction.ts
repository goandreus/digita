import {useCallback, useEffect, useState} from 'react';
import {
  IGetContactData,
  IInteroperabilityExecuteData,
  interoperabilityExecute,
} from '@services/Interoperability';
import useForm from '@hooks/useForm';
import useStoreOTP, {storeOTP} from '@hooks/useStoreOTP';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useLastUser, useLoading, useUserInfo} from '@hooks/common';
import recentContacts from '@features/recentContacts';
import {interopSchedule} from '@utils/interopSchedule';
import {sameBankExecute} from '@services/Transactions';

interface Props {
  params: {
    data: IGetContactData;
    destinationData: {
      destinationBankCode: string;
      destinationName: string;
      destinationCellPhone: string;
    };
  };
  formatedTimeToken: string | null;
  tokenModal: boolean;
  setTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useTransaction = ({params}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {lastTokenUsed, setTargetScreen, setLastTokenUsed} = useLoading();
  const [successModal, setSuccessModal] = useState<
    IInteroperabilityExecuteData & {isOpen: boolean}
  >({
    isOpen: false,
    beneficiaryBankName: '',
    beneficiaryCellPhone: 0,
    beneficiaryDocumentNumber: '',
    beneficiaryDocumentType: 0,
    beneficiaryFullName: '',
    dateTransaction: '',
    email: '',
    hourTransaction: '',
    movementAmount: 0,
    movementAmountFormat: '',
    movementCurrency: 0,
    numberOperation: 0,
  });
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [maxAmoutModal, setMaxAmoutModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string[];
    button: string;
    button2?: string;
    errorCode?: string;
  }>({
    isOpen: false,
    title: '',
    content: [],
    button: '',
  });
  const [tokenModal, setTokenModal] = useState<boolean>(false);

  const {data, destinationData, contactSelected} = params;

  const {timeUntilNextToken} = useStoreOTP();

  const formatedTimeToken = timeUntilNextToken
    ? timeUntilNextToken >= 10
      ? `${timeUntilNextToken}`
      : `0${timeUntilNextToken}`
    : null;

  useEffect(() => {
    if (tokenModal && timeUntilNextToken === 0) {
      setTokenModal(false);
    }
  }, [setTokenModal, timeUntilNextToken, tokenModal]);

  // Form
  const {values, ...form} = useForm({
    initialValues: {
      amount: null,
      termsAreAccepted: false,
    },
  });

  const onSetFieldInitialForm = useCallback(
    (field: any, value: any) => {
      form.setField(field, value);
    },
    [form],
  );

  const originAccount = useAccountByOperationUid({
    operationUId: Number(data?.operationUId),
  });

  const isBtnDisabled =
    values.amount === null ||
    values.amount < 1 ||
    values.amount > 500 ||
    values?.amount > originAccount?.balance!;

  const navigation = useNavigation();
  const route = useRoute();
  const {user} = useUserInfo();
  const {lastUser} = useLastUser();
  const person = user?.person;

  const closeMaxAmountModal = () => {
    if (maxAmoutModal.errorCode === '-1') {
      navigation.navigate('MainTab', {
        screen: 'Main',
      });
    } else {
      setMaxAmoutModal({
        isOpen: false,
        title: '',
        content: [],
        button: '',
        errorCode: '',
      });
    }
  };

  const handleGoToTransfer = () => {
    setTargetScreen({screen: 'Transfers', from: 'Operations'});
    navigation.navigate('MainOperations', {
      screen: 'Transfers',
      params: {from: 'PayWithPhone'},
    });
  };

  const handlePayWithPhone = async () => {
    if (lastTokenUsed === storeOTP.getOtpState().currentToken) {
      setTokenModal(true);
      return;
    }

    const bankCode = parseInt(destinationData?.destinationBankCode);

    if (!interopSchedule().visibilityModal) {
      try {
        setLoading(true);
        if (bankCode === 91) {
          const payload = {
            concept: '',
            movementAmount: values.amount ?? 0,
            codeVerification: String(storeOTP.getOtpState().currentToken),
            originAccount: data?.originAccount,
            destinationAccount: data?.destinationAccount,
            movementCurrency: 1,
            name: data?.beneficiaryFullName,
            typeOriginAccount: data?.typeOriginAccount,
            destinationBankCode: destinationData?.destinationBankCode,
            destinationCellPhone: destinationData?.destinationCellPhone,
          };

          const response = await sameBankExecute({
            payload,
            documentType: person?.documentTypeId,
            documentNumber: person?.documentNumber,
            screen: route.name,
          });

          if (!response.isSuccess) {
            if (response.errorCode === '101') {
              navigation.navigate('RegisterOTP', {
                type: 'INTEROPERABILITY',
                payload: {
                  contactSelected: contactSelected,
                  payloadRecentContacts: {
                    recordID: destinationData.destinationCellPhone,
                    phoneNumber: destinationData.destinationCellPhone,
                    givenName:
                      data.beneficiaryFullName === ''
                        ? destinationData.destinationName
                        : data.beneficiaryFullName,
                  },
                },
                stepProps: undefined,
                channel: 'sms',
                documentNumber: person?.documentNumber,
                documentType: person?.documentTypeId,
                isSensitiveInfo: true,
                trackingTransaction: response.data?.trackingTransaction,
                phoneNumberObfuscated: lastUser.cellphoneNumber,
              });
            } else if (
              response.errorCode === '102' ||
              response.errorCode === '498'
            ) {
              navigation.navigate('InfoAccessBlocked');
            }
            const {title, message, button, button2} = response.data;
            const descriptionArray = message
              ?.split('<b>')
              .filter(i => i.length > 0);
            if (
              response.errorCode !== '101' &&
              response.errorCode !== '102' &&
              response.errorCode !== '498'
            ) {
              setMaxAmoutModal({
                isOpen: true,
                title,
                content: descriptionArray,
                button: 'Entendido',
                button2,
                errorCode: response.errorCode,
              });
            }
          } else {
            setLastTokenUsed(storeOTP.getOtpState().currentToken!);
            const responseData = response.data;
            typeof contactSelected === 'string'
              ? recentContacts.add({
                  recordID: destinationData.destinationCellPhone,
                  phoneNumber: destinationData.destinationCellPhone,
                  givenName:
                    data.beneficiaryFullName === ''
                      ? destinationData.destinationName
                      : data.beneficiaryFullName,
                })
              : recentContacts.add(contactSelected);
            setSuccessModal({isOpen: true, ...responseData});
          }
        } else {
          const payload = {
            destinationBankCode: destinationData?.destinationBankCode,
            destinationCellPhone: destinationData?.destinationCellPhone,
            isCheckTermsAndConditions: values.termsAreAccepted,
            movementAmount: values.amount ?? 0,
            movementCurrency: 1,
            codeVerification: String(storeOTP.getOtpState().currentToken),
          };
          const response = await interoperabilityExecute({
            payload,
            user: `0${person?.documentTypeId}${person?.documentNumber}`,
            screen: route.name,
          });
          if (!response.isSuccess) {
            if (response.errorCode === '101') {
              navigation.navigate('RegisterOTP', {
                type: 'INTEROPERABILITY',
                payload: {
                  contactSelected: contactSelected,
                  payloadRecentContacts: {
                    recordID: destinationData.destinationCellPhone,
                    phoneNumber: destinationData.destinationCellPhone,
                    givenName:
                      data.beneficiaryFullName === ''
                        ? destinationData.destinationName
                        : data.beneficiaryFullName,
                  },
                },
                stepProps: undefined,
                channel: 'sms',
                documentNumber: person?.documentNumber,
                documentType: person?.documentTypeId,
                isSensitiveInfo: true,
                trackingTransaction: response.data?.trackingTransaction,
                phoneNumberObfuscated: lastUser.cellphoneNumber,
              });
            } else if (
              response.errorCode === '102' ||
              response.errorCode === '498'
            ) {
              navigation.navigate('InfoAccessBlocked');
            }
            const {title, content, button, button2} = response.data;
            const descriptionArray = content
              ?.split('<b>')
              .filter(i => i.length > 0);
            if (
              response.errorCode !== '101' &&
              response.errorCode !== '102' &&
              response.errorCode !== '498'
            ) {
              setMaxAmoutModal({
                isOpen: true,
                title,
                content: descriptionArray,
                button,
                button2,
                errorCode: response.errorCode,
              });
            }
          } else {
            setLastTokenUsed(storeOTP.getOtpState().currentToken!);
            const responseData = response.data;
            typeof contactSelected === 'string'
              ? recentContacts.add({
                  recordID: destinationData.destinationCellPhone,
                  phoneNumber: destinationData.destinationCellPhone,
                  givenName:
                    data.beneficiaryFullName === ''
                      ? destinationData.destinationName
                      : data.beneficiaryFullName,
                })
              : recentContacts.add(contactSelected);
            setSuccessModal({isOpen: true, ...responseData});
          }
        }
      } catch (error) {
        setMaxAmoutModal({
          isOpen: true,
          title: '¡Uy, ocurrió un problema!',
          content: [
            'Por favor, verifica si se realizó el pago en los movimientos de la cuenta afiliada al celular. Caso contrario, vuelve a intentarlo en unos minutos.',
          ],
          button: 'Entiendo',
          errorCode: '-1',
        });
      } finally {
        setLoading(false);
      }
    } else {
      setShowScheduleModal(true);
    }
  };

  return {
    loading,
    maxAmoutModal,
    successModal,
    isBtnDisabled,
    showScheduleModal,
    formData: {
      values,
      originAccount,
      onSetField: onSetFieldInitialForm,
    },
    formatedTimeToken,
    tokenModal,
    setTokenModal,
    handleGoToTransfer,
    setShowScheduleModal,
    handlePayWithPhone,
    closeMaxAmountModal,
    setSuccessModal,
  };
};
