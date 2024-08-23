import Icon, {IconName, SvgIconName} from '@atoms/Icon';
import TextCustom from '@atoms/TextCustom';
import {Colors} from '@theme/colors';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

interface TagProps {
  title: string;
  onPress: () => void;
  expanded: boolean;
  disabled?: boolean;
}

const Tag = ({title, disabled = false, onPress, expanded}: TagProps) => {
  const styles = getStyles();

  let iconName: SvgIconName = expanded ? 'icon_arrows_top' : 'icon_arrows_down';

  return (
    <Pressable style={styles.container} disabled={disabled} onPress={onPress}>
      <TextCustom
        text={title}
        size={16}
        variation="p"
        weight="bold"
        color={disabled ? Colors.Disabled : Colors.GrayDark}
        style={styles.text}
      />
      <Icon
        iconName={iconName}
        size={24}
        color={disabled ? Colors.Disabled : Colors.GrayDark}
        style={styles.icon}
      />
    </Pressable>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    container: {
      backgroundColor: Colors.GrayBackground,
      padding: 8 * 1.5,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    text: {
      flexShrink: 2,
    },
    icon: {
      marginLeft: 8,
      flexShrink: 1,
    },
  });

  return stylesBase;
};

export default Tag;
