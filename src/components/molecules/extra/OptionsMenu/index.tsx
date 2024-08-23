/* eslint-disable react-native/no-inline-styles */
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon, {SvgIconName} from '@atoms/Icon';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {
  getOperationOptions,
  getTransferOptions,
  OperationOptionActions,
  TransferOptionActions,
} from '@utils/getOptionsMenu';
import {useLastUser, useUserInfo} from '@hooks/common';
import {useNavigation} from '@react-navigation/native';
import useSavings from '@hooks/useSavings';
import {getRemoteValue} from '@utils/firebase';
import {FONTS} from '@theme/fonts';
import Button from '@atoms/extra/Button';
import AlertBasic from '../AlertBasic';
import BoxView from '@atoms/BoxView';
import {IFavoriteItem, getFavoritesOperations} from '@services/Favorite';
import FavoriteItem from '../FavoriteItem';

interface ItemProps {
  title: string;
  icon?: SvgIconName;
  disabled?: boolean;
  isSubmenu?: boolean;
  onPress?: () => void;
  showElementAs?: 'h-scroll' | 'list';
}

type Props =
  | {
      optionType: 'Operations';
      showElementsAs?: 'h-scroll' | 'list';
      actions: OperationOptionActions;
    }
  | {
      optionType: 'Transfers';
      showElementsAs?: 'h-scroll' | 'list';
      actions: TransferOptionActions;
    };

const transferMenuItemWidth = Dimensions.get('screen').width / 3;

const OptionMenuItem = ({
  onPress,
  showElementAs = 'list',
  disabled,
  isSubmenu,
  title,
  icon,
}: ItemProps) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
    {showElementAs === 'h-scroll' ? (
      <View style={styles.menu_item_wrapper}>
        {icon && (
          <View
            style={[
              styles.menu_item_icon,
              {
                backgroundColor: !disabled
                  ? COLORS.Primary.Medium
                  : COLORS.Neutral.Medium,
              },
            ]}>
            <Icon
              iconName={icon}
              size={SIZES.XS}
              color={!disabled ? COLORS.Primary.Medium : COLORS.Neutral.Medium}
            />
          </View>
        )}
        <Separator type="x-small" />
        <View style={{width: '90%'}}>
          <TextCustom
            text={title}
            variation="h4"
            weight="bold"
            color={'neutral-medium'}
            size={14}
            align="center"
          />
        </View>
      </View>
    ) : (
      <View
        style={[styles.list_container, {borderBottomWidth: isSubmenu ? 0 : 1}]}>
        <View style={styles.menu_wrapper}>
          {icon && (
            <View style={styles.icon_wrapper}>
              <Icon
                iconName={icon}
                size={SIZES.LG}
                color={disabled ? COLORS.Neutral.Medium : COLORS.Primary.Medium}
              />
            </View>
          )}
          <TextCustom
            color={disabled ? 'neutral-medium' : 'neutral-darkest'}
            variation="h5"
            lineHeight="tight"
            weight="normal"
            style={{
              marginLeft: 16,
              width: Dimensions.get('window').width / 1.5,
            }}
            text={title}
          />
        </View>
        {!isSubmenu && (
          <Icon
            name={disabled ? 'arrow-right-xs-disabled' : 'arrow-right-xs'}
            size="small"
          />
        )}
      </View>
    )}
  </TouchableOpacity>
);

const OptionsMenu = ({showElementsAs = 'list', optionType, actions}: Props) => {
  const {userCredits} = useUserInfo();
  const {lastUser} = useLastUser();
  const {hasAccountForServices} = useSavings();
  const [favoritos, setFavoritos] = useState<IFavoriteItem[]>([]);
  const {
    lastUser: {personId},
  } = useLastUser();
  const {user} = useUserInfo();
  const person = user?.person;

  useEffect(() => {
    personId &&
      getFavoritesOperations(
        optionType,
        person?.documentTypeId,
        person?.documentNumber,
      ).then(data => setFavoritos(data));
  }, [personId, optionType, person?.documentTypeId, person?.documentNumber]);

  const disablePayCredits: boolean =
    userCredits?.groupCredits.length === 0 &&
    userCredits?.individualCredits.length === 0;

  const navigation = useNavigation();

  const [scheduleValues, setScheduleValues] = useState({
    open: false,
    values: {open: '', close: ''},
  });

  const openScheduleModal = () => {
    const _schedule = getRemoteValue('active_srv_pay').asString();

    if (_schedule.includes('-')) {
      const open = parseInt(_schedule.split('-')[0], 10);
      const close = parseInt(_schedule.split('-')[1], 10);

      const _open = numberToFormat12h(open);
      const _close = numberToFormat12h(close);

      setScheduleValues({open: true, values: {open: _open, close: _close}});
    }
  };

  function numberToFormat12h(_number: number) {
    _number = _number % 2400;

    var period = _number >= 1200 ? 'pm' : 'am';

    var hours = Math.floor(_number / 100);
    hours = hours % 12 || 12;

    var minutes = _number % 100;

    var formatHour =
      hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + period;

    return formatHour;
  }

  const handleFavorite = (favorite: IFavoriteItem) => {
    navigation.navigate('OperationsStack', {
      screen: 'OtherBanks',
      params: {
        from: 'Transfers',
        type: 'NONE',
        isFavoriteOperation: true,
        favorite,
      },
    });
  };

  const itemsData =
    optionType === 'Operations'
      ? getOperationOptions({
          showElementAs: showElementsAs,
          actions,
          disablePayCredits,
          lastUser,
          hasAccountForServices,
          navigation,
          openScheduleModal,
        })
      : getTransferOptions({
          showElementAs: showElementsAs,
          actions,
        });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scroll_list_container}>
      {itemsData.map(item => (
        <OptionMenuItem
          key={item.title}
          title={item.title}
          icon={item.icon}
          showElementAs={item.showElementAs}
          onPress={item.onPress}
          disabled={item.disabled}
        />
      ))}
      <BoxView pt={48} pb={216} mx={4}>
        <TextCustom
          text={'Enel-Luz'}
          variation="h0"
          lineHeight="tight"
          weight="normal"
          color={'primary-medium'}>
          Operaciones favoritas
        </TextCustom>
        <BoxView py={16}>
          {favoritos?.map(item => (
            <FavoriteItem
              alias={item.alias}
              operationName={item.operationName}
              key={item.id}
              onPress={() => handleFavorite(item)}
            />
          ))}
        </BoxView>
      </BoxView>
      <AlertBasic
        onClose={() => {
          setScheduleValues({...scheduleValues, open: false});
        }}
        closeOnTouchBackdrop={true}
        isOpen={scheduleValues.open}
        onModalHide={() => {}}
        title="Pago de servicios no disponible"
        customDescription={() => (
          <Text
            style={{
              fontFamily: FONTS.AmorSansPro,
              textAlign: 'center',
              fontSize: 16,
              lineHeight: 24,
              color: '#222D42',
            }}>
            ¡Recuerda! puedes realizar el pago de tus {'\n'} servicios de{' '}
            <Text style={{fontFamily: FONTS.AmorSansProBold}}>
              {scheduleValues.values.open}
            </Text>{' '}
            a{' '}
            <Text style={{fontFamily: FONTS.AmorSansProBold}}>
              {scheduleValues.values.close}
            </Text>
            .
          </Text>
        )}
        actions={(utils: any) => [
          {
            id: 'button1',
            render: (
              <Button
                text="Entiendo"
                type="primary"
                onPress={() => {
                  utils.close();
                }}
              />
            ),
          },
        ]}
      />
    </ScrollView>
  );
};

export default OptionsMenu;

const styles = StyleSheet.create({
  scroll_list_container: {},
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
  icon_wrapper: {
    padding: SIZES.XXS,
    width: 36,
    alignItems: 'center',
  },
  menu_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingSection: {
    /* height: HEIGHT * 0.25, */
    justifyContent: 'center',
  },
  list_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.MD,
    borderBottomColor: COLORS.Neutral.Light,
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
