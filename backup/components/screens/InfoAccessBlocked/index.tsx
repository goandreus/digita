import TextCustom from '@atoms/TextCustom';
import InfoTemplate from '@templates/InfoTemplate';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import SVGMan from '@assets/images/vector_men_lock.svg';
import {StyleSheet, View} from 'react-native';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import {InfoAccessBlockedScreenProps} from '@navigations/types';
import {useLastUser} from '@hooks/common';

export type AttemptType = 3 | 4 | 5;

const InfoAccessBlocked = ({
  navigation,
  route,
}: InfoAccessBlockedScreenProps) => {
  const {lastUser} = useLastUser();

  const styles = getStyles();

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
      title="Lo sentimos, tu acceso se encuentra bloqueado"
      imageSVG={SVGMan}
      descriptionAbove={
        <>
          <TextCustom variation="p">
            Hemos detectado una actividad inusual en el uso de tu App
            Compartamos Financiera y por tu seguridad hemos bloqueado tu acceso.
          </TextCustom>
          <Separator size={8 * 2} />
          <TextCustom variation="p">
            Para volver ingresar, crea una nueva clave digital desde la opción{" "}
            <TextCustom variation="p" weight="bold">
              Olvidé mi clave.
            </TextCustom>
          </TextCustom>
        </>
      }
      footer={
        <View style={styles.footerWrapper}>
          <Separator type="x-small" />
          <Button
            orientation="horizontal"
            type="primary"
            text="Olvidé mi clave"
            onPress={() => {
              if (
                lastUser === undefined ||
                lastUser.firstName === undefined ||
                lastUser.document === undefined
              )
                navigation.reset({
                  index: 2,
                  routes: [
                    {name: 'Home'},
                    {name: 'LoginNormal'},
                    {name: 'RecoverPassword'},
                  ],
                });
              else
                navigation.reset({
                  index: 2,
                  routes: [
                    {name: 'Home'},
                    {
                      name: 'LoginSecure',
                      params: {
                        firstName: lastUser.firstName,
                        documentType: lastUser.document.type,
                        documentNumber: lastUser.document.number,
                      },
                    },
                    {name: 'RecoverPassword'},
                  ],
                });
            }}
          />
          <Separator type="x-small" />
          <Button
            orientation="horizontal"
            type="secondary"
            text="Salir"
            onPress={() => {
              navigation.reset({
                index: 1,
                routes: [{name: 'Home'}, {name: 'Login'}],
              });
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

export default InfoAccessBlocked;
