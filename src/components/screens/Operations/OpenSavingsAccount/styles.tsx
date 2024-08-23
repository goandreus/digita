import {StyleSheet} from 'react-native';
import {SIZES} from '@theme/metrics';
import {FONTS} from '@theme/fonts';
import {COLORS} from '@theme/colors';

export const styles = StyleSheet.create({
  headerBorder: {
    borderTopWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.01)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 12,
  },
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
  containerBtn: {
    paddingHorizontal: SIZES.LG,
  },
  styleBtn: {
    marginBottom: 32,
  },
  containerCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.Neutral.Lightest,
    borderRadius: SIZES.XS,
  },
  textSubtitle: {
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '500',
    fontFamily: FONTS.Bree,
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
    width: '90%',
    flexShrink: 1,
  },
  containerBox: {
    borderRadius: 12,
    width: '100%',
    shadowColor: '#222D42',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  containerTexts: {
    width: '65%',
  },
  containerBoxText: {
    width: '90%',
  },
  imageBacground: {
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#91004B',
  },
});
