import TextCustom from '@atoms/extra/TextCustom';
import {COLORS} from '@theme/colors';
import React from 'react';
import {StyleSheet, View} from 'react-native';

interface Props {
  yLocation?: 'top' | 'bottom';
  xLocation?: 'left' | 'right';
  text: string;
  width: number;
  height: number;
  color?: string;
}

const Tooltip = ({
  yLocation = 'bottom',
  xLocation = 'right',
  text,
  width,
  height,
  color = COLORS.Secondary.Darkest,
}: Props) => {
  const styles = getStyles(color, width, height);
  return (
    <>
      <View
        style={[
          styles.triangle,
          yLocation === 'bottom' ? styles.triangleBottom : styles.triangleTop,
        ]}
      />
      <View
        style={[
          styles.container,
          yLocation === 'bottom' ? styles.containerBottom : styles.containerTop,
          xLocation === 'left' ? styles.containerLeft : styles.containerRight,
        ]}>
        <TextCustom
          text={text}
          variation="h6"
          color={'neutral-lightest'}
          weight="normal"
        />
      </View>
    </>
  );
};

export default Tooltip;

const getStyles = (color: string, width: number, height: number) =>
  StyleSheet.create({
    triangle: {
      position: 'absolute',
      width: 0,
      height: 0,
      left: 10,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 5,
      borderRightWidth: 5,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    },
    triangleTop: {
      bottom: 17,
      borderTopWidth: 10,
      borderTopColor: COLORS.Secondary.Darkest,
    },
    triangleBottom: {
      top: 17,
      borderBottomWidth: 10,
      borderBottomColor: COLORS.Secondary.Darkest,
    },
    container: {
      flex: 1,
      position: 'absolute',
      width: width,
      height: height,
      backgroundColor: color,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99,
    },
    containerTop: {
      bottom: 25,
    },
    containerBottom: {
      top: 25,
    },
    containerLeft: {
      right: -10,
    },
    containerRight: {
      left: -10,
    },
  });
