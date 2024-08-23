import Button from '@atoms/Button';
import ImageBox from '@atoms/ImageBox';
import ModalInfo from '@atoms/ModalInfo';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import HeaderBackButton from '@molecules/HeaderBackButton';
import {ConfirmDocumentScreenProps} from '@navigations/types';
import {CommonActions} from '@react-navigation/native';
import {
  evaluateMatchingDocument,
  evaluateMatchingSideScore,
  saveInStorage,
} from '@services/User';
import InfoTemplate from '@templates/InfoTemplate';
import {Colors} from '@theme/colors';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, Platform, StyleSheet, Text, View} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {sanitizeBase64} from '@helpers/ImageHelper';

const ConfirmDocumentScreen = ({
  navigation,
  route,
}: ConfirmDocumentScreenProps) => {
  const styles = getStyles();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {documentScanned, flowType, documentNumber, documentType} =
    route.params;

  const [modalBeforeRemove, setModalBeforeRemove] = useState<{
    open: boolean;
    onRequestCloseScreen?: () => void;
  }>({
    open: false,
  });



  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
        setModalBeforeRemove({
          open: true,
          onRequestCloseScreen: () =>
            navigation.dispatch(
              CommonActions.navigate({
                name: 'RegisterIdentityInfo',
                merge: true,
              }),
            ),
        });
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  const handleOnSubmit = async () => {
    try {
      setIsLoading(true);

      const evaluateMatchingDocumentResult = await evaluateMatchingDocument(
        documentScanned.documentData,
        'ConfirmDocumentScreen-index.tsx',
        {documentNumber, documentType},
        flowType,
      );

      if (evaluateMatchingDocumentResult.isSuccess === false)
        if (evaluateMatchingDocumentResult.error !== undefined)
          switch (evaluateMatchingDocumentResult.error.type) {
            case 'LIMIT_ATTEMPTS':
              navigation.navigate('InfoDNINotRecognizedMaxAttempt');
              break;
            case 'OTHER':
              navigation.navigate('InfoScanError', {
                scanType: 'DOI',
                title: evaluateMatchingDocumentResult.error.title,
              });
              break;
            case 'UNKNOWN':
              throw new Error('Ocurrió un error desconocido.');
              break;
          }
        else throw new Error('Ocurrió un error desconocido.');
      else {
        const evaluateMatchingSideScoreResult = await evaluateMatchingSideScore(
          documentScanned.matchingSidesScore,
          'ConfirmDocumentScreen-index.tsx',
          documentScanned.documentCaptured,
          {documentNumber, documentType},
          flowType,
        );

        if (evaluateMatchingSideScoreResult.isSuccess === false)
          if (evaluateMatchingSideScoreResult.error !== undefined)
            switch (evaluateMatchingSideScoreResult.error.type) {
              case 'LIMIT_ATTEMPTS':
                navigation.navigate('InfoDNINotRecognizedMaxAttempt');
                break;
              case 'OTHER':
                navigation.navigate('InfoScanError', {
                  scanType: 'DOI',
                  title: evaluateMatchingSideScoreResult.error.title,
                });
                break;
              case 'UNKNOWN':
                throw new Error('Ocurrió un error desconocido.');
                break;
            }
          else throw new Error('Ocurrió un error desconocido.');

        if (
          evaluateMatchingDocumentResult.isSuccess === true &&
          evaluateMatchingSideScoreResult.isSuccess === true
        ) {
          saveInStorage(
            {documentNumber, documentType},
            'matchingDocument,matchingSidesScore',
            [
              'data:image/jpeg;base64,' +
                sanitizeBase64(documentScanned.frontDocumentImage),
              'data:image/jpeg;base64,' +
                sanitizeBase64(documentScanned.backDocumentImage),
              'data:image/jpeg;base64,' +
                sanitizeBase64(documentScanned.faceImage),
            ],
          );

          navigation.dispatch(
            CommonActions.navigate({
              name: 'RegisterIdentityInfo',
              merge: true,
              params: {
                documentScanned,
              },
            }),
          );
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <InfoTemplate
        descriptionAbove={
          <>
            <TextCustom
              align="center"
              variation="h2"
              color={Colors.Paragraph}
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
          </>
        }
        footer={
          <>
            <Button
              containerStyle={styles.buttonFull}
              text="Enviar"
              type="primary"
              orientation="horizontal"
              loading={isLoading}
              onPress={handleOnSubmit}
            />
            <Separator type="medium" />
            <TextCustom
              variation="link"
              align="center"
              color={Colors.Paragraph}
              onPress={() => {
                navigation.dispatch(
                  CommonActions.navigate({
                    name: 'ScanDocument',
                    merge: true,
                  }),
                );
              }}>
              Intentar de nuevo
            </TextCustom>
          </>
        }></InfoTemplate>
      <ModalInfo
        title="¿Seguro que quieres salir?"
        message="Aún no has enviado las fotos de tu DNI, si sales perderás tu avance y deberás repetir el proceso."
        open={modalBeforeRemove.open}
        onRequestClose={() => {}}
        actions={
          <>
            <Button
              onPress={() => setModalBeforeRemove({open: false})}
              orientation="horizontal"
              type="primary"
              text="No salir"
            />
            <Separator type="medium" />
            <TextCustom
              style={styles.buttonLink}
              variation="link"
              align="center"
              color={Colors.Paragraph}
              onPress={() => {
                if (modalBeforeRemove.onRequestCloseScreen !== undefined)
                  modalBeforeRemove.onRequestCloseScreen();
              }}>
              Salir sin enviar
            </TextCustom>
          </>
        }
      />
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    buttonFull: {
      width: '100%',
    },
    buttonLink: {
      alignSelf: 'center',
    },
  });

  return stylesBase;
};

export default ConfirmDocumentScreen;
