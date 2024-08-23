import {BackHandler, Keyboard} from 'react-native';
import {SelectItem} from '@atoms/Select';
import useAccountByOperationUid from '@hooks/useAccountByOperationUid';
import useToggle from '@hooks/useToggle';
import {RootStackParamList} from '@navigations/types';
import {getBankCodes} from '@services/BankCode';
import {CatalogueItem, getCatalogue} from '@services/Catalogue';
import {otherBanksQuery} from '@services/Transactions';
import {EventRegister} from '@utils/EventRegister';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useFormDestinationOtherBanks} from './form';
import {useFocusEffect} from '@react-navigation/native';
import { useUserInfo } from '@hooks/common';

type From = 'OtherBanks' | 'ConfirmationOtherBanks';

interface errorMessage {
  isOpen: boolean;
  errorCode: string;
  message: {
    title: string;
    content: string;
  };
}

type Params = Readonly<{
  operationUId: number;
  accountCode: string;
  productName: string;
  owner: {
    documentType: string;
    documentNumber: string;
    fullName: string;
  };
}>;

interface Navigate {
  goBack: () => void;
  navigateToMain: () => void;
  navigateToMainByName: (name: string) => void;
  navigateToConfirmation: (
    data: RootStackParamList['ConfirmationOtherBanks'],
  ) => void;
  navigateToSameBank: (destinationAccount: string) => void;
}

interface Props {
  params: Params;
  from: From;
  routeName: string;
  navigation: Navigate;
}

export const useDestinationOtherBanks = ({
  params,
  from,
  routeName,
  navigation,
}: Props) => {
  const {operationUId, accountCode, productName, owner} = params;
  const {
    goBack,
    navigateToMain,
    navigateToMainByName,
    navigateToConfirmation,
    navigateToSameBank,
  } = navigation;

  const {user} = useUserInfo();
  const originAccount = useAccountByOperationUid({operationUId});
  const [catalogue, setCatalogue] = useState<CatalogueItem[]>([]);

  const documentTypes: SelectItem[] = useMemo(() => {
    return catalogue?.map(catalogueItem => ({
      label: catalogueItem?.descripcionCorta,
      value: String(catalogueItem?.codigo),
    }));
  }, [catalogue]);

  const goBackPath = useRef<{isFromTab: boolean; path: string} | null>(null);

  const {isOpen, onOpen, onClose} = useToggle();
  const [loading, setLoading] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [error, setError] = useState<errorMessage>({
    isOpen: false,
    errorCode: '',
    message: {
      content: '',
      title: '',
    },
  });

  const {values, errors, touched, form, bankCodes, clear} =
    useFormDestinationOtherBanks();

  const handleSubmit = async () => {
    setLoading(true);
    const code = parseInt(values.destinationAccountNumber.slice(0, 3));

    const payload = {
      operationUId,
      formatAmount: values.formatAmount,
      destinationBankName: bankCodes?.current?.get(code)!,
      transferData: {
        beneficiaryDocumentNumber: values.documentNumber,
        beneficiaryDocumentType: Number(values.documentType),
        beneficiaryName: values.destinationAccountName,
        destinationAccount: values.destinationAccountNumber,
        destinationBank: code,
        holderName: values.destinationAccountName,
        concept: '',
        movementAmount: values.amount!,
        movementCurrency: originAccount?.currency!,
        originAccount: originAccount?.accountCode!,
        sameHeadLine: values.accountOwner!,
      },
    };

    // if (userInfo && values.accountOwner) {
    //   const {documentNumber, documentTypeId, names, lastName} = userInfo.person;
    //   payload.transferData.beneficiaryDocumentNumber = documentNumber;
    //   payload.transferData.beneficiaryDocumentType = String(documentTypeId);
    //   payload.transferData.beneficiaryName = `${names} ${lastName}`;
    //   payload.transferData.holderName = `${names} ${lastName}`;
    // }
    if (payload.transferData.destinationAccount.slice(0, 3) === '091') {
      setError({
        errorCode: '450',
        isOpen: true,
        message: {
          title: 'Cambia el tipo de transferencia para realizar esta operación',
          content:
            'La cuenta de destino es de Compartamos Financiera por ello debes hacer la operación desde Transferencia a otras cuentas Compartamos',
        },
      });
      return;
    }

    const res = await otherBanksQuery({
      payload: {
        ...payload.transferData,
        movementCurrency: originAccount?.currency! === 'S/' ? 1 : 2,
      },
      documentType: user?.person.documentTypeId,
      documentNumber: user?.person.documentNumber,
      screen: routeName,
    });
    setLoading(false);

    if (
      (!res?.isWarning && !res?.isSuccess && res?.errorCode === '') ||
      (res?.isWarning && !res?.isSuccess && res?.errorCode === '-1')
    ) {
      setError({
        errorCode: '-1',
        isOpen: true,
        message: {
          title: '¡Ups, hubo un problema!',
          content:
            'No hemos podido cargar tu información, por favor intenta en unos segundos o vuelve a ingresar.',
        },
      });
      return;
    }

    if (res?.isWarning && !res?.isSuccess) {
      if (res.errorCode === '494') {
        setError({
          isOpen: true,
          message: {
            content: res.data.message,
            title: res.data.title,
          },
          errorCode: res.errorCode,
        });
        return;
      }
      setError({
        isOpen: true,
        message: res.data.message,
        errorCode: res.errorCode,
      });
      return;
    } else if (res?.data && res?.isSuccess) {
      clear();
      navigateToConfirmation({
        productName,
        ...payload,
        transferData: {
          ...payload.transferData,
          movementCurrency: originAccount?.currency!,
        },
        itfTax: res.data.itfTax,
        ownerFullName: res.data.ownerFullName,
        originCommission: res.data.originCommission,
        destinationCommission: res.data.destinationCommission,
        owner,
      });
    }
  };

  useEffect(() => {
    getBankCodes().then(res => {
      bankCodes.current = res;
    });
  }, []);

  useEffect(() => {
    getCatalogue({
      screen: routeName,
      user: `0${user?.person?.documentTypeId}${user?.person?.documentNumber}`,
    })
      .then(data => setCatalogue(data))
      .catch(err => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (values.accountOwner) {
      form.setFields({
        documentNumber: owner?.documentNumber,
        destinationAccountName: owner?.fullName,
        documentType: String(owner?.documentType),
      });
    }

    if (!values.accountOwner) {
      form.setFields({
        documentNumber: '',
        destinationAccountName: '',
        documentType: '',
      });
    }
  }, [values.accountOwner]);

  useEffect(() => {
    if (values.accountOwner) {
      form.setFields({
        documentNumber: owner?.documentNumber,
        destinationAccountName: owner?.fullName,
        documentType: String(owner?.documentType),
      });
    }

    if (!values.accountOwner) {
      form.setFields({
        documentNumber: '',
        destinationAccountName: '',
        documentType: '',
      });
    }
  }, [values.accountOwner]);

  const isBtnDisabled =
    Object.keys(touched).length !== 0
      ? Object.keys(errors)?.length !== 0 ||
        (owner && Object.keys(owner).length === 0) ||
        !values.amount ||
        values?.amount < 1 ||
        values?.amount > originAccount?.balance! ||
        values.documentType === '' ||
        values.documentNumber === '' ||
        Object.keys(owner)?.length === 0 ||
        owner?.documentType === null ||
        owner?.documentNumber === '' ||
        owner?.fullName === '' ||
        values.destinationAccountName === '' ||
        (originAccount?.currency === 'S/' && values.amount > 10000) ||
        (originAccount?.currency === '$' && values.amount > 3000)
      : true;

  const handleBackPress = useCallback(() => {
    if (!isBtnDisabled) {
      onOpen();
      return false;
    }
    goBack();
    return true;
  }, [isBtnDisabled, goBack, onOpen]);

  const onPressContainer = () => {
    Keyboard.dismiss();
    setSelectOpen(false);
  };

  const onClosePopUp = async () => {
    onClose();
    await new Promise(res => setTimeout(res, 500));
    navigateToMainByName('Main');
    clear();
  };

  const onCloseModalError = () => {
    setError({
      isOpen: false,
      errorCode: '',
      message: {
        title: '',
        content: '',
      },
    });
    clear();
    if (error.errorCode === '-1') {
      navigateToMain();
    }
  };

  const clearScreen = () => {
    setError({
      isOpen: false,
      errorCode: '',
      message: {
        title: '',
        content: '',
      },
    });
    setLoading(false);
    clear();
  };

  const onChangeTransfer = () => {
    navigateToSameBank(values.destinationAccountNumber);
    clearScreen();
  };

  useFocusEffect(
    useCallback(() => {
      if (from === 'OtherBanks') {
        setError({
          isOpen: false,
          errorCode: '',
          message: {
            title: '',
            content: '',
          },
        });
        clear();
        goBackPath.current = {path: from, isFromTab: false};
      }
    }, [from, clear]),
  );

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => handleBackPress(),
      );

      return () => backHandler.remove();
    }, [handleBackPress]),
  );

  useFocusEffect(
    useCallback(() => {
      const id = EventRegister.on('tabPress', e => {
        if (!isBtnDisabled) {
          e.preventDefault();
          onOpen();

          goBackPath.current = {isFromTab: true, path: 'MainScreen'};
        }
      });

      return () => {
        EventRegister.rm(id!);
      };
    }, [isBtnDisabled, onOpen]),
  );

  const handleFocus = () => setSelectOpen(false);

  return {
    values,
    form,
    errors,
    isOpen,
    error,
    selectOpen,
    originAccount,
    documentTypes,
    isBtnDisabled,
    loading,
    onClose,
    onClosePopUp,
    onCloseModalError,
    clearScreen,
    onChangeTransfer,
    setSelectOpen,
    onPressContainer,
    handleSubmit,
    handleBackPress,
    handleFocus,
  };
};
