import React, { useEffect } from 'react';
import { View } from 'react-native';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import BoxView from '@atoms/BoxView';
import { SIZES } from '@theme/metrics';
import { indexStyles as styles } from '../styles';
import Icon from '@atoms/Icon';
import { COLORS } from '@theme/colors';
import Checkbox from '@atoms/extra/Checkbox';
import Input from '@atoms/extra/Input';
import Picker from '@molecules/extra/Picker';
import { useAccounts } from '../hooks/useAccounts';
import { useAffiliatePhone } from '../hooks/useAffiliatePhone';
import { useUserInfo } from '@hooks/common';

export const AffiliatePhoneScreen = ({
  operationType,
  term,
  formData,
  action,
  setTerm,
  goToTermsConditions,
}: {
  operationType: string;
  term: boolean;
  formData: any;
  action: 'updateAffiliation' | 'affiliation';
  setTerm: (value: boolean) => void;
  goToTermsConditions: () => void;
}) => {
  const { defaultOpenPicker, cellphoneNumber, setDefaultOpenPicker } =
    useAffiliatePhone({ operationName: action });
  const { userInteroperabilityInfo } = useUserInfo();

  const { accounts } = useAccounts();
  const { originAccount, setOriginAccount } = formData;
  const userCellpgoneNumber = `*** *** ${cellphoneNumber?.substring(6)}`;

  let pickerValues = {
    open: defaultOpenPicker,
    value: originAccount?.operationUId,
    onChange: () => setDefaultOpenPicker(false),
  };

  useEffect(() => {
    if (userInteroperabilityInfo && action === 'updateAffiliation') {
      pickerValues.value = +userInteroperabilityInfo?.operationUId!
    }
  }, []);


  return (
    <>
      <Separator type="large" />
      <Separator type="x-small" />
      <TextCustom
        text={
          action === 'updateAffiliation'
            ? 'Cuenta de ahorros afiliada a tu celular'
            : 'Quiero afiliar esta cuenta de ahorros'
        }
        variation="h4"
        weight="normal"
        color="neutral-darkest"
      />
      <Separator type="x-small" />

      <View style={styles.pickerContainer}>
        <Picker
          enabled
          defaultParams={{
            open: pickerValues.open,
            value: pickerValues.value,
            onChange: () => { },
          }}
          text="Elige una cuenta"
          data={accounts}
          onSelect={value => setOriginAccount(value)}
        />
      </View>
      <Separator type="large" />
      <TextCustom
        text="Número de celular"
        variation="h4"
        weight="normal"
        color="neutral-darkest"
      />
      <Separator type="x-small" />
      <Input
        // eslint-disable-next-line react-native/no-inline-styles
        styleInput={{ backgroundColor: '#F6F6F9' }}
        maxLength={11}
        keyboardType="decimal-pad"
        value={userCellpgoneNumber || ''}
        onChange={() => { }}
        editable={false}
      // {...inputProps}
      />
      <Separator type="large" />
      <BoxView
        direction="row"
        align="center"
        justify="center"
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
      {operationType === 'affiliation' ? (
        <>
          <Separator type="large" />
          <BoxView direction="row" align="flex-start" mb={SIZES.MD}>
            <Checkbox
              type="primary"
              size="small"
              value={term}
              onChange={() => setTerm(!term)}
            />
            <BoxView flex={1} ml={SIZES.XS}>
              <TextCustom
                weight="normal"
                variation="h5"
                color="neutral-darkest"
                lineHeight="comfy">
                Acepto los{' '}
                <TextCustom
                  decoration="underline"
                  weight="normal"
                  variation="h5"
                  color="primary-dark"
                  lineHeight="comfy"
                  onPress={goToTermsConditions}>
                  Términos y Condiciones
                </TextCustom>
                {''} de uso.
              </TextCustom>
            </BoxView>
          </BoxView>
        </>
      ) : null}
    </>
  );
};
