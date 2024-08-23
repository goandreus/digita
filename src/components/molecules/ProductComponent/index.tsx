import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Progress from 'react-native-progress';
import TextCustom from '@atoms/TextCustom';
import TextCustomExtra from '@atoms/extra/TextCustom';
import Icon from '@atoms/Icon';
import {COLORS, Colors} from '@theme/colors';
import BoxView from '@atoms/BoxView';
import {SIZES} from '@theme/metrics';

interface ProductComponentProps {
  productName: string;
  text: string;
  currency: string;
  amount: string;
  index: number;
  widthName: string | number;
  progress?: number;
  color?: string;
  backgroundColor?: string;
  action: () => void;
  isGroupAccount?: boolean;
}

const ProductComponent = ({
  productName,
  text,
  currency,
  amount,
  index,
  widthName,
  progress,
  color,
  backgroundColor,
  action,
  isGroupAccount = false,
}: ProductComponentProps) => {
  const styles = getStyles({backgroundColor});

  return (
    <TouchableOpacity style={styles.mainContainer} onPress={action}>
      <View>
        {index !== 0 && <View style={styles.separator} />}
        <View style={styles.container}>
          <View style={{width: widthName}}>
            <TextCustom
              text={productName}
              variation="h2"
              weight="normal"
              color={COLORS.Neutral.Darkest}
              size={16}
            />
          </View>
          <View style={styles.balanceContainer}>
            {text && (
              <TextCustom
                text={text}
                variation="h2"
                weight="normal"
                color={COLORS.Neutral.Dark}
                size={12}
              />
            )}
            <TextCustom
              text={`${currency} ${amount}`}
              variation="h2"
              weight="normal"
              color={COLORS.Neutral.Darkest}
              size={14}
            />
            {progress !== undefined && (
              <Progress.Bar
                style={styles.progressBar}
                progress={progress}
                width={115}
                height={5}
                color={color}
              />
            )}
          </View>
          <Icon name="arrow-right-primary-color" fill="#fff" size="small" />
        </View>
        {isGroupAccount && (
          <BoxView direction="row">
            <BoxView
              direction="row"
              background="error-lightest"
              align="center"
              px={SIZES.MD}
              py={SIZES.XXS}
              style={styles.labelContainer}>
              <Icon
                name={'icon_money-bag-two'}
                size={20}
                fill="red"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{marginRight: 8}}
              />
              <TextCustomExtra
                text="Aquí podrás ver el avance de tu cuota grupal."
                variation="h6"
                weight="normal"
                color="primary-darkest"
              />
            </BoxView>
          </BoxView>
        )}
      </View>
    </TouchableOpacity>
  );
};

const getStyles = ({backgroundColor}: {backgroundColor?: string}) => {
  const stylesBase = StyleSheet.create({
    mainContainer: {
      marginTop: 8,
      backgroundColor: Colors.White,
      borderRadius: 12,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 12,
      marginBottom: '1.5%',
    },
    balanceContainer: {
      marginRight: '-12%',
    },
    separator: {
      borderColor: '#EFEFEF',
      borderWidth: 0.8,
      width: '100%',
      alignSelf: 'center',
      marginBottom: 4,
      marginTop: -4,
    },
    progressBar: {
      marginTop: 2,
      backgroundColor: backgroundColor || undefined,
      borderColor: backgroundColor || undefined,
    },
    labelContainer: {
      borderRadius: SIZES.MD,
      marginBottom: SIZES.MD,
      marginLeft: SIZES.MD,
    },
  });

  return stylesBase;
};

export default ProductComponent;
