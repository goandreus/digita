import React, {useState} from 'react';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {StyleSheet, View} from 'react-native';
import InfoTemplate from '@templates/InfoTemplate';
import SVGTokenSecure from '@assets/images/tokenSecure.svg';
import {Colors} from '@theme/colors';
import {InfoActivateTokenScreenProps} from '@navigations/types';
import {activateToken} from '@services/User';
import {useLastUser} from '@hooks/common';
import {useLoading} from '@hooks/common';
import { useFocusEffect } from '@react-navigation/native';

const InfoActivateToken = ({
  navigation,
  route,
}: InfoActivateTokenScreenProps) => {
  const {lastUser, updateLastUser} = useLastUser();

  const {redirectTo} = route.params;
  const {option} = route.params;

  const styles = getStyles();
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const registerSecret = async () => {
    try {
      setIsRegistering(true);

      if (lastUser.token === undefined) {
        throw new Error('No existe el token del usuario.');
      }

      const resultActivateToken = await activateToken(
        lastUser.token,
        route.name,
        `0${lastUser.document?.type}${lastUser.document?.number}`,
      );

      updateLastUser({
        secret: resultActivateToken.secret,
        seedId: resultActivateToken.seedId,
        hasActiveToken: true,
        tokenIsInCurrentDevice: true,
      });

      switch (redirectTo) {
        case 'HOME':
          navigation.navigate('Main', {
            screen: 'MainScreen',
            params: {
              showTokenIsActivated: true,
              showPasswordUpdated: false,
            },
          });
          break;
        case 'CREDITS':
          navigation.navigate('MainTab', {
            screen: 'MainCredits',
            params: {
              screen: 'MyCredits',
              params: {
                showTokenIsActivated: true,
              },
            },
          });
          break;
        case 'MORE':
          navigation.navigate('Menu', {
            showTokenActivatedModal: true,
          });
          break;
        case 'DISBURSEMENT':
          navigation.navigate('StartDisbursement', {
            showTokenIsActivated: true,
          });
          break;
        case 'PAYWITHPHONE':
          navigation.replace('OperationsStack', {
            screen: 'PayWithPhone',
            params: {
              showTokenIsActivated: true,
              disablePhoneAlert: {
                isOpen: false,
                title: '',
                content: '',
                button: '',
              },
            },
          });
          break;
        case 'AFFILIATION':
          navigation.replace('OperationsStack', {
            screen: 'AffiliatePhone',
            params: {
              showTokenIsActivated: true,
              operationType: 'affiliation',
              from: 'InfoActivateToken',
            },
          });
          break;
        case 'NEWSAVEACCOUNT':
          navigation.replace('OperationsStack', {
            screen: 'OpenSaveAccount',
            params: {
              showTokenIsActivated: true,
              from: 'InfoActivateToken',
            },
          });
          break;
        case 'GROUPCREDIT':
          navigation.navigate('StartGroupCredit', {
            showTokenIsActivated: true,
          });
          break;
        case 'LINECREDIT':
          navigation.navigate('LineCreditContract', {
            showTokenIsActivated: true,
          });
          break;
      }

      setIsRegistering(false);
    } catch (error: any) {
      setIsRegistering(false);
      // Alert.alert('Error', error?.message || 'No se reconoce el error.');
    }
  };

  return (
    <>
      <InfoTemplate
        isFlatDesign={true}
        title={
          <TextCustom
            text="Activar Token Digital"
            variation="h1"
            weight="bold"
            align="center"
          />
        }
        descriptionAbove={
          <TextCustom
            text="Autoriza a este teléfono para que realices tus operaciones bancarias"
            variation="h1"
            weight="normal"
            align="center"
          />
        }
        imageSVG={SVGTokenSecure}
        descriptionBelow={
          <>
            {lastUser.hasActiveToken === true ? (
              <TextCustom variation="p">
                Actualmente tienes activo el token digital en otro teléfono.
                Presiona en{' '}
                <TextCustom variation="p" weight="bold">
                  "Activar"
                </TextCustom>{' '}
                para que tu Token Digital funcione solamente{' '}
                <TextCustom variation="p" weight="bold">
                  en este teléfono celular.
                </TextCustom>
              </TextCustom>
            ) : (
              <TextCustom variation="p">
                Activa el{' '}
                <TextCustom variation="p" weight="bold">
                  Token Digital
                </TextCustom>{' '}
                en este teléfono solo una vez y todas las operaciones bancarias
                que realices estarán protegidas gracias a la validación
                automática del token.
              </TextCustom>
            )}
          </>
        }
        footer={
          <View style={styles.footerWrapper}>
            <Button
              loading={isRegistering}
              orientation="horizontal"
              type="primary"
              text="Activar"
              onPress={registerSecret}
            />
            <Separator type="medium" />
            <TextCustom
              variation="link"
              align="center"
              color={Colors.Paragraph}
              onPress={() => {
                if (navigation.canGoBack()) {
                  if (option === 'transfers') {
                    navigation.navigate('Transfers');
                  }
                  if (option === 'home') {
                    navigation.navigate('Main', {
                      screen: 'MainScreen',
                    });
                  } else {
                    navigation.goBack();
                  }
                }
              }}>
              Ahora no
            </TextCustom>
          </View>
        }
      />
    </>
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

export default InfoActivateToken;
