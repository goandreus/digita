/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import BasicMenuTemplate from '@templates/extra/BasicMenuTemplate';
import OptionsMenu from '@molecules/extra/OptionsMenu';
import {TransferOption} from '@utils/getOptionsMenu';
import {useValidToTransfer} from '@hooks/useValidToOperation';
import {useFocusEffect} from '@react-navigation/native';
import {useLoading, useModals} from '@hooks/common';
import {TransfersScreenProps} from '@navigations/types';
// ------------------
import TextCustom from '@atoms/TextCustom';
import NTextCustom from '@atoms/extra/TextCustom';
import {COLORS, Colors} from '@theme/colors';
import Separator from '@atoms/Separator';
import Button from '@atoms/Button';
import PopUp from '@atoms/PopUp';
import Icon from '@atoms/Icon';
import BoxView from '@atoms/BoxView';
import {useUserInfo} from '@hooks/common';
import {canTransactInteroperability} from '@utils/canTransactInteroperability';
import {InteropEntrepreneurErrorModal} from '@molecules/extra/EntrepreneurErrorModal';
import {
  IInteroperabilityInfo,
  getInteroperabilityInfo,
} from '@services/Interoperability';
import {getRemoteValue} from '@utils/firebase';
import AlertBasic from '@molecules/extra/AlertBasic';
import NButton from '@atoms/extra/Button';
import { SIZES } from '@theme/metrics';

export const Transfers = ({navigation, route}: TransfersScreenProps) => {
  const {targetScreen} = useLoading();
  const {informativeModal, tokenModal, setInformativeModal, setTokenModal} =
    useModals();
  const {handleOwnAccounts, handleOthersAccounts} = useValidToTransfer();
  const {
    user,
    userInteroperabilityInfo,
    userSavings,
    userEntrepreneurAccount,
    setUserEntrepreneurAccount,
    setUserInteroperabilityInfo,
  } = useUserInfo();
  const isInteropAffiliate = userInteroperabilityInfo ? true : false;
  const person = user?.person;
  const [showEntrepreneurErrorModal, setShowEntrepreneurErrorModal] =
    useState<boolean>(false);
  const active_open_sav_entrpnr = getRemoteValue(
    'active_open_sav_entrpnr',
  ).asBoolean();
  const [showAccountAlert, setShowAccountAlert] = useState<boolean>(false);

  const onActivateToken = async () => {
    setTokenModal({show: false});
    await new Promise(res => setTimeout(res, 500));
    navigation.navigate('InfoActivateToken', {
      redirectTo: 'HOME',
    });
  };

  const showMainAlert = () => {
    setShowAccountAlert(true);
  };

  // eslint-disable-next-line no-spaced-func
  const actions = new Map<TransferOption, () => void>([
    [
      'own',
      [
        ...(userSavings?.savings?.savings || []),
        ...(userSavings?.compensations?.savings || []),
      ].length === 1
        ? showMainAlert
        : handleOwnAccounts,
    ],
    ['others', handleOthersAccounts],
  ]);

  const handleBackPress = useCallback(() => {
    navigation.navigate(targetScreen[route.name]);
    return true;
  }, [navigation, route.name, targetScreen]);

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
    const accs = canTransactInteroperability([
      ...(userSavings?.savings.savings ?? []),
    ]);

    if (accs?.canTransactInSoles.length === 0) {
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

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => handleBackPress(),
      );

      return () => backHandler.remove();
    }, [handleBackPress]),
  );

  const styles = getStyles();

  return (
    <>
      <BasicMenuTemplate
        headerTitle="Transferir dinero"
        canGoBack={navigation.canGoBack()}
        goBack={handleBackPress}>
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
                    '¡Olvídate del número de cuenta!\nCobra y paga con tu celular'
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
          optionType="Transfers"
          actions={actions}
        />
      </BasicMenuTemplate>

      {/* Modals Section */}

      <PopUp open={informativeModal.show}>
        <TextCustom
          weight="normal"
          variation="h2"
          text={informativeModal.data.title}
          color={Colors.Paragraph}
          size={20}
        />
        <Separator type="small" />
        <TextCustom
          weight="normal"
          variation="p"
          text={informativeModal.data.content}
          color={Colors.Paragraph}
          align="center"
        />
        <Separator type="medium" />
        <Button
          text="Entiendo"
          type="primary"
          orientation="horizontal"
          onPress={() => setInformativeModal({show: false})}
        />
      </PopUp>

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

      {showEntrepreneurErrorModal ? (
        <InteropEntrepreneurErrorModal
          showEntrepreneurErrorModal={showEntrepreneurErrorModal}
          closeEntrepreneurErrorModal={() => {
            setShowEntrepreneurErrorModal(false);
          }}
        />
      ) : null}

      <AlertBasic
        isOpen={showAccountAlert}
        title={'¡Uy, solo tienes una cuenta\nde ahorros con nosotros!'}
        body={
          <>
            <TextCustom
              style={{lineHeight: 24}}
              color={COLORS.Neutral.Darkest}
              variation="p"
              size={16}
              weight="normal"
              align="center">
              Para usar esta opción, debes ser titular de{'\n'}al menos 02
              cuentas de ahorros en{'\n'}Compartamos Financiera.
            </TextCustom>
            <Separator size={SIZES.MD} />
            <TextCustom
              style={{lineHeight: 24}}
              color={COLORS.Neutral.Darkest}
              variation="p"
              size={16}
              weight="normal"
              text="¿Necesitas abrir una nueva cuenta?"
              align="center"
            />
          </>
        }
        actions={() => [
          {
            id: 'button1',
            render: (
              <Button
                orientation="vertical"
                text="Abrir una cuenta de ahorros"
                type="primary"
                onPress={() => {
                  setShowAccountAlert(false);
                  navigation.navigate('OperationsStack', {
                    screen: 'OpenSavingsAccount',
                  });
                }}
              />
            ),
          },
          {
            id: 'button2',
            render: (
              <NButton
                orientation="vertical"
                text="Entendido"
                type="primary-inverted"
                haveBorder
                onPress={() => setShowAccountAlert(false)}
              />
            ),
          },
        ]}
        onClose={() => {}}
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
