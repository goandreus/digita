import {StyleSheet} from 'react-native';
export const getStyles = (hasLogo: boolean | undefined) => {
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
      marginTop: hasLogo ? -15 : undefined,
    },
    image: {
      alignSelf: 'center',
      bottom: hasLogo ? 348 : 95,
    },
    size: {
      width: 130,
      height: 113,
    },
    toastStyle: {
      borderLeftWidth: 0,
      backgroundColor: '#9a9a9a',
      opacity: 0.9,
      borderRadius: 12,
      width: '64%',
      height: 48,
    },
    toastText1: {height: 0},
    toastText2: {
      color: '#fff',
      fontSize: 15.25,
      fontWeight: 'bold',
    },
  });
  return styles;
};
