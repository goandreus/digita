import React, { useCallback, useRef } from 'react';
import Separator from '@atoms/Separator';
import {RegisterIdentityInfoScreenProps} from '@navigations/types';
import yup from '@yup';
import {Formik} from 'formik';
import InfoScanDNI from './components/infoScanDNIModal';
import TextCustom from '@atoms/extra/TextCustom';
import ComplexButton from './components/complexButton';
import Button from '@atoms/extra/Button';
import {SIZES} from '@theme/metrics';
import AlertBasic from '@molecules/extra/AlertBasic';
import {useRegisterIdentityInfo} from './hook';
import InfoScanFaceModal from './components/infoScanFaceModal';
import TransfersTemplate from '@templates/extra/TransfersTemplate';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';

export const pluginConfig = {
  type: 'ONBOARDING',
};

export const RegisterIdentityInfo = ({
  navigation,
  route,
}: RegisterIdentityInfoScreenProps) => {
  const {flowType, stepProps, documentNumber, documentType, gender} =
    route.params;

  const {
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
    operationId,
    sessionId
  } = useRegisterIdentityInfo({
    route,
    navigation,
  });

  const onCloseDNIModal = useCallback(() => {
    setOpenScanDNIModal(false);
  }, [setOpenScanDNIModal]);

  const onCloseFaceModal = useCallback(() => {
    setOpenScanFaceModal(false);
  }, [setOpenScanFaceModal]);

  const startedDNI = useRef<boolean>(false);
  const startedFace = useRef<boolean>(false);

  return (
    <>
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
        onSubmit={async () => {
          await handleOnSubmit();
        }}>
        {({handleSubmit, values, isValid, isSubmitting}) => (
          <TransfersTemplate
            headerTitle={getTitle()}
            title="Valida tu identidad"
            stepsProps={stepProps}
            canGoBack={navigation.canGoBack()}
            goBack={() => navigation.goBack()}
            footer={
              <Button
                onPress={handleSubmit}
                loading={isSubmitting}
                orientation="horizontal"
                type="primary"
                text="Siguiente"
                disabled={!isValid}
              />
            }>
            <TextCustom
              text="Por tu seguridad validaremos tu información, para ello necesitas tener a la mano tu DNI."
              variation="p4"
              color="neutral-darkest"
            />

            <Separator type="medium" />
            <ComplexButton
              state={values.step1 ? 'saved' : 'neutral'}
              iconName={values.step1 ? 'icon_identityChecked' : 'icon_identity'}
              title="Coloca frente a la cámara tu"
              description="DNI por ambos lados"
              onPress={handleScanDNI}
            />
            <Separator type="medium" />
            <Separator type="x-small" />
            <ComplexButton
              iconName={values.step2 ? 'icon_selfieChecked' : 'icon_selfie'}
              disabled={values.step1 === false && values.step2 === false}
              state={values.step2 === true ? 'saved' : 'neutral'}
              title="Tómate un"
              description="Selfie"
              onPress={handleScanSelfie}
            />
            <Separator type="medium" />
          </TransfersTemplate>
        )}
      </Formik>

      <InfoScanDNI
        isOpen={openScanDNIModal}
        onClose={onCloseDNIModal}
        onPress={() => {
          AH.track("CF App - Validación - Inicio", {
            'Método de Validación': AH.autoGenerate('Método de Validación'),
            'Proceso Consultado': AH.autoGenerate('Proceso Consultado'),
          });
          startedDNI.current = true;
          setOpenScanDNIModal(false);
        }}
        onModalHide={() => {
          if (startedDNI.current === true) {
            startedDNI.current = false;
            setTimeout(() => {
              navigation.navigate('ScanDocument', {
                flowType,
                gender,
                documentNumber,
                documentType,
              });
            });
          }

        }}
      />

      <InfoScanFaceModal
        isOpen={openScanFaceModal}
        onClose={onCloseFaceModal}
        onPress={() => {
          AH.track("CF App - Validación - Inicio", {
            'Método de Validación': AH.autoGenerate('Método de Validación'),
            'Proceso Consultado': AH.autoGenerate('Proceso Consultado'),
          });
          startedFace.current = true;
          setOpenScanFaceModal(false);
        }}
        onModalHide={() => {
          if (
              step1Completed && 
              documentScanned !== undefined && 
              startedFace.current === true &&
              operationId !== undefined &&
              sessionId !== undefined
            ) {
            startedFace.current = false;
            setTimeout(() => {
              navigation.navigate('ScanFace', {
                flowType,
                documentScanned,
                operationId,
                sessionId,
                documentNumber,
                documentType,
              });
            })
          }
        }}
      />
    

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
                text={
                  flowType === 'FORGOT_PASSWORD'
                    ? 'Salir sin enviar'
                    : 'Salir de todas formas'
                }
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
      {/* Success Modal */}

      <AlertBasic
        statusBarTranslucent
        isOpen={showModalIsSucceed === true}
        onClose={() => {}}
        title="¡Validación exitosa!"
        description="Hemos verificado tu identidad correctamente. Gracias por esperar."
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button text="Aceptar" type="primary" onPress={handleOnAccept} />
            ),
          },
        ]}
      />
    </>
  );
};
