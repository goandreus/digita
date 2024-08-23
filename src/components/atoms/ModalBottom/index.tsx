import {Colors} from '@theme/colors';
import {Layout} from '@theme/metrics';
import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';

interface ModalBottomprops {
  open: boolean;
  children?: ReactNode;
  onRequestClose: () => void;
}

const ModalBottom = ({open, children, onRequestClose}: ModalBottomprops) => {
  const styles = getStyles();

  return (
    <Modal
      backdropTransitionOutTiming={0}
      animationOutTiming={1000}
      isVisible={open}
      onBackButtonPress={onRequestClose}
      onBackdropPress={onRequestClose}
      style={styles.view}>
      <View style={styles.box}>{children}</View>
    </Modal>
  );
};

const getStyles = () => {
  const styles = StyleSheet.create({
    view: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    box: {
      backgroundColor: Colors.White,
      padding: Layout.ModalMarginHorizontal,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
  });

  return styles;
};

export default ModalBottom;
