import Icon, {IconName} from '@atoms/Icon';
import Input, {InputProps} from '@atoms/Input';
import {Colors} from '@theme/colors';
import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {SEPARATOR_BASE} from '@theme/metrics';

interface InputIconProps extends InputProps {
  iconRight?: IconName;
  onClickIconRight?: () => void;
  actionName?: string;
}

const InputIcon = ({
  iconRight,
  rigthComponent,
  onClickIconRight,
  actionName,
  ...rest
}: InputIconProps) => {
  const route = useRoute();

  const IconRight =
    iconRight !== undefined ? (
      <Pressable
        {...{dtActionName: `* ${route.name}-Botón-${actionName || iconRight}`}}
        onPress={onClickIconRight}
        style={styles.iconWrapper}>
        <Icon name={iconRight} fill={Colors.GrayDark} size="small" />
      </Pressable>
    ) : null;

  return <Input {...rest} rigthComponent={IconRight} />;
};

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SEPARATOR_BASE,
    height: 50,
  },
});

export default InputIcon;
