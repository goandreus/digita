import React from 'react';
import {Pressable, View} from 'react-native';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import Icon from '@atoms/Icon';
import {COLORS} from '@theme/colors';
import {styles} from '../styles';

export const NewContactItem = ({
  newNumber,
  isDisabled,
  getCustomersList,
}: {
  newNumber: string;
  isDisabled: boolean;
  getCustomersList: (contact: string) => {};
}) => {
  return (
    <Pressable
      disabled={isDisabled}
      onPress={() => {
        isDisabled ? null : getCustomersList(newNumber);
      }}>
      <BoxView
        direction="row"
        align="center"
        justify="space-between"
        py={4}
        background="background-lightest">
        <View style={styles.contactIcon}>
          <TextCustom
            color="background-lightest"
            variation="h4"
            weight="normal"
            text={'N'}
          />
        </View>
        <BoxView
          style={styles.contactWrapper}
          justify="space-between"
          flex={1}
          pb={16}
          direction="row">
          <BoxView>
            <TextCustom
              color="neutral-darkest"
              size={16}
              variation="c1"
              weight="normal"
              text={'A nuevo número celular'}
            />
            <Separator size={2} />
            <TextCustom
              size={16}
              color="neutral-darkest"
              weight="normal"
              variation="c0"
              text={newNumber.replace(/(\d{3})(?=\d)/g, '$1 ')}
            />
          </BoxView>
          <Icon name="arrow-right-xs" size={30} fill={COLORS.Neutral.Medium} />
        </BoxView>
      </BoxView>
    </Pressable>
  );
};
