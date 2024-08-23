import React, {useMemo} from 'react';
import Icon, {IconName} from '@atoms/Icon';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {Colors} from '@theme/colors';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {getRemoteValue} from '@utils/firebase';

interface Props {
  action?: () => void;
  onPressSameBank?: (data?: {destinationAccount: string}) => void;
  onPressOtherBanks?: () => void;
  onPressOwnAccounts?: () => void;
}

const HEIGHT = Dimensions.get('screen').height;
const transferMenuItemWidth = Dimensions.get('screen').width / 3;

const TransfersMenuItem = ({
  onPress,
  disabled,
  isSubmenu,
  title,
  icon,
}: {
  title: string;
  icon?: IconName;
  disabled?: boolean;
  isSubmenu?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: isSubmenu ? 0 : 1,
        borderBottomColor: '#EFEFEF',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {icon && <Icon name={icon} size="small" />}
        <TextCustom
          variation="p"
          weight="bold"
          size={16}
          style={{
            marginLeft: 16,
            color: disabled ? Colors.Disabled : Colors.GrayDark,
          }}
          text={title}
        />
      </View>
      {!isSubmenu && (
        <Icon
          name={disabled ? 'arrow-right-disabled' : 'arrow-right'}
          size="small"
          stroke={disabled ? Colors.Disabled : '#83786F'}
        />
      )}
    </View>
  </TouchableOpacity>
);

const TransfersMenu = ({action, onPressSameBank, onPressOtherBanks}: Props) => {
  const hasBIM = getRemoteValue('trx_bim').asBoolean();
  const hasFavorites = getRemoteValue('active_favs').asBoolean();
  const deviceHeight = Dimensions.get('window').height;
  const canTransactToOwnAccounts = getRemoteValue('trx_own').asBoolean();
  const canTransactToSameBanks = getRemoteValue('trx_others').asBoolean();
  const canTransactToOtherBanks = getRemoteValue('trx_banks').asBoolean();

  // Favorites flow

  /* const {favorites, isGetFavoritesLoading} = useFavorites();

  const favoriteList = useMemo(() => {
    const nFavorites = favorites.length <= 5 ? favorites.length : 5;
    return favorites.slice(0, nFavorites);
  }, [favorites]);

  const onPressFavorite = (item: IFavorite) => {
    if (item.isLocal === true) {
      return (
        onPressSameBank &&
        onPressSameBank({
          destinationAccount: item.ctaProCom,
        })
      );
    }
  }; */

  const TransferItems = () => (
    <>
      <TransfersMenuItem
        icon={
          canTransactToOwnAccounts
            ? 'transfers-outline'
            : 'pig-outline-disabled'
        }
        onPress={action}
        title="A cuentas propias"
        disabled={!canTransactToOwnAccounts}
      />
      <TransfersMenuItem
        icon={
          canTransactToOtherBanks
            ? 'transfers-outline'
            : 'exchange-one-outline-disabled'
        }
        onPress={onPressOtherBanks}
        title="A otras cuentas"
        disabled={!canTransactToOtherBanks}
      />

      {/* {hasBIM && (
        <TransfersMenuItem
          icon={
            showElementsAs === 'h-scroll'
              ? 'money'
              : canTransactToOtherBanks
              ? 'money-outline'
              : 'money-outline-disabled'
          }
          showElementAs={showElementsAs}
          onPress={onPressRefillBim}
          title="Recarga Bim"
          disabled={!canTransactToOtherBanks}
        />
      )}
      {hasFavorites && showElementsAs === 'list' && (
        <>
          <OperationsMenuItem
            icon="star"
            title="Mis Favoritos"
            onPress={() => {}}
            isSubmenu
            showElementAs={showElementsAs}
          />
          {isGetFavoritesLoading ? (
            <View style={styles.loadingSection}>
              <ActivityIndicator size="large" color={Colors.Primary} />
            </View>
          ) : (
            favoriteList.map(item => (
              <OperationsMenuItem
                key={item.registryId}
                showElementAs={showElementsAs}
                onPress={() => onPressFavorite(item)}
                title={item.concept}
              />
            ))
          )}
        </>
      )}
      */}
    </>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{paddingLeft: 16, paddingRight: 24}}>
      <TransferItems />
    </ScrollView>
  );
};

export default TransfersMenu;

const styles = StyleSheet.create({
  menu_item_wrapper: {
    alignItems: 'center',
    width: transferMenuItemWidth,
  },
  menu_item_icon: {
    borderRadius: 50,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu_wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  loadingSection: {
    height: HEIGHT * 0.25,
    justifyContent: 'center',
  },
});
