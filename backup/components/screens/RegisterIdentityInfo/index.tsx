import Button from '@atoms/Button';
import ModalInfo from '@atoms/ModalInfo';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import ComplexButton from '@molecules/ComplexButton';
import {RegisterIdentityInfoScreenProps} from '@navigations/types';
import {
  civilValidation,
  disaffiliation,
  finishTracking,
  updateDeviceAndCounters,
} from '@services/User';
import FormTemplate from '@templates/FormTemplate';
import {Colors} from '@theme/colors';
import yup from '@yup';
import {Formik} from 'formik';
import _, {flow} from 'lodash';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Alert, NativeModules} from 'react-native';
import {v4 as uuid} from 'uuid';
import {
  CommonActions,
  StackActions,
  useIsFocused,
} from '@react-navigation/native';
import useUser from '@hooks/useUser';
import { getRemoteValue } from '@utils/firebase';



export const pluginConfig = {
  type: 'ONBOARDING',
};

const {SdkMobileTracking, SdkMobileCore} = NativeModules;

const RegisterIdentityInfo = ({
  navigation,
  route,
}: RegisterIdentityInfoScreenProps) => {
  const fphi_url = getRemoteValue('fphi_url').asString();
  const fphi_client_id = getRemoteValue('fphi_client_id').asString();
  const fphi_client_secret = getRemoteValue('fphi_client_secret').asString();
  const fphi_tnt_id = getRemoteValue('fphi_tnt_id').asString();

  const isFinished = useRef<boolean>(false);
  const isFocused = useIsFocused();
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

  const sessionId = useMemo(() => uuid(), []);
  const operationId = useMemo(() => uuid(), []);

  const step1Completed = documentScanned !== undefined;
  const step2Completed = faceScanned !== undefined;

  const [showModalIsSucceed, setShowModalIsSucceed] = useState<boolean>(false);

  const [modalBeforeRemove, setModalBeforeRemove] = useState<{
    open: boolean;
    onRequestCloseScreen?: () => void;
  }>({
    open: false,
  });

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
  }, [autoExecute, navigation, flowType, documentNumber, documentType]);

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

  useEffect(() => {
    const initTracking = async () => {
      try {
        const customerId =
          _.padStart(documentType.toString(), 3, '0') + documentNumber;

        await SdkMobileTracking.tracking({
          sessionId: sessionId,
          operationId: operationId,
          platformUrl: fphi_url,
          clientId: fphi_client_id,
          clientSecret: fphi_client_secret,
          tenantId: fphi_tnt_id,
          customerId: customerId,
          type: pluginConfig.type,
        });
      } catch (error: any) {}
    };
    initTracking();
    return () => {
      if (isFinished.current === false) {
        finishTracking(
          'Cancelled',
          {documentNumber, documentType},
          'RegisterIdentityInfo-index.tsx',
        );
      }
    };
  }, [documentNumber, documentType, sessionId, operationId]);

  const handleOnSubmit = async () => {
    try {
      if (step2Completed && step1Completed) {
        const civilValidationResult = await civilValidation(
          'RegisterIdentityInfo-index.tsx',
          faceScanned,
          documentScanned,
          {documentNumber, documentType},
          operationId,
          flowType,
        );
        if (civilValidationResult.isSuccess === false)
          if (civilValidationResult.error !== undefined)
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
                break;
            }
          else throw new Error('Ocurrió un error desconocido.');
        if (civilValidationResult.isSuccess === true) {
          isFinished.current = true;
          finishTracking(
            'Succeeded',
            {documentNumber, documentType},
            'RegisterIdentityInfo-index.tsx',
          );
          setShowModalIsSucceed(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnAccept = async () => {
    switch (flowType) {
      case 'REGISTER': {
        setShowModalIsSucceed(false);
        navigation.navigate('RegisterPasswordInfo', {
          stage: route.params.stage,
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
        break;
      }
      case 'LOGIN':
        {
          try {
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

            const resultLogin = await actions.login(
              documentType,
              documentNumber,
              route.params.password,
            );

            if (resultLogin.type !== 'SUCCESS') {
              throw new Error(
                'Ocurrió un error en cuando se intentó logear al usuario.',
              );
            } else {
              navigation.reset({
                index: 0,
                routes: [{name: 'MainTab'}],
              });
            }
          } catch (error: any) {
            navigation.pop();
            // Alert.alert('Error', error?.message || 'No se reconoce el error.');
          }
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
        break;
      }
    }
  };

  return (
    <>
      <FormTemplate
        title="Validación de identidad"
        description="Sigue los pasos para validar tu identidad:"
        stepsProps={stepProps}>
        <Formik
          enableReinitialize={true}
          validateOnMount={true}
          initialValues={{
            step1: step1Completed,
            step2: step2Completed,
          }}
          validationSchema={yup.object({
            step1: yup.boolean().oneOf([true]).required(),
            step2: yup.boolean().oneOf([true]).required(),
          })}
          onSubmit={async (values, actions) => {
            await handleOnSubmit();
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            values,
            errors,
            touched,
            isValid,
            isSubmitting,
          }) => (
            <>
              <TextCustom variation="p" weight="bold" color={Colors.Primary}>
                Paso 1
              </TextCustom>
              <Separator type="x-small" />
              <ComplexButton
                state={values.step1 ? 'saved' : 'neutral'}
                title="Fotografía tu DNI"
                description="Ambos lados"
                onPress={() => {
                  navigation.navigate('InfoScanDNI', {
                    flowType,
                    gender,
                    documentNumber,
                    documentType,
                  });
                }}
              />
              <Separator type="medium" />
              <TextCustom variation="p" weight="bold" color={Colors.Primary}>
                Paso 2
              </TextCustom>
              <Separator type="x-small" />
              <ComplexButton
                disabled={values.step1 === false && values.step2 === false}
                state={values.step2 === true ? 'saved' : 'neutral'}
                title="Fotografía tu rostro"
                description="¡Tómate una Selfie!"
                onPress={() => {
                  if (step1Completed)
                    navigation.navigate('InfoScanFace', {
                      flowType,
                      gender,
                      documentScanned,
                      sessionId,
                      operationId,
                      documentNumber,
                      documentType,
                    });
                }}
              />
              <Separator type="large" />
              <Button
                onPress={handleSubmit}
                loading={isSubmitting}
                orientation="horizontal"
                type="primary"
                text="Siguiente"
                disabled={!isValid}
              />
            </>
          )}
        </Formik>
      </FormTemplate>
      <ModalInfo
        title="¿Seguro que quieres salir?"
        message="Aún no has completado el proceso, si sales perderás tu avance y deberás de empezar de nuevo"
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
              variation="link"
              align="center"
              color={Colors.Paragraph}
              onPress={() => {
                if (modalBeforeRemove.onRequestCloseScreen !== undefined)
                  modalBeforeRemove.onRequestCloseScreen();
              }}>
              {flowType === 'FORGOT_PASSWORD' && 'Salir sin enviar'}
              {flowType !== 'FORGOT_PASSWORD' && 'Salir de todas formas'}
            </TextCustom>
          </>
        }
      />
      {isFocused && (
        <ModalInfo
          title="¡Validación exitosa!"
          message="Hemos verificado tu identidad correctamente. Gracias por esperar."
          open={showModalIsSucceed === true}
          onRequestClose={() => {}}
          actions={
            <>
              <Button
                onPress={handleOnAccept}
                orientation="horizontal"
                type="primary"
                text="Aceptar"
              />
            </>
          }
        />
      )}
    </>
  );
};

export default RegisterIdentityInfo;
