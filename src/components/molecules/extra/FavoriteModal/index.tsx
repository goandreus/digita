import Icon from '@atoms/Icon';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';

interface Action {
  id: string;
  render: ReactNode;
}

interface ActionUtils {
  close: () => void;
}

interface AlertBasicProps {
  isOpen: boolean;
  title: string;
  description: string;
  body?: ReactNode;
  statusBarTranslucent?: boolean;
  actions: (utils: ActionUtils) => Action[];
  onClose?: () => void;
  onTouchBackdrop?: () => void;
  closeOnTouchBackdrop?: boolean;
  onModalHide?: () => void;
  forwardedRef?: React.ForwardedRef<Modal>;
}

const FavoriteModal = ({
  actions,
  closeOnTouchBackdrop = false,
  body,
  statusBarTranslucent,
  isOpen,
  title,
  description,
  onClose = () => {},
  onTouchBackdrop = undefined,
  onModalHide,
  forwardedRef,
}: AlertBasicProps) => {
  const insets = useSafeAreaInsets();

  const actionsArray = actions({close: onClose});

  const styles = getStyles(insets);
  return (
    <Modal
      ref={forwardedRef}
      onModalHide={onModalHide}
      backdropTransitionOutTiming={0}
      onBackdropPress={
        closeOnTouchBackdrop
          ? typeof onTouchBackdrop === 'function'
            ? onTouchBackdrop
            : onClose
          : undefined
      }
      animationInTiming={1000}
      animationOutTiming={300}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      statusBarTranslucent={statusBarTranslucent}
      backdropColor={COLORS.Neutral.Dark}
      backdropOpacity={0.78}
      isVisible={isOpen}
      avoidKeyboard={true}
      style={styles.modal}>
      <View style={styles.container}>
        <View style={styles.content_icon}>
          <Icon name="star-favorite" size="extra-large" />
        </View>
        <Separator size={SIZES.MD} />
        <TextCustom
          color="primary-medium"
          lineHeight="fair"
          variation="h0"
          weight="normal"
          align="center">
          {title}
        </TextCustom>
        <Separator size={SIZES.MD} />
        {body}
        <Separator size={SIZES.MD} />
        <TextCustom
          color="neutral-darkest"
          lineHeight="comfy"
          variation="p4"
          weight="normal"
          align="center">
          {description}
        </TextCustom>
        {actionsArray.length > 0 && <Separator size={SIZES.LG} />}
        {actionsArray.map((item, index) => (
          <React.Fragment key={item.id}>
            {item.render}
            {index < actionsArray.length - 1 && <Separator size={SIZES.MD} />}
          </React.Fragment>
        ))}
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
    content_icon: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });
  return styles;
};

export default React.forwardRef<Modal, AlertBasicProps>((props, ref) => (
  <FavoriteModal {...props} forwardedRef={ref} />
));
