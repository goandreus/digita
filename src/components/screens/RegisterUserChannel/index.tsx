import React, {useContext, useEffect, useState} from 'react';
import {Linking, StatusBar, View} from 'react-native';
import {RegisterUserChannelScreenProps} from '@navigations/types';
import {Colors} from '@theme/colors';
import Button from '@atoms/Button';
import FormTemplate from '@templates/FormTemplate';
import _ from 'lodash';
import SVGPhoneSendEmail from '@assets/images/phoneSendEmail.svg';
import SVGPhoneSendSMS from '@assets/images/phoneSendSMS.svg';
import {SvgProps} from 'react-native-svg';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {hideWithChar} from '@helpers/StringHelper';
import ModalBottom from '@atoms/ModalBottom';
import Toggle from '@molecules/Toggle';
import {Information} from '@global/information';
import {sendOtpToEmail, sendOtpToPhone} from '@services/User';
import moment from 'moment';
import ModalError from '@molecules/ModalError';
import { useTimer } from '@hooks/common';

type channelType = 'email' | 'sms';

const RegisterUserChannel = ({
  navigation,
  route,
}: RegisterUserChannelScreenProps) => {
  const {
    personId,
    stage,
    isSensitiveInfo,
    phoneNumber,
    email,
    documentNumber,
    documentType,
    stepProps,
    gender,
    firstName,
    secondName,
    firstSurname,
    secondSurname,
  } = route.params;

  const {selectTimer, restart} = useTimer();
  const timer = selectTimer({documentType, documentNumber});
  /* const timer = useAppSelector(state =>
    state.timer.find(
      item =>
        item.documentType === documentType &&
        item.documentNumber === documentNumber,
    ),
  ); */

  const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);
  const [showSelectChannel, setShowSelectChannel] = useState<boolean>(false);
  const [channel, setChannel] = useState<channelType>('sms');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [now, setNow] = useState<number>(new Date().getTime());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date().getTime());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const remaining: number =
    timer?.startedAt !== undefined
      ? 60 - moment().diff(timer.startedAt, 's')
      : -1;

  const getProperties = (
    _channel: channelType = channel,
  ): {
    channelLabelHeader: string;
    channelLabelDescription: string;
    ImageSVG: React.FC<SvgProps>;
  } => {
    let channelLabelHeader: string;
    let channelLabelDescription: string;
    let ImageSVG: React.FC<SvgProps>;

    switch (_channel) {
      case 'email':
        channelLabelHeader = 'Correo';
        channelLabelDescription = 'correo electrónico';
        ImageSVG = SVGPhoneSendEmail;
        break;
      case 'sms':
        channelLabelHeader = 'SMS';
        channelLabelDescription = 'número';
        ImageSVG = SVGPhoneSendSMS;
        break;
    }

    return {
      channelLabelHeader,
      channelLabelDescription,
      ImageSVG,
    };
  };

  const ImageSVG = getProperties().ImageSVG;

  const phoneNumberLabel = isSensitiveInfo
    ? hideWithChar('phone', phoneNumber)
    : phoneNumber;

  const emailLabel = isSensitiveInfo ? hideWithChar('email', email) : email;

  const handleOnSendOTP = async () => {
    try {
      setIsSendingOTP(true);
      switch (channel) {
        case 'email': {
          const result = await sendOtpToEmail(email, route.name, {
            documentNumber: documentNumber,
            documentType: documentType
          });
          if (result.type === 'MAX_LIMIT') {
            setIsOpenModal(true);
            setIsSendingOTP(false);
            return;
          }
          break;
        }
        case 'sms': {
          const result = await sendOtpToPhone(phoneNumber, route.name, {
            documentNumber: documentNumber,
            documentType: documentType
          });
          if (result.type === 'MAX_LIMIT') {
            setIsOpenModal(true);
            setIsSendingOTP(false);
            return;
          }
          break;
        }
      }
      restart({documentNumber, documentType});
      navigation.navigate('RegisterOTP', {
        type: 'REGISTER',
        personId,
        stage,
        gender,
        documentNumber,
        documentType,
        isSensitiveInfo: isSensitiveInfo,
        channel: channel,
        email: email,
        phoneNumber: phoneNumber,
        stepProps:
          stepProps !== undefined && stepProps.current !== undefined
            ? {
                max: stepProps.max,
                current: stepProps.current,
              }
            : undefined,
        firstName,
        secondName,
        firstSurname,
        secondSurname,
      });
      setIsSendingOTP(false);
    } catch (error) {
      setIsOpenModal(false);
      setIsSendingOTP(false);
      console.error(error);
    }
  };

  return (
    <>
      <FormTemplate
        title={`Código de activación vía ${getProperties().channelLabelHeader}`}
        description={`Se enviará un código de activación al ${
          getProperties().channelLabelDescription
        } registrado.`}
        stepsProps={stepProps}>
        <TextCustom variation="p" align="center" weight="bold">
          {channel === 'sms' && phoneNumberLabel}
          {channel === 'email' && emailLabel}
        </TextCustom>
        <Separator type="x-small" />
        <TextCustom
          actionName={`Cambiar Canal`}
          variation="link"
          align="center"
          color={Colors.Paragraph}
          onPress={() => setShowSelectChannel(true)}>
          Cambiar a{' '}
          {channel === 'email' && getProperties('sms').channelLabelHeader}
          {channel === 'sms' && getProperties('email').channelLabelHeader}
        </TextCustom>
        <Separator type="medium" />
        <ImageSVG width="100%" />
        <Separator type="medium" />
        <Button
          disabled={remaining > 0}
          loading={isSendingOTP}
          orientation="horizontal"
          type="primary"
          text="Enviar código"
          onPress={handleOnSendOTP}
        />
        {remaining > 0 && (
          <>
            <Separator type="medium" />
            <TextCustom variation="p" align="center">
              {remaining} {remaining > 1 ? 'segundos' : 'segundo'}
            </TextCustom>
          </>
        )}
      </FormTemplate>
      <ModalBottom
        open={showSelectChannel}
        onRequestClose={() => setShowSelectChannel(false)}>
        <TextCustom variation="h2" weight="normal" color={Colors.Paragraph}>
          ¿Donde quieres recibir tu código de activación?
        </TextCustom>
        <Separator type="small" />
        <Toggle
          actionName='Seleccionar canal Correo electrónico'
          icon="email"
          title={emailLabel}
          description="Correo electrónico"
          selected={channel === 'email'}
          onToggle={() => {
            setChannel('email');
            setShowSelectChannel(false);
          }}
        />
        <Separator type="x-small" />
        <Toggle
          actionName='Seleccionar canal Número de teléfono'
          icon="sms"
          title={phoneNumberLabel}
          description="Número de teléfono"
          selected={channel === 'sms'}
          onToggle={() => {
            setChannel('sms');
            setShowSelectChannel(false);
          }}
        />
        <Separator type="small" />
        {isSensitiveInfo ? (
          <>
            <TextCustom variation="p">
              Si la información mostrada no es correcta, por tu seguridad te
              recomendamos que te comuniques con la central telefónica para
              actualizar tus datos.
            </TextCustom>
            <Separator type="small" />
            <TextCustom
              variation="link"
              align="center"
              color={Colors.Paragraph}
              onPress={() =>
                Linking.openURL(`tel:${Information.PhoneContact}`)
              }>
              Llamar al {Information.PhoneContactFormattedSimple}
            </TextCustom>
          </>
        ) : (
          <>
            <TextCustom variation="p">
              Si la información mostrada no es correcta, puedes corregirla dando
              clic en el enlace de abajo.
            </TextCustom>
            <Separator type="small" />
            <TextCustom
              variation="link"
              align="center"
              color={Colors.Paragraph}
              onPress={() => {
                navigation.goBack();
                setShowSelectChannel(false);
              }}>
              Corregir información
            </TextCustom>
          </>
        )}
      </ModalBottom>
      <ModalError
        isOpen={isOpenModal}
        title="Límite superado"
        content="Ha superado el límite de envío de código permitido. Por favor intente luego nuevamente."
        close={() => setIsOpenModal(false)}
        titleButton="Aceptar"
      />
    </>
  );
};

export default RegisterUserChannel;
