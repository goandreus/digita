import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import TextCustom from '@atoms/TextCustom';
import {Colors} from '@theme/colors';
import Icon, {IconName} from '@atoms/Icon';
import {TabContext} from '.';

interface Props {
  text?: string;
  icon?: IconName;
  tabIndex?: number;
  onPress?: () => void;
}

const TabButton = ({text, icon, tabIndex, onPress}: Props) => {
  const {activeTab, setTabActive} = useContext(TabContext);

  const isActive = tabIndex === activeTab;

  return (
    <Pressable
      onPress={() => {
        onPress?.();
        setTabActive(tabIndex ?? 0);
      }}
      style={[
        styles.tabButton,
        isActive ? styles.tabButton_active : styles.tabButton_inactive,
      ]}>
      {icon && (
        <Icon
          name={icon}
          size="tiny"
          style={{marginRight: 12}}
          fill={isActive ? Colors.White : Colors.Paragraph}
        />
      )}
      <TextCustom
        text={text}
        variation="p"
        weight="bold"
        align="center"
        color={isActive ? Colors.White : Colors.Paragraph}
      />
    </Pressable>
  );
};

export default TabButton;

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton_active: {
    backgroundColor: Colors.Primary,
  },
  tabButton_inactive: {
    backgroundColor: Colors.GrayBackground,
  },
});
