import React from 'react';
import GenericTemplate from '@templates/extra/GenericTemplate';
import {PayWithPhoneSreenProps} from '@navigations/types';
import {useContacts} from './hooks/useContacts';
import ModalIcon from '@molecules/ModalIcon';
import Button from '@atoms/extra/Button';
import AlertBasic from '@molecules/extra/AlertBasic';
import {usePayWithPhone} from './hooks/usePayWithPhone';
import {SearchContact} from './components/searchContact';
import {ShowContacts} from './components/showContacts';
import {ShowDigitalWallets} from './components/showDigitalWallets';
import {InteropScheduleModal} from '@molecules/extra/InteropScheduleModal';
import TextCustom from '@atoms/extra/TextCustom';

export const PayWithPhone = ({navigation, route}: PayWithPhoneSreenProps) => {
  const {
    showTokenIsActivated,
    contactsAccessPermission,
    disablePhoneAlert,
    from,
  } = route?.params;
  const {isOpen, title, content, button, button2, errorCode} =
    disablePhoneAlert;
  const {filteredUserContacts, isNewNumber, initialForm} = useContacts({
    contactsAccessPermission,
  });
  const {
    step,
    setStep,
    destinationList,
    getCustomersList,
    getContactInfo,
    contactSelected,
    showScheduleModal,
    setShowScheduleModal,
    handleGoToTransfer,
    isFetching: isDisabled,
  } = usePayWithPhone();

  const {form, clear} = initialForm;

  return (
    <>
      {/* Modals */}
      <ModalIcon
        type="SUCCESS"
        message="Token Digital activado"
        open={showTokenIsActivated}
        onRequestClose={() => {}}
        actions={
          <>
            <Button
              onPress={() => {
                navigation.setParams({
                  showTokenIsActivated: false,
                });
              }}
              orientation="horizontal"
              type="primary"
              text="Aceptar"
            />
          </>
        }
      />
      <AlertBasic
        statusBarTranslucent
        isOpen={isOpen}
        onClose={() => {}}
        title={title}
        body={
          content &&
          content?.map((text, i) =>
            !text.startsWith('§') ? (
              <TextCustom
                key={`${text}${i}`}
                color="neutral-darkest"
                align="center"
                lineHeight="comfy"
                variation="p4"
                text={text}
              />
            ) : (
              <TextCustom
                key={`${text}${i}`}
                variation="p4"
                align="center"
                lineHeight="comfy"
                color="neutral-darkest"
                weight="bold"
                text={text.slice(1)}
              />
            ),
          )
        }
        actions={() => {
          let actionsArray = [
            {
              id: 'button1',
              render: (
                <Button
                  text={button}
                  type="primary"
                  onPress={() => {
                    if (errorCode === '-1') {
                      navigation.navigate('MainTab', {
                        screen: 'Main',
                      });
                    } else {
                      navigation.setParams({
                        disablePhoneAlert: {
                          isOpen: false,
                          title: '',
                          content: [],
                          button: '',
                        },
                      });
                    }
                  }}
                />
              ),
            },
          ];
          button2 &&
            actionsArray.push({
              id: 'button2',
              render: (
                <Button
                  text={button2}
                  type="primary-inverted"
                  haveBorder={true}
                  onPress={handleGoToTransfer}
                />
              ),
            });
          return actionsArray;
        }}
      />

      <GenericTemplate
        headerTitle="Paga con tu celular"
        title="¿A quién pagarás?"
        stepLabel="Al instante"
        hasPadding
        searchContacts={step === 'show_contacts'}
        list={
          step === 'show_contacts' ? (
            <ShowContacts
              filteredUserContacts={filteredUserContacts}
              isNewNumber={isNewNumber}
              isDisabled={isDisabled}
              getCustomersList={getCustomersList}
            />
          ) : null
        }
        goBack={() => {
          if (step === 'show_wallet') {
            clear();
            setStep('show_contacts');
          } else if (from === 'affiliatePhone') {
            navigation.navigate('MainTab', {
              screen: 'Main',
            });
          } else {
            navigation.pop();
          }
        }}
        isFlex
        scrollEnabled={step !== 'show_contacts'}
        canGoBack={navigation.canGoBack()}>
        {step === 'show_contacts' ? (
          <SearchContact form={form} />
        ) : (
          <ShowDigitalWallets
            destinationList={destinationList}
            getContactInfo={getContactInfo}
            contactSelected={contactSelected}
            isDisabled={isDisabled}
          />
        )}
      </GenericTemplate>

      {showScheduleModal ? (
        <InteropScheduleModal
          showScheduleModal={showScheduleModal}
          closeScheduleModal={() => {
            setShowScheduleModal(false);
            navigation.navigate('MainScreen');
          }}
        />
      ) : null}
    </>
  );
};
