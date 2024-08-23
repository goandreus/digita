import {RegisterPasswordScreenProps} from '@navigations/types';
import {useState} from 'react';
import yup from '@yup';
import {encourage} from '@helpers/StringHelper';
import {useLastUser} from '@hooks/common';
import {
  disaffiliation,
  sendNotificationSuccess,
  updatePassword_ForgotPasswordFlow,
} from '@services/User';
import {FieldMessageType} from '@atoms/extra/FieldMessage';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';

export const useRegisterPassword = ({
  navigation,
  route,
}: RegisterPasswordScreenProps) => {
  const {updateLastUser} = useLastUser();
  const {
    flowType,
    documentNumber,
    documentType,
    email,
    firstName,
    firstSurname,
    secondSurname,
    secondName,
  } = route.params;

  const [modalPasswordCreated, setModalPasswordCreated] = useState<{
    open: boolean;
    onAccept?: () => void;
  }>({
    open: false,
  });

  const [modalReattempt, setModalReattempt] = useState<{
    open: boolean;
    title?: string;
    content?: string;
    button?: string;
  }>({
    open: false,
  });

  const getFieldMessageType = (
    isTouched: boolean,
    hasError: boolean,
  ): FieldMessageType => {
    if (isTouched === false) return 'neutral';
    else if (hasError) return 'error-off';
    else return 'success';
  };

  const validateIndicatorPasswordA = (value: string) =>
    yup
      .string()
      .min(8)
      .max(20)
      .required()
      .isValidSync(value, {abortEarly: true, strict: true});

  const validateIndicatorPasswordB = (value: string) =>
    yup
      .string()
      .matches(/(?=.*[a-zñ])(?=.*[A-ZÑ])[a-zA-ZñÑ]/)
      .required()
      .isValidSync(value, {abortEarly: true, strict: true});

  const validateIndicatorPasswordC = (value: string) =>
    yup
      .string()
      .matches(/(?=.*[0-9])/)
      .required()
      .isValidSync(value, {abortEarly: true, strict: true});

  const handleOnSubmit = async (values: {password: string}) => {
    try {
      let showRegisterTokenFlow: boolean = true;
      switch (flowType) {
        case 'REGISTER': {
          try {
            await disaffiliation({
              screen: route.name,
              documentType,
              documentNumber,
            });
            const response = await sendNotificationSuccess(
              {
                password: values.password,
              },
              route.name,
              documentType,
              documentNumber,
            );
            if(response?.content){
              setModalReattempt({
                open: true,
                title: response.title,
                content: response.content,
                button: response.button,
              });
              return;
            }
          } catch (error) {
            setModalReattempt({
              open: true,
              title: "¡Lo sentimos!",
              content: "Ocurrió un inconveniente. Por favor, inténtalo nuevamente en unos segundos.",
              button: "Volver a intentar",
            });
            return;
          }
          break;
        }
        case 'FORGOT_PASSWORD': {
          try {
            const result = await updatePassword_ForgotPasswordFlow(
              {
                password: values.password,
              },
              route.name,
              documentType,
              documentNumber,
            );
            if (result.isSecure === true && result.hasToken === false)
              showRegisterTokenFlow = true;
            else showRegisterTokenFlow = false;

            if(result?.content){
              setModalReattempt({
                open: true,
                title: result.title,
                content: result.content,
                button: result.button,
              });
              return;
            }
          } catch (error) {
            setModalReattempt({
              open: true,
              title: "¡Lo sentimos!",
              content: "Ocurrió un inconveniente. Por favor, inténtalo nuevamente en unos segundos.",
              button: "Volver a intentar",
            });
            return;
          }
          break;
        }
      }

      updateLastUser({
        document: {
          number: documentNumber,
          type: documentType,
        },
        firstName,
      });

      AH.track("CF App - Crear Clave Digital", {
        'Número de Documento': AH.autoGenerate("documentNumber"),
        'Afiliación Banca Digital': AH.autoGenerate("termsAreAccepted"),
        'Proceso Consultado': AH.autoGenerate("Proceso Consultado"),
        'Sesión Rápida': showRegisterTokenFlow === false,
        'Etapa': "Inicio",
      });
      setModalPasswordCreated({
        open: true,
        onAccept: () => {
          if (showRegisterTokenFlow === true)
            navigation.reset({
              index: 1,
              routes: [
                {name: 'Home'},
                {
                  name: 'InfoRegisterToken',
                  params: {
                    flowType,
                    documentNumber,
                    documentType,
                    password: values.password,
                    email: email,
                    firstName: firstName,
                    secondName: secondName,
                    firstSurname: firstSurname,
                    secondSurname: secondSurname,
                  },
                },
              ],
            });
          else
            navigation.reset({
              index: 1,
              routes: [
                {name: 'Home'},
                {
                  name: 'InfoRegisterSuccess',
                  params: {
                    title: '¡Listo!',
                    description:
                      'Tu clave digital ha sido actualizada. Usa tu clave digital para ingresar a la app.',
                  },
                },
              ],
            });
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const analyzeText = (text: string): string => {
    return encourage(text, 'password');
  };

  return {
    modalPasswordCreated,
    modalReattempt,
    setModalPasswordCreated,
    setModalReattempt,
    getFieldMessageType,
    validateIndicatorPasswordA,
    validateIndicatorPasswordB,
    validateIndicatorPasswordC,
    analyzeText,
    handleOnSubmit,
  };
};
