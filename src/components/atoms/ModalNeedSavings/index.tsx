/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import Modal from 'react-native-modal';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import Button from '@atoms/Button';
import {FONTS} from '@theme/fonts';

interface IProps {
  show: boolean;
  title: string;
  subtitle: string;
  onButtonPress: () => void;
}

const ModalNeedSavings: FC<IProps> = ({show, title, subtitle, onButtonPress}) => {
  return (
    <Modal
      backdropTransitionOutTiming={0}
      onBackdropPress={() => {}}
      animationInTiming={500}
      animationOutTiming={500}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropColor={COLORS.Neutral.Dark}
      backdropOpacity={0.78}
      isVisible={show}
      style={styles.modal}>
      <View style={styles.container}>
        <View
          style={{
            display: 'flex',
            alignSelf: 'center',
          }}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
          <Button
            orientation={'vertical'}
            type={'primary'}
            onPress={() => {
              onButtonPress();
            }}
            text="Entiendo"
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalNeedSavings;

const styles = StyleSheet.create({
  modal: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    backgroundColor: COLORS.Background.Lightest,
    borderTopLeftRadius: SIZES.XS,
    borderTopRightRadius: SIZES.XS,
    paddingHorizontal: 48,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontFamily: FONTS.Bree,
    fontWeight: '500',
    fontSize: 18,
    color: '#CA005D',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.AmorSansPro,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
});
