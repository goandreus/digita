import Icon from '@atoms/Icon';
import TextCustom from '@atoms/TextCustom';
import {Colors} from '@theme/colors';
import React from 'react';
import {StyleSheet, View} from 'react-native';

interface InfoBoxProps {
  message: string;
}

const NotificationBox = ({message}: InfoBoxProps) => {
  const styles = getStyles();
  return (
    <View style={styles.container}>
      <Icon
        name="exclamation-circle"
        fill={Colors.GrayDark}
        size="small"
        style={styles.icon}
      />
      <View style={styles.textWrapper}>
        <TextCustom variation="small" weight="bold">
          {message}
        </TextCustom>
      </View>
    </View>
  );
};

const getStyles = () => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 8,
      backgroundColor: Colors.GrayBackground,
      borderRadius: 5,
      alignItems: 'center',
    },
    icon: {
      marginRight: 8,
    },
    textWrapper: {
      flexShrink: 1,
    },
  });
  return styles;
};

export default NotificationBox;
