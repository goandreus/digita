import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  TextStyle,
} from 'react-native';
import {Colors} from '@theme/colors';
import {FontSizes, FontTypes} from '@theme/fonts';
import Icon, {IconName, IconSize} from '@atoms/Icon';
import {useRoute} from '@react-navigation/native';
import {SEPARATOR_BASE} from '@theme/metrics';

export type ButtonOrientation = 'vertical' | 'horizontal';
export type ButtonType =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'primary-inverted'
  | 'secondary-inverted'
  | 'neutral-inverted';

interface ButtonProps {
  text?: string;
  textSize?: number;
  icon?: IconName;
  iconSize?: IconSize;
  orientation: ButtonOrientation;
  type: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  containerStyle?: ViewStyle;
  onPress: () => void;
  actionName?: string;
}

const Button = ({
  type,
  textSize,
  orientation,
  onPress,
  text,
  icon,
  iconSize = 'small',
  disabled = false,
  loading = false,
  containerStyle,
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
          pressed,
          disabled,
          textSize,
        );

        return (
          <>
            {loading ? (
              <ActivityIndicator size="small" color={styles.iconFill} />
            ) : (
              <>
                {haveText && <Text style={styles.text}>{text}</Text>}
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
      if (haveText) {
        stylesIcon.marginBottom = SEPARATOR_BASE;
      }
      break;
    case 'horizontal':
      stylesContainer.flexDirection = 'row';
      if (haveText) {
        stylesIcon.marginLeft = SEPARATOR_BASE;
      }
      break;
  }

  switch (type) {
    case 'primary':
      if (disabled) {
        stylesContainer.backgroundColor = Colors.Disabled;
        stylesText.color = Colors.White;
      } else if (!pressed) {
        stylesContainer.backgroundColor = Colors.Primary;
        stylesText.color = Colors.White;
      } else {
        stylesContainer.backgroundColor = Colors.PrimaryHover;
        stylesText.color = Colors.White;
      }
      break;
    case 'primary-inverted':
      if (disabled) {
        stylesContainer.backgroundColor = Colors.Transparent;
        stylesText.color = Colors.Disabled;
      } else if (!pressed) {
        stylesContainer.backgroundColor = Colors.Transparent;
        stylesText.color = Colors.Primary;
      } else {
        stylesContainer.backgroundColor = Colors.Transparent;
        stylesText.color = Colors.PrimaryHover;
      }
      break;
    case 'secondary':
      if (disabled) {
        stylesContainer.backgroundColor = Colors.Disabled;
        stylesText.color = Colors.White;
      } else if (!pressed) {
        stylesContainer.backgroundColor = Colors.Secondary;
        stylesText.color = Colors.White;
      } else {
        stylesContainer.backgroundColor = Colors.SecondaryHover;
        stylesText.color = Colors.White;
      }
      break;
    case 'secondary-inverted':
      if (disabled) {
        stylesContainer.backgroundColor = Colors.Transparent;
        stylesText.color = Colors.Disabled;
      } else if (!pressed) {
        stylesContainer.backgroundColor = Colors.Transparent;
        stylesText.color = Colors.Secondary;
      } else {
        stylesContainer.backgroundColor = Colors.Transparent;
        stylesText.color = Colors.SecondaryHover;
      }

      break;
    case 'neutral':
      if (disabled) {
        stylesContainer.backgroundColor = Colors.Disabled;
        stylesText.color = Colors.White;
      } else if (!pressed) {
        stylesContainer.backgroundColor = Colors.Neutral;
        stylesText.color = Colors.White;
      } else {
        stylesContainer.backgroundColor = Colors.NeutralHover;
        stylesText.color = Colors.White;
      }
      break;
    case 'neutral-inverted':
      if (disabled) {
        stylesContainer.borderWidth = 1;
        stylesContainer.backgroundColor = Colors.Transparent;
        stylesContainer.borderColor = Colors.Disabled;
        stylesText.color = Colors.Disabled;
      } else if (!pressed) {
        stylesContainer.borderWidth = 1;
        stylesContainer.backgroundColor = Colors.Transparent;
        stylesContainer.borderColor = Colors.Neutral;
        stylesText.color = Colors.Neutral;
      } else {
        stylesContainer.borderWidth = 1;
        stylesContainer.backgroundColor = Colors.Transparent;
        stylesContainer.borderColor = Colors.NeutralHover;
        stylesText.color = Colors.NeutralHover;
      }
      break;
  }

  iconFill = !pressed ? stylesText.color : stylesText.color;

  const stylesBase = StyleSheet.create({
    container: {
      borderRadius: 5,
      paddingVertical: SEPARATOR_BASE * 2,
      paddingHorizontal: SEPARATOR_BASE * 2,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 8 * 6.5,
      ...stylesContainer,
    },
    text: {
      fontFamily: FontTypes.BreeBold,
      fontSize: textSize || FontSizes.Button,
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
