import React, {ReactElement, useContext} from 'react';
import {StyleSheet, View} from 'react-native';

import {TabContext} from '.';
import {Colors} from '@theme/colors';

interface Props {
  children?: ReactElement | ReactElement[];
}

const TabPanels = ({children}: Props) => {
  const {activeTab} = useContext(TabContext);

  return (
    <View style={styles.tabPanels}>
      {React.Children.toArray(children).map((child, i) => (
        <View style={{display: activeTab === i ? 'flex' : 'none'}} key={i}>
          {child}
        </View>
      ))}
    </View>
  );
};

export default TabPanels;

const styles = StyleSheet.create({
  tabPanels: {
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.Disabled,
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
  },
});
