import React, {useEffect, useMemo} from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import BoxView from '@atoms/BoxView';
import {SIZES} from '@theme/metrics';
import {indexStyles as styles} from '../../styles';
import Checkbox from '@atoms/extra/Checkbox';
import {Linking, TouchableOpacity} from 'react-native';
import {useOtherAccountsContext} from '../../contexts';
import {Information} from '@global/information';
import {COLORS} from '@theme/colors';
import Icon from '@atoms/Icon';
import Input from '@atoms/extra/Input';
import {convertToCurrency} from '@utils/convertCurrency';
import {nameForTransfer} from '@utils/nameForTransfer';

export const ConfirmationInmediate = () => {
  const {
    bankCodes,
    originAccount,
    initialForm,
    queryInfo,
    confirmationInmediate,
    createFavorite,
    favoriteModalUtils,
    favoritePayload,
    setFavoritePayload,
    showFavoriteOperation,
  } = useOtherAccountsContext();

  const {values, form, onSetField} = confirmationInmediate;
  const {
    values: {amount, destinationAccount},
  } = initialForm;

  const {
    values: {favoriteName},
    clear: clearNameFavorite,
  } = createFavorite;
  const isAddedFavorite = favoritePayload?.alias !== undefined ? true : false;

  useEffect(() => {
    clearNameFavorite();
    setFavoritePayload(undefined);
  }, []);

  const {
    destinationAccountName,
    destinationAccountNumber,
    originCommission,
    destinationCommission,
  } = queryInfo;

  const montoCargado = convertToCurrency(amount!);

  const arrNames = useMemo(
    () => nameForTransfer(destinationAccountName! || ''),
    [destinationAccountName],
  );

  const bankCode = parseInt(destinationAccount.slice(0, 3));
  const bankName = bankCodes?.current?.get(bankCode)!;

  return (
    <>
      <TextCustom
        text="Monto a transferir"
        variation="h4"
        weight="normal"
        color="neutral-darkest"
      />
      <Separator type="xx-small" />
      <TextCustom
        text={`${originAccount?.currency} ${montoCargado}`}
        variation="h1"
        lineHeight="tight"
        weight="normal"
        color="neutral-darkest"
      />
      <Separator type="large" />
      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <TextCustom
          text="Transferir a "
          variation="h5"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        <BoxView>
          {arrNames.map(n => (
            <TextCustom
              key={`key-${n}`}
              text={n}
              style={{marginBottom: SIZES.XXS}}
              variation="h5"
              align="right"
              lineHeight="tight"
              weight="normal"
              color="neutral-darkest"
            />
          ))}
          <TextCustom
            text={destinationAccountNumber}
            variation="h6"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-dark"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={bankName}
            variation="h6"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-dark"
          />
        </BoxView>
      </BoxView>
      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <TextCustom
          text="Desde"
          variation="h5"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        <BoxView>
          <TextCustom
            text={originAccount?.productName}
            variation="h5"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
          />
          <Separator type="xx-small" />
          <TextCustom
            text={originAccount?.accountCode}
            variation="h6"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-dark"
          />
        </BoxView>
      </BoxView>

      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <TextCustom
          text={'Comisión Compartamos\nFinanciera'}
          variation="h5"
          align="left"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        <TextCustom
          text={
            originCommission === 0
              ? 'Gratis'
              : `${originAccount?.currency} ${convertToCurrency(
                  originCommission!,
                )}`
          }
          variation="h5"
          align="right"
          lineHeight="tight"
          weight="normal"
          color="primary-dark"
        />
      </BoxView>

      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.block}>
        <TextCustom
          text={'Comisión banco destino'}
          variation="h5"
          align="left"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        <TextCustom
          text={`${originAccount?.currency} ${convertToCurrency(
            destinationCommission!,
          )}`}
          variation="h5"
          align="right"
          lineHeight="tight"
          weight="normal"
          color="neutral-darkest"
        />
      </BoxView>

      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between">
        <TextCustom
          text={'Tipo de transferencia'}
          variation="h5"
          align="left"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        <TextCustom
          text="Inmediata"
          variation="h5"
          align="right"
          lineHeight="tight"
          weight="normal"
          color="neutral-darkest"
        />
      </BoxView>

      {/* Favoritos */}
      <Separator type="x-small" />
      {!showFavoriteOperation && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => favoriteModalUtils.onOpen()}>
          <BoxView
            style={styles.favorite_content}
            direction="row"
            align="center">
            <Icon
              name="star-2"
              size="x-small"
              fill={COLORS.Informative.Medium}
            />
            <TextCustom
              style={styles.text}
              text={
                !isAddedFavorite
                  ? 'Guardar como operación favorita'
                  : favoritePayload?.alias ?? ''
              }
              variation="h5"
              lineHeight="tight"
              weight="normal"
              color={!isAddedFavorite ? 'primary-medium' : 'neutral-darkest'}
            />
          </BoxView>
        </TouchableOpacity>
      )}

      <Separator type="large" />
      <Input
        maxLength={40}
        placeholder="Agregar mensaje (opcional)"
        hasCounter
        {...form.inputProps('concept')}
      />
      <Separator type="small" />
      <BoxView
        direction="row"
        align="center"
        background="informative-lightest"
        p={SIZES.MD}
        style={styles.containerInfo}>
        <Icon name="protected" size="small" fill={COLORS.Informative.Medium} />
        <TextCustom
          style={styles.text}
          color="informative-dark"
          variation="h6"
          lineHeight="fair"
          weight="normal"
          text={'Esta operación se validará con tu Token Digital'}
        />
      </BoxView>
      <Separator size={41} />
      <BoxView direction="row" align="center" mb={SIZES.LG}>
        <Checkbox
          type="primary"
          size="medium"
          value={values.termsAreAccepted}
          onChange={value => {
            onSetField('termsAreAccepted', value);
          }}
        />
        <BoxView ml={SIZES.XS}>
          <TextCustom
            weight="normal"
            variation="h5"
            color="neutral-darkest"
            lineHeight="tight">
            Acepto los{' '}
            <TextCustom
              decoration="underline"
              weight="normal"
              variation="h5"
              color="primary-dark"
              lineHeight="tight"
              onPress={() => {
                Linking.openURL(Information.TermsAndConditions);
              }}>
              Términos y condiciones
            </TextCustom>
          </TextCustom>
        </BoxView>
      </BoxView>
      <Separator type="small" />
    </>
  );
};
