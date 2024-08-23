import {View} from 'react-native';
import React, {ReactNode} from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';
import Picker from '@molecules/extra/Picker';
import {indexStyles as styles} from '../styles';
import {useLastUser, useUserInfo} from '@hooks/common';
import {Saving} from '@features/userInfo';
import PickerCheck from '@molecules/extra/PickerCheck';
import {IQuotaItem, QUOTAS_LIST} from '@global/lists';

const ContentQuotas = ({
  selectedQuota,
  updateSelectedQuota,
}: {
  selectedQuota?: IQuotaItem;
  updateSelectedQuota: (quota: IQuotaItem) => void;
}) => {
  return (
    <>
      <Separator size={SIZES.XL} />
      <TextCustom
        text="Pagarás tu crédito los"
        lineHeight="tight"
        variation="h4"
        weight="normal"
        color="neutral-lightest"
      />
      <Separator type="x-small" />
      <PickerCheck
        seletedItem={selectedQuota}
        title="Elige un día de pago"
        subtitle="Esto podría generar un cambio en el cálculo de tu cuota."
        data={QUOTAS_LIST}
        onSelect={quota => updateSelectedQuota(quota)}
      />
    </>
  );
};

const ContentAccounts = ({
  accounts,
  defaultPicker,
  setOriginAccountUId,
}: {
  accounts: Saving[] | undefined;
  defaultPicker: {
    open: boolean;
    value?: number;
    onChange: () => void;
  };
  setOriginAccountUId: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
  return (
    <>
      <Separator size={SIZES.XL} />
      <TextCustom
        text="Recibirás tu crédito en"
        lineHeight="tight"
        variation="h4"
        weight="normal"
        color="neutral-lightest"
      />
      <Separator type="x-small" />
      {accounts && (
        <View style={styles.pickerContainer}>
          <Picker
            defaultParams={{
              open: defaultPicker.open,
              value: defaultPicker.value,
              onChange: () => defaultPicker.onChange(),
            }}
            text="Elige una cuenta"
            data={accounts}
            onSelect={value => setOriginAccountUId(value.operationUId)}
            statusBarTranslucent
          />
        </View>
      )}
    </>
  );
};

export const Content = ({
  hasSavings,
  isPreApproved,
  actions,
}: {
  hasSavings: boolean;
  isPreApproved: boolean;
  actions: ReactNode;
}) => {
  const {userCreditToDisburt} = useUserInfo();
  const creditPending = userCreditToDisburt;
  const {lastUser} = useLastUser();

  /* const hasSavings = false; */

  const getBoldText = (text: string) => (
    <TextCustom
      color="neutral-lightest"
      variation="h4"
      weight="bold"
      lineHeight="comfy"
      text={text}
    />
  );

  const sumary = (
    <>
      {hasSavings
        ? isPreApproved
          ? 'Desembolsa en tu cuenta de ahorros tu crédito '
          : 'Desembolsa en tu cuenta de ahorros el crédito solicitado a tu asesor en menos de '
        : isPreApproved
        ? 'En menos de '
        : 'En menos de '}

      {hasSavings && isPreApproved && getBoldText('aprobado')}
      {hasSavings && isPreApproved && ' en menos de '}

      {getBoldText('1 minuto')}
      {hasSavings
        ? isPreApproved
          ? '.'
          : '.'
        : isPreApproved
        ? ' crea una cuenta de ahorros y recibe ahí el desembolso de tu crédito '
        : ' crea una cuenta de ahorros y recibe ahí el desembolso del crédito solicitado a tu asesor'}
      {!hasSavings && isPreApproved && getBoldText('aprobado.')}
    </>
  );

  return (
    <>
      <TextCustom
        color="neutral-lightest"
        variation="h1"
        weight="normal"
        lineHeight="tight"
        text={`${lastUser.firstName},`}
      />
      <TextCustom
        color="neutral-lightest"
        variation="h4"
        weight="normal"
        lineHeight="comfy">
        {sumary}
      </TextCustom>
      <Separator size={SIZES.LG} />

      <View style={styles.creditContainer}>
        <BoxView py={SIZES.LG} align="center" background="secondary-lightest">
          <TextCustom
            color="neutral-darkest"
            variation="h5"
            weight="normal"
            lineHeight="tight"
            text="Crédito solicitado"
          />
          <Separator size={SIZES.XXS} />
          <TextCustom
            color="neutral-darkest"
            variation="h2"
            weight="normal"
            lineHeight="tight"
            text={creditPending?.sCreditFormat1}
          />
        </BoxView>
        <BoxView
          direction="row"
          py={SIZES.LG}
          justify="space-evenly"
          background="neutral-lightest">
          <BoxView align="center">
            <TextCustom
              color="neutral-darkest"
              variation="h6"
              weight="normal"
              lineHeight="tight"
              text="Cuota mensual"
            />
            <Separator size={SIZES.XXS} />
            <TextCustom
              color="primary-dark"
              variation="h2"
              weight="normal"
              lineHeight="tight"
              text={creditPending?.sPaymentMonth}
            />
            <TextCustom
              color="neutral-darkest"
              variation="h6"
              weight="normal"
              lineHeight="tight"
              text={`TEA: ${creditPending?.tea} `}
            />
          </BoxView>
          <BoxView align="center">
            <TextCustom
              color="neutral-darkest"
              variation="h6"
              weight="normal"
              lineHeight="tight"
              text="Cuotas"
            />
            <Separator size={SIZES.XXS} />
            <TextCustom
              color="neutral-darkest"
              variation="h2"
              weight="normal"
              lineHeight="tight"
              text={creditPending?.payments}
            />
          </BoxView>
        </BoxView>
      </View>

      {creditPending?.insurance !== '' && (
        <>
          <Separator size={SIZES.XS} />
          <BoxView
            align="center"
            justify="center"
            py={SIZES.MD}
            px={SIZES.LG}
            direction="row"
            background="primary-dark"
            style={{borderRadius: SIZES.XS}}>
            <Icon name="icon-insurance" size="large" />
            <BoxView ml={15}>
              <TextCustom
                color="neutral-lightest"
                variation="h6"
                weight="normal"
                lineHeight="tight"
                text="Al desembolsar estarás protegido con el"
              />
              <Separator size={SIZES.XXS} />
              <TextCustom
                color="neutral-lightest"
                variation="h4"
                weight="normal"
                lineHeight="tight"
                text={creditPending?.insurance}
              />
            </BoxView>
          </BoxView>
        </>
      )}

      <Separator size={SIZES.XXS} />
      <TextCustom
        size={11}
        color="primary-lightest"
        variation="h6"
        align="center"
        weight="normal"
        lineHeight="comfy"
        text="Si deseas cambiar las condiciones del crédito contacta a tu asesor."
      />

      {/* Pickers */}
      {actions}

      <Separator size={SIZES.MD} />
    </>
  );
};

Content.Quotas = ContentQuotas;
Content.Accounts = ContentAccounts;
