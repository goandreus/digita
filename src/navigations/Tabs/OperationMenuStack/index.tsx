import React, {useCallback, useContext, useRef} from 'react';
import {useFavorites, useLoading} from '@hooks/common';
import {useFocusEffect} from '@react-navigation/native';
import {getRemoteValue} from '@utils/firebase';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigations/types';
import {OperationStackContext} from '@contexts/OperationStackContext';
import {InitialMenuOperations, Transfers} from '@screens/Tab/OperationsMenu';

const OperationMenuStack = createNativeStackNavigator<RootStackParamList>();

const OperationsMenus = () => {
  const hasFavorites = getRemoteValue('active_favs').asBoolean();
  const operationNav = useRef<any>(null);
  const {confirmLoading: isConfirmLoading} = useLoading();

  const {getFavorites} = useFavorites();

  /* const operationStackContext = useContext(OperationStackContext);
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (operationStackContext.disableUseFocusEffect === false) {
          operationNav.current?.reset({
            index: 0,
            routes: [{name: 'Operations'}],
          });
        }
      };
    }, [operationStackContext.disableUseFocusEffect]),
  ); */

  //  remote data for this Stack
  // useEffect(() => {
  //   if (hasFavorites) {
  //     getFavorites();
  //   }
  // }, [getFavorites]);

  return (
    <OperationMenuStack.Navigator
      initialRouteName="Operations"
      screenListeners={nav => {
        operationNav.current = nav.navigation;
        return {};
      }}
      screenOptions={{
        gestureEnabled: false,
      }}>
      <OperationMenuStack.Screen
        name="Operations"
        component={InitialMenuOperations}
        options={{headerShown: false}}
      />
      <OperationMenuStack.Screen
        name="Transfers"
        component={Transfers}
        options={{headerShown: false}}
      />
    </OperationMenuStack.Navigator>
  );
};

export default OperationsMenus;
