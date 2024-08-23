import InfoTemplate from '@templates/InfoTemplate';
import React, {useEffect, useLayoutEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import SVGRobotDNIFaceWarning from '@assets/images/robotDNIFaceWarning.svg';
import {CommonActions} from '@react-navigation/native';
import {InfoScanErrorScreenProps} from '@navigations/types';
import TextCustom from '@atoms/TextCustom';

const InfoScanError = ({navigation, route}: InfoScanErrorScreenProps) => {
  const styles = getStyles();

  const {scanType, title} = route.params;

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

  return (
    <InfoTemplate
      useSafeView={true}
      title={title}
      imageSVG={SVGRobotDNIFaceWarning}
      descriptionBelow={
        <>
          <TextCustom variation="p">
            Por favor, sigue estas recomendaciones adicionales e intenta de
            nuevo:
          </TextCustom>
          <Separator type="small" />
          <View style={styles.itemList}>
            <TextCustom variation="p" style={styles.itemPoint}>
              •
            </TextCustom>
            <TextCustom variation="p">
              Verifica que tu DNI se pueda leer con claridad y no esté
              deteriorado.
            </TextCustom>
          </View>
          <View style={styles.itemList}>
            <TextCustom variation="p" style={styles.itemPoint}>
              •
            </TextCustom>
            <TextCustom variation="p">
              Procura lucir lo más parecido a la foto de tu DNI.
            </TextCustom>
          </View>
          <View style={styles.itemList}>
            <TextCustom variation="p" style={styles.itemPoint}>
              •
            </TextCustom>
            <TextCustom variation="p">
              Asegúrate de aparecer solo tú durante la captura del selfie.
            </TextCustom>
          </View>
          <View style={styles.itemList}>
            <TextCustom variation="p" style={styles.itemPoint}>
              •
            </TextCustom>
            <TextCustom variation="p">Recuerda mirar a la cámara.</TextCustom>
          </View>
        </>
      }
      footer={
        <View style={styles.footerWrapper}>
          <Button
            orientation="horizontal"
            type="primary"
            text="Reintentar"
            onPress={() => {
              switch (scanType) {
                case 'DOI':
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'ScanDocument',
                      merge: true,
                    }),
                  );
                  break;
                case 'FACE':
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'ScanFace',
                      merge: true,
                    }),
                  );
                  break;
                case 'ALL':
                  navigation.dispatch(state => {
                    let blockForward = false;

                    const routesFiltered = state.routes.filter(
                      (route, index) => {
                        if (blockForward === false) {
                          if (route.name === 'RegisterIdentityInfo')
                            blockForward = true;
                          return true;
                        } else return false;
                      },
                    );

                    const newRoutes = routesFiltered.map(route => {
                      if (route.name === 'RegisterIdentityInfo') {
                        return {
                          ...route,
                          params: {
                            ...route.params,
                            faceScanned: undefined,
                            documentScanned: undefined,
                            autoExecute: 'DOI',
                          },
                        };
                      } else return route;
                    });

                    return CommonActions.reset({
                      ...state,
                      routes: newRoutes,
                      index: newRoutes.length - 1,
                    });
                  });

                  break;
              }
            }}
          />
          <Separator type="x-small" />
          <Button
            orientation="horizontal"
            type="secondary"
            text="Salir"
            onPress={() => {
              switch (scanType) {
                case 'ALL':
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'RegisterIdentityInfo',
                      merge: true,
                      params: {
                        faceScanned: undefined,
                        documentScanned: undefined,
                      },
                    }),
                  );
                  break;
                default:
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'RegisterIdentityInfo',
                      merge: true,
                    }),
                  );
                  break;
              }
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
    itemList: {
      flexDirection: 'row',
    },
    itemPoint: {
      marginHorizontal: 8 * 1.5,
    },
  });

  return stylesBase;
};

export default InfoScanError;
