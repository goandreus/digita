import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Colors} from '@theme/colors';
import TextCustom from '@atoms/TextCustom';
import Separator from '@atoms/Separator';
import ImpactTemplate from '@templates/ImpactTemplate';

const LoadingScreen = () => {
  return (
    <ImpactTemplate>
      <ActivityIndicator size="large" color={Colors.White} />
      <Separator type="medium" />
      <TextCustom text="Iniciando sesión" variation="h0" color={Colors.White} />
    </ImpactTemplate>
  );
};

export default LoadingScreen;
