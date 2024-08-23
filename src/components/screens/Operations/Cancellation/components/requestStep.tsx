import React from 'react';
import {indexStyles as styles} from '../styles';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import Separator from '@atoms/extra/Separator';
import Icon from '@atoms/Icon';
import Picker from '@molecules/extra/Picker';

interface Props {
  data: any[];
  setOriginAccountUId: (value: any) => void;
}

export const RequestStep = ({data, setOriginAccountUId}: Props) => {
  return (
    <>
      <BoxView
        px={SIZES.MD}
        py={SIZES.LG}
        align="center"
        style={styles.topContainer}>
        <Icon size={60} name="pig-full" />
        <Separator type="small" />
        <TextCustom
          variation="h6"
          weight="normal"
          lineHeight="fair"
          color="neutral-darkest"
          text="Por este canal solo puedes solicitar anular las cuentas"
        />
        <Separator type="xx-small" />
        <TextCustom
          variation="h0"
          weight="normal"
          lineHeight="tight"
          color="neutral-darkest"
          text="Ahorro Emprendedores"
        />
      </BoxView>
      <Separator type="large" />
      <TextCustom
        variation="h4"
        weight="normal"
        lineHeight="tight"
        color="neutral-darkest"
        text="¿Qué cuenta de ahorro anularás?"
      />
      <Separator type="x-small" />
      <Picker
        text="Elige una cuenta"
        data={data}
        onSelect={value => setOriginAccountUId(value.operationUId)}
        statusBarTranslucent
        hideSubtitle
      />
      <Separator type="large" />
      <BoxView p={SIZES.MD} style={styles.bottomContainer} direction="row">
        <Icon size={25} name="exclamation-triangle" />
        <TextCustom
          style={styles.txtWarning}
          variation="h6"
          weight="normal"
          lineHeight="fair"
          color="secondary-darkest"
          text={
            'Para iniciar la solicitud de anulación, la cuenta de ahorros no debe tener saldo disponible. \n\nSi tienes saldo, te recomendamos hacer una transferencia a otra cuenta o de lo contrario acercarte a una de nuestras agencias.'
          }
        />
      </BoxView>
    </>
  );
};
