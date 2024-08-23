import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
export const getStyles = () => {
  const FIGMA_WIDTH = 360;
  const WIDTH = Dimensions.get('screen').width;
  const normalize = (y: number) => (y / FIGMA_WIDTH) * WIDTH;

  const MODAL_WIDTH = normalize(320);
  const COL_ONE_WIDTH = normalize(110);
  const COL_TWO_WIDTH = normalize(160);
  const PADDING_EXTERNO = normalize(28);
  const PADDING_INTERNO = normalize(12);
  const styles = StyleSheet.create({
    modal: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      margin: 0,
    },
    view: {
      backgroundColor: '#FFF',
      position: 'absolute',
      alignSelf: 'center',
      width: '100%',
      paddingHorizontal: SIZES.LG * 2,
      borderRadius: 12,
      bottom: 0,
      opacity: 1,
    },
    wrapper: {
      width: MODAL_WIDTH,
      alignSelf: 'center',
      paddingTop: 26,
      paddingBottom: PADDING_EXTERNO,
      paddingHorizontal: PADDING_EXTERNO,
      backgroundColor: COLORS.Background.Light,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    btn_close: {
      width: '100%',
      marginBottom: 6,
      alignItems: 'flex-end',
    },
    table: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#EFEFEF',
      overflow: 'hidden',
      marginBottom: 24,
    },
    header: {
      paddingTop: 12,
      paddingBottom: 14,
      flexDirection: 'row',
      paddingHorizontal: PADDING_INTERNO,
      backgroundColor: '#F6F6F9',
    },
    table_row: {
      flexDirection: 'row',
      borderBottomColor: '#EFEFEF',
      borderBottomWidth: 1,
      /* paddingVertical: SIZES.XS, */
    },
    table_col_one: {
      width: COL_ONE_WIDTH,
      paddingHorizontal: PADDING_INTERNO,
      paddingVertical: 8,
      borderRightWidth: 1,
      borderRightColor: '#EFEFEF',
      justifyContent: 'center',
    },
    table_col_two: {
      paddingVertical: 8,
      width: COL_TWO_WIDTH,
      paddingHorizontal: PADDING_INTERNO,
    },
    txt: {
      marginVertical: SIZES.XS,
    },
  });
  return styles;
};
