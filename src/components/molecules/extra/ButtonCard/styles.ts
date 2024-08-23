import {StyleSheet} from 'react-native';
import {EdgeInsets} from 'react-native-safe-area-context';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';

export const getStyles = (insets: EdgeInsets) => {
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
      borderColor: COLORS.Neutral.Medium,
      paddingLeft: SIZES.MD,
      paddingRight: SIZES.XS,
      paddingVertical: SIZES.LG,
      justifyContent: 'center',
      // marginBottom: error ? SIZES.XS : 0,
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
      // minHeight:
      //   data && data?.length >= 3 ? 360 : data?.length === 1 ? 220 : 290,
      // maxHeight:
      //   data && data?.length >= 3 ? 360 : data?.length === 1 ? 220 : 290,
    },
  });
  return styles;
};