import React, {useState} from 'react';
import {
  ImageBackground,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import BasicMenuTemplate from '@templates/extra/BasicMenuTemplate';
import OptionsMenu from '@molecules/extra/OptionsMenu';
import {OperationOption} from '@utils/getOptionsMenu';
import {useLastUser, useLoading, useModals, useUserInfo} from '@hooks/common';
import {useValidToRefillBim} from '@hooks/useValidToOperation';
// ------------------
import TextCustom from '@atoms/TextCustom';
import NTextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/Separator';
import Button from '@atoms/Button';
import PopUp from '@atoms/PopUp';

import useSavings from '@hooks/useSavings';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {
  setShowCreditPunishedModal,
  setShowNeedSavingModal,
} from '@features/appConfig';
import {StackActions, useRoute} from '@react-navigation/native';
import {hasContactsAccessPermissions} from '@utils/permissions';
import {interopSchedule} from '@utils/interopSchedule';
import {InteropScheduleModal} from '@molecules/extra/InteropScheduleModal';
import {canTransactInteroperability} from '@utils/canTransactInteroperability';
import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';
import {
  IInteroperabilityInfo,
  getInteroperabilityInfo,
} from '@services/Interoperability';
import {InteropEntrepreneurErrorModal} from '@molecules/extra/EntrepreneurErrorModal';
import {
  IOpeningAccountsErrorModal,
  OpeningAccountsErrorModal,
} from '@molecules/extra/OpeningAccountsErrorModal';

export const InitialMenuOperations = ({navigation}: any) => {
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const {setTargetScreen} = useLoading();
  const {lastUser} = useLastUser();
  const {
    user,
    userSavings,
    userInteroperabilityInfo,
    userEntrepreneurAccount,
    setUserInteroperabilityInfo,
    setUserEntrepreneurAccount,
  } = useUserInfo();
  const {tokenModal, setTokenModal} = useModals();
  const {handleRefillBim} = useValidToRefillBim();
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

  const mainStackNavigator = navigation.getParent('MainStackNavigator' as any);
  const {hasAccountForTransact} = useSavings();
  const {userCredits} = useUserInfo();
  const dispatch = useAppDispatch();

  const isInteropAffiliate = userInteroperabilityInfo ? true : false;
  const hasEnabledAccountsToInteroperate =
    canTransactInteroperability([...(userSavings?.savings.savings ?? [])])
      ?.canTransactInSoles.length === 0;
  const affiliatedAccount = (userSavings?.savings.savings ?? []).find(
    e => `${e.operationUId}` === userInteroperabilityInfo?.operationUId,
  );
  const token = lastUser.secret;

  const onActivateToken = async () => {
    setTokenModal({show: false});
    await new Promise(res => setTimeout(res, 500));
    navigation.navigate('InfoActivateToken');
  };

  const onPressTransfers = () => {
    setTargetScreen({screen: 'Transfers', from: 'Operations'});
    navigation.navigate('MainOperations', {
      screen: 'Transfers',
      params: {from: 'Operations'},
    });
  };

  const onPressPayCredits = () => {
    const hasOneIndividual = userCredits?.individualCredits.length === 1;

    if (!hasAccountForTransact()) {
      dispatch(setShowNeedSavingModal(true));
    } else {
      if (hasOneIndividual) {
        const credit = userCredits.individualCredits[0];
        if (credit.isPunished === false) {
          setTargetScreen({
            screen: 'CreditPayments',
            from: 'OperationsScreen' as any,
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
          from: 'OperationsScreen' as any,
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
          setShowScheduleModal(true);
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

  const handleLink = async () => {
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
  };

  // eslint-disable-next-line no-spaced-func
  const actions = new Map<OperationOption, () => void>([
    ['bim', handleRefillBim],
    ['transfers', onPressTransfers],
    ['credits', onPressPayCredits],
    ['interoperability', onPressInteroperability],
  ]);

  const styles = getStyles();

  return (
    <>
      <BasicMenuTemplate
        headerTitle="Operaciones"
        canGoBack={navigation.canGoBack()}
        goBack={() => navigation.navigate('MainScreen')}>
        {/* Operations Menu */}

        {!isInteropAffiliate ? (
          <ImageBackground
            source={require('@assets/images//InteropBackground.png')}
            style={styles.bannerContainer}
            imageStyle={styles.bannerImage}>
            <View style={styles.bannerBox}>
              <Icon name="icon_payWithPhone_v2" size={90} />
              <BoxView ml={16} style={styles.bannerTextBox}>
                <NTextCustom
                  weight="bold"
                  text={
                    'Cobra y paga a otras entidades\nfinancieras con tu número celular'
                  }
                  variation="h5"
                  color="primary-medium"
                  lineHeight="comfy"
                />
                <Separator size={4} />
                <View style={styles.texts}>
                  <NTextCustom
                    variation="h5"
                    color="primary-darkest"
                    text="Afilia tu cuenta. "
                  />
                  <TouchableOpacity onPress={handleLink}>
                    <NTextCustom
                      variation="h5"
                      color="primary-medium"
                      text="Ingresa aquí"
                      decoration="underline"
                    />
                  </TouchableOpacity>
                </View>
              </BoxView>
            </View>
          </ImageBackground>
        ) : null}

        <OptionsMenu
          showElementsAs="list"
          optionType="Operations"
          actions={actions}
        />
      </BasicMenuTemplate>

      {/* Modals Section */}

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
          // eslint-disable-next-line react-native/no-inline-styles
          containerStyle={{width: '100%'}}
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

      <InteropScheduleModal
        showScheduleModal={showScheduleModal}
        closeScheduleModal={() => {
          setShowScheduleModal(false);
        }}
      />

      <OpeningAccountsErrorModal
        isOpen={showOpeningAccountsErrorModal.isOpen}
        title={showOpeningAccountsErrorModal.title}
        description={showOpeningAccountsErrorModal.description}
        button1={showOpeningAccountsErrorModal.button1}
        button2={showOpeningAccountsErrorModal.button2}
      />

      <InteropEntrepreneurErrorModal
        showEntrepreneurErrorModal={showEntrepreneurErrorModal}
        closeEntrepreneurErrorModal={() => {
          setShowEntrepreneurErrorModal(false);
        }}
      />
    </>
  );
};

const transferMenuItemWidth = Dimensions.get('screen').width - 36;

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    bannerContainer: {
      width: transferMenuItemWidth,
      marginTop: 8,
      marginBottom: 24,
      padding: 8,
      alignSelf: 'center',
    },
    bannerImage: {
      resizeMode: 'cover',
      borderTopLeftRadius: 8,
      borderRadius: 12,
    },
    bannerBox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
      justifyContent: 'center',
    },
    bannerTextBox: {
      width: '65%',
      marginLeft: 18,
    },
    texts: {
      flexDirection: 'row',
    },
  });

  return stylesBase;
};

