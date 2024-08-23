import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {NativeModules, Platform} from 'react-native';
import {RegisterIdentityInfoScreenProps} from '@navigations/types';
import {CommonActions} from '@react-navigation/native';
import {v4 as uuid} from 'uuid';
import {getRemoteValue} from '@utils/firebase';
import _ from 'lodash';
import {
  civilValidation,
  disaffiliation,
  finishTracking,
  updateDeviceAndCounters,
} from '@services/User';
import useUser from '@hooks/useUser';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';
import { getFormattedFlowName } from '@managers/AmplitudeManager/ScreenMap';
import { ERROR_MAP } from '@managers/AmplitudeManager/ErrorMap';
import { CoreResult, InitOperationConfiguration, InitSessionConfiguration } from '@facephi/sdk-core-react-native/src';
import { CUSTOMER_ID, LICENSE_APIKEY_ANDROID, LICENSE_APIKEY_IOS, LICENSE_URL } from '../../../../constants/FacephiConstants';
import { SdkFinishStatus, SdkOperationType } from '@facephi/sdk-core-react-native/src/SdkCoreEnums';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { reset, update } from '@features/authBiometry';
import { KeyEnv, URL_WEBVIEW_KEY } from '@constants';
import NativeConfig from 'react-native-config';
import {decryptText} from '@utils/AES';

export const pluginConfig = {
  type: 'ONBOARDING',
};

const {SdkMobileCore} = NativeModules;

let configSession: InitSessionConfiguration = {
  licenseUrl: LICENSE_URL,
  licenseApiKey: Platform.OS === 'ios' ? LICENSE_APIKEY_IOS : LICENSE_APIKEY_ANDROID,
  enableTracking: true,
  enableBehavior: false
};

let configOperation: InitOperationConfiguration = {
  customerId: CUSTOMER_ID,
  type: SdkOperationType.Onboarding,
};

export const useRegisterIdentityInfo = ({
  navigation,
  route,
}: RegisterIdentityInfoScreenProps) => {
  const urlWebViewKey = URL_WEBVIEW_KEY[NativeConfig.ENV as KeyEnv];
  const LICENSE_IOS = decryptText(getRemoteValue('kff_ap').asString(), urlWebViewKey);
  const LICENSE_ANDROID = decryptText(getRemoteValue('kff_an').asString(), urlWebViewKey);
  const [isSessionInitialized, setIsSessionInitialized] = useState<boolean>(false);
  const [isOperationInitialized, setIsOperationInitialized] = useState<boolean>(false);

  const {
    flowType,
    stepProps,
    documentNumber,
    documentType,
    gender,
    documentScanned,
    faceScanned,
    autoExecute,
  } = route.params;

  const {actions} = useUser();

  const dispatch = useAppDispatch();

  const isFinished = useRef<boolean>(false);

  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [operationId, setOperationId] = useState<string | undefined>(undefined);

  const step1Completed = documentScanned !== undefined;
  const step2Completed = faceScanned !== undefined;

  const [showModalIsSucceed, setShowModalIsSucceed] = useState<boolean>(false);

  const [openScanDNIModal, setOpenScanDNIModal] = useState<boolean>(false);
  const [openScanFaceModal, setOpenScanFaceModal] = useState<boolean>(false);

  const [modalBeforeRemove, setModalBeforeRemove] = useState<{
    open: boolean;
    onRequestCloseScreen?: () => void;
  }>({
    open: false,
  });

  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    if (LICENSE_IOS === null || LICENSE_ANDROID === null) return;
    console.log("INIT_SESSION", "STARTED");
    configSession.licenseApiKey = Platform.OS === 'ios' ? LICENSE_IOS : LICENSE_ANDROID;
    SdkMobileCore.initSession(configSession)
      .then((result: CoreResult) => {
        console.log("INIT_SESSION", result);
        setIsSessionInitialized(true);
      })
      .catch((error: any) => {
        console.log("INIT_SESSION", "ERROR", error);
      });
  }, [LICENSE_IOS, LICENSE_ANDROID]);

  useEffect(() => {
    if (isSessionInitialized) {
      console.log("INIT_OPERATION", "STARTED");
      const customerId = _.padStart(documentType.toString(), 3, '0') + documentNumber;
      SdkMobileCore.initOperation({...configOperation, customerId })
        .then((result: CoreResult) => {
          console.log("INIT_OPERATION", result);
          setIsOperationInitialized(true);
        })
        .catch((error: any) => {
          console.log("INIT_OPERATION", "ERROR", error);
        });
    }
  }, [isSessionInitialized, documentType, documentNumber]);

  useEffect(() => {
    if (isSessionInitialized && isOperationInitialized) {
      console.log("INIT_EXTRA_DATA", "STARTED");
      SdkMobileCore
        .getExtraData()
        .then(async (result: CoreResult) => {
          console.log("INIT_EXTRA_DATA", result);
          if (parseInt(result.finishStatus) == SdkFinishStatus.Ok) {
            console.log("INIT_EXTRA_DATA", "TOKENIZED SUCCESS");
            dispatch(update({ extraData: result.tokenized }));
          }
        })
        .catch((error: any) => {
          console.log("INIT_EXTRA_DATA", "ERROR", error);
        })
    }
  }, [isSessionInitialized, isOperationInitialized]);

  useEffect(() => {
    if (isSessionInitialized && isOperationInitialized) {
      console.log("GET_OPERATION_ID", "STARTED");
      SdkMobileCore
        .getOperationId()
        .then(async (result: CoreResult) => {
          console.log("GET_OPERATION_ID", result);
          setOperationId(result.operationId);
        })
        .catch((error: any) => {
          console.log("GET_OPERATION_ID", "ERROR", error);
        })
    }
  }, [isSessionInitialized, isOperationInitialized]);

  useEffect(() => {
    if (isSessionInitialized && isOperationInitialized) {
      console.log("GET_SESSION_ID", "STARTED");
      SdkMobileCore
        .getSessionId()
        .then(async (result: CoreResult) => {
          console.log("GET_SESSION_ID", result);
          setSessionId(result.sessionId);
        })
        .catch((error: any) => {
          console.log("GET_SESSION_ID", "ERROR", error);
        })
    }
  }, [isSessionInitialized, isOperationInitialized]);


  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  useLayoutEffect(() => {
    if (autoExecute !== undefined) {
      switch (autoExecute) {
        case 'DOI':
          navigation.setParams({
            autoExecute: undefined,
          });
          navigation.navigate('InfoScanDNI', {
            flowType,
            gender,
            documentNumber,
            documentType,
          });
          break;
        case 'FACE':
          break;
      }
    }
  }, [autoExecute, navigation, flowType, documentNumber, documentType, gender]);

  useLayoutEffect(() => {
    if (flowType !== 'FORGOT_PASSWORD' && (step1Completed || step2Completed)) {
      const unsubscribe = navigation.addListener('beforeRemove', e => {
        if (e.data.action.type === 'GO_BACK') {
          e.preventDefault();
          setModalBeforeRemove({
            open: true,
            onRequestCloseScreen: () => navigation.dispatch(e.data.action),
          });
        }
      });
      return () => unsubscribe();
    } else if (flowType === 'FORGOT_PASSWORD') {
      const unsubscribe = navigation.addListener('beforeRemove', e => {
        if (e.data.action.type === 'GO_BACK') {
          e.preventDefault();
          setModalBeforeRemove({
            open: true,
            onRequestCloseScreen: () => {
              const state = navigation.getState();
              const parentRouteKey: string = state.routes[state.index - 1].key;
              navigation.dispatch({
                ...CommonActions.setParams({execRestart: true}),
                source: parentRouteKey,
              });
              navigation.dispatch(e.data.action);
            },
          });
        }
      });
      return () => unsubscribe();
    }
  }, [navigation, step1Completed, step2Completed, flowType]);

  const getTitle = () => {
    switch (route.params.flowType) {
      case 'REGISTER':
        return 'Regístrate';
      case 'LOGIN':
        return 'Inicia sesión';
      case 'FORGOT_PASSWORD':
        return 'Olvidé mi clave';
    }
  };

  const handleOnSubmit = async () => {
    try {
      if (operationId === undefined) return;
      if (step2Completed && step1Completed) {
        const civilValidationResult = await civilValidation(
          'RegisterIdentityInfo-index.tsx',
          faceScanned,
          documentScanned,
          documentScanned.documentData,
          {documentNumber, documentType},
          operationId,
          flowType,
        );

        if (civilValidationResult.isSuccess === false) {
          if (civilValidationResult.error !== undefined) {
            switch (civilValidationResult.error.type) {
              case 'LIMIT_ATTEMPTS':
                navigation.navigate('InfoDNINotRecognizedMaxAttempt');
                break;
              case 'OTHER':
                navigation.navigate('InfoScanError', {
                  scanType: 'ALL',
                  title: civilValidationResult.error.title,
                });
                break;
              case 'UNKNOWN':
                throw new Error('Ocurrió un error desconocido.');
            }
          } else {
            throw new Error('Ocurrió un error desconocido.');
          }
        }
        if (civilValidationResult.isSuccess === true) {
          isFinished.current = true;
          console.log("SDK_MOBILE_CORE","CLOSE_SESSION");
          await SdkMobileCore.closeSession();
          finishTracking(
            'Succeeded',
            {documentNumber, documentType},
            'RegisterIdentityInfo-index.tsx',
          );
          AH.track("CF App - Validación - Finalización", {
            'Método de Validación': 'Ambos',
            'Proceso Consultado': AH.autoGenerate('Proceso Consultado'),
          });
          setShowModalIsSucceed(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnAccept = async () => {
    AH.track("CF App - Clic en Botones", {
      'Nombre de la Vista': AH.autoGenerate('Nombre de la Vista'),
      'Nombre del Botón': "Aceptar",
      'Proceso Consultado': AH.autoGenerate('Proceso Consultado'),
    });
    switch (flowType) {
      case 'REGISTER': {
        setShowModalIsSucceed(false);
        navigation.navigate('RegisterPassword', {
          flowType: 'REGISTER',
          showTerms: true,
          documentNumber,
          documentType,
          email: route.params.email,
          stepProps:
            stepProps !== undefined && stepProps.current !== undefined
              ? {
                  max: stepProps.max,
                  current: stepProps.current + 1,
                }
              : undefined,
          firstName: route.params.firstName,
          firstSurname: route.params.firstSurname,
          secondSurname: route.params.secondSurname,
          secondName: route.params.secondName,
          from: 'RegisterIdentityInfo',
        });
        if (stepProps?.current !== undefined) {
          navigation.setParams({
            stepProps: {
              ...stepProps,
              current: stepProps.current + 1,
            },
          });
        }
        break;
      }
      case 'LOGIN':
        setShowModalIsSucceed(false);
        try {
          setShowModalIsSucceed(false);
          navigation.navigate('LoadingScreen');
          await disaffiliation({
            screen: route.name,
            documentType,
            documentNumber,
          });
          await updateDeviceAndCounters(
            {
              document: {
                number: documentNumber,
                type: documentType,
              },
            },
            route.name,
          );

          try {
            const resultLogin = await actions.login(
              documentType,
              documentNumber,
              route.params.password,
            );
  
            if (resultLogin.type !== 'SUCCESS') {
              navigation.pop();
              setShowModalIsSucceed(true);
            } else {
              navigation.reset({
                index: 0,
                routes: [{name: 'MainTab'}],
              });
            }
          } catch (error) {
            AH.track("CF App - Error Encontrado", {
              "Nombre de la Vista": AH.autoGenerate('Nombre de la Vista'),
              "Nombre del Error": ERROR_MAP['LOGIN']['OTHERS'],
              "Fuente del Error": 'Proceso interno'
            });
            throw error;
          }
        } catch (error: any) {
          navigation.pop();
          setShowModalIsSucceed(true);
          // Alert.alert('Error', error?.message || 'No se reconoce el error.');
        }
        break;
      case 'FORGOT_PASSWORD': {
        setShowModalIsSucceed(false);
        navigation.navigate('RegisterPassword', {
          flowType: 'FORGOT_PASSWORD',
          showTerms: false,
          documentNumber,
          documentType,
          email: route.params.email,
          stepProps:
            stepProps !== undefined && stepProps.current !== undefined
              ? {
                  max: stepProps.max,
                  current: stepProps.current + 1,
                }
              : undefined,
          firstName: route.params.firstName,
          firstSurname: route.params.firstSurname,
          secondSurname: route.params.secondSurname,
          secondName: route.params.secondName,
        });
        if (stepProps?.current !== undefined) {
          navigation.setParams({
            stepProps: {
              ...stepProps,
              current: stepProps.current + 1,
            },
          });
        }
        break;
      }
    }
  };

  const handleScanDNI = useCallback(() => {
    AH.track('CF App - Validar Identidad', {
      'Método de Validación': 'DNI',
      'Proceso Consultado': getFormattedFlowName(flowType),
    });
    setOpenScanDNIModal(true);
  },[setOpenScanDNIModal]); 
  const handleScanSelfie = useCallback(() => {
    AH.track('CF App - Validar Identidad', {
      'Método de Validación': 'Selfie',
      'Proceso Consultado': getFormattedFlowName(flowType),
    });
    setOpenScanFaceModal(true);
  }, [setOpenScanFaceModal]);

  const handleNavigateScanDNI = useCallback(() => {
    setOpenScanDNIModal(false);
    
  }, [setOpenScanDNIModal]);

  const handleNavigateScanSelfie = useCallback(() => {
    setOpenScanFaceModal(false);
    
  }, [setOpenScanFaceModal]);

  return {
    sessionId,
    operationId,
    step1Completed,
    step2Completed,
    showModalIsSucceed,
    modalBeforeRemove,
    openScanDNIModal,
    openScanFaceModal,
    getTitle,
    handleOnSubmit,
    handleOnAccept,
    setOpenScanDNIModal,
    setOpenScanFaceModal,
    setModalBeforeRemove,
    handleScanDNI,
    handleScanSelfie,
    handleNavigateScanSelfie,
    handleNavigateScanDNI,
    documentScanned,
  };
};
