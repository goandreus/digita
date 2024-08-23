import {StyleSheet} from 'react-native';
export const getStyles = () => {
  const styles = StyleSheet.create({
    modal: {
      width: '100%',
      alignSelf: 'center',
      position: 'absolute',
      margin: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    scrollView: {
      flexGrow: 1,
      backgroundColor: 'white',
    },
    image: {
      alignSelf: 'center',
      bottom: 95,
    },
  });
  return styles;
};
