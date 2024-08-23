import {useState} from 'react';
import {Keyboard} from 'react-native';
import {
  DestinationListInterface,
  IDataError,
  getContactData,
  getCustomers,
} from '@services/Interoperability';
import {useNavigation, useRoute} from '@react-navigation/native';
import _ from 'lodash';
import {UserContact} from '../components/contactItem';
import {interopSchedule} from '@utils/interopSchedule';
import {useLoading, useUserInfo} from '@hooks/common';

type steps = 'show_wallet' | 'show_contacts';

export const usePayWithPhone = () => {
  const [destinationList, setDestinationList] = useState<
    Array<DestinationListInterface>
  >([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [step, setStep] = useState<steps>('show_contacts');
  const [contactSelected, setContactSelected] = useState<UserContact | string>(
    {},
  );
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const navigation = useNavigation();
  const {setTargetScreen} = useLoading();
  const route = useRoute();
  const {user} = useUserInfo();
  const person = user?.person;

  const formatData = (wallets: DestinationListInterface[]) => {
    const newData = wallets.map(wallet => {
      return {
        ...wallet,
        destinationName: _.startCase(wallet.destinationName.toLowerCase()),
      };
    });
    return newData;
  };

  const handleGoToTransfer = () => {
    setTargetScreen({screen: 'Transfers', from: 'Operations'});
    navigation.navigate('MainOperations', {
      screen: 'Transfers',
      params: {from: 'PayWithPhone'},
    });
  }

  const getCustomersList = async (contact: UserContact | string) => {
    const phoneNumber =
      typeof contact === 'string' ? contact : contact.phoneNumber;
    const formatedPhoneNumber = phoneNumber
      .replace(/(\d{3})(?=\d)/g, '$1 ')
      .replace(/\D/g, '');

    if (!interopSchedule().visibilityModal) {
      setIsFetching(true);
      Keyboard.dismiss();

      try {
        const customersList = await getCustomers({
          phoneNumber: formatedPhoneNumber,
          user: `0${person?.documentTypeId}${person?.documentNumber}`,
          screen: route.name,
        });

        if (customersList.isSuccess) {
          setDestinationList(formatData(customersList.data?.destinationList));
          setStep('show_wallet');
          setContactSelected(contact);
        } else {
          const {title, content, button, button2} = customersList.data as IDataError;
          const descriptionArray = content?.split('<b>').filter(i => i.length > 0);
          navigation.setParams({
            disablePhoneAlert: {
              isOpen: true,
              title,
              content: descriptionArray,
              button,
              button2,
              errorCode: customersList.errorCode,
            },
          });
        }
      } catch (error) {
        navigation.setParams({
          disablePhoneAlert: {
            isOpen: true,
            title: '¡Uy, ocurrió un problema!',
            content:
              ['Estamos trabajando para solucionarlo. Si persiste contáctanos al (01) 313 5000.'],
            button: 'Aceptar',
          },
        });
      } finally {
        setIsFetching(false);
      }
    } else {
      setShowScheduleModal(true);
    }
  };

  const getContactInfo = async (
    destinationBankCode: string,
    destinationName: string,
    destinationCellPhone: number,
    isCheckTermsAndConditions?: boolean,
    movementAmount?: number,
  ) => {
    if (!interopSchedule().visibilityModal) {
      try {
        setIsFetching(true);
        const contactData = await getContactData({
          payload: {
            destinationBankCode,
            destinationCellPhone: `${destinationCellPhone}`,
            isCheckTermsAndConditions: isCheckTermsAndConditions ?? false,
            movementAmount: movementAmount ?? 1,
            movementCurrency: 1,
          },
          user: `0${person?.documentTypeId}${person?.documentNumber}`,
          screen: route.name,
        });
        if (contactData.isSuccess) {
          navigation.navigate('OperationsStack', {
            screen: 'PayWithPhoneForm',
            params: {
              data: contactData.data,
              destinationData: {
                destinationBankCode,
                destinationName,
                destinationCellPhone,
              },
              contactSelected,
            },
          });
        } else {
          const {title, content, button, button2} = contactData.data as IDataError;
          const descriptionArray = content?.split('<b>').filter(i => i.length > 0);
          navigation.setParams({
            disablePhoneAlert: {
              isOpen: true,
              title,
              content: descriptionArray,
              button,
              button2,
              errorCode: contactData.errorCode,
            },
          });
        }
        setIsFetching(false);
      } catch (error) {
        navigation.setParams({
          disablePhoneAlert: {
            isOpen: true,
            title: '¡Uy, ocurrió un problema!',
            content:
              ['Estamos trabajando para solucionarlo. Si persiste contáctanos al (01) 313 5000.'],
            button: 'Aceptar',
          },
        });
      } finally {
        setIsFetching(false);
      }
    } else {
      setShowScheduleModal(true);
    }
  };

  return {
    step,
    setStep,
    contactSelected,
    destinationList,
    isFetching,
    showScheduleModal,
    setShowScheduleModal,
    getCustomersList,
    getContactInfo,
    handleGoToTransfer,
  };
};
