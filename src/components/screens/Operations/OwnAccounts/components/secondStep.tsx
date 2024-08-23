import React, {useMemo} from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import BoxView from '@atoms/BoxView';
import {SIZES} from '@theme/metrics';
import {indexStyles as styles} from '../styles';
import Icon from '@atoms/Icon';
import {COLORS} from '@theme/colors';
import {IFormData} from '../hooks/useOwnAccounts';
import {convertToCurrency} from '@utils/convertCurrency';
import {nameForTransfer} from '@utils/nameForTransfer';

interface Props {
  data: IFormData;
}

export const SecondStep = ({data: formData}: Props) => {
  const {amountValue, originAccount, destinationAccount} = formData;
  const montoCargado = convertToCurrency(amountValue!);
  const arrNames = useMemo(
    () => nameForTransfer(destinationAccount?.productName!),
    [destinationAccount],
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
            text={destinationAccount?.accountCode}
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
      {/* <Separator type="large" />
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
      <Separator type="small" /> */}
    </>
  );
};
