import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {StyleSheet} from 'react-native';

export const indexStyles = StyleSheet.create({
  containerBtn: {
    alignContent: 'flex-end',
    marginHorizontal: SIZES.LG * 2,
  },
});

export const contentStyles = StyleSheet.create({
  imageBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 260,
    width: '100%',
  },
  containerInfo: {
    borderRadius: SIZES.XS,
  },
  text: {
    marginLeft: SIZES.XS,
  },
  arrowIcon: {
    marginLeft: SIZES.XS,
  },
});

export const modalStyles = StyleSheet.create({
  containerBtn: {
    /* alignSelf: 'flex-start', */
    width: '100%',
  },
  containerInfo: {
    flex: 1,
    borderRadius: SIZES.XS,
  },
  text: {
    marginLeft: SIZES.XS,
  },
  block: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.Neutral.Light,
  },
  operationContent: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    margin: 0,
  },
  infoContainer: {
    borderRadius: SIZES.XS,
    elevation: 3,
    shadowColor: COLORS.Neutral.Darkest,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    shadowOpacity: 0.16,
  },
  logo: {
    width: 65,
    aspectRatio: 65 / 77,
  },
});
