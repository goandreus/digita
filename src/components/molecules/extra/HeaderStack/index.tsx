import React from 'react';
import {View} from 'react-native';
import HeaderBackButton from '../HeaderBackButton';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface HeaderStackProps {
  canGoBack: boolean;
  onBack: () => void;
  title: string;
  noInsets?: boolean;
}

export const HeaderStack = ({canGoBack, onBack, title, noInsets}: HeaderStackProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{backgroundColor: 'white'}}>
      <View
        style={{
          marginTop: noInsets ? 0 : insets.top,
          height: SIZES.XS * 7,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          position: 'relative',
        }}>
        <View
          style={{
            position: 'absolute',
            left: 10,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99,
          }}>
          <HeaderBackButton canGoBack={canGoBack} onPress={onBack} />
        </View>
        <TextCustom
          text={title}
          color="neutral-darkest"
          weight="normal"
          variation="h0"
          lineHeight="fair"
          align="center"
          style={{paddingHorizontal: SIZES.XS * 7 + 10 + 10}}
        />
      </View>
    </View>
  );
};
