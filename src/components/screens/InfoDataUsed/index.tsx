import React from 'react';
import InfoTemplate from '@templates/InfoTemplate';
import SVGRepairMan from '@assets/images/repairMan.svg';
import Button from '@atoms/Button';
import {Linking, StyleSheet, View} from 'react-native';
import Separator from '@atoms/Separator';
import {Information} from '@global/information';
import {InfoDataUsedScreenProps} from '@navigations/types';
import TextCustom from '@atoms/TextCustom';
import {hideWithChar} from '@helpers/StringHelper';

const InfoDataUsed = ({navigation, route}: InfoDataUsedScreenProps) => {
  const styles = getStyles();
  const {phoneNumber, email, isSensitiveInfo} = route.params;

  let title = 'Lo sentimos, el número de teléfono o correo es inválido';

  if (phoneNumber !== undefined)
    title = 'Lo sentimos, el número de teléfono es inválido';

  if (email !== undefined) title = 'Lo sentimos, el correo es inválido';

  return (
    <InfoTemplate
      isFlatDesign={true}
      title={title}
      descriptionBelow={
        <>
          <TextCustom variation="p">
            {phoneNumber !== undefined && (
              <>
                El número de teléfono{' '}
                <TextCustom variation="p" weight="bold">
                  {isSensitiveInfo
                    ? hideWithChar('phone', phoneNumber)
                    : phoneNumber}
                </TextCustom>{' '}
                está afiliado a otro cliente activo.{' '}
              </>
            )}
            {email !== undefined && (
              <>
                El correo{' '}
                <TextCustom variation="p" weight="bold">
                  {isSensitiveInfo ? hideWithChar('email', email) : email}
                </TextCustom>{' '}
                está afiliado a otro cliente activo.
              </>
            )}
            {'\n'}
            Si esto es un error, por favor, acércate a una de nuestras agencias
            o comunícate con nosotros llamando a nuestra central telefónica{' '}
            {Information.PhoneContactFormatted}
          </TextCustom>
        </>
      }
      imageSVG={SVGRepairMan}
      footer={
        <View style={styles.footerWrapper}>
          <Button
            orientation="horizontal"
            type="primary"
            text="Ubícanos"
            disabled
            onPress={() => {
              navigation.navigate('Location');
            }}
          />
          <Separator type="x-small" />
          <Button
            orientation="horizontal"
            type="secondary"
            text="Llámanos"
            onPress={() => {
              Linking.openURL(`tel:${Information.PhoneContact}`);
            }}
          />
        </View>
      }
    />
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    footerWrapper: {
      width: '100%',
    },
  });

  return stylesBase;
};

export default InfoDataUsed;
