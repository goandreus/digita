import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import { COLORS } from '@theme/colors';
import { SIZES } from '@theme/metrics';
import React from 'react'
import { Dimensions, StyleSheet } from 'react-native'

export const Announcement = () => {
  return (
    <BoxView
        direction="row"
        align="center"
        background="informative-lightest"
        py={SIZES.MD}
        style={styles.disclaimerContainer}>
        <BoxView style={styles.disclaimerIcon}>
            <Icon
                name="exclamation-circle-inverted"
                size="x-small"
                fill={COLORS.Informative.Dark}
            />
        </BoxView>
        <TextCustom
            style={styles.disclaimerText}
            color="informative-dark"
            variation="h6"
            weight="normal"
            text="Si tienes un crédito con acuerdo, o deseas realizar un pago anticipado, acércate a una agencia."
        />
    </BoxView>
  )
}

const styles = StyleSheet.create({
    disclaimerContainer: {
        borderRadius: SIZES.XS,
    },
        disclaimerIcon: {
        padding: SIZES.XXS,
        marginHorizontal: SIZES.XS,
    },
    disclaimerText: {
        width: Dimensions.get('window').width - SIZES.MD * 7,
    },
});