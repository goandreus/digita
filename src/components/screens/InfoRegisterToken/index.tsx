import React, {useLayoutEffect, useState} from 'react';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {InfoRegisterTokenScreenProps} from '@navigations/types';
import {Alert, StyleSheet, View} from 'react-native';
import InfoTemplate from '@templates/InfoTemplate';
import SVGTokenSecure from '@assets/images/tokenSecure.svg';
import {Colors} from '@theme/colors';
import ConfirmLoading from '@screens/OperationsStack/loading';
import {getSecret} from '@services/User';
import {useLastUser} from '@hooks/common';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';

const InfoRegisterToken = ({
  navigation,
  route,
}: InfoRegisterTokenScreenProps) => {
  const {updateLastUser} = useLastUser();
  const {
    flowType,
    documentNumber,
    documentType,
    password,
    email,
    firstName,
    firstSurname,
    secondSurname,
    secondName,
  } = route.params;
  const styles = getStyles();
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK') e.preventDefault();
    });
    return () => unsubscribe();
  }, [navigation]);

  const registerSecret = async () => {
    try {
      setIsRegistering(true);
      const res = await getSecret({
        documentNumber,
        documentType,
        password,
        email,
        firstName,
        secondName,
        firstSurname,
        secondSurname,
      }, route.name);


      updateLastUser({
        secret: res.secret,
        seedId: res.seedId
      });

      AH.track("CF App - Crear Clave Digital", {
        'Número de Documento': AH.autoGenerate('Número de Documento'),
        'Afiliación Banca Digital': AH.autoGenerate("Afiliación Banca Digital"),
        'Proceso Consultado': AH.autoGenerate("Proceso Consultado"),
        'Sesión Rápida': AH.autoGenerate("Sesión Rápida"),
        'Etapa': "Activación",
      });

      switch (flowType) {
        case 'REGISTER':
          navigation.reset({
            index: 1,
            routes: [
              {name: 'Home'},
              {
                name: 'InfoRegisterSuccess',
                params: {
                  title: '¡Listo!',
                  description:
                    'Token digital y registro finalizados. Usa tu clave digital para ingresar a la app.',
                },
              },
            ],
          });
          break;
        case 'FORGOT_PASSWORD':
          navigation.reset({
            index: 1,
            routes: [
              {name: 'Home'},
              {
                name: 'InfoRegisterSuccess',
                params: {
                  title: '¡Listo!',
                  description:
                    'Token y clave digital activados. Usa tu clave digital para ingresar a la app.',
                },
              },
            ],
          });
          break;
      }
    } catch (error) {
      setIsRegistering(false);
    }
  };

  return (
    <>
      {isRegistering ? (
        <ConfirmLoading />
      ) : (
        <InfoTemplate
          useSafeView={true}
          title={
            <TextCustom
              text="Un último paso"
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
            <TextCustom variation="p">
              Activa el{' '}
              <TextCustom variation="p" weight="bold">
                Token Digital
              </TextCustom>{' '}
              en este teléfono solo una vez y todas las operaciones bancarias
              que realices estarán protegidas gracias a la validación automática
              del token.
            </TextCustom>
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
                  AH.track("CF App - Clic en Botones", {
                    'Nombre de la Vista': AH.autoGenerate('Nombre de la Vista'),
                    'Nombre del Botón': "Ahora no",
                    'Proceso Consultado': AH.autoGenerate('Proceso Consultado'),
                  });
                  switch (flowType) {
                    case 'REGISTER':
                      navigation.reset({
                        index: 1,
                        routes: [
                          {name: 'Home'},
                          {
                            name: 'InfoRegisterSuccess',
                            params: {
                              title: '¡Listo!',
                              description:
                                'Te has registrado en el app de Compartamos Financiera',
                            },
                          },
                        ],
                      });
                      break;
                    case 'FORGOT_PASSWORD':
                      navigation.reset({
                        index: 1,
                        routes: [
                          {name: 'Home'},
                          {
                            name: 'InfoRegisterSuccess',
                            params: {
                              title: '¡Listo!',
                              description:
                                'Tu clave digital ha sido actualizada. Usa tu clave digital para ingresar a la app.',
                            },
                          },
                        ],
                      });
                      break;
                  }
                }}>
                Ahora no
              </TextCustom>
            </View>
          }
        />
      )}
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

export default InfoRegisterToken;
