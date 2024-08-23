import React from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import {Pressable, StyleSheet, View} from 'react-native';
import Icon from '@atoms/Icon';

interface Props {
  value?: boolean;
  action: (e: boolean) => void;
}

const Switch = ({value, action}: Props) => {
  const onSwitchToggle1 = () => action(false);
  const onSwitchToggle2 = () => action(true);

  return (
    <View style={styles.view}>
      <Pressable style={styles.container} onPress={onSwitchToggle1}>
        {!value ? (
          <Icon name="icon_radio-fill" size={24} />
        ) : (
          <View style={styles.radio} />
        )}
        <TextCustom
          style={{marginLeft: SIZES.XXS * 1.75}}
          color="neutral-darkest"
          text="No"
          variation="p5"
          weight="bold"
        />
      </Pressable>
      <Pressable style={styles.container} onPress={onSwitchToggle2}>
        {value ? (
          <Icon name="icon_radio-fill" size={24} />
        ) : (
          <View style={styles.radio} />
        )}
        <TextCustom
          style={{marginLeft: SIZES.XXS * 1.75}}
          color="neutral-darkest"
          text="Sí"
          variation="p5"
          weight="bold"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 120,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 24,
    height: 24,
    borderColor: '#697385',
    borderWidth: 1,
    borderRadius: 50,
  },
});

export default Switch;
