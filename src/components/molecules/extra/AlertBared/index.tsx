import Button, {ButtonType} from '@atoms/extra/Button';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import React, {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';

interface ActionUtils {
  close: () => void;
}

interface AlertBaredProps {
  isOpen: boolean;
  content: (utils: ActionUtils) => ReactNode;
  onClose: () => void;
  closeOnTouchBackdrop?: boolean;
  onModalHide?: () => void;
}

const AlertBared = ({
  closeOnTouchBackdrop = false,
  content,
  isOpen,
  onClose,
  onModalHide
}: AlertBaredProps) => {
  const insets = useSafeAreaInsets();

  const styles = getStyles(insets);
  return (
    <Modal
      onModalHide={onModalHide}
      backdropTransitionOutTiming={0}
      onBackdropPress={closeOnTouchBackdrop ? onClose : undefined}
      animationInTiming={1000}
      animationOutTiming={300}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropColor={COLORS.Neutral.Dark}
      backdropOpacity={0.78}
      isVisible={isOpen}
      style={styles.modal}>
      <View style={styles.container}>
        {content({close: onClose})}
      </View>
    </Modal>
  );
};

const getStyles = (insets: EdgeInsets) => {
  const styles = StyleSheet.create({
    modal: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      margin: 0,
    },
    container: {
      backgroundColor: COLORS.Background.Lightest,
      borderTopLeftRadius: SIZES.XS,
      borderTopRightRadius: SIZES.XS,
      paddingHorizontal: SIZES.XS * 6,
      paddingTop: SIZES.XS * 5,
      paddingBottom: SIZES.XS * 5 + insets.bottom,
    },
  });
  return styles;
};

export default AlertBared;
