import React from 'react';
import {StatusBar} from 'react-native';
import {Colors} from '@theme/colors';
import Separator from '@atoms/Separator';
import PopUp from '@atoms/PopUp';
import TextCustom from '@atoms/TextCustom';
import Button from '@atoms/Button';
import TransfersTemplate from '@templates/TransfersTemplate';
import {useValidToOperation} from '@hooks/useValidToOperation';
import {useLoading, useUserInfo} from '@hooks/common';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {
  setShowCreditPunishedModal,
  setShowNeedSavingModal,
} from '@features/appConfig';
import useSavings from '@hooks/useSavings';
import {StackActions} from '@react-navigation/native';

const OperationsScreen = ({navigation}) => {
  const {
    showModal,
    showModalToken,
    showRefillModal,
    closeModal,
    closeRefillModal,
    closeModalToken,
    onActivateToken,
    handleRefillBim,
  } = useValidToOperation();

  const mainStackNavigator = navigation.getParent('MainStackNavigator' as any);

  const dispatch = useAppDispatch();

  const {setTargetScreen} = useLoading();

  const {userCredits} = useUserInfo();

  const {hasAccountForTransact} = useSavings();

  const onPressTransfers = () => {
    setTargetScreen({screen: 'Transfers', from: 'Operations'});
    navigation.navigate('Transfers', {from: 'Operations'});
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
        } else dispatch(setShowCreditPunishedModal(true));
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

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />
      <TransfersTemplate
        showMenu="operations"
        title="Operaciones"
        onPressTransfers={onPressTransfers}
        onPressRefillBim={handleRefillBim}
        onPressPayCredits={onPressPayCredits}
        goBack={() => navigation.navigate('MainScreen')}>
        <PopUp open={showRefillModal}>
          <TextCustom
            weight="normal"
            variation="h2"
            text="¡Recuerda!"
            color={Colors.Paragraph}
            size={20}
          />
          <Separator type="small" />
          <TextCustom
            weight="normal"
            variation="p"
            text={
              'Para realizar una transferencia, tu cuenta de origen debe estar habilitada para realizar transferencias y debes contar con saldo suficiente.\nRevisa las condiciones de tus cuentas en nuestra página web o consulta nuestra central telefónica (01) 313 5000.'
            }
            color={Colors.Paragraph}
            align="center"
          />
          <Separator type="medium" />
          <Button
            text="Entiendo"
            type="primary"
            orientation="horizontal"
            onPress={closeRefillModal}
            containerStyle={{
              width: '75%',
              justifyContent: 'center',
            }}
          />
        </PopUp>
        <PopUp animationOutTiming={1} open={showModalToken}>
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
            onPress={closeModalToken}
          />
        </PopUp>
      </TransfersTemplate>
    </>
  );
};

export default OperationsScreen;
