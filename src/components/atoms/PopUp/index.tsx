import React, {ReactNode} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Icon from '@atoms/Icon';
import {Colors} from '@theme/colors';
import Modal from 'react-native-modal';

interface PopUprops {
  open: boolean;
  children?: ReactNode;
  closeIcon?: boolean;
  animationOutTiming?: number;
  onRequestClose?: () => void;
}

const PopUp = ({
  open,
  children,
  closeIcon,
  animationOutTiming,
  onRequestClose,
}: PopUprops) => {
  const styles = getStyles();

  return (
    <Modal
      isVisible={open}
      animationOutTiming={animationOutTiming ?? 1000}
      onBackButtonPress={onRequestClose}>
      <View style={styles.box}>
        <View style={styles.close}>
          {closeIcon && (
            <Pressable onPress={onRequestClose}>
              <Icon name="close-small" size="small" fill="#000" />
            </Pressable>
          )}
        </View>
        <View style={styles.children}>{children}</View>
      </View>
    </Modal>
  );
};

const getStyles = () => {
  const styles = StyleSheet.create({
    close: {
      alignSelf: 'flex-end',
      padding: 24,
    },
    box: {
      alignSelf: 'center',
      width: '90%',
      alignItems: 'center',
      backgroundColor: Colors.White,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    children: {
      width: '85%',
      paddingBottom: 24,
      alignItems: 'center',
    },
  });

  return styles;
};

export default PopUp;
