import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';
import TextCustom from '@atoms/extra/TextCustom';
import { COLORS } from '@theme/colors';
import { FONTS } from '@theme/fonts';
import { SIZES } from '@theme/metrics';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export const InformativeCard = () => {
  return (
    <BoxView 
      py={24}
      px={16}
      style={styles.container}
    >
      <BoxView direction='row' style={{alignItems: 'center'}}>
        <Icon name="pig-save" fill="#fff" size="x-large" style={{marginRight: 19}}/>
        <BoxView>
          <TextCustom
            weight="normal"
            variation="h5"
            text="Cuenta en soles"
            color='neutral-darkest'
          />
          <TextCustom
            weight="normal"
            text="Ahorro Wow"
            color='neutral-darkest'
            style={styles.textSubtitle}
          />
        </BoxView>
      </BoxView>
      <BoxView>
        <BoxView direction='row' mt={14}>
          <Icon name="check-2" fill="#fff" size="tiny" style={{marginRight: 8}}/>
          <TextCustom
            weight="normal"
            variation="h5"
            text="Accede a una "
            color='neutral-darkest'
          />
          <TextCustom
            weight="bold"
            variation="h5"
            text="súper tasa de interés."
            color='neutral-darkest'
          />
        </BoxView>
        <BoxView direction='row' mt={14}>
          <Icon name="check-2" fill="#fff" size="tiny" style={{marginRight: 8}}/>
          <TextCustom
            weight="normal"
            variation="h5"
            text="Sin monto mínimo de apertura."
            color='neutral-darkest'
          />
        </BoxView>
        <BoxView direction='row' mt={14}>
          <Icon name="check-2" fill="#fff" size="tiny" style={{marginRight: 8}}/>
          <TextCustom
            weight="normal"
            variation="h5"
            text={'Sin cobro de mantenimiento.'}
            color='neutral-darkest'
            lineHeight='fair'
            style={{paddingRight: 16}}
          />
        </BoxView>
      </BoxView>
    </BoxView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.Neutral.Light,
    borderRadius: SIZES.XS,
    backgroundColor: COLORS.Background.Light,
  },
  textSubtitle: {
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '500',
    fontFamily: FONTS.Bree,
  }
});
