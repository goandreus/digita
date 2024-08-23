import {StyleSheet} from 'react-native';
import {EdgeInsets} from 'react-native-safe-area-context';
import {ItemProps} from './types';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';

export const getStyles = (
  insets: EdgeInsets,
  data?: (ItemProps & any)[],
  error?: boolean,
  long?: boolean,
) => {
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemValue: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemBorder: {
      marginTop: 6,
    },
    modalContainer: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: error ? COLORS.Error.Medium : COLORS.Neutral.Medium,
      paddingLeft: SIZES.MD,
      paddingRight: SIZES.XS,
      paddingVertical: SIZES.LG,
      justifyContent: 'center',
      marginBottom: error ? SIZES.XS : 0,
    },
    modal: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      margin: 0,
    },
    modalTitle: {
      alignItems: 'flex-start',
    },
    container: {
      borderTopStartRadius: 24,
      borderTopEndRadius: 24,
      backgroundColor: COLORS.Background.Lightest,
      borderTopLeftRadius: SIZES.XS,
      borderTopRightRadius: SIZES.XS,
      paddingHorizontal: SIZES.XS * 3,
      paddingTop: SIZES.XS * 5,
      paddingBottom: SIZES.XS * 2 + insets.bottom,
      marginTop: long ? 128 + insets.bottom : undefined,
      minHeight: !long
        ? data && data?.length >= 3
          ? 360
          : data?.length === 1
          ? 220
          : 290
        : undefined,
      maxHeight: !long
        ? data && data?.length >= 3
          ? 360
          : data?.length === 1
          ? 220
          : 290
        : undefined,
    },
    label: {
      width: 54,
      borderRadius: 8,
    },
  });
  return styles;
};
