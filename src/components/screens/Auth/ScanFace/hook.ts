
import ModalInfo from '@atoms/ModalInfo';
import {ScanFaceScreenProps} from '@navigations/types';
import {CommonActions} from '@react-navigation/native';
import {
  authenticateFacial,
  evaluatePassiveLiveness,
  saveInStorage,
} from '@services/User';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, NativeModules, Platform } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {CoreResult} from 'libs/sdk-core/src';
import {TokenManager} from '@managers/TokenManager';
import {sanitizeBase64} from '@helpers/ImageHelper';
import { getRemoteValue } from '@utils/firebase';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';

const {SdkMobileCore} = NativeModules;

export const useConfirmFace = ({navigation, route}: ScanFaceScreenProps) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    documentScanned,
    flowType,
    operationId,
    sessionId,
    documentNumber,
    documentType,
  } = route.params;


  //NOTA: Estado para controlar un modal q preguntara al cliente si esta seguro de querer salir cuando le da en retroceder
  const [modalBeforeRemove, setModalBeforeRemove] = useState<{
    open: boolean;
    onRequestCloseScreen?: () => void;
  }>({
    open: false,
  });



  //! EVENTO Q SE DIPARA CUANDO SE RETROCEDER ESTE TE ABRE UN MODAL PREGUNTANDOTE SI QUIERES SALIR E IR A LA PANTALLA PRINCIPAL
  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
        setModalBeforeRemove({
          open: true,
          onRequestCloseScreen: () => {
            navigation.dispatch(
              CommonActions.navigate({
                name: 'RegisterIdentityInfo',
                merge: true,
              }),
            );
          },
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

  //!: MANDA DATOS AL BACKEND Y VALIDA
  const handleOnSubmit = async (faceScanned: any) => {
    try {
      setIsLoading(true);
      // DONE: LLAMAMOS AL PRIMER SERVICIO(1)
      const passiveLivenessResult = await evaluatePassiveLiveness(
        'ConfirmFace-index.tsx',
        faceScanned,
        {documentNumber, documentType},
        operationId,
        flowType,
      );

      //DONE: VALIDA CUANDO EL SERVICIO(1) NO ES EXITOSO Y MANDA ALGUN TIPO DE ERROR
      if (passiveLivenessResult.isSuccess === false)
        if (passiveLivenessResult.error !== undefined)
          switch (passiveLivenessResult.error.type) {  
            case 'LIMIT_ATTEMPTS':
              navigation.navigate('InfoDNINotRecognizedMaxAttempt');
              break;
            case 'OTHER':
              navigation.navigate('InfoScanError', {
                scanType: 'FACE',
                title: passiveLivenessResult.error.title,
              });
              break;
            case 'UNKNOWN':
              throw new Error('Ocurrió un error desconocido.');
              break;
            case 'SPOOF':
              navigation.navigate('InfoFaceBlocked');
              break;
          }
        else throw new Error('Ocurrió un error desconocido.');
      else {
        //DONE: EN CASO EL SERVICIO(1) ANTERIOR FUE EXITOSO ENTONCES LLAMA A OTROS SERVICIO(2) TBN
        const authenticateFacialResult = await authenticateFacial(
          documentScanned,
          faceScanned,
          'ConfirmFace-index.tsx',
          {documentNumber, documentType},
          operationId,
          flowType,
        );
        //DONE: VALIDA EL OTRO SERVICIO(2) CUANDO NO ES EXITOSO Y MANDA ALGUN TIPO DE ERROR
        if (authenticateFacialResult.isSuccess === false)
          if (authenticateFacialResult.error !== undefined)
            switch (authenticateFacialResult.error.type) {
              case 'LIMIT_ATTEMPTS':
                navigation.navigate('InfoDNINotRecognizedMaxAttempt');
                break;
              case 'OTHER':
                navigation.navigate('InfoScanError', {
                  scanType: 'FACE',
                  title: authenticateFacialResult.error.title,
                });
                break;
              case 'UNKNOWN':
                throw new Error('Ocurrió un error desconocido.');
                break;
            }
          else throw new Error('Ocurrió un error desconocido.');
        //DONE: VALIDAMOS CUANDO AMBOS SERVICIOS FUERON EXITOSOS
        if (
          passiveLivenessResult.isSuccess === true &&
          authenticateFacialResult.isSuccess === true
        ) {
          saveInStorage(
            {documentNumber, documentType},
            'evaluatePassiveLivenessToken,authenticateFacial',
            [
              'data:image/jpeg;base64,' +
                sanitizeBase64(faceScanned.bestImageCropped),
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
                faceScanned,
              },
            }),
          );
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      navigation.dispatch(
        CommonActions.navigate({
          name: 'RegisterIdentityInfo',
          merge: true
        }),
      );
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleOnSubmit,
  };

  
};