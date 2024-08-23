import React from 'react';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {formatPhoneNumber} from '@helpers/NumberHelper';
import {indexStyles as styles} from '../styles';

export const SecondStep = ({data}: any) => {
  const {originAccount, values} = data;
  const {formatAmount, phoneNumberBim} = values;

  return (
    <>
      <TextCustom
        text="Monto a recargar"
        variation="h4"
        weight="normal"
        color="neutral-darkest"
      />
      <Separator type="xx-small" />
      <TextCustom
        text={formatAmount}
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
          text="Recargar a"
          variation="h5"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        <BoxView>
          <Separator type="xx-small" />
          <TextCustom
            text={formatPhoneNumber(phoneNumberBim)}
            style={{marginBottom: SIZES.XXS}}
            variation="h5"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
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
      <Separator type="large" />
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
