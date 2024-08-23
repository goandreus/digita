import TextCustom from '@atoms/TextCustom';
import FormTemplate from '@templates/FormTemplate';
import {Colors} from '@theme/colors';
import React from 'react';
import {StatusBar, View} from 'react-native';
import SVGPhonePassword from '@assets/images/phonePassword.svg';
import Separator from '@atoms/Separator';
import Button from '@atoms/Button';
import {RegisterPasswordInfoScreenProps} from '@navigations/types';
import NotificationBox from '@molecules/NotificationBox';

const RegisterPasswordInfo = ({
  navigation,
  route,
}: RegisterPasswordInfoScreenProps) => {
  const {
    stage,
    stepProps,
    documentNumber,
    documentType,
    email,
    firstName,
    firstSurname,
    secondSurname,
    secondName,
  } = route.params;

  return (
    <>
      <FormTemplate title="Crea tu clave digital" stepsProps={stepProps}>
        <NotificationBox message="Elije una clave segura que puedas recordar" />
        <Separator size={48} />
        <SVGPhonePassword width="100%" />
        <Separator size={52} />
        <TextCustom variation="p" align="center">
          Úsalo cada vez que{' '}
          <TextCustom variation="p" weight="bold">
            Inicies sesión
          </TextCustom>{' '}
          en la{' '}
          <TextCustom variation="p" weight="bold">
            App de Compartamos Financiera
          </TextCustom>
        </TextCustom>
        <Separator size={48} />
        <Button
          orientation="horizontal"
          type="primary"
          text="Crear clave"
          onPress={() => {
            switch (stage) {
              case 'AGENCY':
                navigation.navigate('RegisterPassword', {
                  flowType: 'REGISTER',
                  showTerms: false,
                  stepProps,
                  documentNumber,
                  documentType,
                  email,
                  firstName,
                  firstSurname,
                  secondSurname,
                  secondName,
                });
                break;
              case 'ONBOARDING':
                navigation.navigate('RegisterPassword', {
                  flowType: 'REGISTER',
                  showTerms: true,
                  stepProps,
                  documentNumber,
                  documentType,
                  email,
                  firstName,
                  firstSurname,
                  secondSurname,
                  secondName,
                });
                break;
            }
          }}
        />
      </FormTemplate>
    </>
  );
};

export default RegisterPasswordInfo;
