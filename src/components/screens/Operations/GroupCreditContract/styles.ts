import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {StyleSheet} from 'react-native';

export const indexStyles = StyleSheet.create({
  containerBtn: {
    alignContent: 'flex-end',
    marginHorizontal: SIZES.LG,
  },
  btnTooltip: {position: 'relative', zIndex: 99},
  iconTooltip: {marginLeft: 6},
  block: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.Neutral.Light,
  },
  containerInfo: {
    borderRadius: SIZES.XS,
  },
  iconContainer: {
    marginRight: SIZES.MD,
  },
  text: {
    marginLeft: SIZES.XS,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export const modalStyles = StyleSheet.create({
  containerBtn: {
    /* alignContent: 'flex-end', */
    marginHorizontal: SIZES.LG,
  },
  block: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.Neutral.Light,
  },
});
