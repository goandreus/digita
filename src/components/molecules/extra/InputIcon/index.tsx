import Icon, {IconName, SvgIconName} from '@atoms/Icon';
import Input, {InputProps} from '@atoms/extra/Input';
import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';

interface InputIconProps extends InputProps {
  iconRightName?: SvgIconName;
  onClickIconRight?: () => void;
  actionName?: string;
}

const InputIcon = ({
  iconRightName,
  rigthComponent,
  onClickIconRight,
  actionName,
  ...rest
}: InputIconProps) => {
  const route = useRoute();

  const IconRight =
    iconRightName !== undefined ? (
      <Pressable
        {...{
          dtActionName: `* ${route.name}-Botón-${actionName || iconRightName}`,
        }}
        onPress={onClickIconRight}
        style={styles.iconWrapper}>
        {iconRightName !== undefined && (
          <Icon
            iconName={iconRightName}
            color={rest.haveError ? COLORS.Error.Medium : COLORS.Neutral.Darkest}
            size={SIZES.LG}
          />
        )}
      </Pressable>
    ) : null;

  return <Input {...rest} rigthComponent={IconRight} />;
};

const styles = StyleSheet.create({
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZES.XS * 5,
    width: SIZES.XS * 5,
  },
});

export default InputIcon;
