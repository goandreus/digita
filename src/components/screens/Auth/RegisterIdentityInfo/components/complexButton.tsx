import React from 'react';
import {GestureResponderEvent, Pressable, StyleSheet, View} from 'react-native';
import BoxView from '@atoms/BoxView';
import Icon, {IconName} from '@atoms/Icon';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';

type stateType = 'neutral' | 'saved';

interface ComplexButtonProps {
  title: string;
  description: string;
  onPress: (e: GestureResponderEvent) => void;
  state?: stateType;
  disabled?: boolean;
  iconName: IconName;
}

const ComplexButton = ({
  title,
  description,
  onPress,
  disabled = false,
  iconName,
}: ComplexButtonProps) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <BoxView
        background={disabled ? 'background-light' : 'transparent'}
        style={styles.container}
        direction="row"
        justify="space-between"
        align="center">
        <BoxView flex={1} direction="row" align="center">
          <Icon style={styles.icon} name={iconName} size={36} />
          <View style={styles.title}>
            <TextCustom
              text={title}
              weight="normal"
              variation="p4"
              color="neutral-darkest"
            />
            <Separator type="xx-small" />
            <TextCustom
              text={description}
              variation="p4"
              weight="bold"
              color="neutral-darkest"
            />
          </View>
        </BoxView>
        <Icon name="chevron-right" size={20} fill={COLORS.Neutral.Darkest} />
      </BoxView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: COLORS.Neutral.Light,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: SIZES.LG,
    paddingHorizontal: SIZES.MD,
  },
  icon: {
    marginRight: 18,
  },
  title: {
    flex: 1,
    marginRight: 2,
  },
});

export default ComplexButton;
