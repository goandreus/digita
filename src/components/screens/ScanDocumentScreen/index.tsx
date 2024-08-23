import {ScanDocumentScreenProps} from '@navigations/types';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback, useEffect} from 'react';
import {Alert, NativeModules, Platform, Text, View} from 'react-native';
import * as SdkSelphidEnums from '@facephi/sdk-selphid-react-native/src/SdkSelphidEnums';
import {SdkErrorType, SdkFinishStatus} from '@facephi/sdk-core-react-native/src/SdkCoreEnums';
import NativeConfig from 'react-native-config';
import { DynActionTrackerManager } from '@managers/DynActionTrackerManager';
import { getRemoteValue } from '@utils/firebase';
import ConfirmLoadingFishes from '@molecules/LoadingFishes';

const {SdkMobileSelphid} = NativeModules;

const pluginConfiguration = {
  debug: false,
  showResultAfterCapture: false,
  showTutorial: false,
  scanMode: SdkSelphidEnums.SdkScanMode.Search,
  specificData: 'PE|<ALL>',
  documentType: SdkSelphidEnums.SdkDocumentType.IdCard,
  fullscreen: true,
  locale: 'ES',
  timeout: SdkSelphidEnums.SdkTimeout.Long,
  wizardMode: true,
};

const ScanDocumentScreen = ({navigation, route}: ScanDocumentScreenProps) => {

  const {gender, flowType, documentNumber, documentType} = route.params;

  const isFocused = useIsFocused();

  const formatDate = (date: string): string | never => {
    const splitted = date.split('/');
    if (splitted[2] === undefined)
      throw new Error('No se reconoce el año del documento.');
    else if (splitted[2].length !== 2 && splitted[2].length !== 4)
      throw new Error('El año del documento es incorrecto.');
    else {
      let rawDate: string | undefined = undefined;
      if (splitted[2].length === 2)
        rawDate = [splitted[0], splitted[1], '20' + splitted[2]].join('/');
      else rawDate = date;
      return moment(rawDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }
  };

  const processResult = useCallback(
    (result: {
      finishStatus: string;
      frontDocumentImage?: string;
      backDocumentImage?: string;
      faceImage?: string;
      tokenOCR?: string;
      tokenFaceImage?: string;
      matchingSidesScore?: number;
      documentCaptured?: string;
      documentData?: string;
      errorType?: number;
    }) => {
      switch (parseInt(result.finishStatus, 10)) {
        case SdkFinishStatus.Ok: // OK
          try {
            if (
              result.frontDocumentImage !== undefined &&
              result.backDocumentImage !== undefined &&
              result.faceImage !== undefined &&
              result.matchingSidesScore !== undefined &&
              result.tokenOCR !== undefined &&
              result.tokenFaceImage !== undefined &&
              result.documentCaptured !== undefined &&
              result.documentData !== undefined
            ) {
              const documentDataJSON: {
                "Back/MRZ/Number": string;
                DocumentNumber: string;
                DateOfBirth: string;
                DateOfExpiry: string;
              } = JSON.parse(result.documentData);

              DynActionTrackerManager.reportEvent("ScanDocument", "* Fin exitoso");
              DynActionTrackerManager.abortAction("ScanDocument");
              navigation.navigate('ConfirmDocument', {
                flowType,
                documentNumber,
                documentType,
                documentScanned: {
                  frontDocumentImage: result.frontDocumentImage,
                  backDocumentImage: result.backDocumentImage,
                  faceImage: result.faceImage,
                  matchingSidesScore: result.matchingSidesScore,
                  tokenOCR: result.tokenOCR,
                  tokenFaceImage: result.tokenFaceImage,
                  documentCaptured: result.documentCaptured,
                  documentData: {
                    documentNumberMRZ: documentDataJSON['Back/MRZ/Number'],
                    documentNumber: documentDataJSON.DocumentNumber.slice(0, 8),
                    dateOfBirth: formatDate(documentDataJSON.DateOfBirth),
                    dateOfExpiry: formatDate(documentDataJSON.DateOfExpiry),
                  },
                },
              });
            } else {
              DynActionTrackerManager.reportEvent("ScanDocument", "* Cancelado: Datos mínimos del OCR");
              throw new Error('No tiene datos mínimos el OCR.');
            }
          } catch (error) {
            DynActionTrackerManager.abortAction("ScanDocument");
            navigation.navigate('InfoScanError', {
              scanType: 'DOI',
              title:
                'Lo sentimos, tenemos inconvenientes al validar la información de tu DNI',
            });
          }
          break;
        case SdkFinishStatus.Error: // Error
        default:
          console.log("SELPHID", "ERROR", result);
          if(result.errorType === SdkErrorType.UnknownError)DynActionTrackerManager.reportEvent("ScanDocument", "* Cancelado: Error desconocido");
          if(result.errorType === SdkErrorType.CancelByUser)DynActionTrackerManager.reportEvent("ScanDocument", "* Cancelado: Acción del usuario");
          if(result.errorType === SdkErrorType.Timeout)DynActionTrackerManager.reportEvent("ScanDocument", "* Cancelado: Timeout");
          DynActionTrackerManager.abortAction("ScanDocument");
          navigation.dispatch(
            CommonActions.navigate({
              name: 'RegisterIdentityInfo',
              merge: true,
            }),
          );
          break;
      }
    },
    [flowType, documentNumber, documentType],
  );

  const captureDocument = useCallback(async () => {
    try {
      console.log("SELPHID", "STARTED");
      DynActionTrackerManager.startAction('ScanDocument', '* Escaneo de Documento');
      await SdkMobileSelphid.selphid({
        ...pluginConfiguration,
        resourcesPath:
          gender === 'M'
            ? SELPHID_RESOURCE_PATH_MALE
            : SELPHID_RESOURCE_PATH_FEMALE,
      }).then((result: any) => {
        console.log("SELPHID", "RESULT IN QUEUE");
        processResult(result);
      });
    } catch (error: any) {
      DynActionTrackerManager.abortAction('ScanDocument');
      console.error(error?.message || 'No se reconoce el error.');
      // Alert.alert('Error', error?.message || 'No se reconoce el error.');
    }
  }, [processResult, gender]);

  useEffect(() => {
    if (isFocused) captureDocument();
  }, [captureDocument, isFocused]);

  return null;
};

const SELPHID_RESOURCE_PATH_MALE =
  'fphi-selphid-widget-resources-sdk-male.zip';
const SELPHID_RESOURCE_PATH_FEMALE =
  'fphi-selphid-widget-resources-sdk-female.zip';

export default ScanDocumentScreen;
