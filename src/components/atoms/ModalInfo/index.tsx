import Icon from '@atoms/Icon';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {Colors} from '@theme/colors';
import {Layout, SEPARATOR_BASE} from '@theme/metrics';
import React, {ReactNode} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';

interface ModalInfoProps {
  open: boolean;
  title?: string;
  message?: string;
  actions?: ReactNode;
  onRequestClose: () => void;
  onCloseButton?: () => void;
  showCloseButton?: boolean;
  titleImage?: ReactNode;
}

const ModalInfo = ({
  open,
  title,
  message,
  actions,
  onRequestClose,
  showCloseButton = false,
  onCloseButton,
  titleImage,
}: ModalInfoProps) => {
  const styles = getStyles();

  return (
    <Modal
      statusBarTranslucent
      backdropTransitionOutTiming={0}
      animationIn="zoomIn"
      animationOut="fadeOut"
      isVisible={open}
      onBackButtonPress={onRequestClose}
      onBackdropPress={onRequestClose}>
      <View style={styles.box}>
        {showCloseButton && (
          <>
            <Pressable onPress={onCloseButton} style={styles.iconClose}>
              <Icon iconName="icon_close" size={24} color={Colors.Paragraph} />
            </Pressable>
            <Separator size={SEPARATOR_BASE / 2} />
          </>
        )}
        {titleImage !== undefined && (
          <>
            {titleImage}
            <Separator size={SEPARATOR_BASE * 3} />
          </>
        )}
        {title !== undefined && (
          <TextCustom
            variation="h2"
            align="center"
            weight="normal"
            color={Colors.Paragraph}>
            {title}
          </TextCustom>
        )}
        {title !== undefined &&
          (message !== undefined || actions !== undefined) && (
            <Separator type="medium" />
          )}
        {message !== undefined && (
          <TextCustom variation="p" align="center">
            {message}
          </TextCustom>
        )}
        {actions !== undefined &&
          (message !== undefined || title !== undefined) && (
            <Separator type="medium" />
          )}
        {actions}
      </View>
    </Modal>
  );
};

const getStyles = () => {
  const styles = StyleSheet.create({
    box: {
      backgroundColor: Colors.White,
      padding: SEPARATOR_BASE * 4.5,
      borderRadius: 10,
      position: 'relative',
    },
    iconClose: {
      position: 'absolute',
      padding: SEPARATOR_BASE,
      top: 8 * 1.5,
      right: 8 * 1.5,
      zIndex: 99,
    },
  });

  return styles;
};

export default ModalInfo;
