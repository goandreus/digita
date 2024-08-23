import React from 'react';
import {Pressable, StyleSheet, ViewStyle} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {COLORS, Colors} from '@theme/colors';
import {useRoute} from '@react-navigation/native';
import {SIZES} from '@theme/metrics';

export type CheckboxSize = 'small' | 'medium' | 'large';
export type CheckboxType = 'primary';

interface CheckboxProps {
  value: boolean;
  size: CheckboxSize;
  type: CheckboxType;
  style?: ViewStyle;
  circular?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  actionName?: string;
}

const Checkbox = ({
  value,
  size,
  type,
  style,
  circular = false,
  disabled = false,
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
      iconStyle={getStyles(value, type, circular).icon}
      disableText={true}
      disableBuiltInState={true}
      disabled={disabled}
      style={{
        paddingHorizontal: SIZES.XXS,
        paddingVertical: SIZES.XXS,
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      onPress={() => onChange(!value)}
      iconImageStyle={{
        width: circular ? '60%' : '50%',
        height: circular ? '50%' : '40%',
      }}
    />
  );
};

const getStyles = (value: boolean, type: CheckboxType, circular: boolean) => {
  const stylesBase = StyleSheet.create({
    icon: {
      borderRadius: circular ? 8 : 3,
      borderColor: value ? getColor(type) : COLORS.Neutral.Dark,
    },
  });

  return stylesBase;
};

const getColor = (type: CheckboxType) => {
  let color: string;

  switch (type) {
    case 'primary':
      color = COLORS.Primary.Medium;
      break;
  }

  return color;
};

const getSize = (size: CheckboxSize) => {
  let n: number;
  switch (size) {
    case 'small':
      n = SIZES.MD;
      break;
    case 'medium':
      n = SIZES.LG;
      break;
    case 'large':
      n = SIZES.XL;
      break;
  }

  return n;
};

export default Checkbox;
