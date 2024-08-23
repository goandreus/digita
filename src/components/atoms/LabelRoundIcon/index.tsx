import {COLORS} from '@theme/colors';
import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import Icon, {IconName} from '@atoms/Icon';

const LabelRoundIcon = ({
  icon,
  text,
  color,
  iconSize,
}: {
  icon?: IconName;
  text?: ReactNode;
  color?: string;
  iconSize?: number;
}) => {
  return (
    <View style={styles.wrapper}>
      {icon && (
        <View
          style={[
            styles.item_icon,
            {
              backgroundColor: color ?? COLORS.Primary.Lightest,
            },
          ]}>
          <Icon
            name={icon}
            size={iconSize ?? 'small'}
            fill={COLORS.Primary.Dark}
            stroke={''}
          />
        </View>
      )}
      <View style={styles.text_wrapper}>{text}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item_icon: {
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_wrapper: {
    width: '83%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

export default LabelRoundIcon;
