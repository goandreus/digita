import { useEffect, useState } from 'react';
import useUser from '@hooks/useUser';
import yup from '@yup';
import { LoginNormalScreenProps } from '@navigations/types';
import { useLoading, useTimer } from '@hooks/common';
import { useValidationFormCatalogue } from '@hooks/useValidationFormCatalogue';
import { Dynatrace } from '@dynatrace/react-native-plugin';
import { encourage } from '@helpers/StringHelper';
import { KeyboardTypeOptions } from 'react-native';
import { activateRemoteConfig, getRemoteValue } from '@utils/firebase';
import { padStart } from 'lodash';
import allUsersLogged from '@features/allUsersLogged';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import { getIsAllowedToAttempt, registerEvent } from '@services/User';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';
import { ERROR_MAP } from '@managers/AmplitudeManager/ErrorMap';

export const useLoginNormal = ({ navigation, route }: LoginNormalScreenProps) => {
  const { actions } = useUser();
  const { restart } = useTimer();

  const { setShowWelcomeModal } = useLoading();

  const schema = {
    documentType: yup.string().required('Es obligatorio completar este dato'),
    password: yup.string().required('Es obligatorio completar este dato'),
    showPassword: yup.boolean(),
  };

  const firstValues = {
    documentType: '',
    password: '',
    showPassword: false,
  };

  const { initialValues, validationSchema, getCatalogueItemByKey } =
    useValidationFormCatalogue(schema, firstValues);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [titleModal, setTitleModal] = useState<string>('');
  const [contentModal, setContentModal] = useState<string>('');
  const [showNormalErrorAlert, setShowNormalErrorAlert] =
    useState<boolean>(false);
  const [showOpenSessionModal, setShowOpenSessionModal] =
    useState<boolean>(false);
  const [openSessionInfo, setOpenSessionInfo] = useState({
    title: "",
    content: "",
    button: ""
  });

  const closeModal = () => setOpenModal(false);

  const analyzeText = (key: string, text: string): string => {
    const catalogueItem = getCatalogueItemByKey(key);
    let analyzed: string;
    switch (catalogueItem?.tipo) {
      case 'A':
        analyzed = encourage(text, 'aplhanumeric');
        break;
      case 'N':
        analyzed = encourage(text, 'numeric');
        break;
      default:
        analyzed = text;
    }
    return analyzed;
  };

  const getPlaceholderByKey = (key: string): string => {
    const catalogueItem = getCatalogueItemByKey(key);
    let placeholder = 'Ej: ';
    switch (catalogueItem?.descripcionCorta) {
      case 'DNI':
        placeholder += '10028945'.padStart(catalogueItem.longitud, '0');
        break;
      case 'CE':
        placeholder += '001043328'.padStart(catalogueItem.longitud, '0');
        break;
      default:
        placeholder = '';
        break;
    }
    return placeholder;
  };

  const handleKeyboardType = (key: string): KeyboardTypeOptions => {
    const catalogueItem = getCatalogueItemByKey(key);
    let keyboardType: KeyboardTypeOptions;
    switch (catalogueItem?.tipo) {
      default:
      case 'A':
        keyboardType = 'default';
        break;
      case 'N':
        keyboardType = 'numeric';
        break;
    }
    return keyboardType;
  };

  const handleMaxLength = (key: string): number | undefined => {
    const catalogueItem = getCatalogueItemByKey(key);
    return catalogueItem?.longitud;
  };
  const dispatch = useAppDispatch();

  const handleOnSubmit = async (
    values: {
      documentTypeFormatted: string;
      documentNumber: string;
      password: string;
    },
    resetForm: () => void,
  ) => {
    await activateRemoteConfig();
    const mandatory_update = getRemoteValue('mandatory_update').asBoolean();
    if (mandatory_update) {
      navigation.navigate('InfoUpdateAppScreen');
      return;
    }

    try {
      navigation.navigate('LoadingScreen');

      const catalogueItem = getCatalogueItemByKey(values.documentTypeFormatted);
      if (catalogueItem === undefined) {
        throw new Error('No existe el item en el catálogo.');
      }

      const documentType = catalogueItem.codigo;
      const documentNumber = values.documentNumber;
      AH.identifyUser(`${padStart(documentType.toString(), 2, '0')}11111111`);

      Dynatrace.identifyUser(
        `${padStart(documentType.toString(), 2, '0')}${documentNumber}-Login`,
      );
      const resultLogin = await actions.login(
        documentType,
        documentNumber,
        values.password,
      );

      if (resultLogin.type === 'SUCCESS') {
        const isNewUser = !allUsersLogged.has(documentNumber);

        if (isNewUser) {
          allUsersLogged.add(documentNumber);
          dispatch(setShowWelcomeModal(true));
        }

        navigation.navigate('MainTab');
      } else if (resultLogin.type === 'SUCCESS_DISBURSE') {
        const isNewUser = !allUsersLogged.has(documentNumber);
        if (isNewUser) {
          allUsersLogged.add(documentNumber);
          dispatch(setShowWelcomeModal(true));
        }
        navigation.navigate('StartDisbursement', {
          showTokenIsActivated: false,
        });
      } else if (resultLogin.type === 'DEVICE_IS_NOT_SECURE') {
        const personId = await registerEvent(
          documentType,
          documentNumber,
          '000000000',
          'LoginNormalScreen-index.tsx',
        );
        const getIsAllowedToAttemptResult = await getIsAllowedToAttempt(
          personId,
          `0${documentType}${documentNumber}`,
          route.name,
        );

        if (getIsAllowedToAttemptResult.isSuccess === false) {
          if (getIsAllowedToAttemptResult.error !== undefined) {
            switch (getIsAllowedToAttemptResult.error.type) {
              case 'LIMIT_ATTEMPTS':
                AH.track("CF App - Error Encontrado", {
                  "Nombre de la Vista": AH.autoGenerate('Nombre de la Vista'),
                  "Nombre del Error": ERROR_MAP['LOGIN']['DEVICE_IS_NOT_SECURE_LIMIT_ATTEMPTS'],
                  "Fuente del Error": 'Proceso interno'
                });
                navigation.dispatch(
                  StackActions.replace('InfoDNINotRecognizedMaxAttempt'),
                );
                break;
              case 'UNKNOWN':
              case 'OTHER':
                AH.track("CF App - Error Encontrado", {
                  "Nombre de la Vista": AH.autoGenerate('Nombre de la Vista'),
                  "Nombre del Error": ERROR_MAP['LOGIN']['DEVICE_IS_NOT_SECURE_UNKNOWN_ERROR'],
                  "Fuente del Error": 'Proceso interno'
                });
                navigation.pop();
            }
          } else {
            AH.track("CF App - Error Encontrado", {
              "Nombre de la Vista": AH.autoGenerate('Nombre de la Vista'),
              "Nombre del Error": ERROR_MAP['LOGIN']['DEVICE_IS_NOT_SECURE_UNKNOWN_ERROR'],
              "Fuente del Error": 'Proceso interno'
            });
            navigation.pop();
          }
        } else {
          navigation.dispatch(
            StackActions.replace('RegisterIdentityInfo', {
              flowType: 'LOGIN',
              password: values.password,
              documentNumber: documentNumber,
              documentType: documentType,
              gender: resultLogin.person.gender,
              stepProps: {
                max: 2,
                current: 0,
              },
            }),
          );
        }
      } else if (resultLogin.type === 'MAX_ATTEMPTS') {
        navigation.navigate('InfoMaxAttemps');
      } else if (resultLogin.type === 'INVALID_SESSION') {
        setOpenModal(true);
        setTitleModal(resultLogin.title);
        setContentModal(resultLogin.content);
        navigation.pop();
      } else if (resultLogin.type === 'SESSION_ACTIVE_ANOTHER_DEVICE') {
        setShowOpenSessionModal(true);
        setOpenSessionInfo({
          title: resultLogin.title,
          content: resultLogin.content,
          button: resultLogin.button
        });
        navigation.pop();
      } else if (resultLogin.type === 'ACCESS_BLOCKED') {
        navigation.navigate('InfoAccessBlocked');
      } else if (
        resultLogin.type === 'IS_NOT_AN_MEMBER_AND_DOESNT_HAVE_ACTIVE_PRODUCTS'
      ) {
        resetForm();
        navigation.replace('InfoWithoutActiveProduct', {
          gender: resultLogin.gender,
        });
      } else if (
        resultLogin.type === 'IS_NOT_AN_MEMBER_AND_HAS_ACTIVE_PRODUCTS'
      ) {
        navigation.replace('InfoRegisterInLogin');
      } else if (resultLogin.type === 'ACCESS_BLOCKED_BY_MP') {
        setShowNormalErrorAlert(true);
        navigation.pop();
      } else if (resultLogin.type === 'UNKNOWN_ERROR_BY_MP') {
        navigation.pop();
      } else if (resultLogin.type === 'NEED_AUTHENTICATION_BY_MP') {
        restart({ documentNumber, documentType });
        navigation.dispatch(
          StackActions.replace('RegisterOTP', {
            type: 'LOGIN',
            showMaxLimit: false,
            documentType: documentType,
            documentNumber: documentNumber,
            password: values.password,
            phoneNumberObfuscated: resultLogin.phoneOfuscated,
            emailObfuscated: resultLogin.emailOfuscated,
            channel: 'sms',
            stepProps: undefined,
            isSensitiveInfo: true,
            execRestart: false,
            trackingLogin: resultLogin.trackingLogin,
          }),
        );
      }
    } catch (error: any) {
      AH.track("CF App - Error Encontrado", {
        "Nombre de la Vista": AH.autoGenerate('Nombre de la Vista'),
        "Nombre del Error": ERROR_MAP['LOGIN']['OTHERS'],
        "Fuente del Error": 'Proceso interno'
      });
      navigation.pop();
      // Alert.alert('Error', error?.message || 'No se reconoce el error.');
    }
  };

  // console.log(encrypt({data: 'asfas', papu: 'asfasf', num: 1}));
  // console.log(
  //   decrypt(
  //     'U2FsdGVkX18aGlDdcxQNKNStaiy65qYV2rc9Dbrfhwv2QmMK4ktddetIodajGq2MLrPOlq3wm7oI2+ywpuvNMQ==',
  //   ),
  // );

  return {
    initialValues,
    validationSchema,
    openModal,
    titleModal,
    contentModal,
    closeModal,
    analyzeText,
    handleKeyboardType,
    handleMaxLength,
    getPlaceholderByKey,
    handleOnSubmit,
    setShowNormalErrorAlert,
    setShowOpenSessionModal,
    showNormalErrorAlert,
    showOpenSessionModal,
    openSessionInfo,
  };
};
