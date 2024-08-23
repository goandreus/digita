import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {Platform, StyleSheet} from 'react-native';
import {EdgeInsets} from 'react-native-safe-area-context';

export const getStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    btnContainer: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: COLORS.Neutral.Medium,
      backgroundColor: COLORS.Background.Lightest,
    },
    btnSubContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: SIZES.MD,
      paddingRight: SIZES.XS,
      paddingVertical: SIZES.XXS * 5,
    },
    modalContainer: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      margin: 0,
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
      maxHeight: Platform.OS === 'ios' ? 420 : 380,
    },
  });

export const getItemStyles = (border?: boolean) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SIZES.LG,
      borderBottomWidth: border ? 1 : 0,
      borderBottomColor: COLORS.Neutral.Light,
    },
    checkbox: {
      paddingVertical: 0,
      paddingHorizontal: 0,
      paddingRight: SIZES.MD,
    },
  });
