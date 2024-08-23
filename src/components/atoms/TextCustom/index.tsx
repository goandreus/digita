import React, {ReactNode} from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';
import {Colors} from '@theme/colors';
import {FontSizes, FontTypes} from '@theme/fonts';
import { useRoute } from '@react-navigation/native';

export type TextCustomVariation =
  | 'h0'
  | 'h1'
  | 'h2'
  | 'sh1'
  | 'p'
  | 'small'
  | 'link';
export type TextCustomWeight = 'normal' | 'bold';
export type TextCustomDecoration = 'underline' | 'none';
export type TextCustomAlign = 'justify' | 'left' | 'center' | 'auto' | 'right';

interface TextCustomProps {
  variation: TextCustomVariation;
  size?: number;
  weight?: TextCustomWeight;
  decoration?: TextCustomDecoration;
  align?: TextCustomAlign;
  text?: string;
  color?: string;
  children?: ReactNode;
  onPress?: () => void;
  style?: TextStyle;
  actionName?: string;
}

const TextCustom = ({
  variation,
  size,
  weight,
  decoration,
  align,
  text,
  color,
  children,
  onPress,
  style,
  actionName,
}: TextCustomProps) => {
  const styles = getStyles(variation, size, decoration, weight, color, align);
  const stylesMerged = {...styles.text, ...style};
  const route = useRoute();

  return (
    <Text
      {...{
        dtActionName: `* ${route.name}-Botón-${actionName || text || children}`,
      }}
      style={stylesMerged}
      onPress={onPress !== undefined ? () => {
        if (typeof text === 'string' || typeof children === 'string') {
          try {
            const buttonName = (children || text)?.toString();
          } catch (error) {
          }
        }
        return onPress();
      } : undefined}>
      {children || text}
    </Text>
  );
};

const getStyles = (
  variation: TextCustomVariation,
  size?: number,
  decoration?: TextCustomDecoration,
  weightCustom?: TextCustomWeight,
  colorCustom?: string,
  align?: TextCustomAlign,
) => {
  let stylesText: TextStyle = {};

  switch (variation) {
    case 'h0':
      stylesText.fontSize = FontSizes.Header0;
      stylesText.color = Colors.Primary;
      switch (weightCustom) {
        case 'normal':
          stylesText.fontFamily = FontTypes.Bree;
          break;
        default:
        case 'bold':
          stylesText.fontFamily = FontTypes.BreeBold;
          break;
      }
      break;
    case 'h1':
      stylesText.fontSize = FontSizes.Header1;
      stylesText.color = Colors.Primary;
      switch (weightCustom) {
        case 'normal':
          stylesText.fontFamily = FontTypes.Bree;
          break;
        default:
        case 'bold':
          stylesText.fontFamily = FontTypes.BreeBold;
          break;
      }
      break;
    case 'h2':
      stylesText.fontSize = FontSizes.Header2;
      stylesText.color = Colors.Primary;
      switch (weightCustom) {
        case 'normal':
          stylesText.fontFamily = FontTypes.Bree;
          break;
        default:
        case 'bold':
          stylesText.fontFamily = FontTypes.BreeBold;
          break;
      }
      break;
    case 'p':
      stylesText.fontSize = FontSizes.Paragraph;
      stylesText.color = Colors.Paragraph;
      switch (weightCustom) {
        default:
        case 'normal':
          stylesText.fontFamily = FontTypes.AmorSansPro;
          break;
        case 'bold':
          stylesText.fontFamily = FontTypes.AmorSansProBold;
          break;
      }
      break;
    case 'small':
      stylesText.fontSize = FontSizes.Small;
      stylesText.color = Colors.Paragraph;
      switch (weightCustom) {
        default:
        case 'normal':
          stylesText.fontFamily = FontTypes.AmorSansPro;
          break;
        case 'bold':
          stylesText.fontFamily = FontTypes.AmorSansProBold;
          break;
      }
      break;
    case 'link':
      stylesText.fontSize = FontSizes.Paragraph;
      stylesText.color = Colors.Primary;
      stylesText.textDecorationLine = 'underline';
      switch (weightCustom) {
        case 'normal':
          stylesText.fontFamily = FontTypes.AmorSansPro;
          break;
        default:
        case 'bold':
          stylesText.fontFamily = FontTypes.AmorSansProBold;
          break;
      }
      break;
    case 'sh1':
      stylesText.fontSize = FontSizes.SuperHeader1;
      stylesText.color = Colors.Primary;
      switch (weightCustom) {
        case 'normal':
          stylesText.fontFamily = FontTypes.Bree;
          break;
        default:
        case 'bold':
          stylesText.fontFamily = FontTypes.BreeBold;
          break;
      }
      break;
  }

  if (colorCustom !== undefined) stylesText.color = colorCustom;

  const stylesBase = StyleSheet.create({
    text: {
      ...stylesText,
      fontSize: size || stylesText.fontSize,
      color: colorCustom || stylesText.color,
      textDecorationLine: decoration || stylesText.textDecorationLine,
      textAlign: align || 'auto',
      zIndex: 0,
    },
  });

  return stylesBase;
};

export default TextCustom;
