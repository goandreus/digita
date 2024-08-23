import React, {useCallback} from 'react';
import {BackHandler, StatusBar} from 'react-native';
import {Colors} from '@theme/colors';
import Separator from '@atoms/Separator';
import PopUp from '@atoms/PopUp';
import TextCustom from '@atoms/TextCustom';
import Button from '@atoms/Button';
import TransfersTemplate from '@templates/TransfersTemplate';
import {useValidToOperation} from '@hooks/useValidToOperation';
import {TransfersScreenProps} from '@navigations/types';
import {useLoading} from '@hooks/common';
import {useFocusEffect} from '@react-navigation/native';

const TransferScreen = ({navigation, route}: TransfersScreenProps) => {
  const {
    showModal,
    showModalToken,
    showRefillModal,
    closeModal,
    closeRefillModal,
    closeModalToken,
    onActivateToken,
    onPressOwnAccounts,
    handleSameBank,
    handleOthersBank,
  } = useValidToOperation();

  const {targetScreen} = useLoading();

  const handleBack = () => navigation.navigate(targetScreen[route.name]);

  const handleBackPress = useCallback(() => {
    handleBack();
    return true;
  }, [handleBack]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => handleBackPress(),
      );

      return () => backHandler.remove();
    }, []),
  );
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
        translucent={true}
      />
      <TransfersTemplate
        showMenu="transfers"
        title="Transferencias"
        onPressOwnAccounts={onPressOwnAccounts}
        onPressSameBank={handleSameBank}
        onPressOtherBanks={handleOthersBank}
        goBack={() => navigation.navigate(targetScreen[route.name])}>
        {/* <ProductTitle title="Favoritos" iconName="star" bree />
        <Separator type="small" />
        <ScrollView style={{marginLeft: -18}} alwaysBounceVertical={false}>
          <FavoriteItem title="Compartamos Elizabeth" />
          <FavoriteItem title="Compartamos Juán" />
          <FavoriteItem title="Compartamos María" />
          <FavoriteItem title="Mariel BCP" />
        </ScrollView> */}

        <PopUp open={showModal}>
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
            text={`Para realizar una transferencia, tu cuenta de origen debe estar habilitada para realizar transferencias y debes contar con saldo suficiente.\nRevisa las condiciones de tus cuentas en nuestra página web o consulta nuestra central telefónica (01) 313 5000.`}
            color={Colors.Paragraph}
            align="center"
          />
          <Separator type="medium" />
          <Button
            text="Entiendo"
            type="primary"
            orientation="horizontal"
            onPress={closeModal}
            containerStyle={{
              width: '75%',
              justifyContent: 'center',
            }}
          />
        </PopUp>
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
            text={`Para realizar una transferencia, tu cuenta de origen debe estar habilitada para realizar transferencias y debes contar con saldo suficiente.\nRevisa las condiciones de tus cuentas en nuestra página web o consulta nuestra central telefónica (01) 313 5000.`}
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

export default TransferScreen;
