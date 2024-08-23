import {View, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Button from '@atoms/extra/Button';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import Separator from '@atoms/extra/Separator';
import Icon from '@atoms/Icon';
import {CreditAdviceType} from '@interface/CreditAdvice';
import {useNavigation} from '@react-navigation/native';

interface Props {
  type: CreditAdviceType;
  amount: string;
  onClose: () => void;
}

const BottonAdviceCredit = ({type, amount, onClose}: Props) => {
  const navigation = useNavigation();
  const advice = {
    CI: {
      btnText: 'Desembolsar ahora',
      onPress: () =>
        navigation.navigate('StartDisbursement', {
          showTokenIsActivated: false,
        }),
      component: (
        <>
          <TextCustom
            text="¡Haz tu desembolso!"
            variation="h4"
            weight="bold"
            lineHeight={'tight'}
            color="background-lightest"
          />
          <Separator type="x-small" />
          <TextCustom
            variation="h4"
            weight="normal"
            size={13}
            lineHeight={'tight'}
            color="background-lightest">
            Ya se encuentra listo tu crédito solicitado de{' '}
            <TextCustom
              text={amount}
              variation="h4"
              size={13}
              weight="bold"
              lineHeight={'tight'}
              color="background-lightest"
            />
          </TextCustom>
        </>
      ),
    },
    CG: {
      btnText: 'Contratar ahora',
      onPress: () =>
        navigation.navigate('StartGroupCredit', {
          showTokenIsActivated: false,
        }),
      component: (
        <>
          <TextCustom
            text="¡Contrata tu Crédito Grupal!"
            variation="h4"
            weight="bold"
            lineHeight={'tight'}
            color="background-lightest"
          />
          <Separator type="x-small" />
          <TextCustom
            variation="h4"
            weight="normal"
            size={13}
            lineHeight={'tight'}
            color="background-lightest">
            Acepta las condiciones de tu nuevo{' '}
            <TextCustom
              text={'desembolso grupal.'}
              variation="h4"
              size={13}
              weight="bold"
              lineHeight={'tight'}
              color="background-lightest"
            />
          </TextCustom>
        </>
      ),
    },
    LC: {
      btnText: 'Desembolsar ahora',
      onPress: () =>
        navigation.navigate('LineCreditContract', {
          showTokenIsActivated: false,
        }),
      component: (
        <>
          <TextCustom
            text={`¡Crea tu Línea de Crédito por ${amount}!`}
            variation="h4"
            weight="bold"
            lineHeight={'tight'}
            color="background-lightest"
          />
          <Separator type="x-small" />
          <TextCustom
            text="Acepta las condiciones y obtén efectivo al instante."
            variation="h4"
            weight="normal"
            size={13}
            lineHeight={'tight'}
            color="background-lightest"
          />
        </>
      ),
    },
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onClose} style={styles.icon}>
        <Icon name="close" size="tiny" />
      </Pressable>

      {advice[type].component}

      <Separator type="x-small" />
      <Button
        containerStyle={styles.btnContainer}
        onPress={advice[type].onPress}
        loading={false}
        textSize={12}
        orientation="horizontal"
        type="secondary"
        text={advice[type].btnText}
      />
    </View>
  );
};

export default BottonAdviceCredit;

const styles = StyleSheet.create({
  container: {
    paddingTop: SIZES.XL,
    paddingBottom: SIZES.MD,
    paddingHorizontal: SIZES.MD,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: COLORS.Primary.Medium,
  },
  btnContainer: {
    paddingHorizontal: SIZES.LG,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  icon: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: SIZES.MD,
  },
});
