import useForm, {FormError} from '@hooks/useForm';
import {isEmpty} from '@utils/isEmpty';
import {validateText} from '@utils/validateText';
import {validateTextNumber} from '@utils/validateTextNumber';
import {useRef} from 'react';

interface FormState {
  destinationAccountNumber: string;
  destinationAccountName: string;
  documentNumber: string;
  documentType: string;
  accountOwner: boolean;
  formatAmount: string;
  amount: number | null;
}

const validateAccount = (destinationAccountNumber: string) => {
  const regex = /^[0-9]*$/;
  return regex.test(destinationAccountNumber);
};

export const useFormDestinationOtherBanks = () => {
  const bankCodes = useRef<Map<number, string> | null>(null);
  const {values, errors, touched, clear, ...form} = useForm<FormState>({
    initialValues: {
      destinationAccountNumber: '',
      destinationAccountName: '',
      documentNumber: '',
      documentType: '',
      accountOwner: false,
      formatAmount: '',
      amount: null,
    },
    validate: formState => {
      const newErrors: FormError<FormState> = {};

      const isDNI = formState.documentType === '1';
      const isCE = formState.documentType === '2';
      const isRUC = formState.documentType === '9';

      if (!formState.accountOwner) {
        if (isEmpty(formState.destinationAccountName)) {
          newErrors.destinationAccountName = 'Este campo es requerido';
        }

        if (!validateText(formState.destinationAccountName)) {
          newErrors.destinationAccountName =
            'Solo puedes ingresar letras y tildes';
        }

        if (isEmpty(formState.documentType)) {
          newErrors.documentType = 'Este campo es requerido';
        }
        if (isEmpty(formState.documentNumber)) {
          newErrors.documentNumber = 'Este campo es requerido';
        }

        if (isDNI) {
          if (formState.documentNumber.length !== 8) {
            newErrors.documentNumber = 'El DNI debe tener 8 digitos.';
          }
          if (!validateAccount(formState.documentNumber)) {
            newErrors.documentNumber = 'El DNI no es válido.';
          }
          if (formState.documentNumber === '00000000') {
            newErrors.documentNumber =
              'El numero de DNI ingresado no es  válido.';
          }
        }
        if (isCE) {
          if (
            formState.documentNumber.length < 9 ||
            formState.documentNumber.length > 12
          ) {
            newErrors.documentNumber =
              'El CE debe tener entre 9 a 12 caracteres';
          }
          if (!validateTextNumber(formState.documentNumber)) {
            newErrors.documentNumber = 'El CE no es válido.';
          }

          if (formState.documentNumber === '000000000') {
            newErrors.documentNumber =
              'El numero de CE ingresado no es  válido.';
          }
          if (formState.documentNumber === '0000000000') {
            newErrors.documentNumber =
              'El numero de CE ingresado no es  válido.';
          }

          if (formState.documentNumber === '00000000000') {
            newErrors.documentNumber =
              'El numero de CE ingresado no es  válido.';
          }
          if (formState.documentNumber === '000000000000') {
            newErrors.documentNumber =
              'El numero de CE ingresado no es  válido.';
          }
        }
        if (isRUC) {
          if (formState.documentNumber.length !== 11) {
            newErrors.documentNumber = 'El RUC debe tener 11 digitos';
          }
          if (
            formState.documentNumber.slice(0, 2) !== '10' &&
            formState.documentNumber.slice(0, 2) !== '20'
          ) {
            newErrors.documentNumber = 'El RUC no es válido.';
          }
          if (!validateAccount(formState.documentNumber)) {
            newErrors.documentNumber = 'El RUC no es válido.';
          }
          if (formState.documentNumber === '00000000000') {
            newErrors.documentNumber =
              'El numero de RUC ingresado no es  válido.';
          }
        }
      }

      if (formState.amount && formState.amount < 1) {
        newErrors.amount = 'El monto debe ser mayor a S/ 1';
      }
      if (formState.destinationAccountNumber.length !== 20) {
        newErrors.destinationAccountNumber =
          'La cuenta destino debe tener 20 dígitos.';
      }
      if (
        formState.destinationAccountNumber.length === 20 &&
        isNaN(+formState.destinationAccountNumber)
      ) {
        newErrors.destinationAccountNumber = 'Debe ingresar solo números.';
      }
      if (!validateAccount(formState.destinationAccountNumber)) {
        newErrors.destinationAccountNumber =
          'El número de cuenta destino ingresado no es válido.';
      }
      if (
        formState.destinationAccountNumber.length === 20 &&
        !isNaN(+formState.destinationAccountNumber) &&
        !isEmpty(formState.destinationAccountNumber)
      ) {
        const code = parseInt(formState.destinationAccountNumber.slice(0, 3));

        if (!bankCodes?.current?.has(code)) {
          newErrors.destinationAccountNumber =
            'El número de cuenta destino ingresado no es válido.';
        }
      }

      return newErrors;
    },
  });

  return {
    values,
    errors,
    touched,
    form,
    bankCodes,
    clear,
  };
};
