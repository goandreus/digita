import React, {useEffect, useRef, useState} from 'react';
import {Animated, BackHandler, StatusBar, StyleSheet, View} from 'react-native';
import {COLORS} from '@theme/colors';
import AnimatedLottieView from 'lottie-react-native';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';

interface Props {
  text1?: string;
  text2?: string;
}

const LoadingLong = ({
  text1 = 'Desembolsando tu crédito...',
  text2 = 'Espera un momento por favor...',
}: Props) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [visible, setVisible] = useState(true);
  const [text, setText] = useState(text1);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setVisible(false);
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setVisible(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (visible) {
        setText(text === text1 ? text2 : text1);
        fadeIn();
      } else fadeOut();
      setVisible(!visible);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [visible]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.Transparent}
        translucent={true}
      />
      <View style={styles.container}>
        <AnimatedLottieView
          style={{width: '100%'}}
          source={require('@assets/images/cardumen2.json')}
          autoPlay
          loop
        />
        <Separator size={50} />
        <Animated.View
          style={{
            opacity: fadeAnim,
          }}>
          <TextCustom
            text={text}
            variation="h0"
            lineHeight="tight"
            weight="bold"
            color="neutral-lightest"
          />
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Primary.Medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingLong;
