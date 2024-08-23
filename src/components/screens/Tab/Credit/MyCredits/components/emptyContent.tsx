import React from 'react';
import BoxView from '@atoms/BoxView';
import {Image, Linking} from 'react-native';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import {indexStyles as styles} from '../styles';
import Separator from '@atoms/extra/Separator';
import Button from '@atoms/extra/Button';
import {Information} from '@global/information';

export const EmptyContent = () => {
  return (
    <BoxView style={styles.emptyContainer}>
      <TextCustom
        text={'Por ahora no tiene un crédito contratado pero...'}
        variation="h0"
        weight="normal"
        color="neutral-darkest"
        lineHeight="comfy"
      />
      <BoxView direction="row" mt={SIZES.LG}>
        <BoxView flex={1}>
          <TextCustom
            text={'¡Que tu negocio \nno deje de crecer!'}
            variation="h2"
            weight="normal"
            color="primary-medium"
            lineHeight="fair"
          />
          <Separator type="x-small" />
          <TextCustom
            text={'Tenemos los créditos que te ayudarán a seguir creciendo.'}
            variation="h5"
            weight="normal"
            color="neutral-darkest"
            lineHeight="comfy"
          />
          <Separator type="x-small" />
          <TextCustom
            variation="h5"
            weight="normal"
            color="neutral-darkest"
            lineHeight="comfy">
            <TextCustom
              text={'Solicita '}
              variation="h5"
              weight="bold"
              color="neutral-darkest"
              lineHeight="comfy"
            />
            hoy tu crédito y accede a grandes beneficios.
          </TextCustom>
        </BoxView>

        <BoxView>
          <Image
            style={styles.logo}
            source={require('@assets/images/manWithProducts.png')}
          />
        </BoxView>
      </BoxView>

      <Separator size={SIZES.LG * 2} />

      <Button
        containerStyle={styles.containerBtn}
        onPress={() => {
          Linking.openURL(Information.Agencies);
        }}
        loading={false}
        orientation="horizontal"
        type="primary"
        text={'Encontrar una agencia'}
        disabled={false}
      />
    </BoxView>
  );
};
