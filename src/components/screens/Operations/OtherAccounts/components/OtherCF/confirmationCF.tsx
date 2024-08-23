import React, {useEffect, useMemo} from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import BoxView from '@atoms/BoxView';
import {SIZES} from '@theme/metrics';
import {indexStyles as styles} from '../../styles';
import {useOtherAccountsContext} from '../../contexts';
import Icon from '@atoms/Icon';
import {COLORS} from '@theme/colors';
import {convertToCurrency} from '@utils/convertCurrency';
import {nameForTransfer} from '@utils/nameForTransfer';
import Input from '@atoms/extra/Input';
import {TouchableOpacity} from 'react-native';

export const ConfirmationCF = () => {
  const {
    originAccount,
    initialForm,
    confirmationCF,
    queryInfo,
    createFavorite,
    favoriteModalUtils,
    favoritePayload,
    setFavoritePayload,
    showFavoriteOperation,
  } = useOtherAccountsContext();

  const {
    values: {amount},
  } = initialForm;
  const {form} = confirmationCF;
  const {clear: clearNameFavorite} = createFavorite;
  const isAddedFavorite = favoritePayload?.alias !== undefined ? true : false;

  useEffect(() => {
    clearNameFavorite();
    setFavoritePayload(undefined);
  }, []);

  const {destinationAccountName, destinationAccountNumber} = queryInfo;

  const montoCargado = convertToCurrency(amount!);
  const arrNames = useMemo(
    () => nameForTransfer(destinationAccountName!),
    [destinationAccountName],
  );

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
        <BoxView /* style={{maxWidth: 100}} */>
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
          <Separator type="xx-small" />
          <TextCustom
            text={destinationAccountNumber}
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
        justify="space-between">
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
        /* onFocus={handleFocus} */
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
      <Separator type="small" />
    </>
  );
};
