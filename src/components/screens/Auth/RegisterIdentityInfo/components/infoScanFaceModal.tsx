/* eslint-disable react-native/no-inline-styles */
import React, { useCallback } from 'react';
import {Image, View} from 'react-native';
import AlertBasic from '@molecules/extra/AlertBasic';
import Button from '@atoms/extra/Button';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import {SIZES} from '@theme/metrics';

const InfoScanFaceModal = ({
  isOpen,
  onClose,
  onPress,
  onModalHide,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPress: () => void;
  onModalHide: () => void;
}) => {
  const actions = useCallback(() => [
    {
      id: 'button1',
      render: <Button text="Comenzar" type="primary" onPress={onPress} />,
    },
  ], [onPress])
  return (
    <>
      <AlertBasic
        statusBarTranslucent
        isOpen={isOpen}
        onModalHide={onModalHide}
        closeOnTouchBackdrop={true}
        onClose={onClose}
        title=""
        actions={actions}
        body={
          <>
            <Separator size={-SIZES.XL} />
            <View style={{alignItems: 'center'}}>
              <Image source={require('@assets/images/scanFace.png')} />
            </View>
            <Separator type="large" />
            <TextCustom
              align="center"
              text="Coloca tu rostro dentro del círculo"
              variation="h0"
              color="primary-medium"
            />
            <Separator type="medium" />
            <TextCustom
              align="center"
              text={
                ' No uses lentes. Mantén el celular a la\naltura de tus ojos y mira la cámara hasta\nque se capture automáticamente la selfie.'
              }
              variation="p4"
              color="neutral-darkest"
            />
          </>
        }
      />
    </>
  );
};

export default InfoScanFaceModal;
