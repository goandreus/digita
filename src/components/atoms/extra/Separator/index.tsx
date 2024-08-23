import React from 'react';
import {StyleSheet, View, Text, StyleProp, ViewStyle} from 'react-native';

import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {FONTS, FONT_SIZES} from '@theme/fonts';

export type SeparatorType =
  | 'none'
  | 'xx-small'
  | 'x-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'x-large';

interface SeparatorProps {
  text?: string;
  type?: SeparatorType;
  size?: number;
  showLine?: boolean;
  width?: number;
  color?: string;
  styleLine?: StyleProp<ViewStyle>;
}

const Separator = ({
  text,
  type,
  size,
  width = 1,
  showLine = false,
  color = COLORS.Neutral.Medium,
  styleLine,
}: SeparatorProps) => {
  const haveText = text !== undefined;

  const styles = getStyles(showLine, haveText, width, color, type, size);

  return (
    <View style={styles.container}>
      {haveText ? (
        <>
          <View style={styles.line} />
          <Text style={styles.text}>{text}</Text>
          <View style={styles.line} />
        </>
      ) : (
        <View style={[styles.line, styleLine]} />
      )}
    </View>
  );
};

const getStyles = (
  showLine: boolean,
  haveText: boolean,
  width: number,
  color: string,
  type?: SeparatorType,
  size?: number,
) => {
  let lineColor: string;
  let margin: number;

  lineColor = !showLine ? COLORS.Transparent : color;

  if (size === undefined) {
    margin = 0;
    switch (type) {
      case 'none':
        margin = 0;
        break;
      case 'xx-small':
        margin = SIZES.XXS;
        break;
      case 'x-small':
        margin = SIZES.XS;
        break;
      case 'small':
        margin = SIZES.MD;
        break;
      case 'medium':
        margin = SIZES.LG;
        break;
      case 'large':
        margin = SIZES.XL;
        break;
      case 'x-large':
        margin = SIZES.XXL;
        break;
    }
  } else {
    margin = size;
  }

  const stylesBase = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      marginTop: showLine || haveText ? margin / 2 : margin,
      marginBottom: showLine || haveText ? margin / 2 : 0,
    },
    line: {
      borderBottomColor: lineColor,
      borderBottomWidth: width || 1,
      flex: 1,
    },
    text: {
      marginHorizontal: SIZES.XS,
      fontFamily: FONTS.AmorSansProBold,
      fontSize: FONT_SIZES.MD,
      color: COLORS.Neutral.Medium,
    },
  });

  return stylesBase;
};

export default Separator;
