import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';
import TextCustom from '@atoms/extra/TextCustom';
import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {COLORS} from '@theme/colors';

interface FavoriteItemProps {
  alias: string;
  operationName: string;
  onPress?: () => void;
}

export default function FavoriteItem({
  alias,
  operationName,
  onPress,
}: FavoriteItemProps) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <BoxView style={styles.favorite_content} direction="row" mb={8} mt={4}>
          <Icon name="star-2" size="x-small" fill={COLORS.Informative.Medium} />
          <BoxView ml={8}>
            <TextCustom
              style={styles.text}
              text={alias}
              variation="h4"
              lineHeight="tight"
              weight="normal"
              color={'neutral-darkest'}
            />
            <TextCustom
              text={operationName}
              variation="p4"
              lineHeight="tight"
              weight="normal"
              color={'neutral-darkest'}
            />
          </BoxView>
        </BoxView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  favorite_content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: 'rgba(0,0,0,0.01)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    zIndex: 1,
  },
  text: {
    marginBottom: 4,
  },
});
