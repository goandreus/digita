import Button from '@atoms/Button';
import ImageBox from '@atoms/ImageBox';
import ModalInfo from '@atoms/ModalInfo';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import HeaderBackButton from '@molecules/HeaderBackButton';
import {ConfirmFaceScreenProps} from '@navigations/types';
import {CommonActions} from '@react-navigation/native';
import {
  authenticateFacial,
  evaluatePassiveLiveness,
  saveInStorage,
} from '@services/User';
import InfoTemplate from '@templates/InfoTemplate';
import {Colors} from '@theme/colors';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, NativeModules, Platform, StyleSheet} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {pluginConfig} from '@screens/Auth/RegisterIdentityInfo';
import {CoreResult} from 'libs/sdk-core/src';
import {SdkOperationType} from 'sdk-core/src/SdkCoreEnums';
import {TokenManager} from '@managers/TokenManager';
import {sanitizeBase64} from '@helpers/ImageHelper';
import { getRemoteValue } from '@utils/firebase';

const {SdkMobileCore} = NativeModules;

const ConfirmFace = ({navigation, route}: ConfirmFaceScreenProps) => {
  const fphi_url = getRemoteValue('fphi_url').asString();
  const fphi_client_id = getRemoteValue('fphi_client_id').asString();
  const fphi_client_secret = getRemoteValue('fphi_client_secret').asString();
  const fphi_tnt_id = getRemoteValue('fphi_tnt_id').asString();
  const styles = getStyles();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    documentScanned,
    faceScanned,
    flowType,
    operationId,
    sessionId,
    documentNumber,
    documentType,
  } = route.params;

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

  useEffect(() => {
    const populateToken = async () => {
      try {
        const extraData: CoreResult = await SdkMobileCore.getExtraData({
          platformUrl: fphi_url,
          clientId: fphi_client_id,
          clientSecret: fphi_client_secret,
          operationId: operationId,
          family: SdkOperationType.Onboarding,
          sessionId: sessionId,
          tenantId: fphi_tnt_id,
        });

        if (extraData.tokenized !== undefined) {
          TokenManager.getInstance().updateToken(
            'TOKEN_TRACKING',
            extraData.tokenized,
          );
          // Alert.alert(
          //   'Tracking info',
          //   'Token is received.\n' +
          //     JSON.stringify(
          //       {token: extraData.tokenized.slice(0, 50)},
          //       null,
          //       4,
          //     ),
          // );
        } else
          throw new Error(
            'El tokenizado devuelve undefined. No se puede trackear correctamente.',
          );
      } catch (error: any) {
        Alert.alert(
          'Error',
          error?.message ||
            'No se pudo obtener el token. No se reconoce el error.',
        );
      }
    };

    populateToken();
  }, [operationId, sessionId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  const handleOnSubmit = async () => {
    try {
      setIsLoading(true);
      const passiveLivenessResult = await evaluatePassiveLiveness(
        'ConfirmFace-index.tsx',
        faceScanned,
        {documentNumber, documentType},
        operationId,
        flowType,
      );

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
        const authenticateFacialResult = await authenticateFacial(
          documentScanned,
          faceScanned,
          'ConfirmFace-index.tsx',
          {documentNumber, documentType},
          operationId,
          flowType,
        );

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
              Imagen capturada
            </TextCustom>
            <Separator type="medium" />
            <ImageBox
              images={[
                {
                  source: {
                    uri:
                      'data:image/jpeg;base64,' + faceScanned.bestImageCropped,
                  },
                  width: 603,
                  height: 603,
                  id: 'face',
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
                    name: 'ScanFace',
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
        message="Aún no has enviado tu selfie, si sales perderás tu avance y deberás repetir el proceso."
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

export default ConfirmFace;
