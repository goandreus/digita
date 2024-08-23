import {Formik} from 'formik';
import React, {useContext, useId, useState} from 'react';
import {Alert, KeyboardTypeOptions, StyleSheet, Text, View} from 'react-native';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import FormTemplate from '@templates/FormTemplate';
import yup from '@yup';
import Button from '@atoms/Button';
import FieldForm from '@molecules/FieldForm';
import * as _ from 'lodash';
import {LoginNormalScreenProps} from '@navigations/types';
import InputIcon from '@molecules/InputIcon';
import {Colors} from '@theme/colors';
import {StackActions} from '@react-navigation/native';
import {CatalogueContext} from '@contexts/CatalogueContext';
import {CatalogueItem} from '@services/Catalogue';
import Select, {SelectItem} from '@atoms/Select';
import {encourage} from '@helpers/StringHelper';
import Input from '@atoms/Input';
import {FontSizes} from '@theme/fonts';
import useUser from '@hooks/useUser';
import {getIsAllowedToAttempt, registerEvent} from '@services/User';
import {decrypt, encrypt} from '@utils/AES';
import ModalError from '@molecules/ModalError';
import {useLoading} from '@hooks/common';
import allUsersLogged from '@features/allUsersLogged';
import { Dynatrace } from '@dynatrace/react-native-plugin';
import { padStart } from 'lodash';
import { SEPARATOR_BASE } from '@theme/metrics';
import { activateRemoteConfig, getRemoteValue } from '@utils/firebase';

const LoginNormalScreen = ({navigation, route}: LoginNormalScreenProps) => {
  const {actions} = useUser();

  const styles = getStyles();

  const {setShowWelcomeModal} = useLoading();
  const catalogue = useContext(CatalogueContext);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [titleModal, setTitleModal] = useState<string>('');
  const [contentModal, setContentModal] = useState<string>('');

  const toKey = (catalogueItem: CatalogueItem) =>
    `documento-${catalogueItem.descripcionCorta}`;

  const getCatalogueItemByKey = (key: string) =>
    catalogue.find(catalogueItem => toKey(catalogueItem) === key);

  const documentTypes: SelectItem[] = catalogue.map(catalogueItem => ({
    label: catalogueItem.descripcionCorta,
    value: toKey(catalogueItem),
  }));

  const validationSchema: {
    documentType: yup.StringSchema;
    password: yup.StringSchema;
    showPassword: yup.BooleanSchema;
    [key: string]: any;
  } = {
    documentType: yup.string().required('Es obligatorio completar este dato.'),
    password: yup.string().required('Es obligatorio completar este dato.'),
    showPassword: yup.boolean(),
  };

  catalogue.forEach(catalogueItem => {
    const key = toKey(catalogueItem);
    let schema: any;
    switch (catalogueItem.tipo) {
      case 'A':
      case 'N':
        schema = yup.string();
        schema = schema.when('documentType', {
          is: key,
          then: schema.required('Es obligatorio completar este dato.'),
          otherwise: schema.transform(() => undefined).notRequired(),
        });

        switch (catalogueItem.precision) {
          case 0:
            schema = schema.max(
              catalogueItem.longitud,
              `El documento debe tener como máximo ${catalogueItem.longitud} dígito(s).`,
            );
            break;
          case 1:
            schema = schema.length(
              catalogueItem.longitud,
              `El documento debe tener ${catalogueItem.longitud} dígito(s).`,
            );
            break;
        }
        break;
    }
    validationSchema[key] = schema;
  });

  const initialValues: {
    documentType: string;
    password: string;
    showPassword: boolean;
    [key: string]: any;
  } = {
    documentType: '',
    password: '',
    showPassword: false,
  };

  catalogue.forEach(catalogueItem => {
    const key = toKey(catalogueItem);
    let initialValue: any;
    switch (catalogueItem.tipo) {
      case 'A':
      case 'N':
        initialValue = '';
        break;
    }
    initialValues[key] = initialValue;

    if (catalogueItem.descripcionCorta === 'DNI')
      initialValues.documentType = key;
  });

  const analyzeText = (key: string, text: string): string => {
    const catalogueItem = getCatalogueItemByKey(key);
    let analyzed: string;
    switch (catalogueItem?.tipo) {
      default:
        analyzed = text;
      case 'A':
        analyzed = encourage(text, 'aplhanumeric');
        break;
      case 'N':
        analyzed = encourage(text, 'numeric');
        break;
    }
    return analyzed;
  };

  const getPlaceholderByKey = (key: string): string => {
    const catalogueItem = getCatalogueItemByKey(key);
    let placeholder = 'EJ: ';
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

  const handleOnSubmit = async (values: {
    documentTypeFormatted: string;
    documentNumber: string;
    password: string;
  }, resetForm: () => void) => {
    await activateRemoteConfig()
    const mandatory_update = getRemoteValue('mandatory_update').asBoolean()
    if(mandatory_update) {
      navigation.navigate('InfoUpdateAppScreen')
      return
    }

    try {
      navigation.navigate('LoadingScreen');

      const catalogueItem = getCatalogueItemByKey(values.documentTypeFormatted);
      if (catalogueItem === undefined)
        throw new Error('No existe el item en el catálogo.');

      const documentType = catalogueItem.codigo;
      const documentNumber = values.documentNumber;

      Dynatrace.identifyUser(`${padStart(documentType.toString(), 2, '0')}${documentNumber}-Login`);
      const resultLogin = await actions.login(
        documentType,
        documentNumber,
        values.password,
      );

      if (resultLogin.type === 'SUCCESS') {
        const isNewUser = !allUsersLogged.has(documentNumber);

        if (isNewUser) {
          allUsersLogged.add(documentNumber);
          setShowWelcomeModal(true);
        }

        navigation.navigate('MainTab');
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

        if (getIsAllowedToAttemptResult.isSuccess === false)
          if (getIsAllowedToAttemptResult.error !== undefined)
            switch (getIsAllowedToAttemptResult.error.type) {
              case 'LIMIT_ATTEMPTS':
                navigation.dispatch(
                  StackActions.replace('InfoDNINotRecognizedMaxAttempt'),
                );
                break;
              case 'UNKNOWN':
              case 'OTHER':
                throw new Error('Ocurrió un error desconocido.');
                break;
            }
          else throw new Error('Ocurrió un error desconocido.');
        else {
          navigation.dispatch(
            StackActions.replace('RegisterIdentityInfo', {
              flowType: 'LOGIN',
              password: values.password,
              documentNumber: documentNumber,
              documentType: documentType,
              gender: resultLogin.person.gender,
              stepProps: {
                max: 3,
                showLabel: false,
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
      } else if (resultLogin.type === 'ACCESS_BLOCKED') {
        navigation.navigate('InfoAccessBlocked');
      } else if (resultLogin.type === 'IS_NOT_AN_MEMBER_AND_DOESNT_HAVE_ACTIVE_PRODUCTS') {
        resetForm();
        navigation.replace('InfoWithoutActiveProduct', {
          gender: resultLogin.gender
        });
      } else if (resultLogin.type === 'IS_NOT_AN_MEMBER_AND_HAS_ACTIVE_PRODUCTS') {
        navigation.replace('InfoRegisterInLogin');
      }
    } catch (error: any) {
      navigation.pop();
    }
  };
 
  return (
    <>
      <FormTemplate showLogo={true} header={<Separator size={SEPARATOR_BASE * 4} />}>
        <Formik
          validateOnMount={true}
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={yup.object(validationSchema)}
          onSubmit={async (values, actions) => {
            await handleOnSubmit({
              documentTypeFormatted: values.documentType,
              documentNumber: values[values.documentType],
              password: values.password,
            }, () => {
              setTimeout(() => {
                actions.resetForm();
              }, 1000);
            });
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            values,
            errors,
            touched,
            isValid,
            isSubmitting,
          }) => (
            <>
              <TextCustom variation="p" weight="bold">
                Número de documento <TextCustom variation="p">(DNI)</TextCustom>
              </TextCustom>
              <Separator size={SEPARATOR_BASE} />
              <FieldForm
                style={styles.inputWrapper}
                message={errors[values.documentType]?.toString()}
                messageType="error"
                showMessage={
                  errors[values.documentType] !== undefined &&
                  touched[values.documentType] === true
                }>
                <Input
                  value={values[values.documentType]}
                  haveError={
                    errors[values.documentType] !== undefined &&
                    touched[values.documentType] === true
                  }
                  onChange={text => {
                    const textAnalyzed: string = analyzeText(
                      values.documentType,
                      text,
                    );
                    setFieldValue(values.documentType, textAnalyzed, true);
                  }}
                  onBlur={handleBlur(values.documentType)}
                  keyboardType={handleKeyboardType(values.documentType)}
                  maxLength={handleMaxLength(values.documentType)}
                  placeholder={getPlaceholderByKey(values.documentType)}
                />
              </FieldForm>
              <Separator size={SEPARATOR_BASE * 4} />
              <TextCustom text="Clave digital" variation="p" weight="bold" />
              <Separator size={SEPARATOR_BASE} />
              <FieldForm
                message={errors.password?.toString()}
                messageType="error"
                showMessage={
                  errors.password !== undefined && touched.password === true
                }>
                <InputIcon
                  actionName={
                    values.showPassword
                      ? 'Ocultar contraseña'
                      : 'Mostar contraseña'
                  }
                  value={values.password}
                  iconRight={values.showPassword ? 'eye-on' : 'eye-off'}
                  secureTextEntry={values.showPassword === false}
                  contextMenuHidden={true}
                  haveError={
                    errors.password !== undefined && touched.password === true
                  }
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  onClickIconRight={() =>
                    setFieldValue('showPassword', !values.showPassword)
                  }
                />
              </FieldForm>
              <Separator size={SEPARATOR_BASE * 2} />
              <View style={styles.registerWrapper}>
                <TextCustom
                  variation="h2"
                  size={FontSizes.Paragraph}
                  color={Colors.Paragraph}
                  weight="normal">
                  ¿Primera vez en la app?{' '}
                  <TextCustom
                    variation="link"
                    onPress={() => {
                      navigation.navigate('RegisterUserDocument');
                    }}>
                    Regístrate aquí
                  </TextCustom>
                </TextCustom>
              </View>
              <Separator size={SEPARATOR_BASE * 6} />
              <Button
                onPress={handleSubmit}
                loading={isSubmitting}
                orientation="horizontal"
                type="primary"
                text="Ingresar"
                disabled={!isValid}
              />
              <Separator size={SEPARATOR_BASE * 3} />
              <View style={styles.linkButton}>
                <TextCustom
                  variation="link"
                  onPress={() => navigation.navigate('RecoverPassword')}>
                  Olvidé mi clave
                </TextCustom>
              </View>
            </>
          )}
        </Formik>
        <ModalError
          isOpen={openModal}
          close={() => setOpenModal(false)}
          title={titleModal}
          content={contentModal}
          titleButton="Aceptar"
        />
      </FormTemplate>
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    inputsWrapper: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      zIndex: 3000,
    },
    selectWrapper: {
      flex: 1,
      marginRight: 8,
    },
    inputWrapper: {
      flex: 2,
    },
    linkButton: {alignSelf: 'center'},
    registerWrapper: {},
  });

  return stylesBase;
};

export default LoginNormalScreen;
