import React, {useEffect, useLayoutEffect, useRef} from 'react';
import {Animated, StyleSheet, View, ViewStyle} from 'react-native';
import Step from '@atoms/extra/Step';
import {COLORS} from '@theme/colors';
import {ScreenSize} from '@theme/metrics';

export interface StepsProps {
  max: number;
  previous?: number;
  current: number;
  started?: boolean;
  style?: ViewStyle;
  duration?: number;
}

const Steps = ({
  max,
  current,
  previous = undefined,
  started = false,
  style,
  duration = 1000,
}: StepsProps) => {
  const styles = getStyles();
  const width = useRef(
    new Animated.Value(started ? (current * ScreenSize.width) / max : 0),
  ).current;

  useLayoutEffect(() => {
    if (previous !== undefined) {
      const FROM_WIDTH = (previous + 1) * ScreenSize.width / max;
      width.setValue(FROM_WIDTH);
    }
  }, [previous]);

  useEffect(() => {
    Animated.timing(width, {
      toValue: ((current + 1) * ScreenSize.width) / max,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [current, max]);

  return (
    <View style={{...styles.container, ...style}}>
      <Step width={width} />
    </View>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      backgroundColor: COLORS.Neutral.Light,
    },
  });

  return stylesBase;
};

export default Steps;
