import React, {ReactNode} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from '@atoms/Icon';
import {COLORS} from '@theme/colors';
import {FONTS, FONT_SIZES} from '@theme/fonts';

export type FieldMessageType = 'error' | 'error-off' | 'success' | 'neutral';

interface FieldMessageProps {
  text: string;
  type: FieldMessageType;
  hideIconLeft?: boolean;
}

const FieldMessage = ({text, type, hideIconLeft}: FieldMessageProps) => {
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
    case 'error-off':
      icon = (
        <Icon
          name="check-off"
          size="tiny"
          stroke={styles.iconFill}
          style={styles.icon}
        />
      );
      break;
    case 'success':
      icon = (
        <Icon
          name="icon_radio-fill"
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
      {hideIconLeft ? null : icon}
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
      textColor = COLORS.Error.Medium;
      iconFill = COLORS.Error.Medium;
      break;
    case 'error-off':
      textColor = COLORS.Error.Medium;
      iconFill = COLORS.Error.Medium;
      break;
    case 'success':
      textColor = COLORS.Neutral.Darkest;
      iconFill = COLORS.Success.Medium;
      break;
    case 'neutral':
      textColor = COLORS.Neutral.Darkest;
      iconFill = COLORS.Neutral.Medium;
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
      fontFamily: FONTS.AmorSansPro,
      fontSize: FONT_SIZES.SM,
      color: textColor,
    },
  });

  return {...stylesBase, iconFill};
};

export default FieldMessage;
