/* eslint-disable react-native/no-inline-styles */
import {ImageBackground, StyleSheet} from 'react-native';
import React from 'react';
import {CreditAdviceType} from '@interface/CreditAdvice';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import Button from '@atoms/extra/Button';
import {COLORS} from '@theme/colors';
import {useNavigation} from '@react-navigation/native';

interface ContainerProps {
  isLast?: boolean;
  children: React.ReactNode;
}

type Props = {
  isLast?: boolean;
  type: CreditAdviceType;
  amount: string;
};

const Container = ({isLast, children}: ContainerProps) => {
  return isLast ? (
    <ImageBackground
      resizeMode="stretch"
      source={require('@assets/images/topAdviceBackground.png')}>
      {children}
    </ImageBackground>
  ) : (
    <BoxView
      background="primary-darkest"
      style={{
        borderBottomWidth: 1,
        borderBottomColor: COLORS.Background.Lightest,
      }}>
      {children}
    </BoxView>
  );
};

const TopAdviceCredit = ({isLast, type, amount}: Props) => {
  const navigation = useNavigation();
  const styles = getStyles();

  const advice = {
    CI: {
      text: 'Desembolsar',
      onPress: () =>
        navigation.navigate('StartDisbursement', {
          showTokenIsActivated: false,
        }),
      component: (
        <TextCustom
          variation="h5"
          color="background-lightest"
          weight="normal"
          lineHeight="fair">
          Ya está listo para desembolsar tu crédito solicitado de{' '}
          <TextCustom
            variation="h5"
            color="background-lightest"
            weight="bold"
            lineHeight="fair"
            text={amount}
          />
        </TextCustom>
      ),
    },
    CG: {
      text: 'Contratar',
      onPress: () =>
        navigation.navigate('StartGroupCredit', {
          showTokenIsActivated: false,
        }),
      component: (
        <TextCustom
          variation="h5"
          color="background-lightest"
          weight="normal"
          lineHeight="fair">
          Acepta las condiciones de tu nuevo desembolso de
          <TextCustom
            variation="h5"
            color="background-lightest"
            weight="bold"
            lineHeight="fair"
            text=" crédito grupal"
          />
          .
        </TextCustom>
      ),
    },
    LC: {
      text: 'Crear Línea',
      onPress: () =>
        navigation.navigate('LineCreditContract', {
          showTokenIsActivated: false,
        }),
      component: (
        <TextCustom
          variation="h5"
          color="background-lightest"
          weight="normal"
          lineHeight="fair">
          Acepta las condiciones y crea tu Línea de Crédito por{' '}
          <TextCustom
            variation="h5"
            color="background-lightest"
            weight="bold"
            lineHeight="fair"
            text={amount}
          />
          .
        </TextCustom>
      ),
    },
  };

  return (
    <Container isLast={isLast}>
      <BoxView
        direction="row"
        m={SIZES.MD}
        mb={isLast ? SIZES.XL : undefined}
        align="center">
        <BoxView flex={1}>{advice[type].component}</BoxView>
        <Button
          onPress={advice[type].onPress}
          loading={false}
          orientation="horizontal"
          type="secondary"
          text={advice[type].text}
          textSize={12}
          containerStyle={styles.btnContainer}
        />
      </BoxView>
    </Container>
  );
};

const getStyles = () => {
  const styles = StyleSheet.create({
    imageBackground: {},
    btnContainer: {
      paddingVertical: SIZES.XS,
      /* paddingHorizontal: SIZES.LG, */
      marginLeft: SIZES.XS,
      width: 100,
    },
  });
  return styles;
};

export default TopAdviceCredit;
