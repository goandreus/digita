import {View, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import {ColorType, getColorByText} from '@theme/colors';

interface SpacingProps {
  m?: number | string;
  mt?: number | string;
  mr?: number | string;
  mb?: number | string;
  ml?: number | string;
  mx?: number | string;
  my?: number | string;
  ms?: number | string;
  me?: number | string;
  p?: number | string;
  pt?: number | string;
  pr?: number | string;
  pb?: number | string;
  pl?: number | string;
  px?: number | string;
  py?: number | string;
  ps?: number | string;
  pe?: number | string;
}

interface FlexProps {
  flex?: number | undefined;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignSelf?:
    | 'auto'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'baseline';
}

interface IBox extends SpacingProps, FlexProps {
  background?: ColorType;
  style?: ViewStyle;
  children?: React.ReactNode;
  zIndex?: number;
}

const BoxView = ({background, children, style, ...spaceProps}: IBox) => {
  const styles = getStyles({
    ...spaceProps,
    background,
  });
  const stylesMerged = {...styles.view, ...style};
  return <View style={stylesMerged}>{children}</View>;
};

const getStyles = (props: IBox) => {
  return StyleSheet.create({
    view: {
      flex: props.flex,
      flexDirection: props.direction,
      alignItems: props.align,
      justifyContent: props.justify,
      alignSelf: props.alignSelf,
      margin: props.m,
      marginTop: props.mt,
      marginRight: props.mr,
      marginBottom: props.mb,
      marginLeft: props.ml,
      marginHorizontal: props.mx,
      marginVertical: props.my,
      marginStart: props.ms,
      marginEnd: props.me,
      padding: props.p,
      paddingTop: props.pt,
      paddingRight: props.pr,
      paddingBottom: props.pb,
      paddingLeft: props.pl,
      paddingHorizontal: props.px,
      paddingVertical: props.py,
      paddingStart: props.ps,
      paddingEnd: props.pe,
      backgroundColor: getColorByText(props.background),
      zIndex: props.zIndex,
    },
  });
};

export default BoxView;
