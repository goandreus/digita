import React, {useEffect, useLayoutEffect} from 'react';
import ImpactTemplate from '@templates/ImpactTemplate';
import TextCustom from '@atoms/TextCustom';
import Separator from '@atoms/Separator';
import Icon from '@atoms/Icon';
import {InfoRegisterSuccessScreenProps} from '@navigations/types';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';

const InfoRegisterSuccess = ({
  navigation,
  route,
}: InfoRegisterSuccessScreenProps) => {
  const {title, description} = route.params;
  useEffect(() => {
    const id = setTimeout(() => {
      AH.track("CF App - Crear Clave Digital", {
        'Número de Documento': AH.autoGenerate('Número de Documento'),
        'Afiliación Banca Digital': AH.autoGenerate("Afiliación Banca Digital"),
        'Proceso Consultado': AH.autoGenerate("Proceso Consultado"),
        'Sesión Rápida': AH.autoGenerate("Sesión Rápida"),
        'Etapa': "Fin",
      });
      navigation.reset({
        index: 1,
        routes: [{name: 'Home'}, {name: 'Login'}],
      });
    }, 3200);

    return () => clearTimeout(id);
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK') e.preventDefault();
    });
    return () => unsubscribe();
  }, [navigation]);

  return (
    <ImpactTemplate>
      <Icon name="check-on" size="x-large" fill="white" />
      <Separator type="small" />
      <TextCustom variation="h0" color="white" align="center">
        {title}
      </TextCustom>
      <Separator type="medium" />
      <TextCustom variation="p" color="white" weight="bold" align="center">
        {description}
      </TextCustom>
    </ImpactTemplate>
  );
};

export default InfoRegisterSuccess;
