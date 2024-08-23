import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import {Platform, StyleSheet} from 'react-native';

export const indexStyles = StyleSheet.create({
  titleContainer: {},
  icon: {marginRight: SIZES.XXS},
  listContainer: {
    marginTop: SIZES.XS,
    /* borderRadius: 12, */
  },
  logo: {
    width: 82,
    height: 143,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    top: -SIZES.LG,
    paddingHorizontal: SIZES.LG,
  },
  containerBtn: {
    alignContent: 'flex-end',
    marginHorizontal: SIZES.LG,
  },
});

export const itemStyles = StyleSheet.create({
  container: {
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 3,
        shadowOpacity: 0.15,
      },
    }),
    marginBottom: SIZES.MD,
    borderRadius: SIZES.XS,
    shadowColor: COLORS.Neutral.Darkest,
    backgroundColor: COLORS.Background.Lightest,
  },
  header: {
    overflow: 'hidden',
    borderTopRightRadius: SIZES.XS,
    borderTopLeftRadius: SIZES.XS,
  },
  moreBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textMore: {
    marginRight: SIZES.XS,
  },
  progressBar: {
    marginTop: 2,
  },
  labelContainer: {
    marginTop: SIZES.MD,
    borderRadius: SIZES.MD,
  },
});

export const cardStyles = StyleSheet.create({
  imageBackground: {
    overflow: 'hidden',
    borderRadius: SIZES.MD,
    /* minHeight: 256, */
  },
  marginRigth: {
    marginRight: SIZES.MD,
  },
  marginLefth: {
    marginLeft: SIZES.MD,
  },
  imageBtn: {
    flexDirection: 'row',
    marginHorizontal: SIZES.MD,
    backgroundColor: COLORS.Secondary.Medium,
    borderRadius: SIZES.XS,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: SIZES.LG * 2,
  },
  iconHands: {
    marginBottom: 9,
  },
  bockedContainer: {position: 'absolute', width: '100%', bottom: 0},
});
