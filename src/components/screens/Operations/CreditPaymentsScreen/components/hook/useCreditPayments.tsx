import React, {JSXElementConstructor, ReactElement, ReactFragment} from 'react';
import {Credit, Saving} from '@features/userInfo';
import {useUserInfo} from '@hooks/common';
import {CreditPayments, PaymentInterfaceRes} from '@interface/Credit';
import {PickerItemProps} from '@molecules/extra/Picker/types';
import {CreditPaymentsScreenProps} from '@navigations/types';
import {
  getCreditPayments,
  getUserCredits,
  getUserSavings,
  payCredit,
  validatePooledAccount,
} from '@services/User';
import {COLORS} from '@theme/colors';
import {FONTS, FontSizes, FontTypes} from '@theme/fonts';
import {FC, ReactNode, useEffect, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {getSchedulesTextFormat} from '@utils/getSchedules';

type AccountType = 'valid' | 'outOfTime' | 'jointly';

interface Options {
  show: boolean;
  disabled: boolean;
  active: boolean;
  value: number | null;
}

interface OptionsObject {
  option1: Options;
  option2: Options;
}

interface HandleOtherAmountErrorProps {
  amount: number | null;
  maxAmount: number;
}

interface SavingItems extends PickerItemProps {
  nValue: number;
  accountCode: string;
}

interface IValues {
  accountCode: string;
}

interface IScheduleError {
  title: string;
  content: string[];
  schedules: string[] | null;
}

interface IOperationValue {
  amountToPay: number | null;
  currencyToPay: string | undefined;
  creditProductName: string | undefined;
  savingProductName: any;
  accountCode: string | undefined;
  accountNumber: any;
  amountInstallments: number | undefined;
  Installments: string | undefined;
  isPayingOtherAmount: boolean | undefined;
}

export interface ICardInfo {
  title: string | null;
  subtitle:
    | string
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | null;
  ammountLabel: string | undefined | null;
  amount: string | null;
  nAmount: number | undefined | null;
}

const useCreditPayments = ({route}: CreditPaymentsScreenProps) => {
  const {userCredits, user, setUserCredits} = useUserInfo();
  const person = user?.person;
  const [creditPayments, setCreditPayments] = useState<CreditPayments | null>(
    null,
  );
  const [savings, setSavings] = useState<PickerItemProps[] | null>(null);
  const [options, setOptions] = useState<OptionsObject>({
    option1: {show: true, disabled: false, active: true, value: null},
    option2: {show: true, disabled: false, active: false, value: 0},
  });
  const [currentSelectedAccount, setCurrentSelectedAccount] = useState<
    number | null
  >(null);
  const [currentSaveAccountInfo, setCurrentSaveAccountInfo] =
    useState<any>(null);
  const [currentAmount, setCurrentAmount] = useState<number | null>(null);
  const [amountValidate, setAmountValidate] = useState<boolean>(false);
  const [showModal, setShowModal] = useState({
    unsupportedAccount: false,
    paymentReceipt: false,
    scheduleError: false,
    payError: false,
    validateAmountError: false,
  });

  const [values, setValues] = useState<IValues>({accountCode: ''});
  const [creditStep, setCreditStep] = useState<number>(0);
  const [operationValue, setOperationValue] = useState<IOperationValue | null>(
    null,
  );
  const [payCreditValues, setPayCreditValues] =
    useState<PaymentInterfaceRes | null>();
  const [loading, setLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<IScheduleError | null>(
    null,
  );
  const [cardInfo, setCardInfo] = useState<ICardInfo>({
    title: null,
    subtitle: null,
    ammountLabel: null,
    amount: null,
    nAmount: null,
  });

  const operationSummary = () => {
    const creditInfo: Credit[] | undefined =
      userCredits?.individualCredits.filter(
        credit => credit.accountCode === route?.params?.accountNumber,
      );
    let currency = creditInfo && creditInfo[0].currency;
    const operationData = {
      amountToPay: currentAmount,
      currencyToPay: currency,
      creditProductName: creditInfo && creditInfo[0].productName,
      savingProductName: currentSaveAccountInfo.title,
      accountCode: creditInfo && creditInfo[0].accountCode,
      accountNumber: currentSaveAccountInfo.accountCode,
      amountInstallments: creditInfo && creditInfo[0].amountInstallments,
      Installments: creditPayments?.existsInstallmentDue
        ? creditPayments?.textAllInstallments
        : creditPayments?.listInstallments[0].number.toString(),
      isPayingOtherAmount: options.option2.active,
    };
    setOperationValue(operationData);
  };

  useEffect(() => {
    if (!creditPayments || !savings) {
      getAccountDetail();
      getSavings();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  const clearStates = () => {
    setCreditPayments(null);
    setSavings(null);
    setOptions({
      option1: {show: true, disabled: false, active: true, value: null},
      option2: {show: true, disabled: false, active: false, value: 0},
    });
    setCurrentSelectedAccount(null);
    setCurrentSaveAccountInfo(null);
    setCurrentAmount(null);
    setAmountValidate(false);
    setShowModal({
      unsupportedAccount: false,
      paymentReceipt: false,
      scheduleError: false,
      payError: false,
      validateAmountError: false,
    });
    setValues({accountCode: ''});
    setCreditStep(0);
    setOperationValue(null);
    setPayCreditValues(null);
  };

  useEffect(() => {
    if (
      (currentSelectedAccount || currentSelectedAccount === 0) &&
      (currentAmount || currentAmount === 0)
    ) {
      if (currentSelectedAccount < currentAmount) {
        setAmountValidate(true);
      } else {
        setAmountValidate(false);
      }
    } else {
      setAmountValidate(true);
    }
  }, [currentAmount, currentSelectedAccount]);

  useEffect(() => {
    if (creditPayments) {
      handleCardInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditPayments]);

  const getSavings = async () => {
    const _savings = await getUserSavings({
      personUid: user?.person?.personUId,
    } as any);

    if (_savings.savings && _savings.savings.savings) {
      let newArr: SavingItems[] = _savings.savings.savings
        .filter((e: Saving) => e.canPay && e.currency === route.params.currency)
        .sort((a: Saving, b: Saving) => b.balance - a.balance)
        .map((e: Saving) => {
          return {
            title: e.productName,
            subtitle: e.accountCode,
            value: `${e.currency} ${e.sBalance}`,
            nValue: e.balance,
            canPay: e.canPay,
            accountCode: e.accountCode,
          };
        });

      setSavings(newArr);

      setValues({...values, accountCode: newArr[0].accountCode});
      setCurrentSelectedAccount(newArr[0].nValue);
      setCurrentSaveAccountInfo(newArr[0]);
    }
  };

  const getAccountDetail = async () => {
    const _creditPayments: CreditPayments = await getCreditPayments({
      accountCode: route?.params?.accountNumber,
      user: `0${person?.documentTypeId}${person?.documentNumber}`,
      screen: route.name,
    });
    setCreditPayments(_creditPayments);
    setCurrentAmount(_creditPayments?.sumAmountInstallments);
  };

  const handleCardInfo = () => {
    let title = '';
    let subtitle: string | ReactNode = '';
    let ammountLabel;
    let amount = `${route.params.currency} ${
      creditPayments!.sSumAmountInstallments
    }`;
    let nAmount = creditPayments!.sumAmountInstallments;

    if (creditPayments!.existsInstallmentDue) {
      title = 'Cuotas pendientes';
      subtitle = (
        <Text style={{...styles.subtitle, fontSize: 12}}>
          Cuota actual +{' '}
          <Text style={{color: COLORS.Error.Medium}}>vencidas</Text>
        </Text>
      );
      ammountLabel = 'Hasta hoy';
    } else {
      title = `Cuota ${creditPayments!.textAllInstallments}`;
      subtitle =
        'Vence el ' + creditPayments!.listInstallments[0].expirationDate;
    }

    setCardInfo({
      title,
      subtitle,
      ammountLabel,
      amount,
      nAmount,
    });

    return {
      title,
      subtitle,
      ammountLabel,
      amount,
      nAmount,
    };
  };

  const hasAmountError = (
    amount: number | null,
    maxAmount: number,
  ): boolean => {
    if (amount) {
      if (amount < 1) {
        return true;
      } else if (amount > maxAmount) {
        return true;
      }
    }
    return false;
  };

  const handleOtherAmountError: FC<HandleOtherAmountErrorProps> = ({
    amount,
    maxAmount,
  }) => {
    if (amount) {
      if (amount < 1) {
        return (
          <Text style={styles.otherAmountText}>
            {`El monto mínimo que puedes ingresar es ${route.params.currency} 1.00.`}
          </Text>
        );
      } else if (amount > maxAmount) {
        return (
          <Text style={styles.otherAmountText}>
            {'El monto máximo que puedes ingresar es ' +
              route.params.currency +
              ' ' +
              maxAmount +
              '.'}
          </Text>
        );
      }
    }
    return <></>;
  };

  const handleOnSelect = async (savingAccountSelected: SavingItems) => {
    setCurrentSelectedAccount(savingAccountSelected.nValue);
    setCurrentSaveAccountInfo(savingAccountSelected);
    setValues({...values, accountCode: savingAccountSelected.accountCode});
    const account = await isInValidAccount(savingAccountSelected.accountCode);
    if (account === 'jointly')
      setShowModal({...showModal, unsupportedAccount: true});
    else if (account === 'outOfTime')
      setShowModal({...showModal, scheduleError: true});
  };

  const isInValidAccount = async (
    accountCode: string,
  ): Promise<AccountType> => {
    const validate = await validatePooledAccount({
      accountCode: accountCode,
      user: `0${person?.documentTypeId}${person?.documentNumber}`,
      screen: route.name,
    });

    if (validate && validate.jointlySaving) {
      return 'jointly';
    }
    if (validate && validate.content) {
      const {schedules, content} = getSchedulesTextFormat(validate.content);
      setScheduleError({
        title: validate.title,
        schedules,
        content,
      });
      return 'outOfTime';
    }
    return 'valid';
  };

  const handleSubmit = async () => {
    const accountType = await isInValidAccount(values.accountCode);
    if (accountType === 'jointly')
      setShowModal({...showModal, unsupportedAccount: true});
    else if (accountType === 'outOfTime')
      setShowModal({...showModal, scheduleError: true});
    else if (currentAmount && currentAmount < 1 )
      setShowModal({...showModal, validateAmountError: true});
    else {
      setCreditStep(1);
      operationSummary();
    }
  };

  const handlePay = async () => {
    setLoading(true);
    const _payCredit = await payCredit({
      payload: {
        creditNumber: `${operationValue?.accountCode}`,
        accountSaving: `${operationValue?.accountNumber}`,
        amountPay: operationValue?.amountToPay ?? 0,
        currency: operationValue?.currencyToPay === 'S/' ? 1 : 2,
        isAnotherAmountPay: operationValue?.isPayingOtherAmount ?? false,
        typeAccountSaving: operationValue?.savingProductName,
        totalInstallments: operationValue?.amountInstallments ?? 0,
        typeCredit: operationValue?.creditProductName ?? '',
      },
      user: `0${person?.documentTypeId}${person?.documentNumber}`,
      screen: route.name,
    }).catch(e => {
      console.log('e', e);
      setLoading(false);
      setShowModal({...showModal, payError: true});
    });
    if (_payCredit) {
      if (_payCredit?.content) {
        const {schedules, content} = getSchedulesTextFormat(_payCredit.content);
        setShowModal({...showModal, scheduleError: true});
        setScheduleError({
          title: _payCredit.title,
          schedules,
          content,
        });
        setLoading(false);
      } else {
        const _userCredits = await getUserCredits(
          user?.person.documentTypeId,
          user?.person.documentNumber,
        );
        setLoading(false);
        setPayCreditValues(_payCredit);
        setUserCredits(_userCredits);
        setShowModal({...showModal, paymentReceipt: true});
      }
    } else {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    safeAreaView: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    header__container: {
      backgroundColor: '#FFFFFF',
      shadowColor: '0px 2px 8px rgba(0, 0, 0, 0.15);',
      height: 56,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    header__back: {
      position: 'absolute',
      top: 18,
      left: 19,
    },
    header__title: {
      color: '#222D42',
      fontFamily: FontTypes.Bree,
      fontSize: FontSizes.Paragraph,
      fontWeight: '500',
    },
    stepText: {
      fontFamily: FontTypes.Bree,
      fontWeight: '500',
      fontSize: 14,
      color: '#97A3B6',
    },
    title: {
      fontFamily: FontTypes.Bree,
      fontWeight: '500',
      fontSize: 24,
      color: '#CA005D',
    },
    subtitle: {
      fontFamily: FontTypes.Bree,
      fontWeight: '500',
      fontSize: 16,
      color: '#222D42',
    },
    warningText: {
      fontFamily: FontTypes.AmorSansPro,
      fontWeight: '400',
      color: '#222D42',
      fontSize: 16,
    },
    payment__container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 16,
      height: 80,
      borderWidth: 0,
      backgroundColor: '#F6F6F9',
      borderColor: '#97A3B6',
      borderStyle: 'solid',
      borderRadius: 8,
    },
    payment__container__debt: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#97A3B6',
      borderStyle: 'solid',
    },
    payment__text: {
      fontFamily: FontTypes.Bree,
      fontWeight: '500',
      fontSize: FontSizes.Button,
      letterSpacing: 0.01,
      color: '#222D42',
    },
    otherAmountText: {
      fontFamily: FONTS.AmorSansPro,
      fontSize: 14,
      fontWeight: '400',
      color: '#E42525',
      marginTop: 8,
    },
  });

  return {
    styles,
    savings,
    values,
    options,
    amountValidate,
    currentAmount,
    creditPayments,
    creditStep,
    showModal,
    operationValue,
    loading,
    handleOtherAmountError,
    payCreditValues,
    scheduleError,
    cardInfo,
    setLoading,
    setShowModal,
    setOptions,
    setValues,
    setAmountValidate,
    setCreditPayments,
    setCreditStep,
    setCurrentSelectedAccount,
    setCurrentAmount,
    setScheduleError,
    handleCardInfo,
    hasAmountError,
    handleOnSelect,
    isInValidAccount,
    setOperationValue,
    handleSubmit,
    handlePay,
    clearStates,
    setCardInfo,
  };
};

export default useCreditPayments;
