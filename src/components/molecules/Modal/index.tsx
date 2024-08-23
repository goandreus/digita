import React, {ReactElement} from 'react';
import {StyleSheet, TouchableOpacity, Modal as ModalBasic} from 'react-native';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  children?: ReactElement | ReactElement[];
}

const Modal = ({children, isOpen, onClose}: Props) => {
  return (
    <ModalBasic
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} style={styles.container}>
        {children}
      </TouchableOpacity>
    </ModalBasic>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    position: 'relative',
  },
});

export default Modal;
