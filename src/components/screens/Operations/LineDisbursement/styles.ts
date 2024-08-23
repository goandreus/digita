import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {Platform, StyleSheet} from 'react-native';

export const indexStyles = StyleSheet.create({
  containerBtn: {
    alignContent: 'flex-end',
    marginHorizontal: SIZES.LG,
  },
  containerInfo: {
    borderRadius: SIZES.XS,
  },
  borderContainer: {
    borderWidth: 1,
    borderColor: COLORS.Neutral.Light,
  },
  iconContainer: {
    marginRight: SIZES.XS,
  },

  pickerContainer: {borderRadius: 12, backgroundColor: 'white'},

  emptyContainer: {
    borderWidth: 1,
    borderColor: COLORS.Neutral.Medium,
  },

  text: {
    marginLeft: SIZES.XS,
  },

  btnTooltip: {zIndex: 99},
  iconTooltip: {marginLeft: 4},

  block: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.Neutral.Light,
  },

  banner: {
    borderRadius: 8,
    paddingHorizontal: SIZES.MD,
    paddingVertical: SIZES.LG,
    shadowColor: COLORS.Neutral.Darkest,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 3,
        shadowOpacity: 0.15,
      },
    }),
  },
  disclaimerContainer: {
    borderRadius: SIZES.XS,
  },
  disclaimerText: {
    marginLeft: SIZES.XS,
  },

  accountContainer: {
    borderRadius: SIZES.MD,
    borderWidth: 1,
    borderColor: COLORS.Primary.Light,
    overflow: 'hidden',
  },
  iconRow: {
    marginRight: SIZES.MD,
  },
  iconAdvisor: {
    position: 'absolute',
    right: 5,
    top: -50,
    width: 51,
    height: 54,
  },

  payActionLogo: {
    width: 61,
    height: 66,
  },
});
