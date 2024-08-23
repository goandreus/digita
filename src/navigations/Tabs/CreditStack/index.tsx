import React from 'react';
import {RootStackParamList} from '@navigations/types';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GroupCreditDetail from '@screens/MainStack/MainScreen/groupCreditDetail';
import {MyCredits, CreditDetail} from '@screens/Tab/Credit';

const CreditStack = createNativeStackNavigator<RootStackParamList>();

const Credit = () => {
  return (
    <CreditStack.Navigator initialRouteName="MyCredits">
      <CreditStack.Screen
        name="MyCredits"
        component={MyCredits}
        options={{headerShown: false}}
      />
      <CreditStack.Screen
        name="CreditsDetail2"
        component={CreditDetail}
        options={{headerShown: false}}
      />
      <CreditStack.Screen
        name="GroupCreditDetail2"
        component={GroupCreditDetail}
        options={{headerShown: false}}
      />
    </CreditStack.Navigator>
  );
};

export default Credit;
