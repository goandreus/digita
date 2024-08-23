import {StyleSheet} from 'react-native';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';

export const styles = StyleSheet.create({
  contactIcon: {
    borderRadius: 50,
    backgroundColor: COLORS.Primary.Light,
    height: 34,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  contactWrapper: {
    borderBottomWidth: 0.5,
    paddingVertical: 8,
    borderBottomColor: COLORS.Neutral.Medium,
  },
  contactInfo: {
    width: '90%',
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
    flexShrink: 1,
  },
  containerBtn: {
    alignContent: 'flex-end',
    marginHorizontal: SIZES.LG,
  },
});
