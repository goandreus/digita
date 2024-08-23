/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import Button from '@atoms/extra/Button';
import Input from '@atoms/extra/Input';
import {PickerSimple} from '@atoms/extra/PickerSimple';
import TextCustom from '@atoms/extra/TextCustom';
import FormBasicTemplate from '@templates/extra/FormBasicTemplate';
import {SIZES} from '@theme/metrics';
import {Formik} from 'formik';
import React, {useEffect, useMemo, useState} from 'react';
import _ from 'lodash';
import SimpleCurrencyInput from 'react-native-currency-input';
import {COLORS} from '@theme/colors';
import Separator from '@atoms/extra/Separator';
import {View} from 'react-native';
import {
  AsubstractB,
  convertToCurrencyWithoutRounding,
} from '@utils/convertCurrency';
import {useUserInfo} from '@hooks/common';
import {GetDebts, getRechargeCompanies} from '@services/Transactions';
import yup from '@yup';
import AlertBasic from '@molecules/extra/AlertBasic';
import {useAppSelector} from '@hooks/useAppSelector';
import {IDebts, IDebt} from '../../../../features/categoryInPayment/types';
import {useNavigation} from '@react-navigation/native';
import {PhoneRechargeScreenProps} from '@navigations/types';

interface IValues {
  phoneNumber: string;
  companyId: string;
  amount: number;
  accountId: string;
}
interface ICompany {
  attentionSchedule: string;
  code: string;
  commission: number;
  groupId: string;
  isAvailable: boolean;
  name: string;
  serviceId: string;
  companyName: string;
  serviceName: string;
}

const PhoneRechargeScreen = ({navigation, route}: PhoneRechargeScreenProps) => {
  const {userSavings} = useUserInfo();
  const userDocumentNumber = useAppSelector(
    state => state.user?.user?.person?.documentNumber,
  );
  const userDocumentType = useAppSelector(
    state => state.user?.user?.person?.documentTypeId,
  );

  const [companies, setCompanies] = useState<ICompany[]>();
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [debts, setDebts] = useState<IDebts>();
  const [loading, setLoading] = useState<boolean>(false);
  const [modals, setModals] = useState({
    notFound: false,
  });
  const [hasComission, setHasComission] = useState(false);

  useEffect(() => {
    getCompanies();
  }, []);

  const accountsFormattedArray = useMemo(() => {
    if (userSavings === null) return [];

    const _new = [...userSavings.savings.savings]
      .filter(i => i.currency === 'S/' && i.accountType !== 'C')
      .sort((a, b) => b.balance - a.balance)
      .map((item, index) => ({
        id: index.toString(),
        accountTitle: item.productName,
        accountNumber: item.accountCode,
        accountAmount: item.balance,
      }));

    return _new;
  }, [userSavings]);

  const defaultAccountId = useMemo(() => {
    if (accountsFormattedArray.length > 0) return accountsFormattedArray[0].id;
  }, [accountsFormattedArray]);

  const getCompanies = async () => {
    const _companies = await getRechargeCompanies({
      documentNumber: userDocumentNumber,
      documentType: userDocumentType,
    });
    setCompanies(_companies);
  };

  const mapCompanies = (_companies: ICompany[]) => {
    return _companies.map(i => {
      return {
        id: i.code,
        label: _.capitalize(i.name),
        codeName: _.capitalize(i.name),
      };
    });
  };

  const checkPhoneNumber = async (phoneNumber: string, companyId: string) => {
    if (phoneNumber.startsWith('9') && phoneNumber.length === 9 && companyId) {
      setLoading(true);
      setShowPayment(false);

      let _company = companies?.find(i => companyId === i.code);
      if (_company === undefined) return;
      const _debts = await GetDebts({
        company: {
          code: _company!.code,
          groupId: _company!.groupId,
        },
        service: {
          serviceId: _company.serviceId,
          supplyNumber: phoneNumber,
        },
        user: {
          documentNumber: userDocumentNumber!,
          documentType: userDocumentType!,
        },
        screeName: 'Recarga celular',
      });
      setLoading(false);
      setDebts(_debts);
      if (_debts.list.length >= 1) {
        if (_debts.list[0].totalCommission > 0) {
          setHasComission(true);
        } else {
          setHasComission(false);
        }

        setShowPayment(true);
      } else {
        setModals({...modals, notFound: true});
      }
    }
  };

  const validateSchema = (values: IValues) => {
    let errors: {[key: string]: string} = {};
    let debt: any = {};

    if (debts?.list && debts.list.length > 0) {
      debt = debts.list[0];

      if (debt.minimumAmount > values.amount) {
        errors.amount = `El monto mínimo que puedes ingresar es S/ ${debt.minimumAmount.toFixed(
          2,
        )}`;
      } else if (debt.maximumAmount < values.amount) {
        errors.amount = `El monto máximo que puedes ingresar es S/ ${debt.maximumAmount.toFixed(
          2,
        )}`;
      }

      if (accountsFormattedArray) {
        const account = accountsFormattedArray.find(
          i => values.accountId === i.id,
        );

        if (account !== undefined && debt !== undefined) {
          if (account.accountAmount < values.amount)
            errors.accountId = 'Esta cuenta no tiene saldo suficiente.';
        }
      }
    }
    if (!values.amount) errors.amount = 'Es obligatorio completar este dato.';

    if (!values.companyId)
      errors.companyId = 'Es obligatorio completar este dato.';

    if (values.phoneNumber.length !== 9) {
      errors.phoneNumber = 'Ingresa un número válido.';
    } else if (!values.phoneNumber.startsWith('9')) {
      errors.phoneNumber = 'Ingresa un número válido.';
    }
    return errors;
  };

  const handleSubmit = (values: IValues) => {
    const account = accountsFormattedArray.find(i => values.accountId === i.id);
    const company = companies?.find(i => i.code === values.companyId);
    let totalAmount = values.amount;

    const companyName = company?.companyName || '';
    const serviceName = company?.serviceName || '';
    /* if (debts!.list[0].totalCommission > 0) {
      totalAmount = totalAmount + debts!.list[0].totalCommission;
    } */

    navigation.navigate('PayServiceConfirmation', {
      stage: 'RECHARGE_PHONE',
      title: 'Recarga Celular',
      totalAmount: totalAmount,
      companyName: companyName,
      serviceType: serviceName,
      serviceName: serviceName,
      serviceCode: values.phoneNumber,
      serviceAmount: values.amount - debts!.list[0].totalCommission,
      completeName: debts?.clientname || '',
      accountName: account?.accountTitle ?? '',
      accountNumber: account?.accountNumber ?? '',
      stepsProps: {current: 1, max: 2, previous: 0},
      operationNumber: debts?.list[0].invoiceNumber || '',
      serviceArrears: 0,
      serviceFee:
        debts!.list[0].totalCommission > 0 ? debts?.list[0].totalCommission : 0,
    });
  };

  return (
    <Formik
      onSubmit={() => {}}
      initialValues={{
        phoneNumber: '',
        companyId: '',
        amount: 0,
        accountId:
          accountsFormattedArray.length > 0
            ? accountsFormattedArray[0].id
            : '0',
      }}
      /*  validationSchema={yup.object({
        phoneNumber: yup
          .string()
          .startsWith('9', 'El número de celular debe empezar con 9')
          .length(9, 'El número de celular debe tener 9 dígitos')
          .required('Es obligatorio completar este dato'),
        amount: yup.number(),
      })} */
      validate={validateSchema}
      validateOnChange
      enableReinitialize>
      {({
        values,
        errors,
        touched,
        setValues,
        setFieldTouched,
        isValid,
        dirty,
      }) => (
        <FormBasicTemplate
          title="Recarga de celular"
          stepsProps={{current: 0, max: 2}}
          footer={
            <Button
              onPress={() => {
                handleSubmit(values);
              }}
              loading={false}
              orientation="horizontal"
              type="primary"
              text="Continuar"
              disabled={!isValid || !dirty}
            />
          }>
          <TextCustom
            text="Número de celular"
            variation="h4"
            weight="normal"
            color="neutral-darkest"
            style={{marginBottom: 8}}
          />
          <Input
            keyboardType="decimal-pad"
            placeholder="Ingresa el número de celular"
            value={values.phoneNumber}
            onChange={val => {
              setFieldTouched('phoneNumber', true);
              if (val === '' || /^\d+$/.test(val)) {
                if (values.companyId) {
                  checkPhoneNumber(val, values.companyId);
                  setValues({...values, amount: 0, phoneNumber: val});
                  setFieldTouched('amount', false);
                } else {
                  setValues({...values, phoneNumber: val});
                }
              }
            }}
            onBlur={() => {
              setFieldTouched('phoneNumber', true);
            }}
            errorMessage={errors.phoneNumber}
            haveError={
              errors.phoneNumber !== undefined &&
              touched.phoneNumber !== undefined
            }
            editable={!loading}
            maxLength={9}
          />

          <TextCustom
            text="Operador"
            variation="h4"
            weight="normal"
            color="neutral-darkest"
            style={{marginBottom: 8, marginTop: 28}}
          />
          <PickerSimple
            placeholder="Selecciona"
            data={mapCompanies(companies ?? [])}
            modalTitle="Selecciona operador"
            onSelectItem={i => {
              setFieldTouched('companyId', true);

              if (values.phoneNumber) {
                checkPhoneNumber(values.phoneNumber, i.id);
                setValues({...values, amount: 0, companyId: i.id});
                setFieldTouched('amount', false);
              } else {
                setValues({...values, companyId: i.id});
              }
            }}
            onRenderItem={item => (
              <TextCustom
                variation="h5"
                weight="normal"
                lineHeight="tight"
                color="neutral-darkest"
                style={{paddingVertical: SIZES.LG}}>
                {_.capitalize(item.label)}
              </TextCustom>
            )}
            style={{borderRadius: 4}}
            disabled={loading}
          />

          {showPayment ? (
            <>
              <View>
                {hasComission && debts ? (
                  <>
                    <TextCustom
                      text="Comisión"
                      variation="h4"
                      weight="normal"
                      style={{marginBottom: 8, marginTop: 28, color: '#97A3B6'}}
                    />
                    <SimpleCurrencyInput
                      textAlign={'left'}
                      style={{
                        borderColor: '#97A3B6',
                        color: '#97A3B6',
                        borderWidth: 1,
                        borderRadius: 4,
                        height: 56,
                        padding: 16,
                      }}
                      value={debts.list[0].totalCommission}
                      onChangeValue={() => {}}
                      onChangeText={() => {}}
                      prefix="S/ "
                      delimiter=","
                      separator="."
                      precision={2}
                      selectionColor={'#97A3B6'}
                      placeholder="S/ 00.00"
                      placeholderTextColor={COLORS.Neutral.Dark}
                      editable={false}
                    />
                  </>
                ) : null}
                <TextCustom
                  text="Monto"
                  variation="h4"
                  weight="normal"
                  color="neutral-darkest"
                  style={{marginBottom: 8, marginTop: 28}}
                />
                <SimpleCurrencyInput
                  textAlign={'left'}
                  maxValue={99999999999999.99}
                  style={{
                    borderColor:
                      errors.amount && touched.amount ? '#E42525' : '#97A3B6',
                    borderWidth: 1,
                    borderRadius: 4,
                    height: 56,
                    padding: 16,
                    color: 'black',
                  }}
                  value={values.amount}
                  onChangeValue={val => {
                    setFieldTouched('amount', true);
                    setValues({...values, amount: val ?? 0});
                  }}
                  onChangeText={() => {}}
                  prefix="S/ "
                  delimiter=","
                  separator="."
                  precision={2}
                  selectionColor={'#97A3B6'}
                  placeholder="S/ 00.00"
                  placeholderTextColor={COLORS.Neutral.Dark}
                  /* maxValue={debts!.list[0].maximumAmount}
                minValue={debts!.list[0].minimumAmount} */
                  editable={true}
                />
                {errors.amount && touched.amount ? (
                  <TextCustom
                    text={errors.amount}
                    variation="p5"
                    weight="normal"
                    color="error-medium"
                    style={{marginTop: 6}}
                  />
                ) : undefined}
              </View>

              <TextCustom
                text="Elige la cuenta de cargo"
                variation="h4"
                weight="normal"
                color="neutral-darkest"
                style={{marginBottom: 8, marginTop: 28}}
              />
              <PickerSimple
                errorMessage={errors.accountId}
                modalTitle="Elige una cuenta"
                data={accountsFormattedArray}
                defaultId={defaultAccountId}
                onSelectItem={item => {
                  setFieldTouched('accountId', true);
                  setValues({...values, accountId: item.id});
                }}
                onRenderItemSelected={item => (
                  <View
                    style={{
                      paddingVertical: SIZES.LG,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexShrink: 1,
                      flexGrow: 1,
                    }}>
                    <View
                      style={{
                        flexShrink: 1,
                        marginRight: SIZES.XS,
                      }}>
                      <TextCustom
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        variation="h5"
                        color="neutral-darkest"
                        lineHeight="tight">
                        {item.accountTitle}
                      </TextCustom>
                      <Separator size={SIZES.XS / 2} />
                      <TextCustom
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        variation="h6"
                        color="neutral-dark"
                        lineHeight="tight">
                        {item.accountNumber}
                      </TextCustom>
                    </View>
                    <TextCustom
                      variation="h4"
                      color="neutral-darkest"
                      lineHeight="tight">
                      S/ {convertToCurrencyWithoutRounding(item.accountAmount)}
                    </TextCustom>
                  </View>
                )}
                onRenderItem={item => (
                  <View
                    style={{
                      paddingVertical: SIZES.LG,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexShrink: 1,
                        marginRight: SIZES.XS / 2,
                      }}>
                      <TextCustom
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        variation="h5"
                        color="neutral-darkest"
                        lineHeight="tight">
                        {item.accountTitle}
                      </TextCustom>
                      <Separator size={SIZES.XS / 2} />
                      <TextCustom
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        variation="h6"
                        color="neutral-dark"
                        lineHeight="tight">
                        {item.accountNumber}
                      </TextCustom>
                    </View>
                    <TextCustom
                      variation="h4"
                      color="neutral-darkest"
                      lineHeight="tight">
                      S/ {convertToCurrencyWithoutRounding(item.accountAmount)}
                    </TextCustom>
                  </View>
                )}
              />
            </>
          ) : null}
          <AlertBasic
            onTouchBackdrop={() => {
              setModals({...modals, notFound: false});
            }}
            closeOnTouchBackdrop={true}
            isOpen={modals.notFound}
            title="Lo sentimos"
            description="El número de celular ingresado no pertenece al operador seleccionado. Verifica que los datos y vuelve a intentar."
            actions={utils => [
              {
                id: 'button1',
                render: (
                  <Button
                    text="Entiendo"
                    type="primary"
                    onPress={() => {
                      setModals({...modals, notFound: false});
                    }}
                  />
                ),
              },
            ]}
          />
        </FormBasicTemplate>
      )}
    </Formik>
  );
};

export default PhoneRechargeScreen;
