import {useCallback, useMemo, useState} from 'react';
import {Platform} from 'react-native';
import {getDepartments, getProvinces} from '@services/Collections';
import {
  EvaluateEntrepreneurAccount,
  OpenEntrepreneurAccount,
} from '@services/EntrepreneurAccount';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Place, Places} from '../types';
import {useLastUser, useUserInfo} from '@hooks/common';
import {getIpAddress, getUserSavings} from '@services/User';
import {getRemoteValue} from '@utils/firebase';
import {
  IInteroperabilityInfo,
  getInteroperabilityInfo,
} from '@services/Interoperability';

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

export const useEntrepreneurAccount = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    user,
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
  const [departments, setDepartments] = useState<Places>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Place>({});
  const [provinces, setProvinces] = useState<Places>([]);
  const [selectedProvince, setSelectedProvince] = useState<Place>({});
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
    action:() => void;
  }>({
    isOpen: false,
    button: '',
    content: '',
    title: '',
    action: () => {},
  });

  const {lastUser} = useLastUser();
  const token = lastUser.secret;
  const person = user?.person;

  const goBack = useCallback(() => {
    if (step !== 0) {
      setStep(0);
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

  const handleContinue = async () => {
    if (
      lastUser.hasActiveToken === false ||
      lastUser.tokenIsInCurrentDevice === false ||
      !token
    ) {
      navigation.navigate('InfoActivateToken');
    } else {
      setLoadingButton(true);
      try {
        const isAllow = await EvaluateEntrepreneurAccount({
          documentType: user?.person.documentTypeId,
          documentNumber: user?.person.documentNumber,
          screen: route?.name,
        });
        if (isAllow.isSuccess && isAllow.data) {
          await listDepartments();
          setStep(prev => (prev += 1));
          setTerm1(false);
          setTerm2(false);
          setSelectedDepartment({});
          setSelectedProvince({});
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
        setLoadingButton(false);
      }
    }
  };

  const handleTerm1 = () => setTerm1(!term1);
  const handleTerm2 = () => setTerm2(!term2);
  const disable = useMemo(
    () =>
      step > 0 &&
      (!term1 ||
        !term2 ||
        Object.keys(selectedDepartment).length === 0 ||
        Object.keys(selectedProvince).length === 0),
    [selectedDepartment, selectedProvince, step, term1, term2],
  );

  const updateUserSavings = useCallback(async () => {
    await getUserSavings().then(res => setUserSavings(res));
    setUserEntrepreneurAccount({
      isCreated: true,
    });
  }, [setUserSavings, setUserEntrepreneurAccount]);

  const handleOpenEntrepreneurAccount = async () => {
    setLoading(true);
    try {
      const response = await OpenEntrepreneurAccount({
        payload: {
          clientUId,
          productUIdTypeOperation: getRemoteValue(
            'saving_opening_app_product',
          ).asString(),
          provinceId: selectedProvince.province.id,
          departmentId: selectedDepartment.department.id,
          ipAddress: await getIpAddress(),
          deviceOs: Platform.OS,
        },
        documentType: user?.person.documentTypeId,
        documentNumber: user?.person.documentNumber,
        screen: route.name,
      });

      if (response.isSuccess) {
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
    goBack,
    step,
    loading,
    departments,
    provinces,
    selectedDepartment,
    selectedProvince,
    term1,
    term2,
    disable,
    successModal,
    showMainAlert,
    loadingButton,
    loadingActionButton1,
    loadingActionButton2,
    selectDepartment,
    selectProvince,
    handleTerm1,
    handleTerm2,
    handleContinue,
    handleOpenEntrepreneurAccount,
    closeSuccessModal,
  };
};
