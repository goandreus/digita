import React from 'react';
import {Animated, StyleSheet, ViewStyle} from 'react-native';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
interface StepProps {
  width: Animated.Value;
  style?: ViewStyle;
}

const Step = ({style, width}: StepProps) => {
  const styles = getStyles();
  return (
    <Animated.View style={{...styles.component, ...style, width: width}} />
  );
};

export default Step;

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    component: {
      backgroundColor: COLORS.Secondary.Medium,
      height: SIZES.XS,
      borderTopRightRadius: SIZES.XXS,
      borderBottomRightRadius: SIZES.XXS,
    },
  });

  return {...stylesBase};
};
