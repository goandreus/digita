import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useLoading, useTerms, useUserInfo} from '@hooks/common';
import NetInfo from '@react-native-community/netinfo';
import LoadingScreen from '@screens/LoadingScreen';
import {EventRegister} from '@utils/EventRegister';
import {COLORS, Colors} from '@theme/colors';
import {FontTypes} from '@theme/fonts';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainStack from '@navigations/Tabs/MainStack';
import OperationMenuStack from '@navigations/Tabs/OperationMenuStack';
import CreditStack from '@navigations/Tabs/CreditStack';
import MoreStack from '@navigations/Tabs/MoreStack';
import Icon from '@atoms/Icon';
import ModalNeedSavings from '@atoms/ModalNeedSavings';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {
  setShowNeedSavingModal,
  setShowCreditPunishedModal,
  setShowScheduleModal,
} from '@features/appConfig';
import {useAppSelector} from '@hooks/useAppSelector';
import {InteropScheduleModal} from '@molecules/extra/InteropScheduleModal';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigations/types';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const {showNeedSavingModal, showCreditPunishedModal, showScheduleModal} =
    useAppSelector(state => state.appConfig);

  const {
    confirmLoading: isConfirmLoading,
    hideTabBar,
    setShowSessionStatus,
    loading,
  } = useLoading();

  const {setTerms} = useTerms();

  const {userCreditToDisburt, userGroupCreditToDisburt, purgeUserState} =
    useUserInfo();
  /* const currentTab = useRef(null); */

  // const {panResponder,resetInactivityTimeout} = useCheckInactivity({
  //   onEndInactivity: () => setShowSessionStatus(true),
  // });
  const [inactivityStatus, setInactivityStatus] = useState<number>(0);

  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => {
    const activeModal = NetInfo.addEventListener(networkState => {
      const offline = !networkState.isConnected;
      setIsOffline(offline);
    });

    return () => activeModal();
  }, [isOffline]);

  const resetTabStackOnTab = (nav: any) => {
    const name = nav.route.name;
    const hasStack = nav.route?.state && nav.route?.state?.routes?.length > 1;

    return {
      tabPress: (e: any) => {
        EventRegister.emit('tabPress', e);
        if (name === 'MainCredits') {
          if (userGroupCreditToDisburt) {
            e.preventDefault();
            nav?.navigation.navigate('StartGroupCredit', {
              showTokenIsActivated: false,
            });
            return;
          }
          if (userCreditToDisburt) {
            e.preventDefault();
            if (userCreditToDisburt.module === 117) {
              nav?.navigation.navigate('LineCreditContract', {
                showTokenIsActivated: false,
              });
            } else {
              nav?.navigation.navigate('StartDisbursement', {
                showTokenIsActivated: false,
              });
            }
          }
        }
        if (name === 'Main' && hasStack) {
          nav?.navigation?.reset({
            index: 0,
            routes: [
              {
                name: 'MainScreen',
                params: {
                  showTokenIsActivated: false,
                  showPasswordUpdated: false,
                },
              },
            ],
          });
        }
        if (name === 'MainOperations' && hasStack) {
          nav?.navigation?.reset({
            index: 0,
            routes: [{name: 'Operations'}],
          });
        }
      },
    };
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Se deberia purgar el estado solo cuando cerramos session
        setTerms(false);
      };
    }, []),
  );

  const timerId = useRef<NodeJS.Timeout | null>(null);
  const inactivityTime = 1000 * 300;

  useEffect(() => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      if (Date.now() - inactivityStatus > inactivityTime) {
        setShowSessionStatus(true);
      }
    }, inactivityTime);
    return () => {
      clearTimeout(timerId.current);
    };
  }, [inactivityStatus]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View
      style={{flex: 1}}
      onTouchStart={() => {
        setInactivityStatus(Date.now());
      }}>
      <Tab.Navigator
        initialRouteName="Main"
        screenListeners={resetTabStackOnTab}
        screenOptions={() => ({
          tabBarActiveTintColor: Colors.Primary,
          tabBarInactiveTintColor: Colors.Border,
          headerShown: false,
          tabBarStyle: {
            display: isConfirmLoading || hideTabBar ? 'none' : 'flex',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: FontTypes.Bree,
          },
          tabBarItemStyle: {
            marginTop: 10,
            marginBottom: Platform.OS === 'android' ? 2 : undefined,
          },
          tabBarIconStyle: {
            paddingBottom: 8,
          },
        })}>
        <Tab.Screen
          name="Main"
          component={MainStack}
          options={{
            tabBarLabel: 'Inicio',
            tabBarInactiveTintColor: COLORS.Neutral.Dark,
            tabBarActiveTintColor: COLORS.Primary.Medium,
            tabBarIcon: ({focused}) => (
              <Icon
                name={focused ? 'home-active' : 'home'}
                size="small"
                fill={focused ? COLORS.Primary.Medium : COLORS.Neutral.Dark}
                color={focused ? COLORS.Primary.Medium : COLORS.Neutral.Dark}
              />
            ),
          }}
        />
        <Tab.Screen
          name="MainCredits"
          component={CreditStack}
          options={{
            tabBarLabel: 'Créditos',
            tabBarInactiveTintColor: COLORS.Neutral.Dark,
            tabBarActiveTintColor: COLORS.Primary.Medium,
            tabBarIcon: ({focused}) => (
              <Icon
                name={focused ? 'pay-credits-primary' : 'icon_credits-tab'}
                size="small"
                color={focused ? COLORS.Primary.Medium : COLORS.Neutral.Dark}
              />
            ),
          }}
        />
        <Tab.Screen
          name="MainOperations"
          component={OperationMenuStack}
          options={{
            tabBarLabel: 'Operaciones',
            tabBarInactiveTintColor: COLORS.Neutral.Dark,
            tabBarActiveTintColor: COLORS.Primary.Medium,
            tabBarIcon: ({focused}) => (
              <Icon
                name="icon_operations-tab"
                size="small"
                fill={focused ? COLORS.Primary.Medium : COLORS.Neutral.Dark}
                color={focused ? COLORS.Primary.Medium : COLORS.Neutral.Dark}
              />
            ),
          }}
        />
        {/*<Tab.Screen
            name="Foryou"
            component={ForyouScreen}
            options={{
              tabBarLabel: 'Para ti',
              tabBarIcon: ({focused}) => (
                <Icon
                  name={focused ? 'foryou-active' : 'heart'}
                  size="small"
                  fill="#fff"
                />
              ),
            }}
          />*/}
        <Tab.Screen
          name="More"
          component={MoreStack}
          options={{
            tabBarInactiveTintColor: COLORS.Neutral.Dark,
            tabBarActiveTintColor: COLORS.Primary.Medium,
            unmountOnBlur: true,
            headerShown: false,
            tabBarLabel: 'Más',
            tabBarIcon: ({focused}) => (
              <Icon
                name="menu-bars"
                size="small"
                fill={focused ? COLORS.Primary.Medium : COLORS.Neutral.Dark}
              />
            ),
          }}
        />
      </Tab.Navigator>

      <ModalNeedSavings
        show={showNeedSavingModal}
        title={'¡Uy, necesitas abrir una\ncuenta de ahorros!'}
        subtitle={
          'Para abrir una cuenta de ahorros acércate\na nuestra agencia más cercana.'
        }
        onButtonPress={() => {
          dispatch(setShowNeedSavingModal(false));
        }}
      />
      <ModalNeedSavings
        show={showCreditPunishedModal}
        title={'Pago no disponible'}
        subtitle={
          'Para realizar el pago de tu cuota acércate\na nuestra agencia más cercana.'
        }
        onButtonPress={() => {
          dispatch(setShowCreditPunishedModal(false));
        }}
      />
      <InteropScheduleModal
        showScheduleModal={showScheduleModal}
        closeScheduleModal={() => {
          dispatch(setShowScheduleModal(false));
          navigation.navigate('MainScreen', {});
        }}
      />
    </View>
  );
};

export default TabNavigation;
