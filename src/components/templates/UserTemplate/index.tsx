import React, {useCallback, useRef, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import {ScreenSize} from '@theme/metrics';
import {COLORS, Colors} from '@theme/colors';
import TextCustom from '@atoms/TextCustom';
import Icon from '@atoms/Icon';
import Separator from '@atoms/Separator';
import PopUp from '@atoms/PopUp';
import Button from '@atoms/Button';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useLoading, useLastUser, useUserInfo, useModals} from '@hooks/common';
import {Credit, Saving} from '@features/userInfo';
import OperationsMenu from '@molecules/OperationsMenu';
import {
  setShowNeedSavingModal,
  setShowCreditPunishedModal,
  setShowScheduleModal,
} from '@features/appConfig';
import {useAppDispatch} from '@hooks/useAppDispatch';
import useSavings from '@hooks/useSavings';
import {getRemoteValue} from '@utils/firebase';
import {useValidToRefillBim} from '@hooks/useValidToOperation';
import {interopSchedule} from '@utils/interopSchedule';
import {hasContactsAccessPermissions} from '@utils/permissions';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigations/types';
import {canTransactInteroperability} from '@utils/canTransactInteroperability';
import {
  IInteroperabilityInfo,
  getInteroperabilityInfo,
} from '@services/Interoperability';
import {InteropEntrepreneurErrorModal} from '@molecules/extra/EntrepreneurErrorModal';
import {
  IOpeningAccountsErrorModal,
  OpeningAccountsErrorModal,
} from '@molecules/extra/OpeningAccountsErrorModal';

interface UserTemplateProps {
  children?: React.ReactNode;
  top?: any;
  right?: any;
  user?: any;
  gender?: string;
  allSavings?: Saving[];
}

const UserTemplate = ({
  children,
  user,
  gender,
  allSavings,
}: UserTemplateProps) => {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    userSavings,
    userCredits,
    userInteroperabilityInfo,
    userEntrepreneurAccount,
    setUserInteroperabilityInfo,
    setUserEntrepreneurAccount,
  } = useUserInfo();
  const deviceHeight = Dimensions.get('window').height;
  const route = useRoute();
  const person = user?.person;
  const [showEntrepreneurErrorModal, setShowEntrepreneurErrorModal] =
    useState<boolean>(false);
  const [showOpeningAccountsErrorModal, setShowOpeningAccountsErrorModal] =
    useState<IOpeningAccountsErrorModal>({
      isOpen: false,
      title: '',
      description: '',
      button1: {
        title: '',
        action: () => {},
      },
      button2: {
        title: '',
        action: () => {},
      },
    });
  const hasEnabledAccountsToInteroperate =
    canTransactInteroperability([...(userSavings?.savings.savings ?? [])])
      ?.canTransactInSoles.length === 0;
  const affiliatedAccount = userSavings?.savings?.savings?.find(
    e => `${e.operationUId}` === userInteroperabilityInfo?.operationUId,
  );

  let originSavings = allSavings?.filter(e => e.canTransact);
  const {lastUser} = useLastUser();
  const {setTargetScreen} = useLoading();
  const {tokenModal, setTokenModal} = useModals();

  const {handleRefillBim} = useValidToRefillBim();

  const savingsInSoles = originSavings?.filter(e => e.currency === 'S/').length;
  const savingsInDollars = originSavings?.filter(
    e => e.currency === '$',
  ).length;

  const {hasAccountForTransact} = useSavings();

  const mainStackNavigator = navigation.getParent('MainStackNavigator' as any);

  if (savingsInSoles === 1 && originSavings!.length > 1) {
    originSavings = originSavings!.filter(e => e.currency !== 'S/');
  }
  if (savingsInDollars === 1 && originSavings!.length > 1) {
    originSavings = originSavings!.filter(e => e.currency !== '$');
  }

  const token = lastUser.secret;

  const onPressTransfers = () => {
    setTargetScreen({screen: 'Transfers', from: 'MainScreen'});
    navigation.navigate('MainOperations', {
      screen: 'Transfers',
      params: {from: 'MainScreen'},
      initial: false,
    });
  };

  const onPressPayCredits = () => {
    if (!hasAccountForTransact()) {
      dispatch(setShowNeedSavingModal(true));
    } else {
      // const credistMerged = [
      //   ...userCredits!.individualCredits,
      //   ...userCredits!.groupCredits,
      // ];
      const hasOneCredit = userCredits?.individualCredits.length === 1;

      if (hasOneCredit) {
        const credit: Credit = userCredits.individualCredits[0];
        if (credit.isPunished === false) {
          setTargetScreen({
            screen: 'CreditPayments',
            from: 'MainScreen',
          });

          navigation.navigate(
            'OperationsStack' as never,
            {
              screen: 'CreditPayments',
              params: {
                accountNumber: credit.accountCode,
                currency: credit.currency! ?? '',
              },
            } as never,
          );
        } else {
          dispatch(setShowCreditPunishedModal(true));
        }
      } else {
        setTargetScreen({
          screen: 'ChooseCredit',
          from: 'MainScreen',
        });
        mainStackNavigator?.dispatch(
          StackActions.push('OperationsStack', {
            screen: 'ChooseCredit',
            params: {},
          }),
        );
      }
    }
  };
  const onPressInteroperability = async () => {
    if (
      lastUser.hasActiveToken === false ||
      lastUser.tokenIsInCurrentDevice === false ||
      !token
    ) {
      navigation.navigate('InfoActivateToken', {
        redirectTo: 'HOME',
        option: 'home',
      });
      return;
    }

    if (userInteroperabilityInfo) {
      if (
        affiliatedAccount?.status === 'Normal' &&
        affiliatedAccount?.currency === 'S/'
      ) {
        if (!interopSchedule().visibilityModal) {
          const contactsAccessPermission = await hasContactsAccessPermissions();

          navigation.navigate('OperationsStack', {
            screen: 'PayWithPhone',
            params: {
              disablePhoneAlert: {
                isOpen: false,
                title: '',
                content: '',
                button: '',
              },
              showTokenIsActivated: false,
              contactsAccessPermission,
            },
          });
        } else {
          dispatch(setShowScheduleModal(true));
        }
      } else {
        setShowOpeningAccountsErrorModal(prev => ({
          ...prev,
          isOpen: true,
          title: '¡Uy, ocurrió un problema!',
          description:
            'La cuenta afiliada a tu número celular está inhabilitada. Te recomendamos acercarte a agencia o actualizar la cuenta afiliada.',
          button1: {
            title: 'Actualizar Cuenta',
            action: () => {
              setShowOpeningAccountsErrorModal(e => ({
                ...e,
                isOpen: false,
              }));
              navigation.navigate('OperationsStack', {
                screen: 'AffiliatePhone',
                params: {
                  showTokenIsActivated: false,
                  operationType: 'updateAffiliation',
                  from: 'moreScreen',
                },
              });
            },
          },
          button2: {
            title: 'Entendido',
            action: () =>
              setShowOpeningAccountsErrorModal(e => ({
                ...e,
                isOpen: false,
              })),
          },
        }));
      }
    } else {
      if (userEntrepreneurAccount?.isCreated) {
        const userInteropInfo = await getInteroperabilityInfo({
          user: `0${person?.documentTypeId}${person?.documentNumber}`,
          screen: route.name,
        });

        if (userInteropInfo.isSuccess === true && userInteropInfo.data) {
          await Promise.all([userInteropInfo]).then(async ([interopInfo]) => {
            Object.keys(interopInfo?.data ?? {}).length !== 0
              ? setUserInteroperabilityInfo(
                  interopInfo.data as IInteroperabilityInfo,
                )
              : setUserInteroperabilityInfo(null);
          });

          setUserEntrepreneurAccount({
            isCreated: false,
          });
        } else {
          setShowEntrepreneurErrorModal(true);
          return;
        }
      }

      if (hasEnabledAccountsToInteroperate) {
        navigation.navigate('OperationsStack', {
          screen: 'OpenSavingsAccount',
        });
      } else {
        navigation.navigate('OperationsStack', {
          screen: 'AffiliatePhone',
          params: {
            showTokenIsActivated: false,
            operationType: 'affiliation',
            from: 'InteroperabilityModal',
          },
        });
      }
    }
  };

  const onActivateToken = async () => {
    setTokenModal({show: false});
    await new Promise(res => setTimeout(res, 500));
    navigation.navigate('InfoActivateToken');
  };

  const styles = getStyles();

  const main_title =
    getRemoteValue('main_title').asString() || '¡Descubre tu nueva app!';

  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({y: 0, animated: false});
      }
    }, []),
  );

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <View style={styles.imageBackgroundContainer}>
        <ImageBackground
          resizeMode="contain"
          style={styles.imageBackgroundStyle}
          source={
            gender === 'F'
              ? require('@assets/images/avatarWoman.png')
              : require('@assets/images/avatarMan.png')
          }>
          {user && (
            <View style={styles.userContainer}>
              <View>
                <Icon name="me" fill="#fff" size="small" />
                <Separator type="x-small" />
                <TextCustom
                  text={`Hola, ${user?.person?.names
                    .charAt(0)
                    .toUpperCase()}${user?.person?.names
                    .slice(1)
                    .toLowerCase()}`}
                  variation="h2"
                  weight="normal"
                  size={24}
                  color={Colors.White}
                />
                <Separator type="xx-small" />
                <TextCustom
                  text={main_title}
                  variation="h2"
                  weight="normal"
                  size={14}
                  color={Colors.White}
                />
              </View>
            </View>
          )}
        </ImageBackground>
      </View>
      <Separator size={120} />
      {deviceHeight > 680 && <Separator type="small" />}

      <OperationsMenu
        onPressRefillBim={handleRefillBim}
        onPressTransfers={onPressTransfers}
        onPressPayCredits={onPressPayCredits}
        onPressInteroperability={onPressInteroperability}
      />
      <View style={styles.body}>{children}</View>

      <PopUp animationOutTiming={1} open={tokenModal.show}>
        <TextCustom
          align="center"
          color="#665F59"
          variation="h0"
          weight="normal"
          size={18}
          text="¡Recuerda!"
        />
        <Separator type="small" />
        <TextCustom
          align="center"
          color="#83786F"
          variation="p"
          text="Necesitas activar tu Token digital y tener habilitadas tus cuentas de ahorro para poder realizar operaciones."
        />
        <Separator size={24} />
        <Button
          containerStyle={styles.tokenButton}
          type="primary"
          text="Activar Token"
          onPress={onActivateToken}
          orientation="horizontal"
        />
        <Separator type="small" />
        <TextCustom
          size={16}
          align="center"
          color="#83786F"
          variation="link"
          text="Ahora no"
          onPress={() => setTokenModal({show: false})}
        />
      </PopUp>

      <InteropEntrepreneurErrorModal
        showEntrepreneurErrorModal={showEntrepreneurErrorModal}
        closeEntrepreneurErrorModal={() => {
          setShowEntrepreneurErrorModal(false);
          navigation.navigate('MainScreen');
        }}
      />

      <OpeningAccountsErrorModal
        isOpen={showOpeningAccountsErrorModal.isOpen}
        title={showOpeningAccountsErrorModal.title}
        description={showOpeningAccountsErrorModal.description}
        button1={showOpeningAccountsErrorModal.button1}
        button2={showOpeningAccountsErrorModal.button2}
      />
    </ScrollView>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.Background.Light,
    },
    imageBackgroundContainer: {
      justifyContent: 'center',
      backgroundColor: Colors.Primary,
      height: '10%',
      paddingTop: 100,
    },
    imageBackgroundStyle: {
      height: ScreenSize.height / 3,
      justifyContent: 'center',
    },
    userContainer: {marginLeft: '4%'},
    informativeButton: {
      width: '75%',
      justifyContent: 'center',
    },
    tokenButton: {width: '100%'},
    header: {
      height: ScreenSize.height / 4,
      overflow: 'hidden',
      backgroundColor: Colors.Primary,
      borderBottomStartRadius: 310,
      borderBottomEndRadius: 650,
      transform: [{scaleX: 1.275}],
      justifyContent: 'center',
    },
    descriptionContainer: {
      marginLeft: '4%',
      transform: [{scaleX: 0.78}],
    },
    logoContainer: {
      position: 'absolute',
      top: '16%',
      right: '10%',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      overflow: 'hidden',
      transform: [{scaleX: 0.78}],
    },
    body: {
      flex: 1,
      marginHorizontal: '4%',
    },
  });

  return stylesBase;
};

export default UserTemplate;
