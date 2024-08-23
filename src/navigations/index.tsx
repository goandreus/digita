import React, {useEffect, useState} from 'react';
import {useLastUser, useLoading, useToken, useUserInfo} from '@hooks/common';
import {useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import TextCustom from '@atoms/TextCustom';
import {Colors} from '@theme/colors';
import {storeOTP} from '@hooks/useStoreOTP';
import {getRemoteValue} from '@utils/firebase';
import HeaderBackButton from '@molecules/HeaderBackButton';
import TestScreen from '@screens/TestScreen';
import InfoUpdateAppScreen from '@screens/InfoUpdateAppScreen';
import {getHeaderTitle} from '@react-navigation/elements';

// Screens with new UIKit

import {
  HomeScreen,
  LoginNormalScreen,
  LoginSecureScreen,
  RegisterIdentityInfo,
  ConfirmDocumentScreen,
  RegisterUserInfoScreen,
  RegisterUserDocumentScreen,
  RegisterPassword,
} from '@screens/Auth';
import {
  SplashScreen,
  InfoAccessBlocked,
  StartDisbursement,
  StartGroupCredit,
  LineCreditContract,
  TermsAndConditions,
  KnowMoreLineCredit,
} from '@screens/Common';

import RecoverPasswordScreen from '@screens/RecoverPassword';
import LoginScreen from '@screens/LoginScreen';
import LoadingScreen from '@screens/LoadingScreen';
import PayServicesScreen from '@screens/OperationsStack/payServicesScreen';
import ConfirmLoading from '@screens/OperationsStack/loading';
import LocationScreen from '@screens/LocationScreen';
import InfoWithoutMembership from '@screens/InfoWithoutMembership';
import InfoWithoutActiveProduct from '@screens/InfoWithoutActiveProduct';
import InfoRegisterInLogin from '@screens/InfoRegisterInLogin';
import InfoUserExists from '@screens/InfoUserExists';
import InfoRegisterSuccess from '@screens/InfoRegisterSuccess';
import InfoSpam from '@screens/InfoSpam';
import InfoScanDNI from '@screens/InfoScanDNI';
import InfoDataUsed from '@screens/InfoDataUsed';
import InfoAttemptRestriction from '@screens/InfoAttemptRestriction';
import InfoDNINotRecognizedMaxAttempt from '@screens/InfoDNINotRecognizedMaxAttempt';
import InfoFaceBlocked from '@screens/InfoFaceBlocked';
import InfoMaxAttemps from '@screens/InfoMaxAttempts';
import InfoScanError from '@screens/InfoScanError';
import InfoRegisterToken from '@screens/InfoRegisterToken';
import RegisterPasswordInfo from '@screens/RegisterPasswordInfo';
import RegisterOTPScreen from '@screens/Common/RegisterOTPScreen';
import RegisterUserChannel from '@screens/RegisterUserChannel';
import ScanDocumentScreen from '@screens/ScanDocumentScreen';
import ConfirmFace from '@screens/ConfirmFace';
import TabNavigation from './Tabs';
import InfoActivateToken from '@screens/InfoActivateToken';
import ModalError from '@molecules/ModalError';
import {HeaderStack} from '@molecules/extra/HeaderStack';
import Operations from './OperationsStack';
import ScanFace from '@screens/Auth/ScanFace';
import {ServicesScreen} from '@screens/Payments/PayOneService';
import {DebtsScreen} from '@screens/Payments/Debts';
import {ConfirmationScreen} from '@screens/Payments/Confirmation';
import PhoneRechargeScreen from '@screens/Payments/phoneRecharge';
import {PayConstancy} from '@screens/Payments/Constancy';
import ModalInactivity from '@screens/Modals/ModalInactivity';
import WebViewScreen from '@screens/WebView';
import VisitRegistrationScreen from '@screens/VisitRegistrationScreen';
import GroupCollectionConstancyScreen from '@screens/GroupCollection/Constancy';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const [, setLoading] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const {showOfflineModal, setShowOfflineModal, setShowSessionStatus} =
    useLoading();
  const {token} = useToken();
  const {purgeUserState} = useUserInfo();
  const {
    lastUser: {secret},
  } = useLastUser();

  const navigation = useNavigation();

  useEffect(() => {
    if (counter === 3) {
      setShowOfflineModal(false);
      setCounter(0);
      return;
    }
    const activeModal = NetInfo.addEventListener(networkState => {
      const offline = !networkState.isConnected;
      if (!offline) {
        setCounter(0);
      }
      if (counter < 3) {
        setShowOfflineModal(offline);
      }
    });

    return () => activeModal();
  }, [counter, setShowOfflineModal, showOfflineModal]);

  useEffect(() => {
    if (counter === 3) {
      setCounter(0);
      setLoading(false);
      setShowOfflineModal(false);
      navigation.navigate('Home');
      purgeUserState();
    }
  }, [counter, navigation, purgeUserState, setShowOfflineModal]);

  const netConnectionQuery: () => void = async () => {
    setCounter(prev => prev + 1);
    setLoading(true);
    setShowSessionStatus(false);
    try {
      const networkState = await NetInfo.fetch();
      if (networkState) {
        setLoading(false);
      }
      if (networkState.isConnected && networkState.isInternetReachable) {
        setShowOfflineModal(false);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    if (secret && !storeOTP.isInitialized()) {
      storeOTP.startOtp({secretKey: secret, digits: 6, period: 30});
    }

    if (!secret && storeOTP.isInitialized()) {
      storeOTP.clearOtp();
    }

    return () => {
      if (storeOTP.isInitialized()) {
        storeOTP.clearOtp();
      }
    };
  }, [secret]);

  const mandatory_update = getRemoteValue('mandatory_update').asBoolean();

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
          onBack={navigation.goBack}
          title={title}
        />
      );
    },
  };

  return (
    <>
      <RootStack.Navigator
        id="MainStackNavigator"
        initialRouteName="Splash"
        screenOptions={({navigation}) => ({
          // headerStyle: {
          //   backgroundColor: COLORS.Background.Lightest,
          // },
          // headerShadowVisible: false,
          headerTitleAlign: 'center',
          // headerTitle: ({children}) => (
          //   <TextCustom
          //     text={children}
          //     color={COLORS.Neutral.Dark}
          //     size={18}
          //     weight="normal"
          //     variation="h1"
          //   />
          // ),
          // headerBackVisible: false,
          // headerLeft: ({canGoBack}) => (
          //   <HeaderBackButton
          //     canGoBack={canGoBack}
          //     onPress={() => navigation.goBack()}
          //   />
          // ),
          // Previous header
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
        <RootStack.Screen
          name="Test"
          component={TestScreen}
          options={{headerShown: false}}
        />

        <RootStack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Home"
          component={mandatory_update ? InfoUpdateAppScreen : HomeScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="InfoUpdateAppScreen"
          component={InfoUpdateAppScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
            fullScreenGestureEnabled: false,
          }}
        />

        <RootStack.Screen
          name="RegisterUserDocument"
          component={RegisterUserDocumentScreen}
          options={{
            title: '',
            ...newHeaderOptions,
          }}
        />

        <RootStack.Screen
          name="RecoverPassword"
          component={RecoverPasswordScreen}
          options={{title: 'Olvidé mi clave'}}
        />

        <RootStack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Inicia sesión'}}
        />

        <RootStack.Screen
          name="LoginSecure"
          component={mandatory_update ? InfoUpdateAppScreen : LoginSecureScreen}
          options={{title: '', headerShown: false}}
        />

        <RootStack.Screen
          name="LoadingScreen"
          component={LoadingScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
            headerLeft: () => null,
          }}
        />

        <RootStack.Screen
          name="LoadingFishes"
          component={ConfirmLoading}
          getId={({params}) => params.screenId}
          options={{
            headerShown: false,
            gestureEnabled: false,
            headerLeft: () => null,
          }}
        />

        <RootStack.Screen
          name="LoginNormal"
          component={LoginNormalScreen}
          options={{title: '', ...newHeaderOptions}}
        />
        <RootStack.Screen
          name="Location"
          component={LocationScreen}
          options={{title: 'Ubícanos'}}
        />
        <RootStack.Screen
          name="InfoWithoutMembership"
          component={InfoWithoutMembership}
          options={{
            title: '',
          }}
        />

        <RootStack.Screen
          name="VisitRegistration"
          component={VisitRegistrationScreen}
          options={{
            title: 'Registro de visita',
            ...newHeaderOptions,
            headerShadowVisible: true,
          }}
        />

        <RootStack.Screen
          name="InfoWithoutActiveProduct"
          component={InfoWithoutActiveProduct}
          options={{
            title: '',
          }}
        />
        <RootStack.Screen
          name="InfoRegisterInLogin"
          component={InfoRegisterInLogin}
          options={{
            title: '',
          }}
        />
        <RootStack.Screen
          name="InfoUserExists"
          component={InfoUserExists}
          options={{
            title: '',
          }}
        />
        <RootStack.Screen
          name="InfoRegisterSuccess"
          component={InfoRegisterSuccess}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="InfoSpam"
          component={InfoSpam}
          options={{
            title: '',
          }}
        />
        <RootStack.Screen
          name="InfoScanDNI"
          component={InfoScanDNI}
          options={{
            title: 'Validación de DNI',
          }}
        />
        <RootStack.Screen
          name="InfoDataUsed"
          component={InfoDataUsed}
          options={{
            title: '',
          }}
        />
        <RootStack.Screen
          name="InfoAttemptRestriction"
          component={InfoAttemptRestriction}
          options={{
            title: '',
          }}
        />
        <RootStack.Screen
          name="InfoDNINotRecognizedMaxAttempt"
          component={InfoDNINotRecognizedMaxAttempt}
          options={{
            title: '',
          }}
        />
        <RootStack.Screen
          name="InfoFaceBlocked"
          component={InfoFaceBlocked}
          options={{
            title: '',
          }}
        />
        <RootStack.Screen
          name="InfoMaxAttemps"
          component={InfoMaxAttemps}
          options={{
            title: '',
          }}
        />

        <RootStack.Screen
          name="InfoAccessBlocked"
          component={InfoAccessBlocked}
          options={{
            title: '',
          }}
        />

        <RootStack.Screen
          name="InfoScanError"
          component={InfoScanError}
          options={{
            title: '',
          }}
          initialParams={{
            scanType: 'DOI',
          }}
        />

        <RootStack.Screen
          name="InfoRegisterToken"
          component={InfoRegisterToken}
        />

        <RootStack.Screen
          name="StartDisbursement"
          component={StartDisbursement}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        <RootStack.Screen
          name="StartGroupCredit"
          component={StartGroupCredit}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        <RootStack.Screen
          name="LineCreditContract"
          component={LineCreditContract}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        <RootStack.Screen
          name="KnowMoreLineCredit"
          component={KnowMoreLineCredit}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        <RootStack.Screen
          name="RegisterPassword"
          component={RegisterPassword}
          options={{
            title: '',
            headerShown: false,
            animation: 'none',
          }}
          /* options={({navigation, route}) => ({
          title: (() => {
            switch (route.params.flowType) {
              case 'REGISTER':
                return 'Regístrate';
                break;
              case 'FORGOT_PASSWORD':
                return 'Olvidé mi clave';
                break;
            }
          })(),
        })} */
        />
        <RootStack.Screen
          name="RegisterPasswordInfo"
          component={RegisterPasswordInfo}
          options={{
            title: 'Regístrate',
          }}
        />
        <RootStack.Screen
          name="RegisterIdentityInfo"
          component={RegisterIdentityInfo}
          options={({navigation, route}) => ({
            headerShown: false,
            title: (() => {
              switch (route.params.flowType) {
                case 'REGISTER':
                  return 'Regístrate';
                case 'LOGIN':
                  return 'Inicia sesión';
                case 'FORGOT_PASSWORD':
                  return 'Olvidé mi clave';
              }
            })(),
          })}
          // initialParams={{
          //   firstName: "Ricardo",
          //   firstSurname: "Silva",
          //   secondSurname: "Manayalle",
          //   flowType: 'REGISTER',
          //   documentNumber: '70886591',
          //   documentType: 1,
          //   email: 'ricardo@ricardonotes.com',
          //   stage: 'ONBOARDING',
          //   gender: 'M',
          //   stepProps: {
          //     max: 4,
          //     current: 2,
          //   },
          // }}
        />
        <RootStack.Screen
          name="RegisterOTP"
          component={RegisterOTPScreen}
          options={({navigation, route}) => ({
            title: 'Validación',
            ...newHeaderOptions,
          })}
        />
        <RootStack.Screen
          name="RegisterUserChannel"
          component={RegisterUserChannel}
          options={{
            title: 'Regístrate',
          }}
        />
        <RootStack.Screen
          name="RegisterUserInfo"
          component={RegisterUserInfoScreen}
          options={{
            title: 'Regístrate',
            ...newHeaderOptions,
          }}
        />
        <RootStack.Screen
          name="ScanDocument"
          component={ScanDocumentScreen}
          options={{
            title: '',
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="ScanFace"
          component={ScanFace}
          options={{
            title: '',
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="ConfirmDocument"
          component={ConfirmDocumentScreen}
          options={{
            title: '',
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="ConfirmFace"
          component={ConfirmFace}
          options={{
            title: 'Validación de rostro',
          }}
        />
        <RootStack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <RootStack.Screen
          name="MainTab"
          component={TabNavigation}
          options={{
            title: 'MainTab',
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <RootStack.Screen
          name="OperationsStack"
          component={Operations}
          options={{
            title: 'OperationsStack',
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <RootStack.Screen
          name="InfoActivateToken"
          component={InfoActivateToken}
          initialParams={{
            redirectTo: 'HOME',
          }}
          options={({navigation, route}) => ({
            title: '',
            headerBackVisible: false,
            headerLeft: ({canGoBack}) => {
              const back = token.backButton;
              return back ? (
                <HeaderBackButton
                  canGoBack={canGoBack}
                  onPress={() => navigation.goBack()}
                />
              ) : null;
            },
          })}

          // options={{

          //   title: '',
          //   headerBackVisible: false,
          //   {back ? null : nul}
          //  ( back ? null : null )
          //   headerLeft: ({canGoBack}) => {

          //     const back = token.backButton;
          //     return back ?  <HeaderBackButton
          //     canGoBack={canGoBack}
          //     onPress={() => navigation.goBack()}
          //   /> : null;
          //   },
          // }}
        />
        <RootStack.Screen
          name="PayServicesRootStack"
          component={PayServicesScreen}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <RootStack.Screen
          name="PayService"
          component={ServicesScreen}
          options={{
            title: 'Pagar Servicio',
            ...newHeaderOptions,
          }}
        />
        <RootStack.Screen
          name="PayConstancy"
          component={PayConstancy}
          options={{
            headerShown: false,
            gestureEnabled: false,
            ...newHeaderOptions,
          }}
        />
        <RootStack.Screen
          name="Debts"
          component={DebtsScreen}
          options={{
            title: 'Pagar Servicio',
            ...newHeaderOptions,
            animation: 'none',
          }}
        />
        <RootStack.Screen
          name="PhoneRechargeScreen"
          component={PhoneRechargeScreen}
          options={{
            title: 'Recargar Celular',
            ...newHeaderOptions,
            animation: 'none',
          }}
        />
        <RootStack.Screen
          name="PayServiceConfirmation"
          component={ConfirmationScreen}
          options={{
            title: 'Pagar Servicio',
            ...newHeaderOptions,
            animation: 'none',
          }}
        />
        <RootStack.Screen
          name="WebViewScreen"
          component={WebViewScreen}
          options={{headerShown: false}}
        />
        <RootStack.Group screenOptions={{presentation: 'transparentModal'}}>
          <RootStack.Screen
            name="ModalInactivity"
            component={ModalInactivity}
            options={{
              headerShown: false,
              animation: 'fade',
              gestureEnabled: false,
            }}
          />
        </RootStack.Group>
        <RootStack.Screen
          name="GroupCollectionConstancy"
          component={GroupCollectionConstancyScreen}
          options={{
            title: '',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </RootStack.Navigator>
      <ModalError
        isOpen={showOfflineModal}
        title="No hay conexión a internet"
        content="Por favor, comprueba la red y vuelve a intentarlo"
        close={() => {
          netConnectionQuery();
        }}
        errorCode="offline"
      />
    </>
  );
};

export default Navigation;
