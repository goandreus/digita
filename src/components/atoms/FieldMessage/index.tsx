import React, {ReactNode} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '@theme/colors';
import {FontSizes, FontTypes} from '@theme/fonts';
import Icon from '@atoms/Icon';

export type FieldMessageType = 'error' | 'success' | 'neutral';

interface FieldMessageProps {
  text: string;
  type: FieldMessageType;
}

const FieldMessage = ({text, type}: FieldMessageProps) => {
  const styles = getStyles(type);

  let icon: ReactNode;

  switch (type) {
    case 'error':
      icon = (
        <Icon
          name="exclamation-circle"
          size="tiny"
          fill={styles.iconFill}
          style={styles.icon}
        />
      );
      break;
    case 'success':
      icon = (
        <Icon
          name="check-on"
          size="tiny"
          fill={styles.iconFill}
          style={styles.icon}
        />
      );
      break;
    case 'neutral':
      icon = (
        <Icon
          name="check-off"
          size="tiny"
          stroke={styles.iconFill}
          style={styles.icon}
        />
      );
      break;
  }

  return (
    <View style={styles.container}>
      {icon}
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const getStyles = (type: FieldMessageType) => {
  let textColor: string;
  let iconFill: string;

  switch (type) {
    case 'error':
      textColor = Colors.Primary;
      iconFill = Colors.Primary;
      break;
    case 'success':
      textColor = Colors.Paragraph;
      iconFill = Colors.GreenCheck;
      break;
    case 'neutral':
      textColor = Colors.Paragraph;
      iconFill = Colors.Paragraph;
      break;
  }

  const stylesBase = StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    icon: {
      marginRight: 8,
    },
    textContainer: {
      flexShrink: 1,
    },
    text: {
      fontFamily: FontTypes.AmorSansPro,
      fontSize: FontSizes.Small,
      color: textColor,
    },
  });

  return {...stylesBase, iconFill};
};

export default FieldMessage;
