import React from 'react';
import {SetInteroperabilitySreenProps} from '@navigations/types';
import TransfersTemplate from '@templates/extra/TransfersTemplate';
import BoxView from '@atoms/BoxView';


export const SetInteroperability = ({navigation, route}: SetInteroperabilitySreenProps) => {

  return (
    <>
      <TransfersTemplate
        headerTitle="Configurar Interoperabilidad"
        title="Configuración"
        goBack={() => navigation.pop()}
        canGoBack={navigation.canGoBack()}
        >
        <BoxView>
         
        </BoxView>
      </TransfersTemplate>
    </>
  );
};
