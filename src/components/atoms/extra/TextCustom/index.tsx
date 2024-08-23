import React, {ReactNode} from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';
import {ColorType, getColorByText} from '@theme/colors';
import {FONTS, FONTS_LINE_HEIGHTS_FACTOR, FONT_SIZES} from '@theme/fonts';
import {useRoute} from '@react-navigation/native';

type BreeTextVariation = 'h0' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type AmorSansVariation = 'p0' | 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';
type BreeCFVariation = 'c0' | 'c1' | 'c2';
type TextCustomVariation =
  | BreeTextVariation
  | AmorSansVariation
  | BreeCFVariation;

type TextCustomLineHeight = 'tight' | 'fair' | 'comfy';
type TextCustomWeight = 'light' | 'normal' | 'bold';
type TextCustomDecoration = 'underline' | 'none';
type TextCustomAlign = 'justify' | 'left' | 'center' | 'auto' | 'right';

interface TextCustomProps {
  lineHeight?: TextCustomLineHeight;
  variation?: TextCustomVariation;
  size?: number;
  weight?: TextCustomWeight;
  decoration?: TextCustomDecoration;
  align?: TextCustomAlign;
  text?: string;
  color?: ColorType;
  children?: ReactNode;
  onPress?: () => void;
  style?: TextStyle;
  actionName?: string;
  numberOfLines?: number;
  ellipsizeMode?: 'clip' | 'head' | 'tail' | 'middle';
}

const TextCustom = ({
  lineHeight,
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
  numberOfLines,
  ellipsizeMode,
}: TextCustomProps) => {
  const styles = getStyles(variation, size, decoration, weight, color, align,lineHeight);
  const stylesMerged = {...styles.text, ...style};
  const route = useRoute();

  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
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
  variation?: TextCustomVariation,
  size?: number,
  decoration?: TextCustomDecoration,
  weightCustom?: TextCustomWeight,
  colorCustom?: ColorType,
  align?: TextCustomAlign,
  lineHeight?: TextCustomLineHeight,
) => {
  let stylesText: TextStyle = {};

  switch (variation) {
    case 'h0':
      stylesText.fontSize = FONT_SIZES.D;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.BreeBold;
      } else if (weightCustom === 'light') {
        stylesText.fontFamily = FONTS.BreeBoldCFLight;
      } else {
        stylesText.fontFamily = FONTS.Bree;
      }
      break;
    case 'h1':
      stylesText.fontSize = FONT_SIZES.XXL;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.BreeBold;
      } else if (weightCustom === 'light') {
        stylesText.fontFamily = FONTS.BreeBoldCFLight;
      } else {
        stylesText.fontFamily = FONTS.Bree;
      }
      break;

    case 'h2':
      stylesText.fontSize = FONT_SIZES.XL;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.BreeBold;
      } else if (weightCustom === 'light') {
        stylesText.fontFamily = FONTS.BreeBoldCFLight;
      } else {
        stylesText.fontFamily = FONTS.Bree;
      }
      break;

    case 'h3':
      stylesText.fontSize = FONT_SIZES.LG;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.BreeBold;
      } else if (weightCustom === 'light') {
        stylesText.fontFamily = FONTS.BreeBoldCFLight;
      } else {
        stylesText.fontFamily = FONTS.Bree;
      }
      break;

    case 'h4':
      stylesText.fontSize = FONT_SIZES.MD;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.BreeBold;
      } else if (weightCustom === 'light') {
        stylesText.fontFamily = FONTS.BreeBoldCFLight;
      } else {
        stylesText.fontFamily = FONTS.Bree;
      }
      break;

    case 'h5':
      stylesText.fontSize = FONT_SIZES.SM;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.BreeBold;
      } else if (weightCustom === 'light') {
        stylesText.fontFamily = FONTS.BreeBoldCFLight;
      } else {
        stylesText.fontFamily = FONTS.Bree;
      }
      break;

    case 'h6':
      stylesText.fontSize = FONT_SIZES.XS;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.BreeBold;
      } else if (weightCustom === 'light') {
        stylesText.fontFamily = FONTS.BreeBoldCFLight;
      } else {
        stylesText.fontFamily = FONTS.Bree;
      }
      break;
    case 'p0':
      stylesText.fontSize = FONT_SIZES.D;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.AmorSansProBold;
      } else {
        stylesText.fontFamily = FONTS.AmorSansPro;
      }
      break;
    case 'p1':
      stylesText.fontSize = FONT_SIZES.XXL;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.AmorSansProBold;
      } else {
        stylesText.fontFamily = FONTS.AmorSansPro;
      }
      break;

    case 'p2':
      stylesText.fontSize = FONT_SIZES.XL;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.AmorSansProBold;
      } else {
        stylesText.fontFamily = FONTS.AmorSansPro;
      }
      break;

    case 'p3':
      stylesText.fontSize = FONT_SIZES.LG;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.AmorSansProBold;
      } else {
        stylesText.fontFamily = FONTS.AmorSansPro;
      }
      break;

    case 'p4':
      stylesText.fontSize = FONT_SIZES.MD;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.AmorSansProBold;
      } else {
        stylesText.fontFamily = FONTS.AmorSansPro;
      }
      break;

    case 'p5':
      stylesText.fontSize = FONT_SIZES.SM;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.AmorSansProBold;
      } else {
        stylesText.fontFamily = FONTS.AmorSansPro;
      }
      break;

    case 'p6':
      stylesText.fontSize = FONT_SIZES.XS;
      if (weightCustom === 'bold') {
        stylesText.fontFamily = FONTS.AmorSansProBold;
      } else {
        stylesText.fontFamily = FONTS.AmorSansPro;
      }
      break;

    case 'c0':
      stylesText.fontFamily = FONTS.BreeBoldCFLight;
      break;
    case 'c1':
      stylesText.fontFamily = FONTS.BreeCF;
      break;
    case 'c2':
      stylesText.fontFamily = FONTS.BreeCFBold;
      break;
  }

  if (colorCustom !== undefined) {
    stylesText.color = getColorByText(colorCustom);
  }

  let customLineHeight: number | undefined = undefined;
  const _fontSize = size || stylesText.fontSize;

  switch (lineHeight) {
    case 'tight':
      customLineHeight = _fontSize !== undefined ? _fontSize * FONTS_LINE_HEIGHTS_FACTOR.TIGHT : undefined;
      break;
    case 'comfy':
      customLineHeight = _fontSize !== undefined ? _fontSize * FONTS_LINE_HEIGHTS_FACTOR.COMFY : undefined;
      break;
    case 'fair':
      customLineHeight = _fontSize !== undefined ? _fontSize * FONTS_LINE_HEIGHTS_FACTOR.FAIR : undefined;
      break;
  }

  const stylesBase = StyleSheet.create({
    text: {
      ...stylesText,
      lineHeight: customLineHeight,
      fontSize: size || stylesText.fontSize,
      color: stylesText.color,
      textDecorationLine: decoration || stylesText.textDecorationLine,
      textAlign: align || 'auto',
      zIndex: 0,
    },
  });

  return stylesBase;
};

export default TextCustom;
