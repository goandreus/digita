import React, {useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigations/types';
import MainScreen from '@screens/MainStack/MainScreen';
import SavingDetail from '@screens/MainStack/MainScreen/savingDetail';
import MyCredits from '@screens/MainStack/MainScreen/myCredits';
import GroupCreditDetail from '@screens/MainStack/MainScreen/groupCreditDetail';
import {COLORS} from '@theme/colors';
import MySavings from '@screens/MainStack/MainScreen/mySavings';
import {getHeaderTitle} from '@react-navigation/elements';
import {HeaderStack} from '@molecules/extra/HeaderStack';
import EntrepreneurSavingDetail from '@screens/MainStack/MainScreen/entrepreneurSavingDetail';
import MyCreditGroups from '@screens/MainStack/MainScreen/myCreditGroups';
import EntrepreneurSavingMovements from '@screens/MainStack/MainScreen/entrepreneurSavingMovements';
import {CreditDetail} from '@screens/Tab/Credit';

const MainStack = createNativeStackNavigator<RootStackParamList>();

const Main = () => {
  const operationNav = useRef<any>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const goBack = () => {
    navigation.navigate('MainScreen');
    return true;
  };

  const newHeaderOptions: NativeStackNavigationOptions = {
    header: props => {
      const title = getHeaderTitle(props.options, props.route.name);
      const hideGoBackButton =
        (props.options.headerLeft !== undefined &&
          props.options.headerLeft({canGoBack: true}) === null) ||
        navigation.canGoBack() === false;
      return (
        <HeaderStack
          canGoBack={hideGoBackButton === false}
          onBack={goBack}
          title={title}
        />
      );
    },
  };

  /* useFocusEffect(
    useCallback(() => {
      return () => {
        if (operationStackContext.disableUseFocusEffect === false) {
          operationNav.current?.reset({
            index: 0,
            routes: [
              {
                name: 'MainScreen',
                params: {showTokenIsActivated: false, showPasswordUpdated: false},
              },
            ],
          });
        }
      };
    }, []),
  ); */

  return (
    <MainStack.Navigator
      screenListeners={nav => {
        operationNav.current = nav.navigation;
        return {};
      }}>
      <MainStack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{
          headerShown: false,
          animation: 'none',
          contentStyle: {
            backgroundColor: COLORS.Background.Light,
          },
        }}
        initialParams={{
          showTokenIsActivated: false,
          showPasswordUpdated: false,
        }}
      />
      <MainStack.Screen
        name="EntrepreneurSavingDetail"
        component={EntrepreneurSavingDetail}
        options={{
          title: 'Mis movimientos',
          ...newHeaderOptions,
          headerShadowVisible: true,
          headerShown: false,
          contentStyle: {
            backgroundColor: COLORS.Background.Lightest,
          },
        }}
      />
      <MainStack.Screen
        name="EntrepreneurSavingMovements"
        component={EntrepreneurSavingMovements}
        options={{
          title: 'Filtra tus movimientos',
          ...newHeaderOptions,
          headerShown: false,
          contentStyle: {
            backgroundColor: COLORS.Background.Lightest,
          },
        }}
      />
      <MainStack.Screen
        name="SavingDetail"
        component={SavingDetail}
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: COLORS.Error.Light,
          },
        }}
      />
      <MainStack.Screen
        name="MySavings"
        component={MySavings}
        options={{
          title: 'Mis Ahorros',
          ...newHeaderOptions,
          headerShadowVisible: true,
          contentStyle: {
            backgroundColor: COLORS.Background.Light,
          },
        }}
      />
      <MainStack.Screen
        name="MyCredits"
        component={MyCredits}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="MyCreditGroups"
        component={MyCreditGroups}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="CreditsDetail"
        component={CreditDetail}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="GroupCreditDetail"
        component={GroupCreditDetail}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  );
};

export default Main;
