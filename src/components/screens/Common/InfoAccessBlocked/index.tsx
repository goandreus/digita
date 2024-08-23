import React, {useEffect, useLayoutEffect} from 'react';
import {StatusBar} from 'react-native';
import {InfoAccessBlockedScreenProps} from '@navigations/types';
import {useLastUser} from '@hooks/common';
import {COLORS} from '@theme/colors';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import Button from '@atoms/extra/Button';
import { useSessionExpiredHandler } from '@hooks/useSessionExpiredHandler';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { update } from '@features/activity';

export type AttemptType = 3 | 4 | 5;

export const InfoAccessBlocked = ({
  navigation,
  route
}: InfoAccessBlockedScreenProps) => {
  const {lastUser} = useLastUser();
  const {handleCloseSession} = useSessionExpiredHandler();
  const dispatch = useAppDispatch();

  const description = route.params?.description;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  useEffect(() => {
    handleCloseSession({ navigateToHome: false });
    dispatch(update({ isTokenExpired: false }));
  }, []);

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK') e.preventDefault();
    });
    return () => unsubscribe();
  }, [navigation]);

  const unLockAccess = () => {
    if (
      lastUser === undefined ||
      lastUser.firstName === undefined ||
      lastUser.document === undefined
    ) {
      navigation.reset({
        index: 2,
        routes: [
          {name: 'Home'},
          {name: 'LoginNormal'},
          {name: 'RecoverPassword'},
        ],
      });
    } else {
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
    }
  };

  const exitScreen = () => {
    navigation.reset({
      index: 1,
      routes: [{name: 'Home'}, {name: 'Login'}],
    });
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.Transparent}
        translucent={true}
      />

      <BoxView flex={1} mx={'12%'} justify="center">
        <TextCustom
          text={'¡Tu acceso se encuentra \nbloqueado!'}
          align="center"
          variation="h0"
          weight="normal"
          color="primary-medium"
          lineHeight="fair"
        />
        <Separator type="medium" />
        <TextCustom
          text={
            description || "Se detectó una actividad inusual al intentar realizar la transferencia y por seguridad bloqueamos tu acceso."
          }
          variation="p0"
          weight="normal"
          align="center"
          color="neutral-darkest"
          lineHeight="fair"
        />
        <Separator size={16} />
        <Separator type="medium" />
        <Button
          orientation="horizontal"
          type="primary"
          text="Desbloquear mi acceso"
          onPress={unLockAccess}
        />
        <Separator type="small" />
        <Button
          orientation="horizontal"
          type="primary-inverted"
          haveBorder
          text="Salir"
          onPress={exitScreen}
        />
      </BoxView>
    </>
  );
};
