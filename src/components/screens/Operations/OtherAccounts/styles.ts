import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {StyleSheet} from 'react-native';

export const indexStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  containerInfo: {
    borderRadius: SIZES.XS,
  },
  containerInfoDeferred: {
    borderRadius: SIZES.XS,
    backgroundColor: '#F6F6F9',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    shadowOpacity: 0.15,
  },
  containerBtn: {
    alignContent: 'flex-end',
    marginHorizontal: SIZES.LG,
  },
  icon: {
    marginRight: SIZES.XS,
  },
  text: {
    marginLeft: SIZES.XS,
    flexShrink: 1,
  },
  block: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.Neutral.Light,
  },
  scrollView: {
    paddingHorizontal: 30,
    height: '100%',
  },
  messageContainer: {
    borderWidth: 1,
    padding: 12,
    borderColor: COLORS.Neutral.Medium,
    borderRadius: 6,
  },
  ownerName: {
    marginBottom: SIZES.XXS,
    width: 120,
  },
  imageClock: {
    resizeMode: 'contain',
    width: '20%',
    maxHeight: 60,
  },
  favorite_content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: 'rgba(0,0,0,0.01)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    zIndex: 1,
  },
  favorite_success: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
