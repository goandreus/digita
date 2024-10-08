import * as React from 'react';
import { StatusBar, StatusBarProps } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const FocusAwareStatusBar = (props: StatusBarProps) => {
  const isFocused = useIsFocused();
  console.log("isFocused",isFocused);
  return isFocused ? <StatusBar {...props} /> : null;
}

export default FocusAwareStatusBar;