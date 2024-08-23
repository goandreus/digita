/* eslint-disable no-spaced-func */
import {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform} from 'react-native';
import {getDepartments, getProvinces} from '@services/Collections';
import {
  EvaluateEntrepreneurAccount,
  OpenEntrepreneurAccount,
} from '@services/EntrepreneurAccount';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AccountType, CustomErr, Place, Places} from '../types';
import {useLastUser, useLoading, useUserInfo} from '@hooks/common';
import {getIpAddress, getUserSavings} from '@services/User';
import {getRemoteValue} from '@utils/firebase';
import {
  IInteroperabilityInfo,
  getInteroperabilityInfo,
} from '@services/Interoperability';
import useStoreOTP, {storeOTP} from '@hooks/useStoreOTP';

interface ISuccessData {
  isOpen: boolean;
  data: {
    datetime: string;
    accountSavingName: string;
    accountSaving: string;
    email: string;
    cci: string;
    cellPhone: string;
    firstName: string;
  };
}

export const useSavingsAccount = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    user,
    userInteroperabilityInfo,
    setUserInteroperabilityInfo,
    setUserSavings,
    setUserEntrepreneurAccount,
  } = useUserInfo();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [loadingActionButton1, setLoadingActionButton1] =
    useState<boolean>(false);
  const [loadingActionButton2, setLoadingActionButton2] =
    useState<boolean>(false);
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState<AccountType>('');
  const [disableITem, setDisableITem] = useState(false);
  const [departments, setDepartments] = useState<Places>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Place>({});
  const [provinces, setProvinces] = useState<Places>([]);
  const [selectedProvince, setSelectedProvince] = useState<Place>({});
  const [recommendationCode, setRecommendationCode] = useState<string>('');
  const [rCodeValidation, setRCodeValidation] = useState<CustomErr>({
    error: false,
    errorMessage: '',
  });
  const [term1, setTerm1] = useState<boolean>(false);
  const [term2, setTerm2] = useState<boolean>(false);
  const [clientUId, setClientUId] = useState<number>(0);
  const [successModal, setSuccessModal] = useState<ISuccessData>({
    isOpen: false,
    data: {
      datetime: '',
      email: '',
      accountSavingName: '',
      accountSaving: '',
      cci: '',
      firstName: '',
      cellPhone: '',
    },
  });
  const [showMainAlert, setShowMainAlert] = useState<{
    isOpen: boolean;
    button: string;
    content: string;
    title: string;
    action: () => void;
  }>({
    isOpen: false,
    button: '',
    content: '',
    title: '',
    action: () => {},
  });
  const [tokenModalOpening, setTokenModalOpening] = useState<boolean>(false);
  const [tokenModalAffiliation, setTokenModalAffiliation] =
    useState<boolean>(false);

  const {lastUser} = useLastUser();
  const token = lastUser.secret;
  const person = user?.person;

  const {timeUntilNextToken} = useStoreOTP();
  const {setLastTokenUsed, lastTokenUsed} = useLoading();
  const {setLastTokenUsedOpening, lastTokenUsedOpening} = useLoading();

  const formatedTimeToken = timeUntilNextToken
    ? timeUntilNextToken >= 10
      ? `${timeUntilNextToken}`
      : `0${timeUntilNextToken}`
    : null;

  useEffect(() => {
    if (timeUntilNextToken === 0) {
      if (tokenModalOpening) {
        setTokenModalOpening(false);
      }
      if (tokenModalAffiliation) {
        setTokenModalAffiliation(false);
      }
    }
  }, [
    timeUntilNextToken,
    setTokenModalOpening,
    tokenModalOpening,
    setTokenModalAffiliation,
    tokenModalAffiliation,
  ]);

  const goBack = useCallback(() => {
    if (step !== 0) {
      setStep(prev => (prev -= 1));
      return;
    }
    navigation.goBack();
  }, [navigation, step]);

  const listDepartments = async () => {
    const allDepartments = await getDepartments();
    allDepartments.data.map(department => {
      department.title = department.description;
      department.value = '';
      department.subtitle = '';
      setDepartments(prev => [...prev, department]);
    });
  };

  const selectDepartment = useCallback(async (department: any) => {
    setSelectedDepartment({department});
    setProvinces([]);
    setSelectedProvince({});
    const allProvinces = await getProvinces(department.id);
    allProvinces.data.map(province => {
      province.title = province.description;
      province.value = '';
      province.subtitle = '';
      setProvinces(prev => [...prev, province]);
    });
  }, []);

  const selectProvince = useCallback((province: any) => {
    setSelectedProvince({province});
  }, []);

  const handleRCode = useCallback((rCode: string) => {
    const code = rCode.replace(/[^0-9]/g, '');

    if (code.length > 0) {
      if (code.length !== 8) {
        setRCodeValidation({
          error: true,
          errorMessage: 'El código debe tener 8 dígitos',
        });
      } else {
        if (['11111111', '00000000'].includes(code)) {
          setRCodeValidation({
            error: true,
            errorMessage: 'Ingrese un código válido',
          });
        } else {
          setRCodeValidation({
            error: false,
            errorMessage: '',
          });
        }
      }
    } else {
      setRCodeValidation({
        error: false,
        errorMessage: '',
      });
    }

    setRecommendationCode(code);
  }, []);

  const handleChooseAccount = async (type: AccountType) => {
    setDisableITem(true);
    try {
      const isAllow = await EvaluateEntrepreneurAccount({
        documentType: user?.person.documentTypeId,
        documentNumber: user?.person.documentNumber,
        screen: route?.name,
      });
      if (isAllow.isSuccess && isAllow.data) {
        setAccountType(type);
        setStep(prev => (prev += 1));
        setClientUId(isAllow.data.clientUId);
      } else if (!isAllow.isSuccess && isAllow.isWarning) {
        setShowMainAlert({
          isOpen: true,
          button: isAllow.data.button,
          content: isAllow.data.content,
          title: isAllow.data.title,
          action: () => {
            navigation.navigate('MainTab', {
              screen: 'Main',
            });
          },
        });
      }
    } catch (error) {
      setShowMainAlert({
        isOpen: true,
        title: '¡Uy, ocurrió un problema!',
        content:
          'Por favor, vuelve a intentarlo en unos minutos. Si persiste contáctanos al (01) 313 5000.',
        button: 'Entendido',
        action: () => {
          navigation.navigate('MainTab', {
            screen: 'Main',
          });
        },
      });
    } finally {
      setTimeout(() => {
        setDisableITem(false);
      }, 1500);
    }
  };

  const handleContinue = async () => {
    if (
      lastUser.hasActiveToken === false ||
      lastUser.tokenIsInCurrentDevice === false ||
      !token
    ) {
      navigation.navigate('InfoActivateToken');
    } else {
      if (lastTokenUsedOpening === storeOTP.getOtpState().currentToken) {
        setTokenModalOpening(true);
        return;
      }
      setLoadingButton(true);
      try {
        await listDepartments();
        setStep(prev => (prev += 1));
        setTerm1(false);
        setTerm2(false);
        setSelectedDepartment({});
        setSelectedProvince({});
        setRecommendationCode('');
        setRCodeValidation({error: false, errorMessage: ''});
      } catch (error) {
        setShowMainAlert({
          isOpen: true,
          title: '¡Uy, ocurrió un problema!',
          content:
            'Por favor, vuelve a intentarlo en unos minutos. Si persiste contáctanos al (01) 313 5000.',
          button: 'Entendido',
          action: () => {
            navigation.navigate('MainTab', {
              screen: 'Main',
            });
          },
        });
      } finally {
        setLoadingButton(false);
      }
    }
  };

  const handleTerm1 = () => setTerm1(!term1);
  const handleTerm2 = () => setTerm2(!term2);
  const disable = useMemo(
    () =>
      step > 1 &&
      (!term1 ||
        !term2 ||
        Object.keys(selectedDepartment).length === 0 ||
        Object.keys(selectedProvince).length === 0 ||
        rCodeValidation.error),
    [selectedDepartment, selectedProvince, step, term1, term2, rCodeValidation],
  );

  const updateUserSavings = useCallback(async () => {
    await getUserSavings().then((res: any) => setUserSavings(res));
    setUserEntrepreneurAccount({
      isCreated: true,
    });
  }, [setUserSavings, setUserEntrepreneurAccount]);

  const handleOpenAccount = async () => {
    setLoading(true);
    try {
      if (
        lastTokenUsed === storeOTP.getOtpState().currentToken &&
        userInteroperabilityInfo === null
      ) {
        setTokenModalAffiliation(true);
        return;
      }

      const response = await OpenEntrepreneurAccount({
        payload: {
          clientUId,
          productUIdTypeOperation:
            accountType === 'entrepreneur'
              ? getRemoteValue('saving_opening_app_product').asString()
              : getRemoteValue('saving_opening_app_product_wow').asString(),
          provinceId: selectedProvince.province.id,
          departmentId: selectedDepartment.department.id,
          ipAddress: await getIpAddress(),
          deviceOs: Platform.OS,
          recommendationCode: recommendationCode,
        },
        documentType: user?.person.documentTypeId,
        documentNumber: user?.person.documentNumber,
        screen: route.name,
      });

      if (response.isSuccess) {
        setLastTokenUsedOpening(storeOTP.getOtpState().currentToken!);
        if (userInteroperabilityInfo === null) {
          setLastTokenUsed(storeOTP.getOtpState().currentToken!);
        }
        const data = response.data;
        await updateUserSavings();
        setSuccessModal({
          isOpen: true,
          data: {
            email: data.email,
            accountSavingName: data.accountSavingName,
            accountSaving: data.accountSaving,
            cci: data.cci,
            datetime: `${data.dateFormatted} - ${data.hourFormatted}`,
            cellPhone: data.cellPhone,
            firstName: data.firstName,
          },
        });
      } else {
        setShowMainAlert({
          isOpen: true,
          title: response.data.title,
          content: response.data.content,
          button: response.data.button,
          action: () => {
            setShowMainAlert({
              isOpen: false,
              button: '',
              content: '',
              title: '',
              action: () => {
                setShowMainAlert({
                  isOpen: false,
                  button: '',
                  content: '',
                  title: '',
                  action: () => {},
                });
              },
            });
          },
        });
      }
    } catch (error) {
      setShowMainAlert({
        isOpen: true,
        title: '¡Uy, ocurrió un problema!',
        content:
          'Por favor, vuelve a intentarlo en unos minutos. Si persiste contáctanos al (01) 313 5000.',
        button: 'Entendido',
        action: () => {
          setShowMainAlert({
            isOpen: false,
            button: '',
            content: '',
            title: '',
            action: () => {},
          });
        },
      });
    } finally {
      setLoading(false);
      setTerm1(false);
      setTerm2(false);
      setSelectedDepartment({});
      setSelectedProvince({});
      setRecommendationCode('');
      setRCodeValidation({error: false, errorMessage: ''});
    }
  };

  const closeSuccessModal = async (screenName: string) => {
    if (screenName === 'Main') {
      setLoadingActionButton2(true);
    } else {
      setLoadingActionButton1(true);
    }
    try {
      const userInteropInfo = await getInteroperabilityInfo({
        user: `0${person?.documentTypeId}${person?.documentNumber}`,
        screen: route.name,
      });
      if (userInteropInfo.isSuccess === true) {
        Object.keys(userInteropInfo?.data ?? {}).length !== 0 &&
          setUserInteroperabilityInfo(
            userInteropInfo.data as IInteroperabilityInfo,
          );
      } else {
        setUserInteroperabilityInfo(null);
      }
    } catch (error) {
      throw new Error(`${error.message}`);
    } finally {
      navigation.navigate('MainTab', {
        screen: screenName,
      });
    }
  };

  return {
    step,
    accountType,
    loading,
    departments,
    provinces,
    selectedDepartment,
    selectedProvince,
    recommendationCode,
    rCodeValidation,
    term1,
    term2,
    disable,
    disableITem,
    successModal,
    showMainAlert,
    loadingButton,
    loadingActionButton1,
    loadingActionButton2,
    formatedTimeToken,
    tokenModalOpening,
    tokenModalAffiliation,
    goBack,
    handleChooseAccount,
    selectDepartment,
    selectProvince,
    handleRCode,
    handleTerm1,
    handleTerm2,
    handleContinue,
    handleOpenAccount,
    closeSuccessModal,
  };
};
