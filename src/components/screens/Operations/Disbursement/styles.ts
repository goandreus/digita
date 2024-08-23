import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {StyleSheet} from 'react-native';

export const indexStyles = StyleSheet.create({
  containerBtn: {
    alignContent: 'flex-end',
    marginHorizontal: SIZES.LG,
  },
  block: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.Neutral.Light,
  },
  containerInfo: {
    borderRadius: SIZES.XS,
  },
  text: {
    marginLeft: SIZES.XS,
  },
  btnTooltip: {position: 'relative', zIndex: 99},
  iconTooltip: {marginLeft: 6},
  box: {
    borderColor: COLORS.Neutral.Light,
    borderWidth: 1,
    borderRadius: 8,
    padding: SIZES.MD,
  },
  banner: {
    borderRadius: 8,
    padding: SIZES.MD,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    shadowOpacity: 0.15,
    shadowColor: '#222D42',
  },
  disclaimerContainer: {
    borderRadius: SIZES.XS,
  },
  disclaimerIcon: {
    padding: SIZES.XXS,
    marginLeft: SIZES.MD,
  },
  disclaimerText: {
    marginLeft: SIZES.XS,
  },
});
