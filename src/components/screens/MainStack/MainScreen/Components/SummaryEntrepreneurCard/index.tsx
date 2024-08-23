/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {COLORS} from '@theme/colors';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import BoxView from '@atoms/BoxView';
import Icon from '@atoms/Icon';

export interface SummaryEntrepreneurCardProps {
  title: string;
  receiveAmount?: string;
  giveAmount?: string;
  installmentState?: string;
  currency?: string;
}

const SummaryEntrepreneurCard = ({
  title,
  receiveAmount,
  giveAmount,
  currency,
}: SummaryEntrepreneurCardProps) => {
  const styles = getStyles();
  const [showCard, setShowCard] = useState(true);

  return (
    <>
      <BoxView>
        <Pressable onPress={() => setShowCard(!showCard)}>
          <BoxView
            background="background-lightest"
            direction="row"
            align="center"
            justify="space-between"
            py={SIZES.MD}
            px={SIZES.LG}
            style={{
              ...styles.cardTitle,
              borderBottomEndRadius: showCard ? 0 : SIZES.MD,
              borderBottomLeftRadius: showCard ? 0 : SIZES.MD,
            }}>
            <TextCustom text={title} variation="h5" color="primary-medium" />
            <View>
              <Icon
                iconName={
                  showCard ? 'icon_arrows_top_v2' : 'icon_arrows_back_v2'
                }
                size={16}
                color={COLORS.Primary.Medium}
              />
            </View>
          </BoxView>
        </Pressable>

        <BoxView
          background="background-light"
          py={SIZES.MD}
          px={SIZES.LG}
          style={{
            ...styles.cardInfoContainer,
            display: showCard ? 'flex' : 'none',
          }}>
          <BoxView
            align="center"
            justify="space-between"
            direction="row"
            pb={SIZES.XS}>
            <TextCustom
              text={'Dinero recibido'}
              variation="h4"
              color="neutral-dark"
              weight="normal"
            />
            <TextCustom
              text={`${currency}${receiveAmount}`}
              variation={'h4'}
              color={'neutral-darkest'}
              weight={'normal'}
            />
          </BoxView>
          <BoxView
            align="center"
            justify="space-between"
            direction="row"
            pb={SIZES.XS}>
            <TextCustom
              text={'Dinero enviado'}
              variation="h4"
              color="neutral-dark"
              weight="normal"
            />
            <TextCustom
              text={
                giveAmount !== '0.00'
                  ? `-${currency}${giveAmount}`
                  : `${currency}${giveAmount}`
              }
              variation={'h4'}
              color={giveAmount !== '0.00' ? 'error-medium' : 'neutral-darkest'}
              weight={'normal'}
            />
          </BoxView>
        </BoxView>
      </BoxView>
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    cardTitle: {
      borderTopStartRadius: SIZES.MD,
      borderTopRightRadius: SIZES.MD,
    },
    cardInfoContainer: {
      borderBottomEndRadius: SIZES.MD,
      borderBottomLeftRadius: SIZES.MD,
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: COLORS.Neutral.Light,
    },
  });

  return stylesBase;
};

export default SummaryEntrepreneurCard;
