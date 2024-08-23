import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import TextCustom from '@atoms/extra/TextCustom';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import Separator from '@atoms/extra/Separator';
import Button from '@atoms/extra/Button';
import Icon from '@atoms/Icon';

interface Props {
  isOpen: boolean;
  icon: 'info-insurance' | 'info-insurance2';
  title: string;
  content: string | null;
  btnText1: string;
  btnText2: string;
  onPress1: () => void;
  onPress2: () => void;
}

export const InfoModal = ({
  isOpen,
  icon,
  title,
  content,
  btnText1,
  btnText2,
  onPress1,
  onPress2,
}: Props) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles({insets});

  return (
    <Modal
      backdropTransitionOutTiming={0}
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
        <Icon name={icon} size={110} />
        <Separator type="medium" />
        <TextCustom
          text={title}
          variation={'h0'}
          weight={'normal'}
          color={'primary-medium'}
          lineHeight="fair"
        />
        {content && (
          <>
            <Separator type="small" />
            <TextCustom
              text={content}
              variation={'p4'}
              align="center"
              weight={'normal'}
              color={'neutral-darkest'}
              lineHeight="comfy"
            />
          </>
        )}
        <Separator type="medium" />
        <Button
          containerStyle={styles.btnContainer}
          onPress={onPress1}
          orientation="horizontal"
          type="primary"
          text={btnText1}
        />
        <Separator type="medium" />
        <Button
          containerStyle={styles.btnContainer}
          onPress={onPress2}
          haveBorder
          orientation="horizontal"
          type="primary-inverted"
          text={btnText2}
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
      paddingTop: SIZES.XS * 5,
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
