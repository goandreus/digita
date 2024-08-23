/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useMemo } from 'react';
import {Image, View} from 'react-native';
import AlertBasic from '@molecules/extra/AlertBasic';
import Button from '@atoms/extra/Button';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import {SIZES} from '@theme/metrics';

const InfoScanDNIModal = ({
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
  ], [onPress]);
  return (
    <>
      <AlertBasic
        statusBarTranslucent
        onModalHide={onModalHide}
        isOpen={isOpen}
        closeOnTouchBackdrop={true}
        onClose={onClose}
        title=""
        actions={actions}
        body={
          <>
            <Separator size={-SIZES.XL} />
            <View style={{alignItems: 'center'}}>
              <Image source={require('@assets/images/scanDni.png')} />
            </View>
            <Separator type="large" />
            <TextCustom
              align="center"
              text="Coloca tu DNI frente a la Cámara"
              variation="h0"
              color="primary-medium"
            />
            <Separator type="medium" />
            <TextCustom
              align="center"
              text={
                'Encuadra tu DNI hasta que quede dentro\nde los bordes y se capture la foto\nautomáticamente.'
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

export default InfoScanDNIModal;
