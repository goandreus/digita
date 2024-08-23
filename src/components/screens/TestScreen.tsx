import Button from '@atoms/Button';
import ModalBottom from '@atoms/ModalBottom';
import ModalInfo from '@atoms/ModalInfo';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import ComplexButton from '@molecules/ComplexButton';
import InputIcon from '@molecules/InputIcon';
import Toggle from '@molecules/Toggle';
import GenericTemplate from '@templates/extra/GenericTemplate';
import {Colors} from '@theme/colors';
import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StatusBar, Text, View} from 'react-native';

const TestScreen = ({navigation}: any) => {

  return (
    <>
      <GenericTemplate
        headerTitle="Paga con tu celular"
        title="¿A quién pagarás?"
        goBack={() => {
          navigation.pop();
        }}
        canGoBack={navigation.canGoBack()}>
        <Separator type="medium" />
        <TextCustom
          color="neutral-darkest"
          variation="h0"
          weight="normal"
          size={18}
          text="Contactos"
        />
      </GenericTemplate>
    </>
  );
};

export default TestScreen;
