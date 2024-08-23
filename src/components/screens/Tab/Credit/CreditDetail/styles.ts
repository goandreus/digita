import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {Platform, StyleSheet} from 'react-native';

export const indexStyles = StyleSheet.create({
  skeleton: {
    marginTop: 24,
    marginLeft: 16,
    width: '90%',
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E1E1E1',
  },
});

export const cardStyles = StyleSheet.create({
  mainContainer: {
    borderRadius: SIZES.MD,
    overflow: 'hidden',
  },
  backgroundIcon: {
    position: 'absolute',
    top: 15,
    right: 16,
  },
  subContainer: {
    backgroundColor: COLORS.Background.Lightest,
    paddingHorizontal: SIZES.MD,
    paddingVertical: SIZES.LG,
  },
  payContainer: {
    marginHorizontal: SIZES.LG,
    paddingTop: SIZES.LG,
    borderRadius: SIZES.MD,
    backgroundColor: COLORS.Background.Lightest,
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
  btntooltip: {
    zIndex: 99,
  },
  iconTooltip: {
    marginLeft: 6,
  },
  paySubContainer: {
    overflow: 'hidden',
    borderBottomRightRadius: SIZES.XS,
    borderBottomLeftRadius: SIZES.XS,
  },
  disclaimerContainer: {
    borderRadius: SIZES.XS,
    marginHorizontal: SIZES.LG,
  },
});
