import React, {useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import Button from '@atoms/Button';
import Icon, {SvgIconName} from '@atoms/Icon';
import ModalInfo from '@atoms/ModalInfo';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {
  useLastUser,
  useTerms,
  useToken,
  useUserInfo,
  useLoading,
  useCreditAdvice,
} from '@hooks/common';
import {MoreMenuScreenProps} from '@navigations/types';
import {COLORS, Colors} from '@theme/colors';
import SvgCheck from '@assets/icons/SvgCheck';
import {storeOTP} from '@hooks/useStoreOTP';
import {logout} from '@services/User';
import {CommonActions} from '@react-navigation/native';
import {getRemoteValue} from '@utils/firebase';
import {setSessionModal} from '@features/modal';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {canDisburse} from '@utils/canDisburse';
import BasicMenuTemplate from '@templates/extra/BasicMenuTemplate';

const MoreMenu = ({navigation, route}: MoreMenuScreenProps) => {
  const hasFavorites = getRemoteValue('active_favs').asBoolean();

  const styles = getStyles();

  const {lastUser} = useLastUser();
  const dispatch = useAppDispatch();
  const {setShowExpiredTokenSession, setShowSessionStatus} = useLoading();
  const {setTerms} = useTerms();
  const {setBackButton} = useToken();
  const {purgeCreditAdviceState} = useCreditAdvice();
  const {userSavings, userInteroperabilityInfo, purgeUserState} = useUserInfo();

  const [showActivateTokenModal, setShowActivateTokenModal] =
    useState<boolean>(false);

  const [showTokenActivatedModal, hideTokenActivatedModal] = [
    route.params.showTokenActivatedModal === true,
    () =>
      navigation.setParams({
        showTokenActivatedModal: false,
      }),
  ];

  const token = storeOTP.getOtpState().currentToken;

  const savings = useMemo(() => {
    return canDisburse([
      ...(userSavings?.savings.savings ?? []),
      ...(userSavings?.compensations.savings ?? []),
    ]);
  }, [userSavings?.compensations.savings, userSavings?.savings.savings]);

  return (
    <>
      <BasicMenuTemplate
        headerTitle="Más"
        canGoBack={navigation.canGoBack()}
        goBack={() => navigation.goBack()}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {(lastUser.hasActiveToken === false ||
              lastUser.tokenIsInCurrentDevice === false ||
              !token) && (
              <Option
                iconName="icon_token"
                title="Activar Token Digital"
                onPress={() => {
                  setBackButton(true);
                  navigation.navigate('InfoActivateToken');
                }}
              />
            )}
            <Option
              iconName="icon_littePig"
              title="Abrir Cuenta de Ahorros"
              onPress={() => {
                navigation.navigate('OperationsStack', {
                  screen: 'OpenSavingsAccount',
                });
              }}
            />
            <Option
              iconName="icon_lock"
              title="Cambiar clave"
              onPress={() => {
                if (
                  lastUser.hasActiveToken === false ||
                  lastUser.tokenIsInCurrentDevice === false ||
                  !token
                ) {
                  setShowActivateTokenModal(true);
                } else {
                  navigation.navigate('UpdatePassword');
                }
              }}
            />
            {userInteroperabilityInfo ? (
              <Option
                iconName="icon_gear"
                title="Configurar pagar a un celular"
                onPress={() => {
                  if (!token) {
                    navigation.navigate('InfoActivateToken');
                  } else {
                    navigation.navigate('OperationsStack', {
                      screen: 'AffiliatePhone',
                      params: {
                        showTokenIsActivated: false,
                        operationType: 'updateAffiliation',
                        from: 'moreScreen',
                      },
                    });
                  }
                }}
              />
            ) : null}
            <Option
              iconName="icon_gear"
              title="Configurar operaciones favoritas"
              onPress={() => navigation.navigate('FavoriteOperations')}
            />
            {savings?.canDisburse ? (
              <Option
                iconName="icon_cancellation"
                title="Anulación de cuenta de ahorros"
                onPress={() => {
                  navigation.navigate('OperationsStack', {
                    screen: 'Cancellation',
                  });
                }}
              />
            ) : null}
            <Option
              iconName="icon_logout"
              title="Cerrar sesión"
              onPress={() => {
                if (lastUser.document !== undefined) {
                  logout(
                    {
                      documentNumber: lastUser.document.number,
                      documentType: lastUser.document.type,
                    },
                    route.name,
                  );
                  purgeUserState();
                  purgeCreditAdviceState();
                  setTerms(false);
                  setShowSessionStatus(false);
                  setShowExpiredTokenSession(false);
                  dispatch(setSessionModal({show: false}));
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [{name: 'Home'}, {name: 'Login'}],
                    }),
                  );
                }
              }}
            />
            {hasFavorites && (
              <Option
                iconName="icon_star"
                title="Mis Favoritos"
                onPress={() => navigation.navigate('MyFavorites')}
              />
            )}
          </View>
        </ScrollView>
      </BasicMenuTemplate>

      <ModalInfo
        title="¡Activa tu Token Digital!"
        message="Si deseas cambiar tu clave digital, debes tener activo tu Token Digital en este teléfono celular."
        open={showActivateTokenModal}
        onRequestClose={() => {}}
        showCloseButton={true}
        onCloseButton={() => setShowActivateTokenModal(false)}
        actions={
          <>
            <Button
              onPress={() => {
                setShowActivateTokenModal(false);
                setBackButton(true);
                navigation.navigate('InfoActivateToken', {
                  redirectTo: 'MORE',
                });
              }}
              orientation="horizontal"
              type="primary"
              text="Activar Token Digital"
            />
            <Separator size={8 * 4} />
            <TextCustom
              variation="link"
              align="center"
              style={styles.buttonLink}
              color={Colors.Paragraph}
              onPress={() => setShowActivateTokenModal(false)}>
              Cancelar
            </TextCustom>
          </>
        }
      />
      <ModalInfo
        titleImage={
          <SvgCheck width="100%" height={64} color={Colors.Primary} />
        }
        title="¡Tu token está activado!"
        message="Ya puedes realizar tu operaciones desde la app cuando tu quieras."
        open={showTokenActivatedModal}
        onRequestClose={() => {}}
        showCloseButton={true}
        onCloseButton={() => hideTokenActivatedModal()}
        actions={
          <>
            <Button
              onPress={() => hideTokenActivatedModal()}
              orientation="horizontal"
              type="primary"
              text="Entendido"
            />
          </>
        }
      />
    </>
  );
};

const Option = ({
  title,
  iconName,
  onPress,
}: {
  title: string;
  iconName: SvgIconName;
  onPress: () => void;
}) => {
  const styles = getOptionStyles();

  return (
    <Pressable onPress={onPress} style={styles.pressableContainer}>
      <View style={styles.optionWrapper}>
        <Icon
          iconName={iconName}
          size={20}
          color={Colors.Primary}
          style={styles.icon}
        />
        <TextCustom
          style={styles.optionDescription}
          variation="h2"
          size={16}
          color={COLORS.Neutral.Darkest}
          weight="normal">
          {title}
        </TextCustom>
        <Icon
          iconName="icon_arrows_right_thin"
          size={16}
          color={Colors.GrayDark}
          style={styles.iconRight}
        />
      </View>
    </Pressable>
  );
};

const getStyles = () => {
  return StyleSheet.create({
    container: {},
    buttonLink: {
      alignSelf: 'center',
    },
  });
};

const getOptionStyles = () => {
  return StyleSheet.create({
    pressableContainer: {
      paddingVertical: 16,
      borderBottomColor: Colors.GrayBackground,
      borderBottomWidth: 1,
    },
    optionWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionDescription: {
      width: '90%',
    },
    icon: {
      marginRight: 16,
    },
    iconRight: {
      marginLeft: 'auto',
    },
  });
};

export default MoreMenu;
