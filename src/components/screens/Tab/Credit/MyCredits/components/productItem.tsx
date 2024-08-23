import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {itemStyles as styles} from '../styles';
import TextCustom from '@atoms/extra/TextCustom';
import BoxView from '@atoms/BoxView';
import {COLORS} from '@theme/colors';
import Icon from '@atoms/Icon';
import Separator from '@atoms/extra/Separator';
import {SIZES} from '@theme/metrics';

interface Props {
  productName: string;
  text: string;
  currency: string;
  amount: string;
  index: number;
  color?: string;
  backgroundColor?: string;
  action: () => void;
  isGroupAccount?: boolean;
}
export const ProductItem = ({
  productName,
  text,
  currency,
  amount,
  index,
  action,
  isGroupAccount = false,
}: Props) => {
  return (
    <View style={styles.container}>
      <BoxView
        p={SIZES.MD}
        background="background-light"
        direction="row"
        justify="space-between"
        style={styles.header}>
        <TextCustom
          text={productName}
          variation="h4"
          weight="normal"
          color="neutral-darkest"
          lineHeight="tight"
        />
        <TouchableOpacity onPress={action} style={styles.moreBtn}>
          <TextCustom
            style={styles.textMore}
            text="Ver más"
            variation="h5"
            weight="normal"
            color="primary-medium"
            lineHeight="tight"
          />
          <Icon
            iconName="icon_arrows_right_thin"
            size={14}
            color={COLORS.Primary.Medium}
          />
        </TouchableOpacity>
      </BoxView>
      <BoxView py={SIZES.LG} px={SIZES.MD}>
        <TextCustom
          text={text}
          variation="h5"
          weight="normal"
          color="neutral-dark"
          lineHeight="tight"
        />
        <Separator type="xx-small" />
        <TextCustom
          text={`${currency} ${amount}`}
          variation="h3"
          weight="normal"
          color="neutral-darkest"
          lineHeight="tight"
        />
        {isGroupAccount && (
          <BoxView
            direction="row"
            align="center"
            px={SIZES.MD}
            py={SIZES.XXS}
            background="error-lightest"
            style={styles.labelContainer}>
            <Icon
              name={'icon_money-bag-two'}
              size={20}
              fill="red"
              style={{marginRight: 8}}
            />
            <TextCustom
              text="Aquí podrás ver el avance de tu cuota grupal."
              variation="h6"
              weight="normal"
              color="primary-darkest"
            />
          </BoxView>
        )}
      </BoxView>
    </View>
  );
};
