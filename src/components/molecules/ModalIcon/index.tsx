import Icon, {IconName} from '@atoms/Icon';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {Colors} from '@theme/colors';
import {Layout} from '@theme/metrics';
import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';

interface ModalIconProps {
  open: boolean;
  type?: string;
  message?: string;
  description?: string;
  actions?: ReactNode;
  onRequestClose: () => void;
}

const ModalIcon = ({
  open,
  type,
  message,
  description,
  actions,
  onRequestClose,
}: ModalIconProps) => {
  const styles = getStyles();

  let icon: React.ReactNode;

  switch (type) {
    case 'SUCCESS':
      icon = <Icon name="check-on" size={8 * 7} fill={Colors.Primary} />;
      break;
    default:
      break;
  }

  return (
    <Modal
      backdropTransitionOutTiming={0}
      animationIn="zoomIn"
      animationOut="fadeOut"
      statusBarTranslucent
      isVisible={open}
      onBackButtonPress={onRequestClose}
      onBackdropPress={onRequestClose}>
      <View style={styles.box}>
        {icon !== undefined && <View style={styles.iconWrapper}>{icon}</View>}
        {icon !== undefined &&
          (message !== undefined || actions !== undefined) && (
            <Separator type="medium" />
          )}
        {message !== undefined && (
          <TextCustom 
            variation={type === 'token' ? "h1" : "p" }
            align="center"
            weight={type === 'token' ? "normal" : "bold" }
            color={Colors.Paragraph}
            size={18}>
            {message}
          </TextCustom>
        )}
        <Separator type="small" />
        {description !== undefined && (
          <TextCustom variation="p" align="center" weight="normal">
            {description}
          </TextCustom>
        )}
        {actions !== undefined &&
          (message !== undefined || icon !== undefined) && (
            <Separator type="medium" />
          )}
        {actions}
      </View>
    </Modal>
  );
};

const getStyles = () => {
  const styles = StyleSheet.create({
    iconWrapper: {
      alignItems: 'center',
    },
    box: {
      backgroundColor: Colors.White,
      padding: Layout.ModalMarginHorizontal,
      borderRadius: 10,
    },
  });

  return styles;
};

export default ModalIcon;
