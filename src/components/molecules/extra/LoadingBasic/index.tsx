import React from 'react'
import BoxView from '@atoms/BoxView';
import { COLORS } from '@theme/colors';
import { ActivityIndicator, View } from 'react-native'

export const LoadingBasic = () => {
  return (
    <>
      <BoxView flex={1} mt={'40%'} >
        <ActivityIndicator size="large" color={COLORS.Neutral.Medium} />
      </BoxView>
    </>
  )
}