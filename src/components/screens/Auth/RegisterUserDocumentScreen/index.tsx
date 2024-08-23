import {Formik} from 'formik';
import React, {useContext, useState} from 'react';
import {Image, Linking, StatusBar, StyleSheet, View} from 'react-native';
import Separator from '@atoms/extra/Separator';
import Input from '@atoms/extra/Input';
import Button from '@atoms/extra/Button';
import {Information} from '@global/information';
import {RegisterScreenProps} from '@navigations/types';
import * as _ from 'lodash';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import {Dynatrace} from '@dynatrace/react-native-plugin';
import {padStart} from 'lodash';
import yup from '@yup';
import {encourage} from '@helpers/StringHelper';
import {KeyboardTypeOptions} from 'react-native';
import {
  getIsAllowedToAttempt,
  registerEvent,
  sendOtpToPhone,
  validateUser,
  registerEventAgency,
  GetMembership,
} from '@services/User';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {COLORS} from '@theme/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CatalogueItem} from '@services/Catalogue';
import {SelectItem} from '@atoms/Select';
import {CatalogueContext} from '@contexts/CatalogueContext';
import Checkbox from '@atoms/extra/Checkbox';
import FormPureTemplate from '@templates/extra/FormPureTemplate';
import {useTimer} from '@hooks/common';
import moment from 'moment';
import AlertBasic from '@molecules/extra/AlertBasic';

export const RegisterUserDocumentScreen = ({
  navigation,
  route,
}: RegisterScreenProps) => {
  const {restart, timers} = useTimer();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showNormalErrorAlert, setShowNormalErrorAlert] =
    useState<boolean>(false);
  const styles = getStyles();
  const catalogue = useContext(CatalogueContext);
  const insets = useSafeAreaInsets();

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
    dataUseAreAccepted: yup.BooleanSchema;
    [key: string]: any;
  } = {
    documentType: yup.string().required('Es obligatorio completar este dato'),
    termsAreAccepted: yup
      .boolean()
      .oneOf([true], 'Es obligatorio completar este dato')
      .required('Es obligatorio completar este dato'),
    dataUseAreAccepted: yup
      .boolean()
      .oneOf([true], 'Es obligatorio completar este dato')
      .required('Es obligatorio completar este dato'),
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
          then: schema.required('Es obligatorio completar este dato'),
          otherwise: schema.transform(() => undefined).notRequired(),
        });

        switch (catalogueItem.precision) {
          case 0:
            schema = schema.max(
              catalogueItem.longitud,
              `El documento debe tener como máximo ${catalogueItem.longitud} dígito(s)`,
            );
            break;
          case 1:
            schema = schema.length(
              catalogueItem.longitud,
              `El documento debe tener ${catalogueItem.longitud} dígitos`,
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
    dataUseAreAccepted: boolean;
    [key: string]: any;
  } = {
    documentType: '',
    termsAreAccepted: false,
    dataUseAreAccepted: false,
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
    let placeholder = '';
    switch (catalogueItem?.descripcionCorta) {
      case 'DNI':
        placeholder += ''.padStart(catalogueItem.longitud, '0');
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
    clearForm: () => void,
  ) => {
    try {
      const catalogueItem = getCatalogueItemByKey(documentTypeCustomized);
      if (catalogueItem === undefined)
        throw new Error('No existe el item en el catálogo.');

      const documentType: number = catalogueItem.codigo;

      const membershipResult = await GetMembership({
        documentNumber: documentNumber,
        documentType: documentType,
        phoneNumber: '000000000',
        screenName: 'RegisterUserDocumentScreen-index.tsx',
      });

      switch (membershipResult.type) {
        case 'USER_FRAUDULENT':
          setShowAlert(true);
          break;
        case 'USER_IS_NOT_A_MEMBER':
          setShowNormalErrorAlert(true);
          break;
        case 'USER_DOESNT_HAVE_AN_ACTIVE_PRODUCT':
          setShowNormalErrorAlert(true);
          break;
        case 'USER_EXISTS':
          setShowNormalErrorAlert(true);
          break;
        case 'MAX_LIMIT_ATTEMPTS':
          navigation.navigate('InfoDNINotRecognizedMaxAttempt');
          break;
        case 'GO_TO_ONBOARDING': {
          Dynatrace.identifyUser(
            `${padStart(
              documentType.toString(),
              2,
              '0',
            )}${documentNumber}-Registro Onboarding`,
          );
          navigation.navigate('RegisterUserInfo', {
            personId: membershipResult.personId,
            documentType,
            documentNumber,
            gender: membershipResult.gender,
            firstName: membershipResult.firstName,
            secondName: '',
            firstSurname: '',
            secondSurname: '',
            stepProps: {
              max: 3,
              current: 0,
            },
          });
          clearForm();
          break;
        }
        case 'GO_TO_PRE_AGENCY': {
          Dynatrace.identifyUser(
            `${padStart(
              documentType.toString(),
              2,
              '0',
            )}${documentNumber}-Registro PreAgencia`,
          );
          
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
            const result = await sendOtpToPhone(
              membershipResult.phoneNumber,
              route.name,
              {
                documentNumber: documentNumber,
                documentType: documentType
              }
            );
            if (result.type === 'MAX_LIMIT') showMaxLimit = true;
            restart({documentNumber, documentType});
          }
          navigation.navigate('RegisterOTP', {
            type: 'REGISTER',
            showMaxLimit: showMaxLimit,
            personId: undefined,
            stage: 'AGENCY',
            gender: membershipResult.gender,
            documentNumber,
            documentType,
            isSensitiveInfo: true,
            channel: 'sms',
            email: membershipResult.email,
            phoneNumber: membershipResult.phoneNumber,
            stepProps: {
              max: 2,
              current: 0,
            },
            firstName: membershipResult.firstName,
            secondName: '',
            firstSurname: '',
            secondSurname: '',
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
      <StatusBar
        barStyle="dark-content"
        backgroundColor="white"
        translucent={true}
      />

      <Formik
        validateOnMount={true}
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={yup.object(validationSchema)}
        onSubmit={async (values, actions) => {
          await handleOnSubmit(
            values.documentType,
            values[values.documentType],
            () => actions.resetForm(),
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
            <FormPureTemplate
              footer={
                <Button
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  orientation="horizontal"
                  type="primary"
                  text="Ingresar"
                  disabled={!isValid}
                />
              }>
              <Separator size={SIZES.XS} />
              <Image
                source={require('@assets/images/logo-red.png')}
                style={styles.logo}
              />
              <Separator size={SIZES.XS * 5.5} />
              <View>
                <TextCustom
                  color="neutral-darkest"
                  variation="h3"
                  align="center"
                  lineHeight="tight">
                  Para comenzar,{'\n'}ingresa tu documento
                </TextCustom>
                <Separator size={SIZES.XS * 5} />
                <TextCustom
                  variation="h4"
                  color={
                    errors[values.documentType] !== undefined &&
                    touched[values.documentType] !== undefined
                      ? 'error-medium'
                      : 'neutral-darkest'
                  }
                  lineHeight="tight">
                  Número de DNI
                </TextCustom>
                <Separator size={SIZES.XS} />
                <Input
                  value={values[values.documentType]}
                  haveError={
                    errors[values.documentType] !== undefined &&
                    touched[values.documentType] !== undefined
                  }
                  errorMessage={errors[values.documentType]?.toString()}
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
                <Separator size={SIZES.XS * 5} />
                <View style={styles.checkboxWrapper}>
                  <Checkbox
                    type="primary"
                    size="medium"
                    value={values.termsAreAccepted}
                    onChange={value => {
                      setFieldValue('termsAreAccepted', value, true);
                    }}
                  />
                  <View style={styles.checkboxWrapperDescription}>
                    <TextCustom
                      weight="normal"
                      variation="h5"
                      color="neutral-darkest"
                      lineHeight="comfy">
                      Acepto los{' '}
                      <TextCustom
                        decoration="underline"
                        weight="normal"
                        variation="h5"
                        color="primary-dark"
                        lineHeight="comfy"
                        onPress={() => {
                          Linking.openURL(Information.TermsAndConditions);
                        }}>
                        Términos y Condiciones{' '}
                      </TextCustom>
                      y también{'\n'} las{' '}
                      <TextCustom
                        decoration="underline"
                        weight="normal"
                        variation="h5"
                        color="primary-dark"
                        lineHeight="comfy"
                        onPress={() => {
                          Linking.openURL(Information.TermsAndConditions);
                        }}>
                        Políticas de Privacidad.
                      </TextCustom>
                    </TextCustom>
                  </View>
                </View>
                <Separator size={SIZES.MD} />
                <View style={styles.checkboxWrapper}>
                  <Checkbox
                    type="primary"
                    size="medium"
                    value={values.dataUseAreAccepted}
                    onChange={value => {
                      setFieldValue('dataUseAreAccepted', value, true);
                    }}
                  />
                  <View style={styles.checkboxWrapperDescription}>
                    <TextCustom
                      weight="normal"
                      variation="h5"
                      color="neutral-darkest"
                      lineHeight="tight">
                      Acepto el{' '}
                      <TextCustom
                        decoration="underline"
                        weight="normal"
                        variation="h5"
                        color="primary-dark"
                        lineHeight="tight"
                        onPress={() => {
                          navigation.navigate('TermsAndConditions', {
                            type: 'DATAUSE_CONSENT',
                          });
                        }}>
                        uso de mis datos personales.
                      </TextCustom>
                    </TextCustom>
                  </View>
                </View>
                <Separator size={SIZES.XL} />
              </View>
            </FormPureTemplate>
          </>
        )}
      </Formik>
      <AlertBasic
        isOpen={showAlert}
        closeOnTouchBackdrop={true}
        onClose={() => setShowAlert(false)}
        title={'Lo sentimos, tenemos\ninconvenientes al ingresar'}
        description={`Estamos trabajando para solucionarlo.\nSi el problema persiste contáctanos al\n${Information.PhoneContactFormattedPretty}.`}
        actions={utils => [
          {
            id: 'button1',
            render: (
              <Button
                text="Entiendo"
                type="primary"
                onPress={() => utils.close()}
              />
            ),
          },
        ]}
      />
      <AlertBasic
        isOpen={showNormalErrorAlert}
        closeOnTouchBackdrop={true}
        onClose={() => setShowNormalErrorAlert(false)}
        title={'Lo sentimos, para continuar debes\nacercarte a una agencia'}
        description={`Para más información contáctanos al\n${Information.PhoneContactFormattedPretty}.`}
        actions={utils => [
          {
            id: 'button1',
            render: (
              <Button
                text="Entiendo"
                type="primary"
                onPress={() => utils.close()}
              />
            ),
          },
          {
            id: 'button2',
            render: (
              <Button
                text="Contáctanos"
                type="primary-inverted"
                haveBorder
                onPress={() => {
                  utils.close();
                  Linking.openURL(`tel:${Information.PhoneContact}`);
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    logo: {
      height: 55,
      alignSelf: 'center',
      resizeMode: 'contain',
    },
    container: {
      backgroundColor: COLORS.Background.Lightest,
    },
    checkboxWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkboxWrapperDescription: {
      marginLeft: SIZES.XS,
    },
  });

  return stylesBase;
};
