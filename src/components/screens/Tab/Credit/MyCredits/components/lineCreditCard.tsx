/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import BoxView from '@atoms/BoxView';
import {cardStyles as styles} from '../styles';
import {SIZES} from '@theme/metrics';
import Icon from '@atoms/Icon';
import {useUserInfo} from '@hooks/common';

interface Props {
  loading: boolean;
  onPress: () => void;
}

export const LineCreditCard = ({loading, onPress}: Props) => {
  const {userLineCredit} = useUserInfo();
  const lineCredit = userLineCredit?.credits[0];
  const isBlock = lineCredit?.lineStateCode !== 0;

  return (
    <>
      <BoxView style={styles.imageBackground}>
        <ImageBackground
          resizeMode="stretch"
          style={{opacity: isBlock ? 0.4 : 1}}
          source={require('@assets/images/lineCardfond.png')}>
          <Separator type="medium" />
          <TextCustom
            style={styles.marginLefth}
            text="Línea de Crédito"
            variation={'h3'}
            weight={'normal'}
            color={'neutral-lightest'}
            lineHeight="tight"
          />
          <Separator type="small" />
          <BoxView direction="row" justify="space-between">
            <BoxView>
              <TextCustom
                style={styles.marginLefth}
                text="Disponible"
                variation={'h5'}
                weight={'normal'}
                color={'neutral-lightest'}
                lineHeight="tight"
              />
              <Separator type="xx-small" />
              <TextCustom
                style={styles.marginLefth}
                text={lineCredit?.sAvailableCreditLineAmount}
                variation={'h2'}
                weight={'normal'}
                color={'secondary-light'}
                lineHeight="tight"
              />
            </BoxView>
            <BoxView justify="center" align="flex-end">
              <TextCustom
                text="Vigencia"
                style={styles.marginRigth}
                variation={'h6'}
                weight={'normal'}
                color={'primary-light'}
                lineHeight="tight"
              />
              <Separator type="xx-small" />
              <TextCustom
                style={styles.marginRigth}
                text={lineCredit?.sEffectiveDate}
                variation={'h6'}
                weight={'normal'}
                color={'primary-light'}
                lineHeight="tight"
              />
            </BoxView>
          </BoxView>
          <Separator type="small" />
          <BoxView direction="row">
            <BoxView flex={1}>
              <TextCustom
                style={styles.marginLefth}
                text="Utilizado"
                variation={'h5'}
                weight={'normal'}
                color={'neutral-lightest'}
                lineHeight="tight"
              />
              <Separator type="xx-small" />
              <TextCustom
                style={styles.marginLefth}
                text={lineCredit?.sAmountCreditLineUsed}
                variation={'h3'}
                weight={'normal'}
                color={'neutral-lightest'}
                lineHeight="tight"
              />
            </BoxView>
            <BoxView flex={1}>
              <TextCustom
                text="Línea de crédito"
                variation={'h5'}
                weight={'normal'}
                color={'neutral-lightest'}
                lineHeight="tight"
              />
              <Separator type="xx-small" />
              <TextCustom
                text={lineCredit?.sCreditLineAmount}
                variation={'h3'}
                weight={'normal'}
                color={'neutral-lightest'}
                lineHeight="tight"
              />
            </BoxView>
          </BoxView>
          <Separator type="medium" />
          {!isBlock ? (
            <>
              <TouchableOpacity
                activeOpacity={0.6}
                disabled={loading}
                style={styles.imageBtn}
                onPress={onPress}>
                {loading ? (
                  <BoxView>
                    <Separator type="small" />
                    <ActivityIndicator size={SIZES.MD} />
                    <Separator type="small" />
                  </BoxView>
                ) : (
                  <>
                    <TextCustom
                      style={{marginLeft: SIZES.XS}}
                      text="Obtener dinero"
                      variation={'h4'}
                      weight={'normal'}
                      color={'neutral-lightest'}
                      lineHeight="tight"
                    />
                    <Icon
                      style={styles.iconHands}
                      name="hand_bills"
                      size={58}
                    />
                  </>
                )}
              </TouchableOpacity>
              <Separator type="medium" />
            </>
          ) : (
            <Separator type="x-large" />
          )}
        </ImageBackground>

        {isBlock && (
          <BoxView
            flex={1}
            background="secondary-medium"
            p={SIZES.MD}
            style={styles.bockedContainer}>
            <BoxView direction="row" align="center">
              <Icon name="chain" size={'tiny'} />
              <BoxView ml={SIZES.MD}>
                <TextCustom
                  text="Línea de Crédito bloqueada"
                  variation="h4"
                  weight="bold"
                  color="error-darkest"
                  lineHeight="tight"
                />
                <Separator type="xx-small" />
                <TextCustom
                  text="Para conocer más comunícate con tu asesor."
                  variation="h6"
                  weight="normal"
                  color="error-darkest"
                  lineHeight="tight"
                />
              </BoxView>
            </BoxView>
          </BoxView>
        )}
      </BoxView>
      <Separator type="large" />
    </>
  );
};
