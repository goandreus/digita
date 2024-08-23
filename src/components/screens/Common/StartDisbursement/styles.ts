import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {StyleSheet} from 'react-native';
import {EdgeInsets} from 'react-native-safe-area-context';

export const indexStyles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: SIZES.LG,
    backgroundColor: COLORS.Primary.Medium,
  },
  creditContainer: {
    borderRadius: SIZES.MD,
    overflow: 'hidden',
  },
  btnEdit: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  pickerContainer: {borderRadius: 12, backgroundColor: 'white'},
  containerBtn: {
    marginHorizontal: SIZES.LG,
  },
});

export const getStylesFromTemplate = ({insets}: {insets: EdgeInsets}) => {
  const stylesBase = StyleSheet.create({
    boxContainer: {},
    imageBackground: {
      position: 'absolute',
      right: 10,
      overflow: 'visible',
      zIndex: 99,
    },
    logo: {
      width: 222,
      height: 69,
    },
    backContainer: {
      left: 0,
    },
    scrollContainer: {
      flex: 1,
      backgroundColor: COLORS.Primary.Medium,
    },
    body: {
      paddingHorizontal: SIZES.LG,
    },
    footer: {
      paddingHorizontal: SIZES.LG,
      paddingTop: SIZES.MD,
      paddingBottom: insets.bottom + SIZES.XL,
      backgroundColor: COLORS.Primary.Medium,
      shadowColor: 'dark',
      shadowOffset: {width: 0, height: 1.5},
      shadowRadius: SIZES.XS / 2,
    },
  });

  return stylesBase;
};
