import React from 'react';
import {Image, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import {Path, Svg} from 'react-native-svg';
import {getStyles} from './styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CancellationModal = ({
  children,
  isOpen,
  statusBarTranslucent = false,
  closeModal,
}: {
  children?: React.ReactNode;
  isOpen: boolean;
  delay?: number;
  statusBarTranslucent?: boolean;
  closeModal: () => void;
}) => {
  const styles = getStyles();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Modal
        backdropTransitionOutTiming={0}
        onBackdropPress={closeModal}
        animationInTiming={600}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        hasBackdrop={false}
        statusBarTranslucent={statusBarTranslucent}
        isVisible={isOpen}
        useNativeDriver
        style={styles.modal}>
        <ScrollView
          bounces={false}
          contentContainerStyle={{
            ...styles.scrollView,
            paddingBottom: insets.bottom + 20,
          }}>
          <Svg
            style={{alignSelf: 'center'}}
            width="100%"
            height="150"
            viewBox="15 24 360 112"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <Path
              scaleX={1.1}
              d="M359.998 -88.9999V75.9809C317.642 91.7253 267.715 101.952 207.381 107.565C127.797 114.968 57.6709 112.27 0 105.583L5.45208e-06 -89L359.998 -88.9999Z"
              fill="#CA005D"
            />
          </Svg>
          <Image
            source={require('@assets/images/thinkingMan.png')}
            style={styles.image}
          />
          {children}
        </ScrollView>
      </Modal>
    </>
  );
};

export default CancellationModal;
