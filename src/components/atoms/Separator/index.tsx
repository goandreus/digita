import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {Colors} from '@theme/colors';
import {FontSizes, FontTypes} from '@theme/fonts';
import {SEPARATOR_BASE} from '@theme/metrics';

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
  color = Colors.Border,
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
  const BASE = SEPARATOR_BASE;
  //const BASE = 8;
  let lineColor: string;
  let margin: number;

  lineColor = !showLine ? Colors.Transparent : color;

  if (size === undefined) {
    margin = 0;
    switch (type) {
      case 'none':
        margin = 0;
        break;
      case 'xx-small':
        margin = 0.5 * BASE;
        break;
      case 'x-small':
        margin = 1 * BASE;
        break;
      case 'small':
        margin = 2 * BASE;
        break;
      case 'medium':
        margin = 4 * BASE;
        break;
      case 'large':
        margin = 8 * BASE;
        break;
      case 'x-large':
        margin = 10 * BASE;
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
      marginHorizontal: 8,
      fontFamily: FontTypes.AmorSansProBold,
      fontSize: FontSizes.Paragraph,
      color: Colors.Paragraph,
    },
  });

  return stylesBase;
};

export default Separator;
