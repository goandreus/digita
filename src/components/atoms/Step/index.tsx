import React from 'react';
import {StyleSheet, View, Text, ViewStyle} from 'react-native';
import {Colors} from '@theme/colors';
import SVGStep from '@assets/icons/step.svg';
import {FontSizes, FontTypes} from '@theme/fonts';

export type StepType = 'enabled' | 'disabled';

interface StepProps {
  type: StepType;
  text?: string;
  width?: string | number;
  style?: ViewStyle;
}

const Step = ({type, text, width, style}: StepProps) => {
  const styles = getStyles(type);
  const haveText = text !== undefined;
  return (
    <View style={{...styles.container, ...style}}>
      <SVGStep
        width={width}
        fill={styles.iconFill}
        preserveAspectRatio="none"
      />
      {haveText && (
        <View style={styles.textContainer}>
          <Text style={styles.text}>{text}</Text>
        </View>
      )}
    </View>
  );
};

const getStyles = (type: StepType) => {
  let iconFill: string;
  let textColor: string;

  switch (type) {
    case 'enabled':
      iconFill = Colors.Primary;
      textColor = Colors.White;
      break;
    case 'disabled':
      iconFill = Colors.Disabled;
      textColor = Colors.White;
      break;
  }

  const stylesBase = StyleSheet.create({
    container: {
      position: 'relative',
    },
    textContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: FontSizes.Paragraph,
      fontFamily: FontTypes.BreeBold,
      color: textColor,
    },
  });

  return {...stylesBase, iconFill};
};

export default Step;
