import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View, ViewStyle} from 'react-native';
import {COLORS} from '@theme/colors';
import TextCustom from '@atoms/extra/TextCustom';
import { SIZES } from '@theme/metrics';

export interface ProductCardProps {
  title: string;
  disbursedCapital: string;
  existsInstallmentDue?: boolean;
  quota?: string;
  quotaNumber?: number;
  currency?: string;
  dueDate?: string;
  style?: ViewStyle;
  onPressCredit?: () => void;
}

const ProductCard = ({
  title, 
  disbursedCapital, 
  existsInstallmentDue, 
  quota, 
  quotaNumber,
  currency, 
  dueDate,
  style, 
  onPressCredit
}: ProductCardProps) => {
  const styles = getStyles();

  return (
    <>
      <TouchableWithoutFeedback onPress={onPressCredit}>
        <View style={{...styles.container, ...style}}>
          <View style={styles.cardInfo}>
            <TextCustom 
              text={`Crédito Individual ${title}`}
              variation="h4"
              color='neutral-darkest'
            />
            <TextCustom 
              text={`Monto desembolsado ${currency} ${disbursedCapital}`}
              variation="h6"
              color='neutral-dark'
            />
          </View>
          <View style={styles.cardData}>
            <View style={styles.dataIn}>
              <TextCustom 
                text={`Cuota ${quotaNumber?.toString()}`}
                variation="h4"
                weight='normal'
                color='primary-medium'
              />
              <TextCustom 
                text={`${currency} ${quota}`}
                variation="h4"
                weight='normal'
                color='neutral-darkest'
              />
            </View>
            <View style={styles.dataIn}>
              <TextCustom 
                text={"Vencimiento"}
                variation="h4"
                weight='normal'
                color='primary-medium'
              />
              <TextCustom 
                text={dueDate}
                variation="h4"
                weight='normal'
                color='neutral-darkest'
              />
            </View>
          </View>
          { existsInstallmentDue && (
            <View style={styles.cardError}>
              <TextCustom 
                text={"Adicional tienes cuota(s) vencida(s)"}
                variation="h4"
                weight='normal'
                color='error-medium'
              />
            </View>
          ) }
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    container: {
      marginBottom: SIZES.XL,
      borderRadius: SIZES.XS,
      overflow: 'hidden',
      
      shadowColor: '#000',
      shadowOffset: {
        width: 1,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 7.68,

      elevation: 5,
    },
    cardInfo: {
      padding: SIZES.MD,
      backgroundColor: COLORS.Background.Light,
    },
    cardData: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      height: 82,
      paddingHorizontal: SIZES.MD,
      backgroundColor: COLORS.Background.Lightest,
    },
    cardError: {
      alignItems: 'center',
      paddingVertical: SIZES.XS,
      backgroundColor: COLORS.Error.Lightest,
    },
    dataIn: {
      marginRight: SIZES.XXL,
    },
  });

  return stylesBase;
};

export default ProductCard;
