import React from 'react';
import {Pressable} from 'react-native';
import Icon from '@atoms/Icon';
import {setBalanceVisibility} from '@features/balanceVisibility';
import TextCustom from '@atoms/extra/TextCustom';
import {COLORS} from '@theme/colors';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import BoxView from '@atoms/BoxView';

interface BalanceToggleProps {
  direction?: 'row' | 'column';
  fonSize?: number;
}

const BalanceToggle = ({
  direction = 'row',
  fonSize = 14,
}: BalanceToggleProps) => {
  const dispatch = useAppDispatch();
  const {balanceVisibility} = useAppSelector(state => state.balanceVisibility);

  const handleToggle = () => {
    dispatch(setBalanceVisibility(!balanceVisibility));
  };

  return (
    <Pressable onPress={handleToggle}>
      <BoxView
        direction={direction === 'row' ? 'row' : 'column-reverse'}
        align="center">
        <TextCustom
          size={fonSize}
          color="primary-dark"
          variation="h4"
          text={balanceVisibility ? 'Ocultar' : 'Mostrar'}
        />
        <Icon
          color={COLORS.Primary.Dark}
          iconName={balanceVisibility ? 'icon_eye_off' : 'icon_eye_on'}
          size={24}
        />
      </BoxView>
    </Pressable>
  );
};

export default BalanceToggle;
