import React, {ReactNode} from 'react';
import {Pressable, StyleSheet, View, ViewStyle} from 'react-native';
import Checkbox, {CheckboxSize} from '@atoms/Checkbox';
import TextCustom from '@atoms/TextCustom';
import { useRoute } from '@react-navigation/native';

interface CheckboxLabelProps {
  value: boolean;
  text?: string;
  checkboxSize?: CheckboxSize;
  textComponent?: ReactNode;
  pressWithLabel?: boolean;
  style?: ViewStyle;
  onChange: (checked: boolean) => void;
  actionName?: string;
}

const CheckboxLabel = ({
  value,
  text,
  checkboxSize,
  textComponent,
  pressWithLabel = true,
  style,
  onChange,
  actionName,
}: CheckboxLabelProps) => {
  const styles = getStyles();
  const route = useRoute();

  return (
    <Pressable
      {...{dtActionName: `* ${route.name}-Checkbox-${actionName}`}}
      onPress={() => (pressWithLabel ? onChange(!value) : undefined)}
      style={{...styles.container, ...style}}>
      <Checkbox
        actionName={actionName}
        type="primary"
        value={value}
        size={checkboxSize}
        onChange={() => onChange(!value)}
        style={styles.checkbox}
      />
      <View style={styles.textContainer}>
        {text && <TextCustom variation="p">{text}</TextCustom>}
        {textComponent}
      </View>
    </Pressable>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textContainer: {
      flexShrink: 1,
    },
    checkbox: {
      marginRight: 8,
    },
  });
  return stylesBase;
};

export default CheckboxLabel;
