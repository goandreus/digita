import {Formik} from 'formik';
import React, {useContext, useMemo, useState} from 'react';
import {
  KeyboardTypeOptions,
  Linking,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Colors} from '@theme/colors';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import FormTemplate from '@templates/FormTemplate';
import yup from '@yup';
import Input from '@atoms/Input';
import CheckboxLabel from '@molecules/CheckboxLabel';
import Button from '@atoms/Button';
import Select, {SelectItem} from '@atoms/Select';
import FieldForm from '@molecules/FieldForm';
import {CatalogueContext} from '@contexts/CatalogueContext';
import {Information} from '@global/information';
import {RegisterScreenProps} from '@navigations/types';
import {CatalogueItem} from '@services/Catalogue';
import {
  getIsAllowedToAttempt,
  registerEvent,
  validateUser,
} from '@services/User';
import {FontSizes} from '@theme/fonts';
import {encourage} from '@helpers/StringHelper';
import * as _ from 'lodash';
import { Dynatrace } from '@dynatrace/react-native-plugin';
import {padStart} from 'lodash';
import {SEPARATOR_BASE} from '@theme/metrics';

const RegisterUserDocumentScreen = ({
  navigation,
  route,
}: RegisterScreenProps) => {
  const styles = getStyles();
  const catalogue = useContext(CatalogueContext);

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
    termsAreAccepted: yup.BooleanSchema;
    politicsAreAccepted: yup.BooleanSchema;
    [key: string]: any;
  } = {
    documentType: yup.string().required('Es obligatorio completar este dato.'),
    termsAreAccepted: yup
      .boolean()
      .oneOf([true], 'Es obligatorio completar este dato.')
      .required('Es obligatorio completar este dato.'),
    politicsAreAccepted: yup
      .boolean()
      .oneOf([true], 'Es obligatorio completar este dato.')
      .required('Es obligatorio completar este dato.'),
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
    termsAreAccepted: boolean;
    politicsAreAccepted: boolean;
    [key: string]: any;
  } = {
    documentType: '',
    termsAreAccepted: false,
    politicsAreAccepted: false,
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

      const validateUserResult = await validateUser(
        documentType,
        documentNumber,
        route.name,
      );

      switch (validateUserResult.type) {
        case 'USER_IS_NOT_A_MEMBER':
          navigation.navigate('InfoWithoutMembership');
          break;
        case 'USER_DOESNT_HAVE_AN_ACTIVE_PRODUCT':
          navigation.navigate('InfoWithoutActiveProduct', {
            name: validateUserResult.firstName,
            gender: validateUserResult.gender,
          });
          break;
        case 'USER_EXISTS':
          navigation.reset({
            index: 1,
            routes: [{name: 'Home'}, {name: 'InfoUserExists'}],
          });
          break;
        case 'GO_TO_ONBOARDING': {
          Dynatrace.identifyUser(`${padStart(documentType.toString(), 2, '0')}${documentNumber}-Registro Onboarding`);
          const personId = await registerEvent(
            documentType,
            documentNumber,
            '000000000',
            'RegisterUserDocumentScreen-index.tsx',
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
                  navigation.navigate('InfoDNINotRecognizedMaxAttempt');
                  break;
                case 'UNKNOWN':
                case 'OTHER':
                  throw new Error('Ocurrió un error desconocido.');
                  break;
              }
            else throw new Error('Ocurrió un error desconocido.');
          if (getIsAllowedToAttemptResult.isSuccess === true) {
            navigation.navigate('RegisterUserInfo', {
              personId: personId,
              documentType,
              documentNumber,
              gender: validateUserResult.gender,
              firstName: validateUserResult.firstName,
              secondName: validateUserResult.secondName,
              firstSurname: validateUserResult.firstSurname,
              secondSurname: validateUserResult.secondSurname,
              stepProps: {
                max: 4,
                current: 0,
              },
            });
          }
          break;
        }
        case 'GO_TO_PRE_AGENCY': {
          Dynatrace.identifyUser(`${padStart(documentType.toString(), 2, '0')}${documentNumber}-Registro PreAgencia`);
          navigation.navigate('RegisterUserChannel', {
            personId: undefined,
            stage: 'AGENCY',
            gender: validateUserResult.gender,
            documentType,
            documentNumber,
            isSensitiveInfo: true,
            email: validateUserResult.email,
            phoneNumber: validateUserResult.phoneNumber,
            stepProps: {
              max: 2,
              current: 0,
            },
            firstName: validateUserResult.firstName,
            secondName: validateUserResult.secondName,
            firstSurname: validateUserResult.firstSurname,
            secondSurname: validateUserResult.secondSurname,
          });
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FormTemplate
        header={<Separator size={SEPARATOR_BASE * 4} />}
        title="Identifícate"
        description="Para comenzar, ingresa tu documento de identidad y luego sigue los pasos.">
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
              <Separator size={SEPARATOR_BASE} />
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
              <CheckboxLabel
                actionName={
                  values.termsAreAccepted
                    ? 'No acepto los Términos y Condiciones'
                    : 'Acepto los Términos y Condiciones'
                }
                style={styles.checkbox}
                pressWithLabel={true}
                value={values.termsAreAccepted}
                onChange={value => {
                  setFieldValue('termsAreAccepted', value, true);
                }}
                textComponent={
                  <TextCustom variation="small" weight="bold">
                    Acepto{' '}
                    <TextCustom
                      size={FontSizes.Small}
                      variation="link"
                      onPress={() => {
                        Linking.openURL(Information.TermsAndConditions);
                      }}>
                      Términos y Condiciones
                    </TextCustom>
                    <TextCustom
                      size={FontSizes.Small}
                      variation="link"
                      decoration="none">
                      .
                    </TextCustom>
                  </TextCustom>
                }
              />
              <Separator size={SEPARATOR_BASE * 2} />
              <CheckboxLabel
                actionName={
                  values.politicsAreAccepted
                    ? 'No acepto la Política de privacidad'
                    : 'Acepto la Política de privacidad'
                }
                style={styles.checkbox}
                pressWithLabel={true}
                value={values.politicsAreAccepted}
                onChange={value => {
                  setFieldValue('politicsAreAccepted', value, true);
                }}
                textComponent={
                  <TextCustom variation="small" weight="bold">
                    Acepto la{' '}
                    <TextCustom
                      size={FontSizes.Small}
                      variation="link"
                      onPress={() => {
                        Linking.openURL(Information.PrivacyPolicies);
                      }}>
                      Política de privacidad
                    </TextCustom>
                    <TextCustom
                      size={FontSizes.Small}
                      variation="link"
                      decoration="none">
                      .
                    </TextCustom>
                  </TextCustom>
                }
              />
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
    checkbox: {alignSelf: 'flex-start'},
  });

  return stylesBase;
};

export default RegisterUserDocumentScreen;
