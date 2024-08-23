import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, View} from 'react-native';
import {MyFavoritesScreenProps} from '@navigations/types';
import MenuTemplate from '@templates/MenuTemplate';
import Icon from '@atoms/Icon';
import {Colors} from '@theme/colors';
import TextCustom from '@atoms/TextCustom';
import {useFavorites} from '@hooks/common';
import {IFavorite} from '@interface/Favorite';

const MyFavoritesScreen = ({navigation}: MyFavoritesScreenProps) => {
  const {favorites, isGetFavoritesLoading} = useFavorites();
  const handleOnPress = (item: IFavorite) => {
    navigation.navigate('MyFavoritesDetail', {favorite: item});
  };

  return (
    <MenuTemplate title="Mis Favoritos">
      {isGetFavoritesLoading ? (
        <View style={styles.loadingSection}>
          <ActivityIndicator size="large" color={Colors.Primary} />
        </View>
      ) : (
        favorites.map((item, i) => (
          <Pressable
            key={item.registryId}
            onPress={() => handleOnPress(item)}
            style={[
              styles.pressableContainer,
              i !== favorites.length - 1 ? styles.border_bottom : null,
            ]}>
            <View style={styles.optionWrapper}>
              <TextCustom
                variation="h2"
                size={16}
                color={Colors.GrayDark}
                weight="normal">
                {item.concept}
              </TextCustom>
              <Icon
                iconName="icon_arrows_right"
                size={24}
                color={Colors.GrayDark}
                style={styles.iconRight}
              />
            </View>
          </Pressable>
        ))
      )}
    </MenuTemplate>
  );
};

export default MyFavoritesScreen;

const styles = StyleSheet.create({
  pressableContainer: {
    paddingVertical: 8 * 2,
  },
  border_bottom: {
    borderBottomColor: Colors.GrayBackground,
    borderBottomWidth: 1,
  },
  optionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 'auto',
  },
  loadingSection: {
    marginVertical: '50%',
  },
});
