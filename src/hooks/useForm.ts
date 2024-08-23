import {useCallback, useState} from 'react';
import {useAppSelector} from './useAppSelector';

export type FormTouched<T> = Partial<Record<keyof T, boolean>>;
export type FormError<T> = Partial<Record<keyof T, string | undefined>>;

export type SelectPropsOptions<T> = {
  resetFields: {
    [P in keyof T]?: T[P];
  };
};

interface Props<T> {
  initialValues: T;
  validate?: (values: T) => FormError<T>;
}


const useForm = <T extends object>({validate, initialValues}: Props<T>) => {
  const userInfo = useAppSelector(state => state.user.user);
  // const [isDirty, setIsDirty] = useState(false);
  const [state, setState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormError<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});

  const validateErrorsByField = useCallback(
    <K extends keyof T>(name: K, newState: Partial<T>) => {
      if (typeof validate === 'function') {
        const newErrors = validate({...state, ...newState});

        setErrors(prevErrors => {
          if (!newErrors[name]) {
            let tempErrors = prevErrors;
            delete tempErrors[name];
            return tempErrors;
          }

          return {...prevErrors, [name]: newErrors[name]};
        });
      }
    },
    [state],
  );

  // Settings values
  const clear = useCallback(() => {
    setErrors({});
    setTouched({});
    // setIsDirty(false);
    setState(initialValues);
  }, []);

  const setField = useCallback(
    <K extends keyof T>(
      nameOrCallback: K | ((values: T) => Partial<T>),
      value?: string | number | boolean | null,
    ) => {
      if (typeof nameOrCallback === 'function') {
        const _values = nameOrCallback(state);
        setState(prev => ({...prev, ..._values}));
        return;
      }

      setState(prev => ({...prev, [nameOrCallback]: value}));
    },
    [state],
  );

  const setFields = useCallback((values?: Partial<T>) => {
    setState(prev => ({...prev, ...values}));
  }, []);

  const handleChange = useCallback((name: string, value: string | number) => {
    switch (name) {
      case 'destinationAccount': 
        setState(prev => ({...prev, [name]: value.replace(/[^0-9]/g, '')}));
        break;
      case 'favoriteName': 
        setState(prev => ({...prev, [name]: value.replace(/^\s+|[^a-zA-Z0-9 ]/g, '')}));
        break;
      case 'searchContact': 
        setState(prev => ({...prev, [name]: value}));
        break;
      default: 
        setState(prev => ({...prev, [name]: value}));

    }
  }, []);

  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({...prev, [name]: true}));
  }, []);

  // Validate Errors
  const hasErrors = useCallback((newErrors: FormError<T>) => {
    return Object.keys(newErrors).length !== 0;
  }, []);

  // Inputs default props
  const inputProps = useCallback(
    <K extends keyof T>(name: K,destinationOtherBanks?: boolean) => {
      return {
        errorMessage: errors[name],
        haveError: !!errors[name],
        value: state[name]!,
        onBlur: () => handleBlur(name as string),
        onChange: (value: string) => {
          if(destinationOtherBanks && value === userInfo?.person.documentNumber) {
            setField('accountOwner',true)
            checkErrors({...state,accountOwner: value})
          }
          handleChange(name as string, value);
          // @ts-ignore
          validateErrorsByField(name, {[name]: value});
        },
      };
    },
    [state, errors, handleBlur, handleChange, validateErrorsByField],
  );

  // OnSubmit middleware
  const onSubmit = useCallback(
    (cb: () => void) => {
      return () => {
        if (typeof validate === 'function') {
          // toggleDirty(true);

          const newErrors = validate(state);

          setErrors(newErrors);
          if (hasErrors(newErrors)) return;

          cb();
          return;
        }

        cb();
      };
    },
    [state],
  );

  const checkErrors = useCallback(
    (newState: T) => {
      const newErrors = validate?.(newState);
      setErrors(newErrors!);
    },
    [state],
  );

  return {
    values: state,
    errors,
    touched,
    hasErrors,
    clear,
    onSubmit,
    setField,
    setFields,
    setErrors,
    setTouched,
    handleBlur,
    inputProps,
    checkErrors,
    // toggleDirty,
    handleChange,
  };
};

export default useForm;
