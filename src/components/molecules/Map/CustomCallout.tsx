import {Colors} from '@theme/colors';
import React, {ReactElement} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  children?: ReactElement | ReactElement[];
}

const CustomCallout = (props: Props) => {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.bubble}>
        <View style={styles.content}>{props.children}</View>
      </View>
      <View style={styles.arrowBorder} />
      <View style={styles.arrow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    elevation: 1,
  },
  bubble: {
    width: 230,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: Colors.White,
    padding: 12,
    borderRadius: 8,
    borderColor: Colors.White,
    borderWidth: 0.5,
  },
  content: {
    flex: 1,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    borderTopColor: Colors.White,
    alignSelf: 'center',
    marginTop: -32,
    elevation: 1,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    alignSelf: 'center',
    marginTop: -0.5,
  },
});

export default CustomCallout;
