import {useCallback, useEffect, useMemo, useState} from 'react';
import {Keyboard} from 'react-native';
import Contacts, {Contact} from 'react-native-contacts';
import {UserContact} from '../components/contactItem';
import useForm from '@hooks/useForm';
import recentContacts from '@features/recentContacts';

const formatContacts = (contacts: Contact[]) => {
  const labelsTypes = ['móvil', 'other', 'otro', 'celular', 'mobile'];
  const allContacts: any = [];
  for (const contact of contacts) {
    if (contact.phoneNumbers) {
      let defPhoneNumber;
      for (const phone of contact.phoneNumbers) {
        if (phone.number.replace(/\D/g, '') !== defPhoneNumber) {
          if (
            labelsTypes.includes(phone.label?.toLocaleLowerCase()) &&
            phone.number
          ) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {phoneNumbers, ...rest} = contact;
            allContacts.push({
              ...rest,
              phoneNumber: phone.number.replace(/^\+\d{2}\s*/, ''),
            });
          }
        }
        if (!defPhoneNumber) {
          defPhoneNumber = phone.number.replace(/\D/g, '');
        }
      }
    }
  }
  return allContacts.sort((a: UserContact, b: UserContact) => {
    return a.givenName.localeCompare(b.givenName, undefined, {
      sensitivity: 'base',
    });
  });
};

export const useContacts = ({
  contactsAccessPermission,
}: {
  contactsAccessPermission: boolean;
}) => {
  const [userContacts, setUserContacts] = useState<UserContact[]>([]);
  const [isNewNumber, setIsNewNumber] = useState<string | null>(null);

  const getUserContacts = useCallback(async () => {
    if (contactsAccessPermission) {
      Contacts.getAllWithoutPhotos()
        .then(phoneContacts => {
          const allContacts = formatContacts(phoneContacts);
          setUserContacts(allContacts);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [contactsAccessPermission]);

  useEffect(() => {
    getUserContacts();
  }, [getUserContacts]);

  const allUserContacts = useMemo(() => {
    const recentUserContacts = recentContacts.getAll();

    return [
      {
        title: recentUserContacts.length > 0 ? 'Recientes' : '',
        data: recentUserContacts,
      },
      {
        title: userContacts.length > 0 ? 'Contactos' : '',
        data: userContacts.map(contact => ({
          ...contact,
          phoneNumber: contact.phoneNumber.replace(/\D/g, ''),
        })),
      },
    ];
  }, [userContacts]);

  const [filteredUserContacts, setFilteredUserContacts] =
    useState<any>(allUserContacts);

  const {
    values: valuesInitialForm,
    clear: clearInitialForm,
    ...initialForm
  } = useForm({
    initialValues: {
      searchContact: '',
    },
  });

  const contactsFilter = () => {
    const filteredContact = [
      valuesInitialForm.searchContact === ''
        ? allUserContacts[0]
        : {
            title: '',
            data: [],
          },
      valuesInitialForm.searchContact === ''
        ? allUserContacts[1]
        : {
            title: 'Contactos',
            data: allUserContacts[1].data.filter((contact: UserContact) =>
              valuesInitialForm.searchContact !== ''
                ? contact.phoneNumber.startsWith(
                    valuesInitialForm.searchContact,
                  ) ||
                  `${contact.givenName} ${contact.familyName}`
                    .toLowerCase()
                    .includes(
                      valuesInitialForm.searchContact.toLocaleLowerCase(),
                    )
                : true,
            ),
          },
    ];

    const onlyDigits = /^\d+$/;

    const newNumber =
      filteredContact[1].data.length <= 0 &&
      /^9\d{8}$/.test(valuesInitialForm.searchContact)
        ? valuesInitialForm.searchContact
        : null;

    setFilteredUserContacts(filteredContact);
    newNumber ? setIsNewNumber(newNumber) : setIsNewNumber(null);

    if (
      newNumber ||
      (onlyDigits.test(valuesInitialForm.searchContact) &&
        valuesInitialForm.searchContact.length === 9 &&
        filteredContact.length !== 0)
    ) {
      Keyboard.dismiss();
    }
  };

  useEffect(() => {
    contactsFilter();
  }, [userContacts, valuesInitialForm]);

  return {
    userContacts,
    filteredUserContacts,
    isNewNumber,
    initialForm: {
      values: valuesInitialForm,
      form: initialForm,
      clear: clearInitialForm,
    },
  };
};
