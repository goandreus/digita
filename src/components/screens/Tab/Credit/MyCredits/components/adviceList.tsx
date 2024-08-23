import {View, StyleSheet} from 'react-native';
import React from 'react';
import TopAdviceCredit from '@molecules/extra/TopAdviceCredit';
import {SIZES} from '@theme/metrics';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useCreditAdvice} from '@hooks/common';
import {CreditAdviceType} from '@interface/CreditAdvice';
interface Props {
  crediTypes: CreditAdviceType[];
}

export const AdvicesList = ({crediTypes}: Props) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets.top);
  const {creditAdvice} = useCreditAdvice();

  return (
    <View style={styles.container}>
      {crediTypes.map((key, index) => (
        <TopAdviceCredit
          key={`${key}-${index}}`}
          type={key as CreditAdviceType}
          amount={creditAdvice.amount}
          isLast={crediTypes.length - 1 === index}
        />
      ))}
    </View>
  );
};

const getStyles = (insets: number) => {
  return StyleSheet.create({
    container: {
      top: insets + SIZES.XS * 7,
      zIndex: 99,
      position: 'absolute',
      width: '100%',
    },
  });
};
