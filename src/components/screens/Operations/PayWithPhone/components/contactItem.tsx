import React from 'react';
import {Pressable, View} from 'react-native';
import BoxView from '@atoms/BoxView';
import {Contact} from 'react-native-contacts';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import Icon from '@atoms/Icon';
import {COLORS} from '@theme/colors';
import {styles} from '../styles';

export type UserContact = Omit<Contact, 'phoneNumbers'> & {phoneNumber: string};

export const ContactItem = ({
  contact,
  isDisabled,
  getCustomersList,
}: {
  contact: UserContact;
  isDisabled: boolean;
  getCustomersList: (userContact: UserContact) => {};
}) => {
  const contactName = `${contact.givenName ?? ''} ${contact.familyName ?? ''}`;
  const onlyPhoneNumbers = /^9\d*/g;
  const formatedPhoneNumber = contact.phoneNumber.replace(
    /(\d{3})(?=\d)/g,
    '$1 ',
  );

  return contact.givenName &&
    formatedPhoneNumber.match(onlyPhoneNumbers) &&
    contact?.phoneNumber?.length === 9 ? (
    <Pressable
      disabled={isDisabled}
      onPress={() => {
        isDisabled ? null : getCustomersList(contact);
      }}>
      <BoxView
        direction="row"
        align="center"
        justify="space-between"
        py={4}
        background="background-lightest">
        <View style={styles.contactIcon}>
          <TextCustom
            color="background-lightest"
            variation="h4"
            weight="normal"
            text={`${contact.givenName[0] ?? ''}${
              contact.familyName ? contact.familyName[0] : ''
            }`}
          />
        </View>
        <BoxView
          style={styles.contactWrapper}
          justify="space-between"
          flex={1}
          pb={16}
          direction="row">
          <BoxView style={styles.contactInfo}>
            <TextCustom
              color="neutral-darkest"
              variation="c1"
              size={16}
              numberOfLines={1}
              ellipsizeMode="tail"
              text={contactName}
            />
            <Separator size={2} />
            <TextCustom
              color="neutral-darkest"
              variation="c0"
              size={16}
              text={formatedPhoneNumber}
            />
          </BoxView>
          <Icon name="arrow-right-xs" size={30} fill={COLORS.Neutral.Medium} />
        </BoxView>
      </BoxView>
    </Pressable>
  ) : null;
};
