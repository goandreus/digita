/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useState} from 'react';
import Icon, {IconName} from '@atoms/Icon';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {COLORS, Colors} from '@theme/colors';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useLastUser, useUserInfo} from '@hooks/common';

import {getRemoteValue} from '@utils/firebase';
import {sortArrayByStringProp} from '@utils/orderBy';
import {SIZES} from '@theme/metrics';
import MenuItem from './MenuItem';
import {useNavigation} from '@react-navigation/native';
import {setTargetScreen} from '@features/loading';
import useSavings from '../../../hooks/useSavings';
import AlertBasic from '@molecules/extra/AlertBasic';
import {FONTS} from '@theme/fonts';
import Button from '@atoms/extra/Button';

interface Props {
  screen?: string;
  showElementsAs?: 'h-scroll' | 'list';
  onPressInteroperability?: ({redirectTo}: {redirectTo?: string}) => void;
  onPressTransfers?: () => void;
  onPressRefillBim?: () => void;
  onPressPayCredits?: () => void;
  onPressFavorites?: () => void;
}

interface Item {
  title: string;
  icon: IconName;
  showElementAs: 'h-scroll' | 'list';
  onPress:
    | (() => void)
    | (({redirectTo}: {redirectTo?: string}) => void)
    | undefined;
  disabled: boolean;
  show?: boolean;
}

const HEIGHT = Dimensions.get('screen').height;
const transferMenuItemWidth = Dimensions.get('screen').width / 4;

const OperationsMenuItem = ({
  onPress,
  showElementAs = 'h-scroll',
  disabled,
  isSubmenu,
  title,
  icon,
  show = true,
}: {
  title: string;
  icon?: IconName;
  disabled?: boolean;
  isSubmenu?: boolean;
  onPress?:
    | (() => void)
    | (({redirectTo}: {redirectTo?: string}) => void)
    | undefined;
  showElementAs?: 'h-scroll' | 'list';
  show?: boolean;
}) => {
  return show ? (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      {showElementAs === 'h-scroll' && show && (
        <View style={styles.menu_item_wrapper}>
          {icon && (
            <View
              style={[
                styles.menu_item_icon,
                {
                  backgroundColor: !disabled ? Colors.Primary : Colors.Disabled,
                },
              ]}>
              <Icon
                name={icon}
                size="small"
                fill={'#fff'}
                color="white"
                stroke={!disabled ? '' : Colors.Disabled}
              />
            </View>
          )}
          <Separator type="x-small" />
          <View style={{width: '90%'}}>
            <TextCustom
              text={title}
              variation="h2"
              weight="normal"
              color={COLORS.Neutral.Dark}
              size={14}
              style={{textAlign: 'center'}}
            />
          </View>
        </View>
      )}

      {showElementAs === 'list' && (
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
              size={16}
              weight="bold"
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
      )}
    </TouchableOpacity>
  ) : null;
};

const OperationsMenu = ({
  onPressInteroperability,
  onPressRefillBim,
  onPressTransfers,
  onPressPayCredits,
  screen,
  showElementsAs = 'h-scroll',
}: Props) => {
  const navigation = useNavigation();
  const {lastUser} = useLastUser();
  const {hasAccountForServices} = useSavings();
  const token = lastUser.secret;
  const hasBIM = getRemoteValue('trx_bim').asBoolean();
  const canTransactToSameBanks = getRemoteValue('trx_others').asBoolean();
  const canTransactToOtherBanks = getRemoteValue('trx_banks').asBoolean();
  const canPayCredits = getRemoteValue('trx_pay_credit').asBoolean();
  const canPayInterop = getRemoteValue('trx_interop').asBoolean();
  const canPayServices = getRemoteValue('trx_srv_pay').asBoolean();
  const activeServicePay = getRemoteValue('active_srv_pay').asString();
  const allow_srv_pay = getRemoteValue('allow_srv_pay').asString();
  const allow_interop = getRemoteValue('allow_interop').asString();
  const {userCredits} = useUserInfo();
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [showEntrepreneurErrorModal, setShowEntrepreneurErrorModal] = useState<boolean>(false);
  const active_interop = getRemoteValue('active_interop').asString();
  const scheduleRange = active_interop?.split('-');
  const [startRange, endRange] = scheduleRange;
  const startHour = +startRange?.slice(0, startRange?.length - 2);
  const endHour = +endRange?.slice(0, endRange?.length - 2);
  const startMinutes = +startRange?.slice(-2);
  const endMinutes = +endRange?.slice(-2);
  const active_open_sav_entrpnr = getRemoteValue('active_open_sav_entrpnr').asBoolean();

  const startHourText = startHour < 10 ? `0${startHour}` : `${startHour}`;
  const endHourText = endHour < 10 ? `0${endHour}` : `${endHour}`;
  const startMinutesText =
    startMinutes < 10 ? `0${startMinutes}` : `${startMinutes}`;
  const endMinutesText = endMinutes < 10 ? `0${endMinutes}` : `${endMinutes}`;
  const startLabel = startHour < 13 ? 'am' : 'pm';
  const endLabel = endHour < 13 ? 'am' : 'pm';

  const isAllowedToServicePay = useMemo(() => {
    if (typeof allow_srv_pay === 'string' && allow_srv_pay !== '') {
      if (lastUser.document === undefined || lastUser.document.number === '') return false;

      const chunks = allow_srv_pay.split(",");
      for (let index = 0; index < chunks.length; index++) {
        const dni = chunks[index];
        if (dni === lastUser.document.number) return true;
      }

      return false;
    } else return true;
  }, [allow_srv_pay, lastUser]);

  const isAllowedToInterop = useMemo(() => {
    if (typeof allow_interop === 'string' && allow_interop !== '') {
      if (lastUser.document === undefined || lastUser.document.number === '') {
        return false;
      }

      const chunks = allow_interop.split(',');
      for (let index = 0; index < chunks.length; index++) {
        const dni = chunks[index];
        if (dni === lastUser.document.number) {
          return true;
        }
      }

      return false;
    } else {
      return true;
    }
  }, [allow_interop, lastUser]);

  const [scheduleValues, setScheduleValues] = useState({
    open: false,
    values: {open: '', close: ''},
  });
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

  const handleShowCreditsItem = (): boolean => {
    if (
      screen === 'operationsMenu' &&
      userCredits &&
      userCredits!.individualCredits.length === 0
    ) {
      return false;
    }
    return true;
  };

  const disablePayCredits: boolean =
    userCredits?.groupCredits.length === 0 &&
    userCredits?.individualCredits.length === 0;

  const itemsData: Item[] = [
    {
      title: 'Pagar a\n un celular',
      icon: 'interoperability-outline',
      showElementAs: showElementsAs,
      onPress: onPressInteroperability,
      disabled: !canPayInterop || isAllowedToInterop === false,
    },
    {
      title: 'Pagar\n crédito',
      icon:
        showElementsAs === 'h-scroll'
          ? 'pay-credits'
          : true
          ? 'pay-credits-outline'
          : 'pay-credits-outline',
      showElementAs: showElementsAs,
      show: handleShowCreditsItem(),
      onPress: onPressPayCredits,
      disabled: !canPayCredits || disablePayCredits,
    },
    {
      title: 'Transferir\n dinero',
      icon: showElementsAs === 'h-scroll' ? 'transfers' : 'transfers-outline',
      showElementAs: showElementsAs,
      onPress: onPressTransfers,
      disabled: false,
    },
    {
      title: 'Pagar\n servicios',
      icon: 'icon_pay_services',
      showElementAs: showElementsAs,
      onPress: () => {
        const isOpen = handleSchedule(activeServicePay);
        if (
          lastUser.hasActiveToken === false ||
          lastUser.tokenIsInCurrentDevice === false ||
          !token
        ) {
          navigation.navigate('InfoActivateToken');
        } else {
          if (hasAccountForServices()) {
            if (isOpen) {
              setTargetScreen({
                screen: 'PayServicesRootStack',
                from: 'MainScreen',
              });
              navigation.navigate('PayServicesRootStack');
            }
          } else {
            navigation.navigate('OperationsStack', {
              screen: 'OpenSavingsAccount',
            });
          }
        }
      },
      disabled: canPayServices === false || isAllowedToServicePay === false,
    },
    // ...(hasBIM
    //   ? [
    //       {
    //         title: 'Recargar\n Bim',
    //         icon: (showElementsAs === 'h-scroll'
    //           ? 'bim-recharge'
    //           : canTransactToOtherBanks
    //           ? 'bim-recharge-outline'
    //           : 'bim-recharge-outline') as IconName,
    //         showElementAs: showElementsAs,
    //         onPress: onPressRefillBim,
    //         disabled: !canTransactToSameBanks,
    //       },
    //     ]
    //   : []),
  ];
  // console.log('userCredits :>> ', userCredits);

  /* const TransferItems = () => (
    <>
      <OperationsMenuItem
        icon={showElementsAs === 'h-scroll' ? 'pig' : (canTransactToOwnAccounts ? 'pig-outline' : 'pig-outline-disabled')}
        showElementAs={showElementsAs}
        onPress={action}
        title="Transferir a cuentas propias"
        disabled={!canTransactToOwnAccounts}
      />
      <OperationsMenuItem
        icon={showElementsAs === 'h-scroll' ? 'users' : (canTransactToSameBanks ? 'users-outline' : 'users-outline-disabled')}
        showElementAs={showElementsAs}
        onPress={onPressSameBank}
        title="Transferir a cuentas Compartamos"
        disabled={!canTransactToSameBanks}
      />
      <OperationsMenuItem
        icon={
          showElementsAs === 'h-scroll'
            ? 'exchange-one'
            : (canTransactToOtherBanks ? 'exchange-one-outline' : 'exchange-one-outline-disabled')
        }
        showElementAs={showElementsAs}
        onPress={onPressOtherBanks}
        title="Transferir a otros bancos"
        disabled={!canTransactToOtherBanks}
      />
      {hasBIM && (
        <OperationsMenuItem
          icon={showElementsAs === 'h-scroll' ? 'money' : (canTransactToOtherBanks ? 'money-outline' : 'money-outline-disabled')}
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
    </>
  ); */

  if (showElementsAs === 'list') {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingLeft: 16, paddingRight: 24}}>
        {/* <TransferItems /> */}
        {sortArrayByStringProp(itemsData, 'title').map(item => (
          <OperationsMenuItem
            key={item.title}
            title={item.title}
            icon={item.icon}
            showElementAs={item.showElementAs}
            onPress={item.onPress}
            disabled={item.disabled}
            show={item.show}
          />
        ))}
      </ScrollView>
    );
  }

  const handleSchedule = (_schedule: string) => {
    if (_schedule.includes('-')) {
      const open = parseInt(_schedule.split('-')[0], 10);
      const close = parseInt(_schedule.split('-')[1], 10);

      const _open = numberToFormat12h(open);
      const _close = numberToFormat12h(close);

      const isOpen = onSchedule(open, close);

      setScheduleValues({open: !isOpen, values: {open: _open, close: _close}});

      return isOpen;
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

  function onSchedule(open: number, close: number) {
    var now = new Date();
    var currentHour = now.getHours() * 100 + now.getMinutes();

    return currentHour >= open && currentHour <= close;
  }

  return (
    <View>
      <ScrollView
        horizontal
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        snapToInterval={transferMenuItemWidth}>
        {itemsData.map(item => (
          <OperationsMenuItem
            key={item.title}
            title={item.title}
            icon={item.icon}
            showElementAs={item.showElementAs}
            onPress={item.onPress}
            disabled={item.disabled}
            show={item.show}
          />
        ))}
      </ScrollView>

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
        actions={utils => [
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
      <AlertBasic
        isOpen={showScheduleModal}
        title={'Pago no disponible'}
        body={
          <TextCustom
            // eslint-disable-next-line react-native/no-inline-styles
            style={{lineHeight: 24}}
            color={COLORS.Neutral.Dark}
            variation="p"
            size={16}
            weight="normal"
            align="center">
            {'¡Recuerda! puedes realizar pagos a un número celular de'}
            <TextCustom
              text={` ${startHourText}:${startMinutesText} ${startLabel} `}
              color={COLORS.Neutral.Darkest}
              variation="p"
              weight="bold"
              align="center"
            />
            a
            <TextCustom
              text={` ${endHourText}:${endMinutesText} ${endLabel}.`}
              color={COLORS.Neutral.Darkest}
              variation="p"
              weight="bold"
              align="center"
            />
          </TextCustom>
        }
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button
                orientation="vertical"
                text="Entiendo"
                type="primary"
                onPress={() => setShowScheduleModal(false)}
              />
            ),
          },
        ]}
        onClose={() => {}}
      />
    </View>
  );
};

export default OperationsMenu;

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
