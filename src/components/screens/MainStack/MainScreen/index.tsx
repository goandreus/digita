import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {COLORS, Colors} from '@theme/colors';
import UserTemplate from '@templates/UserTemplate';
import TextCustom from '@atoms/TextCustom';
import ExtraTextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import Separator from '@atoms/Separator';
import PopUp from '@atoms/PopUp';
import Button from '@atoms/Button';
import ExtraButton from '@atoms/extra/Button';
import ProductTitle from '@molecules/ProductTitle';
import ProductComponent from '@molecules/ProductComponent';
import ModalIcon from '@molecules/ModalIcon';
import ModalInfo from '@atoms/ModalInfo';
import {MainScreenProps} from '@navigations/types';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {SEPARATOR_BASE, SIZES} from '@theme/metrics';
import {useLastUser, useLoading, useUserInfo} from '@hooks/common';
import {useCreditAdvice} from '@hooks/common/useCreditAdvice';
import MainAdvice from '@molecules/extra/MainAdvice';
import AlertBasic from '@molecules/extra/AlertBasic';
import {logout} from '@services/User';
import {setTerms} from '@features/terms';
import {
  setShowExpiredTokenSession,
  setShowSessionStatus,
} from '@features/loading';
import {useAppSelector} from '@hooks/useAppSelector';
import {setSessionModal} from '@features/modal';
import {useAppDispatch} from '@hooks/useAppDispatch';
import BottonAdviceCredit from '@molecules/extra/BottomAdviceCredit';
import BoxView from '@atoms/BoxView';
import {getRemoteValue, subscribeFirebase} from '@utils/firebase';
import {getUserCredits, getUserSavings} from '@services/User';
import Skeleton from '@molecules/Skeleton';
import {storage} from '@utils/secure-storage';
import {TokenRegister} from '@utils/TokenRegister';
import MainDayToDay from '@molecules/extra/MainDayToDay';
import {Saving} from '@features/userInfo';
import BalanceToggle from '@atoms/extra/BalanceToggle';
import {Information} from '@global/information';

const MainScreen = ({navigation, route}: MainScreenProps) => {
  const {showTokenIsActivated, showPasswordUpdated} = route.params;
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const [showAdvice, setShowAdvice] = useState<boolean>(true);
  const {lastUser} = useLastUser();
  const dispatch = useAppDispatch();
  const showSessionModal = useAppSelector(
    state => state.modal.sessionModal.show,
  );
  const {balanceVisibility} = useAppSelector(state => state.balanceVisibility);

  const {
    user,
    userSavings,
    userCredits,
    userInteroperabilityInfo,
    purgeUserState,
  } = useUserInfo();

  const active_open_sav_entrpnr = getRemoteValue(
    'active_open_sav_entrpnr',
  ).asBoolean();

  const {showWelcomeModal, setDisplayErrorModal, setShowWelcomeModal} =
    useLoading();

  const {creditAdvice} = useCreditAdvice();

  const creditType = creditAdvice.banners.CG
    ? 'CG'
    : creditAdvice.banners.LC
    ? 'LC'
    : creditAdvice.banners.CI
    ? 'CI'
    : null;

  let allSavings = [...(userSavings?.sortAccounts?.savings || [])];

  const affiliatedAccount =
    userSavings?.savings?.savings?.find(
      e =>
        `${e.operationUId}` === userInteroperabilityInfo?.operationUId &&
        (e.productUId === 110 || e.productUId === 410 || e.productUId === 88),
    ) || null;

  const isExclusiveProduct = (e: Saving) => {
    if (
      e.operationUId === parseInt(userInteroperabilityInfo?.operationUId) &&
      (e.productUId === 110 || e.productUId === 410 || e.productUId === 88)
    ) {
      return true;
    } else {
      return false;
    }
  };

  if (allSavings.length > 1) {
    allSavings = [
      ...(userSavings?.sortAccounts?.savings?.filter(e =>
        userInteroperabilityInfo ? !isExclusiveProduct(e) : true,
      ) || []),
    ];
  }

  const hasOnlyOneSaving =
    userSavings?.sortAccounts?.savings &&
    userSavings?.sortAccounts?.savings?.length > 0 &&
    userSavings?.sortAccounts?.savings?.length === 1
      ? false
      : true;
  const hasOnlyOneCredit =
    userCredits?.individualCredits &&
    userCredits?.individualCredits?.length > 0 &&
    userCredits?.individualCredits?.length === 1
      ? false
      : true;
  const hasOnlyOneCreditGroup =
    userCredits?.groupCredits &&
    userCredits?.groupCredits?.length > 0 &&
    userCredits?.groupCredits?.length === 1
      ? false
      : true;

  const hasNotProducts =
    allSavings?.length === 0 &&
    userCredits?.groupCredits?.length === 0 &&
    userCredits?.individualCredits?.length === 0;

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      return () => backHandler.remove();
    }, []),
  );

  const onPressOpenAccount = () => {
    navigation.navigate('OperationsStack', {
      screen: 'OpenSavingsAccount',
    });
  };

  const openLandingPage = () => Linking.openURL(Information.LandingPage);

  const goLogin = () =>
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Home'}, {name: 'Login'}],
      }),
    );

  const closeSession = () => {
    if (lastUser.document !== undefined) {
      logout(
        {
          documentNumber: lastUser.document.number,
          documentType: lastUser.document.type,
        },
        route.name,
      );
      dispatch(setSessionModal({show: false}));
      purgeUserState();
      setTerms(false);
      setShowSessionStatus(false);
      setShowExpiredTokenSession(false);
      timerId.current = setTimeout(() => goLogin(), 500);
    }
  };

  const {setUserSavings, setUserCredits} = useUserInfo();

  const [savingsListLoading, setSavingsListLoading] = useState(true);
  const [creditsListLoading, setCreditsListLoading] = useState(true);

  const getSavingsList = async () => {
    const savingsList = await getUserSavings(
      user?.person.documentTypeId,
      user?.person.documentNumber,
    );
    setUserSavings(savingsList);
    setSavingsListLoading(false);
  };

  const getCreditsList = async () => {
    const creditsList = await getUserCredits(
      user?.person.documentTypeId,
      user?.person.documentNumber,
    );
    setUserCredits(creditsList);
    setCreditsListLoading(false);
  };

  const fcmToken = storage.getString('fcmToken');

  const populateUserDataPost = useCallback(
    async (props: {token: string}): Promise<void> => {
      TokenRegister.updateToken('LOGIN', props.token);

      await Promise.all([userSavings, userCredits]).then(
        async ([savings, credits]) => {
          const compensations = savings?.compensations.savings;
          const originSavings = savings?.savings.savings;
          const investments = savings?.investments.savings;
          const groupCredits = credits?.groupCredits;
          const individualCredits = credits?.individualCredits;
          const hasCG = groupCredits ? groupCredits?.length > 0 : false;
          const hasCI = individualCredits
            ? individualCredits?.length > 0
            : false;
          const hasCompensations = compensations
            ? compensations?.length > 0
            : false;
          const hasInvestments = investments ? investments?.length > 0 : false;
          const hasSavingProducts = originSavings
            ? originSavings?.length > 0
            : false;

          try {
            await subscribeFirebase({
              hasCG,
              hasCI,
              hasCompensations,
              hasInvestments,
              hasSavingProducts,
              registrationToken: [fcmToken || ''],
              token: props.token,
            });
          } catch (error) {
            console.error('Error en subscribeFirebase:', error);
          }
        },
      );
    },
    [fcmToken, userCredits, userSavings],
  );

  useEffect(() => {
    setDisplayErrorModal({
      isOpen: false,
      message: {
        title: '',
        content: '',
      },
      errorCode: '',
    });
  }, [setDisplayErrorModal]);

  // Clear the interval when the component unmounts
  useEffect(() => {
    return () => clearTimeout(timerId.current);
  }, []);

  useEffect(() => {
    populateUserDataPost({token: lastUser.token!});
    getSavingsList();
    getCreditsList();
  }, []);

  return (
    <>
      <ModalIcon
        type="SUCCESS"
        message="Token Digital activado"
        open={showTokenIsActivated}
        onRequestClose={() => {}}
        actions={
          <>
            <Button
              onPress={() => {
                navigation.setParams({
                  showTokenIsActivated: false,
                });
              }}
              orientation="horizontal"
              type="primary"
              text="Aceptar"
            />
          </>
        }
      />
      <UserTemplate
        user={user}
        gender={user?.person?.gender}
        allSavings={allSavings}>
        <View>
          <BoxView mt={16} mb={8} mr={8} align="flex-end">
            <BalanceToggle />
          </BoxView>
          {affiliatedAccount ? (
            <BoxView mt={8} mb={24}>
              <MainDayToDay
                affiliatedAccount={affiliatedAccount}
                balance={
                  balanceVisibility ? affiliatedAccount?.sBalance! : '********'
                }
              />
            </BoxView>
          ) : null}
          {!savingsListLoading ? (
            <>
              {allSavings?.length > 0 ? (
                <View>
                  <ProductTitle
                    title="Mis Ahorros"
                    iconName="pig_cash"
                    showMore={hasOnlyOneSaving}
                    size={24}
                    bree={true}
                    action={() =>
                      navigation.navigate('MySavings', {
                        personUId: user?.person?.personUId,
                      })
                    }
                  />
                  <View
                    style={{
                      marginTop: SEPARATOR_BASE,
                      backgroundColor: Colors.White,
                      borderRadius: 12,
                    }}>
                    {allSavings?.slice(0, 1).map(
                      (
                        saving: {
                          balance: string | number;
                          productType: string;
                          subAccount: string | string[];
                          productName: string;
                          currency: string;
                          operationUId: any;
                          accountCode: any;
                          accountCci: any;
                          contable: any;
                        },
                        index: React.Key | null | undefined,
                      ) => {
                        let title = saving.productType;
                        if (title === 'PF') title = 'Depósito a Plazo Fijo';
                        if (saving.subAccount.includes('CTS')) {
                          title = 'CTS';
                        } else {
                          title = 'Ahorros';
                        }
                        return (
                          <ProductComponent
                            key={index}
                            controlVisibility
                            widthName="50%"
                            productName={saving.productName}
                            text="Saldo disponible"
                            currency={saving.currency}
                            amount={
                              balanceVisibility ? saving.sBalance : '********'
                            }
                            index={index}
                            action={async () => {
                              if (saving.productType !== 'PF') {
                                if (isExclusiveProduct(saving)) {
                                  navigation.navigate(
                                    'EntrepreneurSavingDetail',
                                    {
                                      from: 'MainScreen',
                                      title: 'Ahorros',
                                      accountName: saving.productName,
                                      accountNumber: saving.accountCode,
                                      cci: saving.accountCci,
                                      contable: saving.contable,
                                      currency: saving.currency,
                                      operationId: saving.operationUId,
                                      productType: saving.productType,
                                      sAvailableBalance: saving.sBalance,
                                      balance: saving.balance,
                                    },
                                  );
                                } else {
                                  navigation.navigate('SavingDetail', {
                                    from: 'MainScreen',
                                    title,
                                    accountName: saving.productName,
                                    accountNumber: saving.accountCode,
                                    cci: saving.accountCci,
                                    contable: saving.contable,
                                    currency: saving.currency,
                                    operationId: saving.operationUId,
                                    productType: saving.productType,
                                    sAvailableBalance: saving.sBalance,
                                  });
                                }
                              } else {
                                navigation.navigate('SavingDetail', {
                                  from: 'MainScreen',
                                  title: 'Depósito a Plazo Fijo',
                                  accountName: saving.productName,
                                  accountNumber: saving.accountCode,
                                  cci: saving.accountCci,
                                  contable: saving.contable,
                                  currency: saving.currency,
                                  operationId: saving.operationUId,
                                  productType: saving.productType,
                                });
                              }
                            }}
                          />
                        );
                      },
                    )}
                  </View>
                </View>
              ) : null}
            </>
          ) : (
            <Skeleton timing={600}>
              <View
                style={{
                  alignSelf: 'center',
                  width: '90%',
                  height: 50,
                  borderRadius: 8,
                  backgroundColor: '#E1E1E1',
                }}
              />
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: '#efefef',
                  marginTop: '6%',
                }}
              />
            </Skeleton>
          )}

          {!creditsListLoading ? (
            <>
              {userCredits && userCredits?.individualCredits?.length > 0 ? (
                <View style={{marginTop: 20}}>
                  <ProductTitle
                    title="Mis Créditos Individuales"
                    iconName="people"
                    showMore={hasOnlyOneCredit}
                    bree={true}
                    size={18}
                    marginRight={7}
                    action={() => {
                      navigation.navigate('MyCredits', {
                        personUId: user?.person?.personUId,
                      });
                    }}
                  />
                  <View
                    style={{
                      marginTop: 8,
                      backgroundColor: Colors.White,
                      borderRadius: 12,
                    }}>
                    {userCredits?.individualCredits
                      ?.slice(0, 1)
                      .map((credit, index) => (
                        <ProductComponent
                          key={index}
                          controlVisibility
                          widthName="40%"
                          productName={credit.productName}
                          text="Crédito desembolsado"
                          currency={credit.currency}
                          amount={
                            balanceVisibility
                              ? credit.sDisbursedCapital
                              : '********'
                          }
                          index={index}
                          progress={credit.advancePercentage}
                          backgroundColor={
                            credit.capitalAmount > credit.disbursedCapital
                              ? '#FCCFCF'
                              : Colors.GrayBackground
                          }
                          color={
                            credit.capitalAmount > credit.disbursedCapital
                              ? '#FCCFCF'
                              : Colors.Secondary
                          }
                          action={async () => {
                            navigation.navigate('CreditsDetail', {
                              status: credit.status,
                              productName: credit.productName,
                              advancePercentage: credit.advancePercentage,
                              disbursedCapital: credit.sDisbursedCapital,
                              disbursedCapitalAmount: credit.disbursedCapital,
                              currency: credit.currency,
                              accountNumber: credit.accountCode,
                              capitalCanceled: credit.sCapitalAmount,
                              capitalCanceledAmount: credit.capitalAmount,
                              isPunished: credit.isPunished,
                              type: 'Individual',
                            });
                          }}
                        />
                      ))}
                  </View>
                </View>
              ) : null}
            </>
          ) : (
            <Skeleton timing={600}>
              <View
                style={{
                  alignSelf: 'center',
                  width: '90%',
                  height: 50,
                  borderRadius: 8,
                  backgroundColor: '#E1E1E1',
                }}
              />
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: '#efefef',
                  marginTop: '6%',
                }}
              />
            </Skeleton>
          )}

          {!creditsListLoading ? (
            <>
              {userCredits && userCredits?.groupCredits?.length > 0 ? (
                <View style={{marginTop: 20}}>
                  <ProductTitle
                    title="Mis Créditos Grupales"
                    iconName="peoples-two"
                    showMore={hasOnlyOneCreditGroup}
                    bree={true}
                    size={18}
                    marginRight={7}
                    action={() => {
                      navigation.navigate('MyCreditGroups', {
                        personUId: user?.person?.personUId,
                      });
                    }}
                  />
                  <View
                    style={{
                      marginTop: 8,
                      backgroundColor: Colors.White,
                      borderRadius: 12,
                    }}>
                    {userCredits?.groupCredits
                      ?.slice(0, 1)
                      ?.map((credit, index) => (
                        <ProductComponent
                          key={index}
                          isGroupAccount={true}
                          widthName="40%"
                          productName={credit.productName}
                          text="Crédito desembolsado"
                          currency={credit.currency}
                          amount={
                            balanceVisibility
                              ? credit.sDisbursedCapital
                              : '********'
                          }
                          index={index}
                          backgroundColor={
                            credit.capitalAmount > credit.disbursedCapital
                              ? '#FCCFCF'
                              : Colors.GrayBackground
                          }
                          color={
                            credit.capitalAmount > credit.disbursedCapital
                              ? '#FCCFCF'
                              : Colors.Secondary
                          }
                          progress={credit.advancePercentage}
                          action={() => {
                            navigation.navigate('GroupCreditDetail', {
                              status: credit.status,
                              productName: credit.productName,
                              advancePercentage: credit.advancePercentage,
                              disbursedCapital: credit.sDisbursedCapital,
                              disbursedCapitalAmount: credit.disbursedCapital,
                              currency: credit.currency,
                              accountNumber: credit.accountCode,
                              capitalCanceled: credit.sCapitalAmount,
                              capitalCanceledAmount: credit.capitalAmount,
                              type: 'Grupal',
                            });
                          }}
                        />
                      ))}
                  </View>
                </View>
              ) : null}
            </>
          ) : (
            <Skeleton timing={600}>
              <View
                style={{
                  alignSelf: 'center',
                  width: '90%',
                  height: 50,
                  borderRadius: 8,
                  backgroundColor: '#E1E1E1',
                }}
              />
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: '#efefef',
                  marginTop: '6%',
                }}
              />
            </Skeleton>
          )}

          {hasNotProducts && (
            <BoxView flex={1} align="center" justify="center">
              <TouchableOpacity
                onPress={onPressOpenAccount}
                style={styles.emptyContainer}>
                <Icon name="pig-save" size={60} />
                <BoxView style={styles.columnContainer} flex={1}>
                  <ExtraTextCustom
                    text={'¡Es momento de ahorrar!'}
                    variation="h0"
                    weight="normal"
                    lineHeight="tight"
                    color="primary-medium"
                  />
                  <ExtraTextCustom
                    text={
                      'Abre tu cuenta de ahorros sin ir a la agencia. Es fácil y seguro.'
                    }
                    variation="h5"
                    weight="normal"
                    lineHeight="comfy"
                    color="neutral-darkest"
                  />
                </BoxView>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={openLandingPage}
                style={styles.emptyContainer}>
                <Icon name="man-products" size={70} />
                <BoxView style={styles.columnContainer} flex={1}>
                  <ExtraTextCustom
                    text={'¡Haz crecer tu negocio!'}
                    variation="h0"
                    weight="normal"
                    lineHeight="tight"
                    color="primary-medium"
                  />
                  <ExtraTextCustom
                    variation="h5"
                    weight="normal"
                    lineHeight="comfy"
                    color="neutral-darkest">
                    <ExtraTextCustom
                      text={'Solicita '}
                      variation="h5"
                      weight="bold"
                      lineHeight="comfy"
                      color="neutral-darkest"
                    />
                    hoy tu crédito y accede a grandes beneficios.
                  </ExtraTextCustom>
                </BoxView>
              </TouchableOpacity>
            </BoxView>
          )}

          <Separator type="small" />
        </View>
      </UserTemplate>

      {creditType && showAdvice ? (
        <BottonAdviceCredit
          type={creditType}
          onClose={() => setShowAdvice(false)}
          amount={creditAdvice.amount}
        />
      ) : (
        <MainAdvice />
      )}

      <ModalInfo
        title="¡Clave digital actualizada!"
        message="Usa tu clave digital cada vez que inicies sesión en tu App de Compartamos Financiera"
        open={showPasswordUpdated}
        showCloseButton={true}
        onRequestClose={() => {}}
        onCloseButton={() => {
          navigation.setParams({
            showPasswordUpdated: false,
          });
        }}
        actions={
          <>
            <Button
              onPress={() => {
                navigation.setParams({
                  showPasswordUpdated: false,
                });
              }}
              orientation="horizontal"
              type="primary"
              text="Aceptar"
            />
          </>
        }
      />
      <PopUp
        open={showWelcomeModal && !!user}
        onRequestClose={() => setShowWelcomeModal(false)}
        closeIcon>
        <Icon name="party-hat" fill="#fff" size="extra-large" />
        <Separator type="medium" />
        <TextCustom
          weight="bold"
          variation="p"
          text="¡Te damos la bienvenida!"
          color={Colors.TBlack50}
        />
        <Separator type="x-small" />
        <TextCustom
          weight="normal"
          variation="p"
          text="Esta es la nueva aplicación de Compartamos Financiera, podrás consultar tus cuentas de ahorro, realizar transferencias y obtener información sobre tus créditos. Porque pensamos en ti, pronto encontrarás más novedades."
          align="center"
        />
        <Separator type="medium" />
        <Button
          text="Empecemos"
          type="primary"
          orientation="horizontal"
          onPress={() => setShowWelcomeModal(false)}
          containerStyle={{
            width: '75%',
            justifyContent: 'center',
          }}
        />
      </PopUp>

      <AlertBasic
        statusBarTranslucent
        isOpen={showSessionModal}
        onClose={() => {}}
        title="¡Debemos cerrar tu sesión!"
        body={
          <ExtraTextCustom
            color="neutral-darkest"
            lineHeight="comfy"
            variation="p4"
            weight="normal"
            text="Te recomendamos te comuniques a la brevedad con tu asesor."
            align="center"
          />
        }
        actions={() => [
          {
            id: 'button1',
            render: (
              <ExtraButton
                text="Entendido"
                type="primary"
                onPress={closeSession}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  emptyContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.Background.Lightest,
    width: '100%',
    borderRadius: SIZES.XS,
    paddingVertical: SIZES.XL,
    paddingHorizontal: SIZES.LG,
    marginBottom: SIZES.LG,
  },
  columnContainer: {
    marginLeft: SIZES.LG,
  },
  logo: {
    width: 82,
    height: 143,
    transform: [{scaleX: -1}],
  },
});
