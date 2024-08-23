import {ScanFaceScreenProps} from '@navigations/types';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, NativeModules, Platform} from 'react-native';
import * as SdkSelphiEnums from '@facephi/sdk-selphi-react-native/src/SdkSelphiEnums';
import { SdkErrorType, SdkFinishStatus, SdkOperationType } from '@facephi/sdk-core-react-native/src/SdkCoreEnums';
import {SelphiConfiguration} from 'libs/sdk-selphi/src';
import { DynActionTrackerManager } from '@managers/DynActionTrackerManager';
import { useConfirmFace } from './hook';
import Clipboard from '@react-native-community/clipboard';
import ConfirmLoadingFishes from '@molecules/LoadingFishes';

const {SdkMobileSelphi} = NativeModules;

const pluginConfiguration: SelphiConfiguration = {
  debug: false,
  fullscreen: true,
  enableImages: false,
  livenessMode: SdkSelphiEnums.SdkLivenessMode.PassiveMode,
  frontalCameraPreferred: true,
  resourcesPath: 'fphi-selphi-widget-resources-sdk-updated.zip',
  enableGenerateTemplateRaw: true,
  crop: false,
  jpgQuality: 0.95,
  stabilizationMode: false,
  templateRawOptimized: true,
};

const ScanFace = ({navigation, route}: ScanFaceScreenProps) => {
  const [faceScanned, setFaceScanned] = useState<any>();
  const {
    documentScanned,
    flowType,
    operationId,
    sessionId,
    documentNumber,
    documentType,
  } = route.params;

  const {
    isLoading,
    handleOnSubmit
  } = useConfirmFace({
    route,
    navigation,
  });

  

  const isFocused = useIsFocused();

  const processResult = useCallback(
    (result: {
      finishStatus: string;
      bestImage?: string;
      templateRaw?: string;
      bestImageTemplateRaw?: string;
      bestImageCropped?: string;
      errorType?: number;
    }) => {
      switch (parseInt(result.finishStatus, 10)) {
        case SdkFinishStatus.Ok: // OK
          if (
            result.bestImage !== undefined &&
            result.bestImageTemplateRaw !== undefined &&
            result.templateRaw !== undefined &&
            result.bestImageCropped !== undefined
          ) {
            DynActionTrackerManager.reportEvent("ScanFace", "* Fin exitoso");
            DynActionTrackerManager.abortAction("ScanFace");
            const faceScannedData = {
              bestImage: result.bestImage,
              bestImageCropped: result.bestImageCropped,
              bestImageTemplateRaw: result.bestImageTemplateRaw,
              templateRaw: result.templateRaw,
            };
            setFaceScanned(faceScannedData)
            handleOnSubmit(faceScannedData);
          }
          break;
        case SdkFinishStatus.Error: // Error
        default:
          console.log("SELPHI", "ERROR", result);
          if(result.errorType === SdkErrorType.UnknownError)DynActionTrackerManager.reportEvent("ScanFace", "* Cancelado: Error desconocido");
          if(result.errorType === SdkErrorType.CancelByUser)DynActionTrackerManager.reportEvent('ScanFace', '* Cancelado: Acción del usuario');
          if(result.errorType === SdkErrorType.Timeout)DynActionTrackerManager.reportEvent('ScanFace', '* Cancelado: Timeout');
          DynActionTrackerManager.abortAction("ScanFace");
          navigation.dispatch(
            CommonActions.navigate({
              name: 'RegisterIdentityInfo',
              merge: true,
            }),
          );
          break;
      }
    },
    [
      documentScanned,
      flowType,
      operationId,
      sessionId,
      documentNumber,
      documentType,
    ],
  );

  const captureFace = useCallback(async () => {
    try {
      console.log("SELPHI", "STARTED");
      DynActionTrackerManager.startAction('ScanFace', '* Escaneo de Rostro')
      await SdkMobileSelphi.selphi(pluginConfiguration).then((result: any) => {
        console.log("SELPHI", "RESULT IN QUEUE");
        processResult(result);
      });
    } catch (error: any) {
      DynActionTrackerManager.abortAction('ScanFace');
      console.error(error?.message || 'No se reconoce el error.');
      // Alert.alert('Error', error?.message || 'No se reconoce el error.');
    }
  }, [processResult]);

  useEffect(() => {
    if (isFocused) captureFace();
  }, [captureFace, isFocused]);

  return (
    isLoading ? <ConfirmLoadingFishes /> : null
  );
};

export default ScanFace;
