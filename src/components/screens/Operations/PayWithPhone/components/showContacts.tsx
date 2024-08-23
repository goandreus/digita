import React from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import {SIZES} from '@theme/metrics';
import {Dimensions, Keyboard, SectionList} from 'react-native';
import {ContactItem, UserContact} from './contactItem';
import {NewContactItem} from './newContactItem';
import {LoadingBasic} from '@molecules/extra/LoadingBasic';

interface Props {
  filteredUserContacts: {title: string; data: UserContact[]}[];
  isNewNumber: string | null;
  isDisabled: boolean;
  getCustomersList: (contact: UserContact | string) => {};
}

export const ShowContacts = ({
  filteredUserContacts,
  isNewNumber,
  isDisabled,
  getCustomersList,
}: Props) => {
  return (
    <>
      {filteredUserContacts[1].data.length > 0 ? (
        <>
          {!isNewNumber ? (
            !isDisabled ? (
              <SectionList
                onScroll={() => Keyboard.dismiss()}
                stickyHeaderHiddenOnScroll={true}
                style={{height: Dimensions.get('window').height - 350}}
                sections={filteredUserContacts}
                stickySectionHeadersEnabled={false}
                renderItem={({item}) => (
                  <>
                    <Separator size={SIZES.XXS} />
                    <ContactItem
                      isDisabled={isDisabled}
                      contact={item}
                      getCustomersList={getCustomersList}
                    />
                  </>
                )}
                renderSectionHeader={({section: {title}}) =>
                  title ? (
                    <TextCustom
                      color="neutral-darkest"
                      variation={title === 'Recientes' ? 'c1' : 'h0'}
                      weight="normal"
                      size={18}
                      text={title}
                    />
                  ) : null
                }
                renderSectionFooter={({section: {title}}) =>
                  title === 'Recientes' ? <Separator size={SIZES.LG} /> : null
                }
                keyExtractor={(item, index) => item.recordID + index}
              />
            ) : (
              <LoadingBasic />
            )
          ) : (
            <NewContactItem
              isDisabled={isDisabled}
              newNumber={isNewNumber}
              getCustomersList={getCustomersList}
            />
          )}
        </>
      ) : isNewNumber ? (
        <>
          <TextCustom
            color="neutral-darkest"
            variation="h0"
            weight="normal"
            size={18}
            text="Contactos"
          />
          <Separator size={SIZES.XS} />
          {!isDisabled ? (
            <NewContactItem
              isDisabled={isDisabled}
              newNumber={isNewNumber}
              getCustomersList={getCustomersList}
            />
          ) : (
            <LoadingBasic />
          )}
        </>
      ) : null}
    </>
  );
};
