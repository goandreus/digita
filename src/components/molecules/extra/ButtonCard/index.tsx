import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import Icon from '@atoms/Icon';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getStyles} from './styles';

export interface PickerProps {
  text: string;
  isDisabled: boolean;
  onChange?: () => void;
}

const ButtonCard = ({
  text,
  isDisabled,
  onChange,
}: PickerProps) => {
  const insets = useSafeAreaInsets();

  const styles = getStyles(insets);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.modalContainer,
        ]}
        onPress={
          isDisabled
            ? () => {}
            : onChange
        }>
        <View style={styles.itemContainer}>
          <View>
            <TextCustom
              text={text}
              weight="normal"
              variation="h5"
              color="neutral-darkest"
            />
          </View>
        </View>
      </TouchableOpacity>
      
    
    </>
  );
};

export default ButtonCard;