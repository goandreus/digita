import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  BackHandler,
  Keyboard,
  Linking,
  Pressable,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import TransfersTemplate from '@templates/TransfersTemplate';

import Button from '@atoms/Button';
import ModalInfo from '@atoms/ModalInfo';
import TextCustom from '@atoms/TextCustom';
import {Information} from '@global/information';
import CheckboxLabel from '@molecules/CheckboxLabel';
import {OtherBanksScreenProps} from '@navigations/types';
import {Colors} from '@theme/colors';
import {FontSizes} from '@theme/fonts';
import useForm from '@hooks/useForm';
import DropDownAccount from '@atoms/DropDownAccount';
import {useFocusEffect} from '@react-navigation/native';
import useToggle from '@hooks/useToggle';
import {EventRegister} from '@utils/EventRegister';
import Separator from '@atoms/Separator';
import PopUp from '@atoms/PopUp';
import {getMainScreenByName} from '@utils/getMainScreenByName';
import ModalInfoOtherBanks from '@molecules/ModalInfoOtherBanks';
import { getOwner, OwnerDetail } from '@services/Accounts';
import ModalError from '@molecules/ModalError';
import { SEPARATOR_BASE } from '@theme/metrics';
import {useTerms, useUserInfo} from '@hooks/common';

type From =
  | 'MainScreen'
  | 'Transfers'
  | 'ConfirmationOtherBanks'
  | 'TermsAndConditions';

interface errorMessage {
  isOpen: boolean
  errorCode: string
  message: {
    title: string
    content: string
  }
}

const OtherBanks = ({route, navigation}: OtherBanksScreenProps) => {
  const from = route.params.from as From;
  const goBackPath = useRef<From | null>(null);
  const infoModal = useToggle();
  const closeAlert = useToggle();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<errorMessage>({
    isOpen: false,
    errorCode: '',
    message: {
      content: '',
      title: '',
    }
  })

  const {user, userSavings} = useUserInfo();
  const person = user?.person;
  const {terms, setTerms} = useTerms();

  const originSavings = useMemo(
    () =>
      [
        ...(userSavings?.savings.savings ?? []),
        ...(userSavings?.compensations.savings ?? []),
      ]
        .filter(e => e.canTransact && e.balance > 0)
        .map(e => ({
          ...e,
          title: e.productName,
          subtitle: e.accountCode,
          value: `${e.currency} ${e.sBalance}`,
        })),
    [userSavings?.savings.savings, userSavings?.compensations.savings],
  );

  const {values, clear, ...form} = useForm({
    initialValues: {
      operationUId: originSavings[0]?.operationUId,
    },
  });

  const accountCode = useMemo(() => {
    return originSavings
      .filter(item => item.operationUId === values.operationUId)
      .map(item => item.accountCode)[0];
  }, [values.operationUId]);

  const productName = useMemo(() => {
    return originSavings
      .filter(item => item.operationUId === values.operationUId)
      .map(item => item.productName)[0];
  }, [values.operationUId]);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await getOwner({
      accountCode,
      documentType: person?.documentTypeId,
      documentNumber: person?.documentNumber,
      screen: route.name
    })

    setLoading(false);

    if (res?.isWarning && !res?.isSuccess) {
      if (res.errorCode === '494') {
        setErrorModal({
          isOpen: true,
          message: {
            content: res.data.message,
            title: res.data.title,
          },
          errorCode: res.errorCode,
        });
        return;
      }
      setErrorModal({
        isOpen: true,
        message: res.data.message,
        errorCode: res.errorCode,
      })
      return
    }

    const owner = res.data

    navigation.navigate('DestinationOtherBanks', {
      operationUId: values.operationUId,
      accountCode,
      productName,
      owner,
      from,
    });
  };

  const onPressCloseModal = () => {
    setErrorModal({
      isOpen: false,
      errorCode: '',
      message: {
        content: '',
        title: '',
      },
    });
    clear();
  };

  useFocusEffect(
    useCallback(() => {
      if (from === 'MainScreen' || from === 'Transfers') {
        clear();
        infoModal.onOpen();
        goBackPath.current = from;
      }
    }, [from, clear]),
  );

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          setTerms(false);
          navigation.navigate(goBackPath.current);
          return true;
        },
      );

      return () => backHandler.remove();
    }, [navigation, closeAlert.onOpen, terms]),
  );

  useFocusEffect(
    useCallback(() => {
      const id = EventRegister.on('tabPress', () => {
        setTerms(false);
        goBackPath.current = 'MainScreen';
      });

      return () => {
        EventRegister.rm(id!);
      };
    }, [terms, closeAlert.onOpen]),
  );


  return (
    <>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <TransfersTemplate
            title="A Otros Bancos"
            titleSize={24}
            goBack={() => {
              setTerms(false);
              navigation.navigate(getMainScreenByName(goBackPath.current));
            }}>
            <TextCustom
              style={{marginTop: SEPARATOR_BASE * 3, marginBottom: SEPARATOR_BASE * 2}}
              text="Cuenta Origen"
              variation="p"
              weight="bold"
              size={18}
            />
            <DropDownAccount
              data={originSavings}
              operationUId={values.operationUId}
              onSelect={value => form.setField('operationUId', value)}
            />
          </TransfersTemplate>

          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              bottom: SEPARATOR_BASE * 3,
              width: '80%',
            }}>
            <CheckboxLabel
              value={terms}
              checkboxSize="small"
              style={{marginBottom: SEPARATOR_BASE}}
              pressWithLabel={false}
              onChange={value => setTerms(value)}
              textComponent={
                <TextCustom variation="small" weight="bold">
                  Acepto los{' '}
                  <TextCustom
                    size={FontSizes.Small}
                    variation="link"
                    onPress={() => {
                      navigation.navigate('TermsAndConditions', {from});
                    }}>
                    términos y condiciones
                  </TextCustom>{' '}
                  de uso.
                </TextCustom>
              }
            />

            <Button
              text="Continuar"
              textSize={18}
              type="primary"
              orientation="vertical"
              loading={loading}
              onPress={handleSubmit}
              disabled={loading || !terms}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <ModalInfo
        open={!!error}
        message={'Tenemos problemas para conectarnos a Compartamos Financiera'}
        onRequestClose={() => setError(null)}
        actions={
          <>
            <Pressable
              style={{padding: 12, marginLeft: 'auto'}}
              onPress={() => setError(null)}>
              <TextCustom text="Aceptar" variation="p" weight="bold" />
            </Pressable>
          </>
        }
      />

      <ModalInfoOtherBanks
        open={infoModal.isOpen}
        onClose={infoModal.onClose}
      />

      <PopUp open={closeAlert.isOpen}>
        <TextCustom
          align="center"
          color="#665F59"
          variation="h0"
          weight="normal"
          size={18}
          text="¿Seguro que quieres cerrar la operación?"
        />
        <Separator type="small" />
        <TextCustom
          align="center"
          color="#83786F"
          variation="p"
          text="Si cierras la operación, toda la información será eliminada"
        />
        <Separator size={24} />
        <Button
          containerStyle={{width: '100%'}}
          type="primary"
          text="Sí, cerrar"
          onPress={async () => {
            closeAlert.onClose();

            await new Promise(res => setTimeout(res, 500));
            setTerms(false);
            navigation.navigate(getMainScreenByName(goBackPath.current));

            clear();
          }}
          orientation="horizontal"
        />
        <Separator type="small" />
        <TextCustom
          size={16}
          align="center"
          color="#83786F"
          variation="link"
          text="Mantener la operación"
          onPress={() => closeAlert.onClose()}
        />
      </PopUp>

      <ModalError
        isOpen={errorModal.isOpen}
        errorCode={errorModal.errorCode}
        title={errorModal.message.title}
        content={errorModal.message.content}
        titleButton={'Elegir otra cuenta'}
        close={onPressCloseModal}
      />
    </>
  );
};

export default OtherBanks;
