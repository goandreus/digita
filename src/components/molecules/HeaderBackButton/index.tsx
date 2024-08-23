import Button from '@atoms/Button';
import React from 'react';
import {StyleSheet} from 'react-native';

interface HeaderBackButtonProps {
  canGoBack: boolean;
  onPress: () => void;
}

const HeaderBackButton = ({canGoBack, onPress}: HeaderBackButtonProps) =>
  canGoBack ? (
    <Button
      actionName="Atrás"
      icon="back-circle"
      type="primary-inverted"
      orientation="vertical"
      containerStyle={styles.containerButtonBack}
      onPress={onPress}
    />
  ) : null;

const styles = StyleSheet.create({
  containerButtonBack: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});

export default HeaderBackButton;
