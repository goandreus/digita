import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';

interface Props {
  children?: ReactElement | ReactElement[];
}

const TabList = ({children}: Props) => {
  const hasItems = React.Children.count(children) !== 0;

  return (
    <View style={styles.tabList}>
      {hasItems &&
        React.Children.map(children, (child, i) => {
          return React.cloneElement(child!, {tabIndex: i});
        })}
    </View>
  );
};

export default TabList;

const styles = StyleSheet.create({
  tabList: {
    overflow: 'hidden',
    flexDirection: 'row',
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
  },
});
