import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {StyleSheet} from 'react-native';

export const indexStyles = StyleSheet.create({
  containerBtn: {
    alignContent: 'flex-end',
    marginHorizontal: SIZES.LG,
  },
  topContainer: {
    borderRadius: SIZES.XS,
    borderWidth: 1,
    backgroundColor: COLORS.Background.Light,
    borderColor: COLORS.Neutral.Light,
  },
  bottomContainer: {
    borderRadius: SIZES.XS,
    backgroundColor: COLORS.Warning.Lightest,
  },
  txtWarning: {
    flex: 1,
    marginLeft: SIZES.XS,
  },
  banner: {
    borderRadius: 8,
    padding: SIZES.MD,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    shadowOpacity: 0.15,
    shadowColor: '#222D42',
    elevation: 3,
  },
  containerInfo: {
    borderRadius: SIZES.XS,
  },
  text: {
    marginLeft: SIZES.XS,
  },
  block: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.Neutral.Light,
  },
});
