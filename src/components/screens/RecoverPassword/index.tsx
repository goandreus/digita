import {Formik} from 'formik';
import React, {useContext, useState} from 'react';
import {Alert, KeyboardTypeOptions, StyleSheet, View} from 'react-native';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import FormTemplate from '@templates/FormTemplate';
import yup from '@yup';
import Input from '@atoms/Input';
import Button from '@atoms/Button';
import Select, {SelectItem} from '@atoms/Select';
import FieldForm from '@molecules/FieldForm';
import {CatalogueContext} from '@contexts/CatalogueContext';
import {RecoverPasswordScreenProps} from '@navigations/types';
import {CatalogueItem} from '@services/Catalogue';
import {encourage} from '@helpers/StringHelper';
import * as _ from 'lodash';
import {
  GetMembership_ForgotPassword,
  getInfoFromUser,
  getIsAllowedToAttempt,
  registerEvent,
  sendOtpToEmail,
  sendOtpToEmail_ForgotPassword,
} from '@services/User';
import {useTimer} from '@hooks/common';
import moment from 'moment';
import { Dynatrace } from '@dynatrace/react-native-plugin';
import { padStart } from 'lodash';
import { AH } from '@managers/AmplitudeManager/AmplitudeHandler';

const RecoverPasswordScreen = ({
  navigation,
  route,
}: RecoverPasswordScreenProps) => {
  const styles = getStyles();
  const catalogue = useContext(CatalogueContext);

  const {timers, restart} = useTimer();

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
    [key: string]: any;
  } = {
    documentType: yup.string().required('Es obligatorio completar este dato.'),
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
    [key: string]: any;
  } = {
    documentType: '',
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

  const handleOnSubmit = async (
    documentTypeCustomized: string,
    documentNumber: string,
  ) => {
    try {
      const catalogueItem = getCatalogueItemByKey(documentTypeCustomized);
      if (catalogueItem === undefined)
        throw new Error('No existe el item en el catálogo.');

      const documentType: number = catalogueItem.codigo;

      const infoOfUser = await GetMembership_ForgotPassword(
        {
          documentNumber,
          documentType,
          phoneNumber: '000000000',
          screenName: 'RecoverPassword-index.tsx'
        }
      );

      if(infoOfUser.type === 'MAX_LIMIT_ATTEMPTS'){
        navigation.navigate('InfoDNINotRecognizedMaxAttempt');
      }
      else if (infoOfUser.type === 'SUCCESS') {
        Dynatrace.identifyUser(`${padStart(documentType.toString(), 2, '0')}${documentNumber}-Olvidé mi contraseña`);
        const timer = timers.find(
          item =>
            item.documentType === documentType &&
            item.documentNumber === documentNumber,
        );
        const remaining: number =
          timer?.startedAt !== undefined
            ? 60 - moment().diff(timer.startedAt, 's')
            : -1;

        let showMaxLimit: boolean = false;
        if (remaining <= 0) {
          const result = await sendOtpToEmail_ForgotPassword(infoOfUser.email, route.name, {
            documentNumber: documentNumber,
            documentType: documentType
          });
          if (result.type === 'MAX_LIMIT') showMaxLimit = true;
          restart({ documentNumber, documentType });
        }
        AH.track("CF App - Clave Olvidada", {
          'Número de Documento': documentNumber,
          'Fase de Inicio de Sesión': AH.autoGenerate('Fase de Inicio de Sesión'),
          'Etapa': 'Identificación'
        });
        navigation.navigate('RegisterOTP', {
          type: 'FORGOT_PASSWORD',
          showMaxLimit: showMaxLimit,
          personId: undefined,
          gender: 'F',
          documentNumber,
          documentType,
          email: infoOfUser.email,
          channel: 'email',
          isSensitiveInfo: true,
          firstName: infoOfUser.firstName,
          secondName: "",
          firstSurname: "",
          secondSurname: "",
          stepProps: {
            max: 4,
            current: 1,
            showLabel: true,
          },
        });
      } else if (infoOfUser.type === 'USER_DOESNT_HAVE_MEMBERSHIP') {
        navigation.navigate('InfoWithoutMembership');
      } else if (infoOfUser.type === 'USER_DOESNT_EXIST') {
        // Alert.alert('Info', "User doesn't exist");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FormTemplate
        title="Identifícate"
        description="Para comenzar, ingresa tu documento de identidad y luego sigue los pasos."
        stepsProps={{max: 4, current: 0, showLabel: true}}>
        <Formik
          validateOnMount={true}
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={yup.object(validationSchema)}
          onSubmit={async (values, actions) => {
            await handleOnSubmit(
              values.documentType,
              values[values.documentType],
            );
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
              <Separator size={8} />
              <FieldForm
                style={styles.inputWrapper}
                message={errors[values.documentType]?.toString()}
                messageType="error"
                showMessage={
                  errors[values.documentType] !== undefined &&
                  touched[values.documentType] !== undefined
                }>
                <Input
                  value={values[values.documentType]}
                  haveError={
                    errors[values.documentType] !== undefined &&
                    touched[values.documentType] !== undefined
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
              <Separator type="medium" />
              <Button
                onPress={handleSubmit}
                loading={isSubmitting}
                orientation="horizontal"
                type="primary"
                text="Siguiente"
                disabled={!isValid}
              />
            </>
          )}
        </Formik>
      </FormTemplate>
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    title: {
      alignSelf: 'center',
    },
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
  });

  return stylesBase;
};

export default RecoverPasswordScreen;
