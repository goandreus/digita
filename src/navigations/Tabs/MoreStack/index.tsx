import React from 'react';
import {MoreStackParamList} from '@navigations/types';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getRemoteValue} from '@utils/firebase';
import {useFavorites} from '@hooks/common';
import TextCustom from '@atoms/TextCustom';
import {Colors} from '@theme/colors';
import HeaderBackButton from '@molecules/HeaderBackButton';
import MoreMenu from '@screens/MoreMenu';
import UpdatePassword from '@screens/UpdatePassword';
import MyFavoritesScreen from '@screens/MyFavorites';
import MyFavoritesDetailScreen from '@screens/MyFavorites/MyFavoritesDetailScreen';
import FavoriteOperationsScreen from '@screens/MoreMenu/FavoriteOperations';

const MoreStack = createNativeStackNavigator<MoreStackParamList>();

const More = () => {
  const hasFavorites = getRemoteValue('active_favs').asBoolean();
  const {getFavorites} = useFavorites();
  //  remote data for this Stack
  // useEffect(() => {
  //   if (hasFavorites) {
  //     getFavorites();
  //   }
  // }, [getFavorites]);

  return (
    <MoreStack.Navigator
      screenOptions={({navigation}) => ({
        headerTitleAlign: 'center',
        headerTitle: ({children}) => (
          <TextCustom text={children} color={Colors.Primary} variation="h1" />
        ),
        headerBackVisible: false,
        headerLeft: ({canGoBack}) => (
          <HeaderBackButton
            canGoBack={canGoBack}
            onPress={() => navigation.goBack()}
          />
        ),
      })}>
      <MoreStack.Screen
        name="Menu"
        component={MoreMenu}
        options={{headerShown: false}}
        initialParams={{
          showTokenActivatedModal: false,
        }}
      />
      <MoreStack.Screen
        name="UpdatePassword"
        component={UpdatePassword}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="MyFavorites"
        component={MyFavoritesScreen}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="MyFavoritesDetail"
        options={{headerShown: false}}
        component={MyFavoritesDetailScreen}
      />
      <MoreStack.Screen
        name="FavoriteOperations"
        options={{headerShown: false}}
        component={FavoriteOperationsScreen}
      />
    </MoreStack.Navigator>
  );
};

export default More;
