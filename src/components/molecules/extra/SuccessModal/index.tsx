/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {Image, Pressable, ScrollView, View} from 'react-native';
import Modal from 'react-native-modal';
import {getStyles} from './styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AnimatedLottieView from 'lottie-react-native';
import Toast, {BaseToast, BaseToastProps} from 'react-native-toast-message';
import HeaderWithLogo from './Components/HeaderWithLogo';
import EmptyHeader from './Components/EmptyHeader';
import Icon, {IconName} from '@atoms/Icon';

const SuccessModal = ({
  children,
  isOpen,
  extraBottomPadding = true,
  delay = 800,
  statusBarTranslucent = false,
  icon = 'individual',
  hasToast,
  hasLogo,
  hasScrollButton,
  closeModal,
}: {
  children?: React.ReactNode;
  isOpen: boolean;
  delay?: number;
  extraBottomPadding?: boolean;
  statusBarTranslucent?: boolean;
  icon?: 'individual' | 'group';
  hasToast?: boolean;
  hasLogo?: boolean;
  hasScrollButton?: boolean;
  closeModal: () => void;
}) => {
  const animationRef = useRef<AnimatedLottieView>(null);
  const [isDone, setIsDone] = useState(true);
  const styles = getStyles(hasLogo);
  const insets = useSafeAreaInsets();

  const iconSource =
    icon === 'individual'
      ? require('@assets/images/successMan.png')
      : require('@assets/images/successPeople.png');

  useEffect(() => {
    let delayTimer: NodeJS.Timeout;
    let durationTimer: NodeJS.Timeout;
    if (isOpen) {
      delayTimer = setTimeout(() => {
        animationRef.current?.play();
      }, delay);

      durationTimer = setTimeout(() => {
        setIsDone(false);
      }, 1000);
    }

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(durationTimer);
    };
  }, [delay, isOpen]);

  const toastConfig = {
    info: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
      <BaseToast
        {...props}
        style={styles.toastStyle}
        text1Style={styles.toastText1}
        text2Style={styles.toastText2}
      />
    ),
  };

  const scrollViewRef = useRef<any>(null);

  const [scrolling, setScrolling] = useState<boolean>(false);
  const [iconName, setIconName] = useState<IconName>('icon_scroll-down');

  const handleScroll = () => {
    if (!scrolling) {
      scrollViewRef.current.getNativeScrollRef().scrollToEnd({animated: true});
      setIconName('icon_scroll-up');
      setScrolling(true);
    } else {
      scrollViewRef.current
        .getNativeScrollRef()
        .scrollTo({x: 0, y: 0, animated: true});
      setIconName('icon_scroll-down');
      setScrolling(false);
    }
  };

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
          ref={scrollViewRef}
          bounces={false}
          contentContainerStyle={{
            ...styles.scrollView,
            paddingBottom: extraBottomPadding ? insets.bottom + 20 : undefined,
          }}>
          {hasLogo ? <HeaderWithLogo /> : <EmptyHeader />}
          <Image
            source={iconSource}
            style={[styles.image, icon === 'group' ? styles.size : {}]}
          />
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              top: hasLogo ? -400 : -150,
              zIndex: 99,
            }}>
            <AnimatedLottieView
              ref={animationRef}
              style={{
                width: 175,
                position: 'absolute',
              }}
              source={require('@assets/images/Confetti.json')}
              loop={isDone}
            />
          </View>
          {children}
        </ScrollView>
        {hasScrollButton ? (
          <Pressable onPressIn={handleScroll}>
            <Icon
              style={{
                bottom: 16,
                right: 16,
                position: 'absolute',
                elevation: 36,
                shadowColor: '#222D42',
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.15,
                shadowRadius: 6,
              }}
              size={48}
              name={iconName}
            />
          </Pressable>
        ) : null}
        {hasToast ? <Toast config={toastConfig} /> : null}
      </Modal>
    </>
  );
};

export default SuccessModal;
