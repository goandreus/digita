import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {COLORS} from '@theme/colors';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import TextTitleValue from '@atoms/extra/TextTitleValue';
import Icon from '@atoms/Icon';

export interface DetailCardProps {
  title: string;
  individualCapitalOriginal?: string;
  individualAmountBalanceCapital?: string;
  individualInstallmentAmount?: string;
  installmentState?: string;
  currency?: string;
  style?: ViewStyle;
}

const DetailCard = ({
  title,
  individualCapitalOriginal,
  individualAmountBalanceCapital,
  individualInstallmentAmount,
  installmentState,
  currency,
  style,
}: DetailCardProps) => {
  const styles = getStyles();
  const [showCard, setShowCard] = useState(false);

  return (
    <>
      <BoxView style={{...styles.container, ...style}}>
        <BoxView
          style={{
            ...styles.cardTitle,
            borderBottomEndRadius: showCard ? 0 : SIZES.MD,
            borderBottomLeftRadius: showCard ? 0 : SIZES.MD,
          }}>
          <TextCustom text={title} variation="h5" color="primary-medium" />
          <TouchableWithoutFeedback onPress={() => setShowCard(!showCard)}>
            <View>
              <Icon
                iconName={showCard ? 'icon_arrows_top' : 'icon_arrows_down'}
                size={16}
                color={COLORS.Primary.Medium}
              />
            </View>
          </TouchableWithoutFeedback>
        </BoxView>

        <BoxView
          style={{
            ...styles.cardInfoContainer,
            display: showCard ? 'flex' : 'none',
          }}>
          <BoxView style={styles.cardInfo1}>
            <TextTitleValue
              text1="Deuda actual"
              text2={`${currency} ${individualAmountBalanceCapital}`}
              text1Variation="h5"
              text2Variation="h4"
              text1Color="neutral-dark"
              text2Color="neutral-darkest"
              directionFlex="column"
            />
            <TextTitleValue
              text1="Monto total del crédito"
              text2={`${currency} ${individualCapitalOriginal}`}
              text1Variation="h5"
              text2Variation="h4"
              text1Color="neutral-dark"
              text2Color="neutral-darkest"
              directionFlex="column"
            />
          </BoxView>
          <BoxView style={styles.separator} />
          <BoxView style={styles.cardInfo2}>
            <TextTitleValue
              text1="Monto de tu cuota"
              text2={`${currency} ${individualInstallmentAmount}`}
              text1Variation="h5"
              text2Variation="h4"
              text1Color="neutral-dark"
              text2Color="neutral-darkest"
              directionFlex="column"
            />
            <BoxView direction="row" mr={8}>
              <TextTitleValue
                text1="Estado de tu cuota"
                text2={installmentState ?? ''}
                text1Variation="h5"
                text2Variation="h4"
                text1Color="neutral-dark"
                text2Color={
                  installmentState === 'Al día'
                    ? 'success-medium'
                    : 'error-medium'
                }
                directionFlex="column"
                style={{marginRight: 8, alignItems: 'center'}}
              />
              {installmentState === 'Al día' ? (
                <Icon name={'badge'} size={32} fill="#000" />
              ) : (
                <BoxView px={8} />
              )}
            </BoxView>
          </BoxView>
        </BoxView>
      </BoxView>
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    container: {},
    cardTitle: {
      backgroundColor: COLORS.Background.Lightest,
      borderTopStartRadius: SIZES.MD,
      borderTopRightRadius: SIZES.MD,
      padding: SIZES.MD,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardInfoContainer: {
      backgroundColor: COLORS.Background.Light,
      padding: SIZES.MD,
      borderBottomEndRadius: SIZES.MD,
      borderBottomLeftRadius: SIZES.MD,
    },
    cardInfo1: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingBottom: SIZES.MD,
      paddingHorizontal: 12,
    },
    cardInfo2: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingTop: SIZES.MD,
      paddingHorizontal: 12,
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: COLORS.Neutral.Light,
    },
    dataIn: {
      marginRight: SIZES.XXL,
    },
  });

  return stylesBase;
};

export default DetailCard;
