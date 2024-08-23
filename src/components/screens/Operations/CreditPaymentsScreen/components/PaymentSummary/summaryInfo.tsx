import BoxView from '@atoms/BoxView';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import { COLORS } from '@theme/colors';
import { SIZES } from '@theme/metrics';
import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface IProps {
  title: string,
  productNameOrInstallments: string,
  accountCode?: string,
}

export const SummaryInfo: FC<IProps> = ({
  title,
  productNameOrInstallments,
  accountCode
}) => { 
  
  return (
    <>
      <BoxView
        py={SIZES.LG}
        direction="row"
        align="center"
        justify="space-between"
        style={styles.container}>
        <TextCustom
          text={title}
          variation="h5"
          lineHeight="tight"
          weight="normal"
          color="neutral-dark"
        />
        <BoxView justify={'center'}>
          <TextCustom
            text={productNameOrInstallments}
            variation="h5"
            align="right"
            lineHeight="tight"
            weight="normal"
            color="neutral-darkest"
          />
          {/* <Separator type="xx-small" /> */}
          {
            accountCode &&
              <TextCustom
                text={accountCode}
                variation="h6"
                align="right"
                lineHeight="tight"
                weight="normal"
                color="neutral-dark"
                style={{marginTop: SIZES.XXS}}
              />
          }
        </BoxView>
      </BoxView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.Neutral.Light,
  },
});