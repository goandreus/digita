import React, {ReactNode} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Step from '@atoms/Step';

export interface StepsProps {
  max: number;
  current?: number;
  showLabel?: boolean;
  style?: ViewStyle;
}

const Steps = ({max, current, showLabel = true, style}: StepsProps) => {
  const styles = getStyles(max);
  const stepComponents: ReactNode[] = [];

  for (let i = 0; i < max; i++) {
    const isEnabled = current === i;
    const isLast = i === max - 1;
    const element = (
      <Step
        key={i}
        type={isEnabled ? 'enabled' : 'disabled'}
        style={{
          ...(!isLast ? styles.stepNotLastChild : undefined),
          ...styles.step,
        }}
        text={showLabel ? (i + 1).toString() : undefined}
      />
    );
    stepComponents.push(element);
  }

  return <View style={{...styles.container, ...style}}>{stepComponents}</View>;
};

const getStyles = (max: number) => {
  const stepMarginRight = 8 / 4;

  const stylesBase = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
    },
    step: {
      flex: 1,
    },
    stepNotLastChild: {
      marginRight: stepMarginRight,
    },
  });

  return stylesBase;
};

export default Steps;
