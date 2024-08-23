import {useMemo} from 'react';
import {SvgIconName} from '@atoms/Icon';
import {setTargetScreen} from '@features/loading';
import {IUser} from '@interface/User';
import {getRemoteValue} from '@utils/firebase';

export type OperationOption =
  | 'bim'
  | 'transfers'
  | 'credits'
  | 'interoperability';
export type TransferOption = 'own' | 'others';

export type OperationOptionActions = Map<OperationOption, () => void>;
export type TransferOptionActions = Map<TransferOption, () => void>;

type Item = {
  title: string;
  icon: SvgIconName;
  showElementAs: 'h-scroll' | 'list';
  onPress: (() => void) | undefined;
  disabled: boolean;
};

export const getOperationOptions = ({
  showElementAs,
  actions,
  disablePayCredits,
  lastUser,
  hasAccountForServices,
  navigation,
  openScheduleModal,
}: {
  showElementAs: 'h-scroll' | 'list';
  actions: OperationOptionActions;
  disablePayCredits: boolean;
  lastUser: IUser;
  hasAccountForServices: () => any;
  navigation: any;
  openScheduleModal: () => any;
}) => {
  const token = lastUser.secret;

  const canTransactToOwnAccounts = getRemoteValue('trx_own').asBoolean();
  const canTransactToSameBanks = getRemoteValue('trx_others').asBoolean();
  const canRechargeBim = getRemoteValue('trx_bim').asBoolean();
  const canPayCredits = getRemoteValue('trx_pay_credit').asBoolean();
  const canPayInterop = getRemoteValue('trx_interop').asBoolean();

  const canPayServices = getRemoteValue('trx_srv_pay').asBoolean();
  const activeServicePay = getRemoteValue('active_srv_pay').asString();
  const allow_srv_pay = getRemoteValue('allow_srv_pay').asString();
  const allow_interop = getRemoteValue('allow_interop').asString();
  const active_open_sav_entrpnr = getRemoteValue(
    'active_open_sav_entrpnr',
  ).asBoolean();

  const isAllowedToServicePay = useMemo(() => {
    if (typeof allow_srv_pay === 'string' && allow_srv_pay !== '') {
      if (lastUser.document === undefined || lastUser.document.number === '')
        return false;

      const chunks = allow_srv_pay.split(',');
      for (let index = 0; index < chunks.length; index++) {
        const dni = chunks[index];
        if (dni === lastUser.document.number) return true;
      }

      return false;
    } else return true;
  }, [allow_srv_pay, lastUser]);

  const isAllowedToInterop = () => {
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
  };

  const handleSchedule = (_schedule: string) => {
    if (_schedule.includes('-')) {
      const open = parseInt(_schedule.split('-')[0], 10);
      const close = parseInt(_schedule.split('-')[1], 10);

      const isOpen = onSchedule(open, close);

      return isOpen;
    }
  };
  function onSchedule(open: number, close: number) {
    var now = new Date();
    var currentHour = now.getHours() * 100 + now.getMinutes();

    return currentHour >= open && currentHour <= close;
  }

  const itemsData: Item[] = [
    {
      title: 'Pagar Crédito',
      icon: 'icon_pay-credits',
      showElementAs: showElementAs,
      onPress: actions.get('credits'),
      disabled: !canPayCredits || disablePayCredits,
    },
    {
      title: 'Pagar servicios',
      icon: 'icon_pay_services',
      showElementAs: showElementAs,
      onPress: () => {
        if (
          lastUser.hasActiveToken === false ||
          lastUser.tokenIsInCurrentDevice === false ||
          !token
        ) {
          navigation.navigate('InfoActivateToken');
          /* if (hasAccountForServices()) {
            navigation.navigate('InfoActivateToken');
          } else {
            navigation.navigate('OperationsStack', {
              screen: 'OpenSaveAccount',
              params: {
                from: 'InteroperabilityModal',
                type: 'savings',
              },
            });
          } */
        } else {
          if (hasAccountForServices()) {
            const isOpen = handleSchedule(activeServicePay);
            if (isOpen) {
              setTargetScreen({
                screen: 'PayServicesRootStack',
                from: 'Operations',
              });
              navigation.navigate('PayServicesRootStack');
            } else {
              openScheduleModal();
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
    {
      title: 'Recargar celular',
      icon: 'icon_recharge_phone',
      showElementAs: showElementAs,
      onPress: () => {
        if (
          lastUser.hasActiveToken === false ||
          lastUser.tokenIsInCurrentDevice === false ||
          !token
        ) {
          navigation.navigate('InfoActivateToken');
        } else {
          if (hasAccountForServices()) {
            const isOpen = handleSchedule(activeServicePay);
            if (isOpen) {
              setTargetScreen({
                screen: 'PhoneRechargeScreen',
                from: 'Operations',
              });
              navigation.navigate('PhoneRechargeScreen');
            } else {
              openScheduleModal();
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
    {
      title: 'Recargar Bim',
      icon: 'icon_recharge-bim',
      showElementAs: showElementAs,
      onPress: actions.get('bim'),
      disabled: !canRechargeBim,
    },
    {
      title: 'Transferir dinero',
      icon: 'icon_transfers',
      showElementAs: showElementAs,
      onPress: actions.get('transfers'),
      disabled: !canTransactToOwnAccounts && !canTransactToSameBanks,
    },
    {
      title: 'Pagar a un celular',
      icon: 'icon_Interoperability',
      showElementAs: showElementAs,
      onPress: actions.get('interoperability'),
      disabled: !canPayInterop || isAllowedToInterop() === false,
    },
  ];

  return itemsData;
};

export const getTransferOptions = ({
  showElementAs,
  actions,
}: {
  showElementAs: 'h-scroll' | 'list';
  actions: TransferOptionActions;
}) => {
  const canTransactToOwnAccounts = getRemoteValue('trx_own').asBoolean();
  const canTransactToSameBanks = getRemoteValue('trx_others').asBoolean();

  const itemsData: Item[] = [
    {
      title: 'Entre mis cuentas de Compartamos',
      icon: 'icon_transfers',
      showElementAs: showElementAs,
      onPress: actions.get('own'),
      disabled: !canTransactToOwnAccounts,
    },
    {
      title: 'A cuentas de otros bancos y Compartamos',
      icon: 'icon_transfers',
      showElementAs: showElementAs,
      onPress: actions.get('others'),
      disabled: !canTransactToSameBanks,
    },
  ];

  return itemsData;
};
