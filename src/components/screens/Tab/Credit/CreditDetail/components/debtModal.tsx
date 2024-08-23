import {View, StyleSheet} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import Separator from '@atoms/extra/Separator';
import Icon from '@atoms/Icon';
import TextCustom from '@atoms/extra/TextCustom';
import Button from '@atoms/extra/Button';

interface Props {
  isOpen: boolean;
  onPress: () => void;
}

export const DebtModal = ({isOpen, onPress}: Props) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles({insets});

  return (
    <Modal
      backdropTransitionOutTiming={0}
      onBackdropPress={onPress}
      animationInTiming={600}
      animationOutTiming={600}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      statusBarTranslucent
      backdropColor={COLORS.Neutral.Dark}
      backdropOpacity={0.78}
      isVisible={isOpen}
      useNativeDriver
      style={styles.modal}>
      <View style={styles.mainContainer}>
        <Icon size={110} name="due-pay" />
        <Separator type="medium" />
        <TextCustom
          text="¡Cuota(s) pendiente de pago!"
          variation={'h0'}
          weight={'normal'}
          color={'primary-medium'}
          lineHeight="fair"
        />
        <Separator type="small" />
        <TextCustom
          text={
            'Lamentablemente el pago de tu crédito está pendiente. Recuerda que a más días de atraso mayor pago de moras y cargos.\n \n No pagar afecta tu calificación crediticia.'
          }
          variation={'p4'}
          align="center"
          weight={'normal'}
          color={'neutral-darkest'}
          lineHeight="comfy"
        />
        <Separator type="medium" />
        <Button
          containerStyle={styles.btnContainer}
          onPress={onPress}
          orientation="horizontal"
          type="primary"
          text="Entendido"
        />
      </View>
    </Modal>
  );
};

const getStyles = ({insets}: {insets: EdgeInsets}) => {
  return StyleSheet.create({
    modal: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      margin: 0,
    },
    mainContainer: {
      alignItems: 'center',
      backgroundColor: COLORS.Background.Lightest,
      borderTopLeftRadius: SIZES.MD,
      borderTopRightRadius: SIZES.MD,
      paddingHorizontal: SIZES.XS * 6,
      paddingTop: SIZES.XL,
      paddingBottom: SIZES.XS * 5 + insets.bottom,
    },
    btnContainer: {
      width: '100%',
    },
    logo: {
      width: 110,
      height: 130,
    },
  });
};
