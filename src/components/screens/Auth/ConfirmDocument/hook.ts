import {Platform} from 'react-native';
import {useEffect, useLayoutEffect, useState} from 'react';
import Clipboard from '@react-native-community/clipboard';
import {CommonActions} from '@react-navigation/native';
import {
  evaluateMatchingDocument,
  evaluateMatchingDocumentSidesScore,
  evaluateMatchingSideScore,
  saveInStorage,
} from '@services/User';
import {sanitizeBase64} from '@helpers/ImageHelper';
import {ConfirmDocumentScreenProps} from '@navigations/types';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';

interface IModalBeforeRemove {
  open: boolean;
  onRequestCloseScreen?: () => void;
}

export const useConfirmDocument = ({
  navigation,
  route,
}: ConfirmDocumentScreenProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {documentScanned, flowType, documentNumber, documentType} =
    route.params;

  const [modalBeforeRemove, setModalBeforeRemove] =
    useState<IModalBeforeRemove>({
      open: false,
    });

  const handleOnSubmit = async () => {
    try {
      setIsLoading(true);

      const res = await evaluateMatchingDocumentSidesScore({
        matchingSidesScore: documentScanned.matchingSidesScore,
        dateOfBirth: documentScanned.documentData.dateOfBirth,
        dateOfExpiry: documentScanned.documentData.dateOfExpiry,
        documentNumber: documentScanned.documentData.documentNumber,
        documentCaptured: documentScanned.documentCaptured
      },
        'ConfirmDocumentScreen-index.tsx',
        { documentNumber, documentType },
        flowType
      );

      if (res.isSuccess === true) {
        saveInStorage(
          { documentNumber, documentType },
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
        AH.track("CF App - Validación - Finalización", {
          'Método de Validación': AH.autoGenerate('Método de Validación'),
          'Proceso Consultado': AH.autoGenerate('Proceso Consultado'),
        });
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
      else {
        if (res.error !== undefined) {
          if (res.error.type === 'LIMIT_ATTEMPTS') {
            navigation.navigate('InfoDNINotRecognizedMaxAttempt');
          }
          else if (res.error.type === 'OTHER') {
            navigation.navigate('InfoScanError', {
              scanType: 'DOI',
              title: res.error.title,
            });
          }
          else throw new Error('Ocurrió un error desconocido.');
        }
        else throw new Error('Ocurrió un error desconocido.');
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };



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

  return {
    isLoading,
    modalBeforeRemove,
    setModalBeforeRemove,
    handleOnSubmit,
  };
};
