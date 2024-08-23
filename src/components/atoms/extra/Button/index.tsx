import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  TextStyle,
} from 'react-native';

import Icon, {IconName, IconSize} from '@atoms/Icon';
import {useRoute} from '@react-navigation/native';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {FONT_SIZES, FONTS} from '@theme/fonts';

export type ButtonOrientation =
  | 'vertical'
  | 'horizontal'
  | 'horizontal-reverse';
export type ButtonType =
  | 'primary'
  | 'primary-inverted'
  | 'secondary'
  | 'neutral'
  | 'neutral-inverted'
  | 'tertiary'
  | 'link'
  | 'lightest';

interface ButtonProps {
  text?: string;
  textSize?: number;
  icon?: IconName;
  iconSize?: IconSize | number;
  orientation?: ButtonOrientation;
  type: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  haveBorder?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  onPress: () => void;
  actionName?: string;
}

const Button = ({
  type,
  textSize,
  orientation = 'horizontal',
  onPress,
  text,
  icon,
  iconSize = 'small',
  disabled = false,
  loading = false,
  haveBorder = false,
  containerStyle,
  textStyle,
  actionName,
}: ButtonProps) => {
  const haveText = text !== undefined;
  const haveIcon = icon !== undefined;

  const route = useRoute();

  return (
    <Pressable
      {...(disabled
        ? {dtActionIgnore: true}
        : {
            dtActionName: `* ${route.name}-Botón-${actionName || text || icon}`,
          })}
      onPress={() => {
        return (!disabled && !loading ? onPress() : undefined);
      }}
      style={({pressed}) => ({
        ...getStyles(
          orientation,
          type,
          haveText,
          haveIcon,
          haveBorder,
          pressed,
          disabled,
          textSize,
        ).container,
        ...containerStyle,
      })}>
      {({pressed}) => {
        const styles = getStyles(
          orientation,
          type,
          haveText,
          haveIcon,
          haveBorder,
          pressed,
          disabled,
          textSize,
        );

        return (
          <>
            {loading ? (
              <ActivityIndicator size={SIZES.MD} color={styles.iconFill} />
            ) : (
              <>
                {haveText && <Text style={{...styles.text,...textStyle}}>{text}</Text>}
                {haveIcon && (
                  <Icon
                    name={icon}
                    size={iconSize}
                    fill={styles.iconFill}
                    style={styles.icon}
                  />
                )}
              </>
            )}
          </>
        );
      }}
    </Pressable>
  );
};

const getStyles = (
  orientation: ButtonOrientation,
  type: ButtonType,
  haveText: boolean,
  haveIcon: boolean,
  haveBorder: boolean,
  pressed: boolean,
  disabled: boolean,
  textSize?: number,
) => {
  let iconFill: string;
  let stylesContainer: ViewStyle = {};
  let stylesText: TextStyle = {};
  let stylesIcon: ViewStyle = {};

  switch (orientation) {
    case 'vertical':
      stylesContainer.flexDirection = 'column-reverse';
      if (haveText && haveIcon) {
        stylesIcon.marginBottom = SIZES.XS;
      }
      break;
    case 'horizontal':
      stylesContainer.flexDirection = 'row';
      if (haveText && haveIcon) {
        stylesIcon.marginLeft = SIZES.XS;
      }
      break;
    case 'horizontal-reverse':
      stylesContainer.flexDirection = 'row-reverse';
      if (haveText && haveIcon) {
        stylesIcon.marginRight = SIZES.XS;
      }
      break;
  }

  switch (type) {
    case 'primary':
      if (disabled) {
        stylesContainer.backgroundColor = COLORS.Primary.Light;
        stylesText.color = COLORS.Neutral.Lightest;
      } else if (!pressed) {
        stylesContainer.backgroundColor = COLORS.Primary.Medium;
        stylesText.color = COLORS.Neutral.Lightest;
      } else {
        stylesContainer.backgroundColor = COLORS.Primary.Darkest;
        stylesText.color = COLORS.Neutral.Lightest;
      }
      break;
    case 'primary-inverted':
      if (disabled) {
        stylesContainer.backgroundColor = COLORS.Transparent;
        stylesText.color = COLORS.Neutral.Medium;
      } else if (!pressed) {
        stylesContainer.backgroundColor = COLORS.Transparent;
        stylesText.color = COLORS.Primary.Medium;
      } else {
        stylesContainer.backgroundColor = COLORS.Transparent;
        stylesText.color = COLORS.Primary.Darkest;
      }
      break;
    case 'secondary':
      if (disabled) {
        stylesContainer.backgroundColor = COLORS.Secondary.Light;
        stylesText.color = COLORS.Neutral.Medium;
      } else if (!pressed) {
        stylesContainer.backgroundColor = COLORS.Secondary.Medium;
        stylesText.color = COLORS.Neutral.Darkest;
      } else {
        stylesContainer.backgroundColor = COLORS.Secondary.Dark;
        stylesText.color = COLORS.Neutral.Lightest;
      }
      break;
    case 'neutral':
      if (disabled) {
        stylesContainer.backgroundColor = COLORS.Neutral.Light;
        stylesText.color = COLORS.Neutral.Lightest;
      } else if (!pressed) {
        stylesContainer.backgroundColor = COLORS.Neutral.Medium;
        stylesText.color = COLORS.Neutral.Lightest;
      } else {
        stylesContainer.backgroundColor = COLORS.Neutral.Darkest;
        stylesText.color = COLORS.Neutral.Lightest;
      }
      break;
    case 'neutral-inverted':
      if (disabled) {
        stylesContainer.backgroundColor = COLORS.Transparent;
        stylesText.color = COLORS.Neutral.Medium;
      } else if (!pressed) {
        stylesContainer.backgroundColor = COLORS.Transparent;
        stylesText.color = COLORS.Neutral.Medium;
      } else {
        stylesContainer.backgroundColor = COLORS.Transparent;
        stylesText.color = COLORS.Neutral.Darkest;
      }
      break;
    case 'tertiary':
      if (disabled) {
        stylesContainer.backgroundColor = COLORS.Transparent;
        stylesText.color = COLORS.Neutral.Medium;
      } else if (!pressed) {
        stylesContainer.backgroundColor = COLORS.Transparent;
        stylesText.color = COLORS.Neutral.Dark;
      } else {
        stylesContainer.backgroundColor = COLORS.Transparent;
        stylesText.color = COLORS.Neutral.Darkest;
      }
      break;
    case 'link':
      stylesContainer.paddingVertical = SIZES.XS;
      stylesContainer.paddingHorizontal = SIZES.XS;
      stylesText.fontFamily = FONTS.AmorSansProBold;
      if (disabled) {
        stylesContainer.backgroundColor = COLORS.Transparent;
        stylesText.color = COLORS.Primary.Light;
      } else if (!pressed) {
        stylesContainer.backgroundColor = COLORS.Transparent;
        stylesText.color = COLORS.Primary.Dark;
      } else {
        stylesContainer.backgroundColor = COLORS.Transparent;
        stylesText.color = COLORS.Primary.Darkest;
      }
      break;
    case 'lightest':
      if (disabled) {
        stylesContainer.backgroundColor = COLORS.Neutral.Light;
        stylesText.color = COLORS.Neutral.Lightest;
      } else if (!pressed) {
        stylesContainer.backgroundColor = COLORS.Neutral.Lightest;
        stylesText.color = COLORS.Primary.Medium;
      } else {
        stylesContainer.backgroundColor = COLORS.Neutral.Darkest;
        stylesText.color = COLORS.Neutral.Lightest;
      }
      break;
  }

  iconFill = !pressed ? stylesText.color : stylesText.color;

  if (haveBorder) {
    stylesContainer.borderWidth = 1;
    stylesContainer.borderColor = stylesText.color;
  }

  const stylesBase = StyleSheet.create({
    container: {
      borderRadius: SIZES.XS,
      paddingVertical: SIZES.MD,
      paddingHorizontal: SIZES.MD,
      alignItems: 'center',
      justifyContent: 'center',
      ...stylesContainer,
    },
    text: {
      fontFamily: FONTS.Bree,
      fontSize: textSize || FONT_SIZES.MD,
      ...stylesText,
    },
    icon: {
      ...stylesIcon,
    },
  });

  return {
    ...stylesBase,
    iconFill,
  };
};

export default Button;
