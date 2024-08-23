import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {Colors} from '@theme/colors';
import { useRoute } from '@react-navigation/native';

export type CheckboxSize = 'small' | 'normal' | 'large';
export type CheckboxType = 'primary' | 'secondary';

interface CheckboxProps {
  value: boolean;
  size?: CheckboxSize;
  type: CheckboxType;
  style?: ViewStyle;
  onChange: () => void;
  actionName?: string;
}

const Checkbox = ({
  value,
  size = 'normal',
  type,
  style,
  onChange,
  actionName,
}: CheckboxProps) => {
  const route = useRoute();

  return (
    <BouncyCheckbox
      {...{dtActionName: `* ${route.name}-Checkbox-${actionName}`}}
      isChecked={value}
      size={getSize(size)}
      fillColor={getColor(type)}
      iconStyle={getStyles(value, type).icon}
      disableText={true}
      disableBuiltInState={true}
      onPress={() => {
        onChange();
      }}
      style={style}
    />
  );
};

const getStyles = (value: boolean, type: CheckboxType) => {
  const stylesBase = StyleSheet.create({
    icon: {
      borderRadius: 5,
      borderColor: value ? getColor(type) : Colors.Border,
    },
  });

  return stylesBase;
};

const getColor = (type: CheckboxType) => {
  let color: string;

  switch (type) {
    case 'primary':
      color = Colors.Primary;
      break;
    case 'secondary':
      color = Colors.Secondary;
      break;
  }

  return color;
};

const getSize = (size: CheckboxSize) => {
  let n: number;
  switch (size) {
    case 'small':
      n = 24;
      break;
    case 'normal':
      n = 32;
      break;
    case 'large':
      n = 40;
      break;
  }

  return n;
};

export default Checkbox;
