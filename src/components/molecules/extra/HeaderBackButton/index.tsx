import Icon from '@atoms/Icon';
import Button from '@atoms/extra/Button';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

interface HeaderBackButtonProps {
  canGoBack: boolean;
  color?: string;
  onPress: () => void;
}

const HeaderBackButton = ({
  canGoBack,
  onPress,
  color = COLORS.Neutral.Dark,
}: HeaderBackButtonProps) =>
  canGoBack ? (
    <Pressable onPress={onPress}>
      <View style={styles.containerButtonBack}>
        <Icon iconName="icon_arrow_back" size={SIZES.XL} color={color} />
      </View>
    </Pressable>
  ) : null;

const styles = StyleSheet.create({
  containerButtonBack: {
    height: SIZES.XS * 5,
    width: SIZES.XS * 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HeaderBackButton;
