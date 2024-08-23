import React from 'react';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/Separator';
import {Platform, Pressable, StyleSheet} from 'react-native';
import Icon from '@atoms/Icon';

const SavingItem = ({
  type,
  action,
  disabled,
}: {
  type: string;
  action: () => void;
  disabled: boolean;
}) => {
  return (
    <Pressable onPress={action} disabled={disabled}>
      <BoxView
        style={styles.container}
        background="background-lightest"
        p={16}
        direction="row">
        {type === 'entrepreneur' ? (
          <Icon name="icon_entrepreneur-saving" size={60} />
        ) : (
          <Icon name="icon_wow-saving" size={60} />
        )}
        <BoxView style={styles.detailContainer} py={24}>
          <TextCustom
            text={
              type === 'entrepreneur' ? 'Cuenta Emprendedores' : 'Cuenta WOW'
            }
            variation="h2"
            size={18}
            weight="bold"
            color="primary-medium"
          />
          <Separator size={8} />
          <TextCustom
            text={
              type === 'entrepreneur'
                ? 'Para enviar y recibir dinero en tu negocio con tu número celular.'
                : 'Donde tu dinero crece más rápido con una súper tasa.'
            }
            variation="h5"
            color="neutral-darkest"
          />
        </BoxView>
      </BoxView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowRadius: 8,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.15,
        shadowColor: '#222D42',
        shadowOffset: {width: 0, height: 2},
      },
      android: {
        elevation: 4,
      },
    }),
  },
  detailContainer: {
    width: '75%',
    marginLeft: 18,
    justifyContent: 'center',
    flexShrink: 1,
  },
});

export default SavingItem;
