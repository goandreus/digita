import {COLORS} from '@theme/colors';
import {FONTS, FONTS_LINE_HEIGHTS_FACTOR, FONT_SIZES} from '@theme/fonts';
import {SIZES} from '@theme/metrics';
import {StyleSheet} from 'react-native';
import {EdgeInsets} from 'react-native-safe-area-context';

export const indexStyles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    width: '100%',
  },
  containerBtn: {
    alignContent: 'flex-end',
    marginHorizontal: SIZES.LG,
  },
});

export const loadStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  lottieView: {
    width: '100%',
  },
});

export const tabStyles = StyleSheet.create({
  lisTabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    /* marginVertical: SIZES.XXS * 3, */
  },
  tabContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    maxHeight: SIZES.LG * 2,
    marginVertical: (SIZES.XXS * 3) / 2,
    marginRight: SIZES.XS,
    borderRadius: SIZES.MD,
  },
  itemTab: {
    padding: SIZES.MD,
    borderRadius: SIZES.MD,
  },
  itemTabNotSelected: {
    borderColor: COLORS.Neutral.Medium,
  },
  itemTabSelected: {
    backgroundColor: COLORS.Primary.Lightest,
    borderColor: COLORS.Primary.Medium,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: SIZES.MD,
    fontSize: FONT_SIZES.MD,
    fontFamily: FONTS.Bree,
  },
});

export const modalStyles = (insets: EdgeInsets) => {
  const styles = StyleSheet.create({
    modal: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      margin: 0,
    },
    container: {
      backgroundColor: COLORS.Primary.Medium,
      borderTopLeftRadius: SIZES.XS,
      borderTopRightRadius: SIZES.XS,
      paddingHorizontal: SIZES.LG,
      paddingTop: SIZES.XS * 5,
      paddingBottom: SIZES.XS * 5 + insets.bottom,
    },
    subContainer: {
      borderRadius: SIZES.MD,
    },
    radiusContainer: {
      borderRadius: SIZES.XS,
    },
    margin: {
      marginLeft: SIZES.XS,
    },
    containerBtn: {
      marginHorizontal: SIZES.LG,
    },
    textBtn: {
      color: COLORS.Neutral.Lightest,
    },
  });
  return styles;
};
