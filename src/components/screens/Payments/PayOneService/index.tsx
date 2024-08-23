/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {Formik} from 'formik';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import yup from '@yup';
import TextCustom from '@atoms/extra/TextCustom';
import Button from '@atoms/extra/Button';
import FormBasicTemplate from '@templates/extra/FormBasicTemplate';
import {useAppSelector} from '@hooks/useAppSelector';
import Input from '@atoms/extra/Input';
import Separator from '@atoms/extra/Separator';
import {SIZES} from '@theme/metrics';
import {Text, View} from 'react-native';
import {COLORS} from '@theme/colors';
import {FONTS, FONTS_LINE_HEIGHTS_FACTOR, FONT_SIZES} from '@theme/fonts';
import {PickerSimple} from '@atoms/extra/PickerSimple';
import _ from 'lodash';
import AlertBasic from '@molecules/extra/AlertBasic';
import {ICompany, IService} from '@features/categoryInPayment/types';
import moment from 'moment';
import {PayServiceScreenProps} from '@navigations/types';
import {GetDebts} from '@services/Transactions';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {updateDebts} from '@features/categoryInPayment';
import {useModalManager} from '@hooks/useModalManager';
import {v4 as uuid} from 'uuid';

const PATTERN = /^[a-zA-Z0-9ñÑ\-]+$/;

interface IValues {
  businessName: string;
  serviceId: string | undefined;
  serviceCode: string | undefined;
}

interface ILength {
  min?: number;
  max: number;
}

export const ServicesScreen = ({navigation, route}: PayServiceScreenProps) => {
  const category = useAppSelector(state => state.categoryInPayment);
  const [mainService, setMainService] = useState<IService | undefined>();
  const [length, setLength] = useState<ILength>({max: 0});
  const modalHandler = useModalManager([
    'NO_DEBTS',
    'REATTEMPT',
    'FAILED_REATTEMPT',
  ]);
  const [isProcessingSubmitFromModal, setIsProcessingSubmitFromModal] =
    useState<boolean>(false);
  const [isAllowedToBlockRequest, setIsAllowedToBlockRequest] =
    useState<boolean>(true);
  const refUUIDRequest = useRef<string>(uuid());
  const screen = route.name;
  const dispatch = useAppDispatch();
  const userDocumentNumber = useAppSelector(
    state => state.user?.user?.person?.documentNumber,
  );
  const userDocumentType = useAppSelector(
    state => state.user?.user?.person?.documentTypeId,
  );
  const [scheduleModal, setScheduleModal] = useState({
    open: false,
    values: {open: '', close: ''},
  });

  const services = useMemo(() => {
    if (category === null) return [];
    return category.services.map(item => ({
      id: item.id,
      label: item.label,
      codeName: item.codeName,
    }));
  }, [category?.services]);

  const defaultServiceId = useMemo(() => {
    if (services.length === 1) return services[0].id;
    return undefined;
  }, [services]);

  const getServiceCodeName = useCallback(
    (serviceId: string) => {
      return _.capitalize(
        services.find(service => service.id === serviceId)?.codeName || '',
      );
    },
    [services],
  );

  const getServiceCodePlaceholder = useCallback(
    (serviceId: string) => {
      return _.capitalize(
        services.find(service => service.id === serviceId)?.codeName || '',
      );
    },
    [services],
  );

  useEffect(() => {
    setMainService(category?.services[0]);
  }, []);

  useEffect(() => {
    handleLength(mainService?.length ?? '');
  }, [mainService]);

  const handleLength = (_length: string) => {
    if (_length.includes('-')) {
      setLength({
        min: parseInt(_length.split('-')[0], 10),
        max: parseInt(_length.split('-')[1], 10),
      });
    } else if (_length.includes('/')) {
      setLength({
        min: parseInt(_length.split('/')[0], 10),
        max: parseInt(_length.split('/')[1], 10),
      });
    } else {
      setLength({
        max: parseInt(_length, 10),
      });
    }
  };

  const initValues: IValues = useMemo(
    () => ({
      businessName: category?.businessName || '',
      serviceId: defaultServiceId,
      serviceCode: undefined,
    }),
    [category?.businessName, defaultServiceId, mainService],
  );
  const handleOnSubmit = useCallback(
    async (serviceId: string, serviceCode: string) => {
      if (category === null) return;
      const service = category.services.find(item => item.id === serviceId);
      if (service === undefined) return;
      if (userDocumentType === undefined || userDocumentNumber === undefined)
        return;

      const id = uuid();
      refUUIDRequest.current = id;
      const isGarbaged = () => refUUIDRequest.current !== id;

      try {
        if (modalHandler.current === 'REATTEMPT')
          setIsProcessingSubmitFromModal(true);

        const data = await GetDebts({
          company: {
            code: category.company.code,
            groupId: category.company.groupId,
          },
          service: {
            serviceId: service.serviceId,
            supplyNumber: serviceCode,
          },
          user: {
            documentNumber: userDocumentNumber,
            documentType: userDocumentType,
          },
          screeName: screen,
        });
        if (isGarbaged() === false) {
          const goToScreen = () => {
            const hasNoDebts = data.list.length === 0;
            if (hasNoDebts) modalHandler.actions.open('NO_DEBTS');
            else {
              dispatch(updateDebts(data));
              navigation.navigate('Debts', {
                businessName: category.company.name,
                serviceCode: serviceCode,
                serviceName: service.name,
              });
            }
          };
          if (modalHandler.current !== undefined)
            modalHandler.actions.close(goToScreen);
          else goToScreen();
        }
      } catch (error) {
        if (isGarbaged() === false) {
          if (modalHandler.current === undefined)
            modalHandler.actions.open('REATTEMPT');
          else if (modalHandler.current === 'REATTEMPT')
            modalHandler.actions.open('FAILED_REATTEMPT');
        }
      } finally {
        if (isGarbaged() === false) {
          setIsProcessingSubmitFromModal(false);
        }
      }
    },
    [category, userDocumentType, userDocumentNumber, modalHandler.current],
  );

  useLayoutEffect(() => {
    if (isProcessingSubmitFromModal) {
      setIsAllowedToBlockRequest(false);
      const id = setTimeout(() => {
        setIsAllowedToBlockRequest(true);
      }, 3000);
      return () => clearTimeout(id);
    } else setIsAllowedToBlockRequest(true);
  }, [isProcessingSubmitFromModal]);

  return (
    <>
      <Formik
        validateOnMount={true}
        initialValues={initValues}
        validationSchema={yup.object({
          businessName: yup
            .string()
            .required('Es obligatorio completar este dato.'),
          serviceId: yup
            .string()
            .required('Es obligatorio completar este dato.'),
          serviceCode: yup
            .string()
            .required('Es obligatorio completar este dato.')
            .min(length.min ?? length.max, 'Ingresa un dato válido.')
            .max(length.max, 'Ingresa un dato válido.'),
        })}
        onSubmit={async values => {
          if (
            values.serviceId === undefined ||
            values.serviceCode === undefined
          )
            return;
          await handleOnSubmit(values.serviceId, values.serviceCode);
        }}>
        {({
          setFieldTouched,
          setFieldValue,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          isSubmitting,
          resetForm,
        }) => (
          <FormBasicTemplate
            title="Pago de servicio"
            stepsProps={{current: 0, max: 3}}
            footer={
              <Button
                onPress={() => {
                  if (!mainService?.isAvailable) {
                    let open = '';
                    let close = '';
                    if (mainService?.attentionSchedule.includes('-')) {
                      const sch = mainService?.attentionSchedule.split(' - ');
                      open = sch[0];
                      close = sch[1];
                    }
                    setScheduleModal({
                      ...scheduleModal,
                      open: true,
                      values: {
                        open,
                        close,
                      },
                    });
                  } else {
                    handleSubmit();
                  }
                }}
                loading={isSubmitting}
                orientation="horizontal"
                type="primary"
                text="Buscar recibo"
                disabled={!isValid}
              />
            }>
            <>
              <TextCustom
                variation="h4"
                color="neutral-darkest"
                lineHeight="tight">
                Empresa
              </TextCustom>
              <Separator size={SIZES.XS} />
              <View
                style={{
                  borderRadius: 4,
                  borderWidth: 1,
                  flexDirection: 'row',
                  borderColor: COLORS.Neutral.Medium,
                }}>
                <TextCustom
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{
                    paddingHorizontal: SIZES.MD,
                    paddingVertical: SIZES.XS * 2.5,
                    fontSize: FONT_SIZES.MD,
                    color: COLORS.Neutral.Darkest,
                    fontFamily: FONTS.AmorSansPro,
                    lineHeight: FONT_SIZES.MD * FONTS_LINE_HEIGHTS_FACTOR.TIGHT,
                  }}>
                  {values.businessName.toLocaleUpperCase()}
                </TextCustom>
              </View>
              <Separator size={SIZES.XS * 5} />
              <TextCustom
                variation="h4"
                color="neutral-darkest"
                lineHeight="tight">
                Servicio
              </TextCustom>
              <Separator size={SIZES.XS} />
              <PickerSimple
                placeholder="Selecciona servicio"
                data={services}
                defaultId={defaultServiceId}
                modalTitle="Elige un servicio"
                onSelectItem={item => {
                  setFieldValue('serviceId', item?.id);
                  setMainService(
                    category?.services.find((e: IService) => e.id === item?.id),
                  );
                  resetForm({
                    values: {
                      ...values,
                      serviceId: item?.id,
                      serviceCode:
                        item?.id !== values.serviceId ? '' : values.serviceCode,
                    },
                    errors: {
                      ...errors,
                      serviceCode: undefined,
                    },
                    touched: {
                      ...touched,
                      serviceCode: undefined,
                    },
                  });
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
              />
              {values.serviceId !== undefined && (
                <>
                  <Separator size={SIZES.XS * 5} />
                  <TextCustom
                    variation="h4"
                    color={
                      errors.serviceCode !== undefined &&
                      touched.serviceCode !== undefined
                        ? 'error-medium'
                        : 'neutral-darkest'
                    }
                    lineHeight="tight">
                    {getServiceCodeName(values.serviceId)}
                  </TextCustom>
                  <Separator size={SIZES.XS} />
                  <Input
                    placeholder={getServiceCodePlaceholder(values.serviceId)}
                    autoCapitalize="none"
                    value={values.serviceCode || ''}
                    haveError={!!errors.serviceCode && !!touched.serviceCode}
                    errorMessage={errors.serviceCode?.toString()}
                    onBlur={() => {
                      setFieldTouched('serviceCode');
                    }}
                    onChange={value => {
                      setFieldTouched('serviceCode');
                      if (value === '' || PATTERN.test(value)) {
                        setFieldValue('serviceCode', value);
                      }
                    }}
                  />
                </>
              )}
            </>
            <AlertBasic
              ref={modalHandler.handlers.handleRef}
              onTouchBackdrop={() => {
                refUUIDRequest.current = uuid();
                setIsProcessingSubmitFromModal(false);

                modalHandler.actions.close();
              }}
              closeOnTouchBackdrop={isAllowedToBlockRequest}
              isOpen={modalHandler.current === 'REATTEMPT'}
              title="Lo sentimos"
              description="No logramos mostrar la información. Por favor vuelve a intentar de nuevo."
              actions={() => [
                {
                  id: 'button1',
                  render: (
                    <Button
                      text="Volver a cargar"
                      type="primary"
                      loading={isProcessingSubmitFromModal}
                      onPress={async () => {
                        if (
                          values.serviceId === undefined ||
                          values.serviceCode === undefined
                        )
                          return;
                        await handleOnSubmit(
                          values.serviceId,
                          values.serviceCode,
                        );
                      }}
                    />
                  ),
                },
              ]}
            />
            <AlertBasic
              ref={modalHandler.handlers.handleRef}
              onTouchBackdrop={() => {
                modalHandler.actions.close(() => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'MainTab'}],
                  });
                });
              }}
              closeOnTouchBackdrop={true}
              isOpen={modalHandler.current === 'FAILED_REATTEMPT'}
              title="Lo sentimos"
              description="No logramos mostrar la información de la empresa. Por favor intentalo más tarde."
              actions={utils => [
                {
                  id: 'button1',
                  render: (
                    <Button
                      text="Entendido"
                      type="primary"
                      onPress={() => {
                        modalHandler.actions.close(() => {
                          navigation.reset({
                            index: 0,
                            routes: [{name: 'MainTab'}],
                          });
                        });
                      }}
                    />
                  ),
                },
              ]}
            />
            <AlertBasic
              ref={modalHandler.handlers.handleRef}
              onTouchBackdrop={modalHandler.actions.close}
              closeOnTouchBackdrop={true}
              isOpen={modalHandler.current === 'NO_DEBTS'}
              title="No hay deuda pendiente"
              description="Por el momento no tenemos información de deuda pendiente de pago correspondiente al código o número ingresado."
              actions={utils => [
                {
                  id: 'button1',
                  render: (
                    <Button
                      text="Entendido"
                      type="primary"
                      onPress={modalHandler.actions.close}
                    />
                  ),
                },
              ]}
            />
            <AlertBasic
              onClose={() => {
                setScheduleModal({...scheduleModal, open: false});
                resetForm();
              }}
              closeOnTouchBackdrop={true}
              isOpen={scheduleModal.open}
              onModalHide={() => {}}
              title={`El pago de este ${'\n'} servicio no esta disponible`}
              customDescription={() => (
                <TextCustom
                  color="neutral-darkest"
                  lineHeight="comfy"
                  variation="p4"
                  weight="normal"
                  align="center">
                  ¡Recuerda! puedes realizar el pago de este {'\n'} servicio de{' '}
                  <Text style={{fontFamily: FONTS.AmorSansProBold}}>
                    {moment(scheduleModal.values.open, 'HH:mm').format(
                      'h:mm a',
                    )}
                  </Text>{' '}
                  a{' '}
                  <Text style={{fontFamily: FONTS.AmorSansProBold}}>
                    {moment(scheduleModal.values.close, 'HH:mm').format(
                      'h:mm a',
                    )}
                    .
                  </Text>
                </TextCustom>
              )}
              actions={utils => [
                {
                  id: 'button1',
                  render: (
                    <Button
                      text="Entiendo"
                      type="primary"
                      onPress={() => {
                        utils.close();
                        resetForm();
                      }}
                    />
                  ),
                },
              ]}
            />
          </FormBasicTemplate>
        )}
      </Formik>
    </>
  );
};
