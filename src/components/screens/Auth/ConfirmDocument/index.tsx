import {ScrollView} from 'react-native';
import React from 'react';
import {ConfirmDocumentScreenProps} from '@navigations/types';
import {useConfirmDocument} from './hook';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import BasicMenuTemplate from '@templates/extra/BasicMenuTemplate';
import ImageBox from '@atoms/extra/ImageBox';
import Button from '@atoms/extra/Button';
import {CommonActions} from '@react-navigation/native';
import AlertBasic from '@molecules/extra/AlertBasic';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';

export const ConfirmDocumentScreen = ({
  navigation,
  route,
}: ConfirmDocumentScreenProps) => {
  const {flowType, documentScanned} = route.params;

  const getTitle = () => {
    switch (flowType) {
      case 'REGISTER':
        return 'Regístrate';
      case 'LOGIN':
        return 'Inicia sesión';
      case 'FORGOT_PASSWORD':
        return 'Olvidé mi clave';
    }
  };

  const {isLoading, modalBeforeRemove, setModalBeforeRemove, handleOnSubmit} =
    useConfirmDocument({
      navigation,
      route,
    });

  return (
    <>
      <BasicMenuTemplate
        headerTitle={getTitle()}
        goBack={() => navigation.goBack()}
        canGoBack={navigation.canGoBack()}>
        <ScrollView>
          <Separator type="medium" />
          <TextCustom
            align="center"
            variation="h2"
            lineHeight="tight"
            color="primary-medium"
            weight="normal">
            Imágenes capturadas
          </TextCustom>
          <Separator type="medium" />
          <ImageBox
            images={[
              {
                source: {
                  uri:
                    'data:image/jpeg;base64,' +
                    documentScanned.frontDocumentImage,
                },
                width: 672,
                height: 424,
                id: 'front',
              },
              {
                source: {
                  uri:
                    'data:image/jpeg;base64,' +
                    documentScanned.backDocumentImage,
                },
                width: 672,
                height: 424,
                id: 'back',
              },
            ]}
          />

          <Separator type="large" />
          <Button
            onPress={handleOnSubmit}
            loading={isLoading}
            orientation="horizontal"
            type="primary"
            text="Continuar"
          />
          <Separator type="small" />
          <Button
            onPress={() => {
              AH.track("CF App - Clic en Botones", {
                'Nombre de la Vista': AH.autoGenerate('Nombre de la Vista'),
                'Nombre del Botón': "Volver a capturar",
                'Proceso Consultado': AH.autoGenerate('Proceso Consultado'),
              });
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'ScanDocument',
                  merge: true,
                }),
              );
            }}
            orientation="horizontal"
            haveBorder
            type="primary-inverted"
            text="Volver a capturar"
          />
          <Separator type="x-large" />
          <Separator type="large" />
        </ScrollView>
      </BasicMenuTemplate>

      {/* Back Modal */}

      <AlertBasic
        statusBarTranslucent
        isOpen={modalBeforeRemove.open}
        onClose={() => {}}
        title="¿Seguro que quieres salir?"
        description="Aún no has completado el proceso, si sales perderás tu avance y deberás de empezar de nuevo"
        actions={utils => [
          {
            id: 'button1',
            render: (
              <Button
                text="No salir"
                type="primary"
                onPress={() => {
                  utils.close();
                  setModalBeforeRemove({open: false});
                }}
              />
            ),
          },
          {
            id: 'button2',
            render: (
              <Button
                text="Salir sin enviar"
                type="primary-inverted"
                haveBorder={true}
                onPress={() => {
                  if (
                    modalBeforeRemove.open === true &&
                    modalBeforeRemove.onRequestCloseScreen !== undefined
                  ) {
                    modalBeforeRemove.onRequestCloseScreen();
                  } else {
                    utils.close();
                  }
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
};
