import React from 'react';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigations/types';
import {
  ChooseCredit,
  OtherAccounts,
  CreditPaymentsScreen,
  OwnAccounts,
  RefillBim,
  OpenSaveAccount,
  OpenEntrepreneurAccount,
  Disbursement,
  AffiliatePhone,
  PayWithPhone,
  Cancellation,
  GroupCreditContract,
  LineDisbursement,
  LineSimulation,
} from '@screens/Operations';
import ModalNeedSavings from '@atoms/ModalNeedSavings';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {
  setShowNeedSavingModal,
  setShowCreditPunishedModal,
  setShowScheduleModal,
} from '@features/appConfig';
import {useAppSelector} from '@hooks/useAppSelector';
import {PayWithPhoneForm} from '@screens/Operations/PayWithPhone/screens/PayWithPhoneForm';
import {SetInteroperability} from '../../components/screens/Operations/SetInteroperalibity/index';
import {InteropScheduleModal} from '@molecules/extra/InteropScheduleModal';
import {useNavigation} from '@react-navigation/native';
import {OpenSavingsAccount} from '@screens/Operations/OpenSavingsAccount';

const OperationStack = createNativeStackNavigator<RootStackParamList>();

const Operations = () => {
  const dispatch = useAppDispatch();
  const {showNeedSavingModal, showCreditPunishedModal, showScheduleModal} =
    useAppSelector(state => state.appConfig);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <>
      <OperationStack.Navigator
        initialRouteName="OtherBanks"
        screenOptions={{
          gestureEnabled: false,
        }}>
        <OperationStack.Screen
          name="AffiliatePhone"
          component={AffiliatePhone}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <OperationStack.Screen
          name="OpenSavingsAccount"
          component={OpenSavingsAccount}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <OperationStack.Screen
          name="OpenSaveAccount"
          component={OpenSaveAccount}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <OperationStack.Screen
          name="OpenEntrepreneurAccount"
          component={OpenEntrepreneurAccount}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <OperationStack.Screen
          name="PayWithPhone"
          component={PayWithPhone}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <OperationStack.Screen
          name="PayWithPhoneForm"
          component={PayWithPhoneForm}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <OperationStack.Screen
          name="SetInteroperability"
          component={SetInteroperability}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <OperationStack.Screen
          name="Disbursement"
          component={Disbursement}
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
        <OperationStack.Screen
          name="LineDisbursement"
          component={LineDisbursement}
          options={{
            headerShown: false,
          }}
        />
        <OperationStack.Screen
          name="LineSimulation"
          component={LineSimulation}
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
        <OperationStack.Screen
          name="OtherBanks"
          component={OtherAccounts}
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
        <OperationStack.Screen
          name="OwnAccounts"
          component={OwnAccounts}
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
        <OperationStack.Screen
          name="RefillBim"
          component={RefillBim}
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
        <OperationStack.Screen
          name="CreditPayments"
          component={CreditPaymentsScreen}
          options={{
            title: 'Pagar cuotas',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <OperationStack.Screen
          name="ChooseCredit"
          component={ChooseCredit}
          options={{
            title: 'Elegir Credito',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <OperationStack.Screen
          name="Cancellation"
          component={Cancellation}
          options={{
            headerShown: false,
          }}
        />
        <OperationStack.Screen
          name="GroupCreditContract"
          component={GroupCreditContract}
          options={{
            headerShown: false,
          }}
        />
      </OperationStack.Navigator>

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
    </>
  );
};

export default Operations;
