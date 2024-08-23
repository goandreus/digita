import TextCustom from '@atoms/TextCustom';
import InfoTemplate from '@templates/InfoTemplate';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import SVGSecurityMan from '@assets/images/securityMan.svg';
import {Information} from '@global/information';
import {Linking, StyleSheet, View} from 'react-native';
import Button from '@atoms/Button';
import Separator from '@atoms/Separator';
import {InfoAttemptRestrictionScreenProps} from '@navigations/types';
import moment from 'moment';
import {padStart} from 'lodash';

export type AttemptType = 3 | 4 | 5;

const InfoAttemptRestriction = ({
  navigation,
  route,
}: InfoAttemptRestrictionScreenProps) => {
  const styles = getStyles();

  const {attempt, firedAt} = route.params;

  const [now, setNow] = useState<number>(new Date().getTime());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date().getTime());
    }, 100);
    return () => clearInterval(id);
  }, []);

  const isLastAttempt = attempt === 5;
  let isExpired: boolean = false;

  let duration: moment.Duration | undefined = undefined;
  let expiredAt: moment.Moment | undefined = undefined;

  switch (attempt) {
    case 3:
      expiredAt = moment(firedAt).add(15, 'minutes');
      break;
    case 4:
      expiredAt = moment(firedAt).add(60, 'minutes');
      break;
    case 5:
      expiredAt = moment(firedAt).endOf('day');
      break;
  }

  duration = moment.duration(expiredAt.diff(now));

  let remainingText: string | undefined = undefined;

  if (duration !== undefined) {
    if (duration.asMilliseconds() > 0) {
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      let arr: string[] = [];

      arr.push(padStart(minutes.toString(), 2, '0'));
      arr.push(padStart(seconds.toString(), 2, '0'));

      remainingText = arr.join(':');
    } else {
      remainingText = '00:00';
      isExpired = true;
    }
  }

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK' && isExpired === false)
        e.preventDefault();
    });
    return () => unsubscribe();
  }, [navigation, isExpired]);

  useEffect(() => {
    if (isExpired && navigation.canGoBack()) navigation.goBack();
  }, [isExpired, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  return (
    <InfoTemplate
      useSafeView={true}
      title="Superaste los intentos permitidos"
      imageSVG={SVGSecurityMan}
      descriptionAbove={
        <TextCustom variation="p">
          Has ingresado{' '}
          <TextCustom variation="p" weight="bold">
            {attempt} códigos de activación errados
          </TextCustom>
          , por tu seguridad podrás enviar un nuevo código de activación{' '}
          {isLastAttempt ? (
            <TextCustom variation="p" weight="bold">
              el día de mañana.
            </TextCustom>
          ) : (
            <>
              en:{' '}
              <TextCustom variation="p" weight="bold">
                {remainingText} minutos.
              </TextCustom>
            </>
          )}
        </TextCustom>
      }
      descriptionBelow={
        isLastAttempt ? null : (
          <TextCustom variation="p">
            Si no deseas esperar el tiempo señalado, comunícate con nosotros
            llamando a nuestra central telefónica{' '}
            {Information.PhoneContactFormatted}.
          </TextCustom>
        )
      }
      footer={
        <View style={styles.footerWrapper}>
          {isLastAttempt ? null : (
            <>
              <Button
                orientation="horizontal"
                type="primary"
                text="Llámanos"
                onPress={() => {
                  Linking.openURL(`tel:${Information.PhoneContact}`);
                }}
              />
              <Separator type="x-small" />
            </>
          )}
          <Button
            orientation="horizontal"
            type="secondary"
            text="Volver a Inicio"
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
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

export default InfoAttemptRestriction;
