import Icon from '@atoms/Icon';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import OperationsMenu from '@molecules/OperationsMenu';
import TransfersMenu from '@molecules/TransfersMenu';
import {Colors} from '@theme/colors';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';

interface TransfersTemplateProps {
  title?: string;
  titleSize?: number;
  titleWidth?: string;
  children?: React.ReactNode;
  showMenu?: 'operations' | 'transfers';
  goBack?: () => void;
  variant?: 'default' | 'close';
  onPressOwnAccounts?: () => void;
  onPressSameBank?: () => void;
  onPressOtherBanks?: () => void;
  onPressRefillBim?: () => void;
  onPressTransfers?: () => void;
  onPressPayCredits?: () => void;
}

const TransfersTemplate = ({
  title,
  titleSize,
  titleWidth,
  children,
  variant = 'default',
  showMenu,
  onPressOwnAccounts,
  goBack,
  onPressSameBank,
  onPressOtherBanks,
  onPressRefillBim,
  onPressTransfers,
  onPressPayCredits,
}: TransfersTemplateProps) => {
  const styles = getStyles();

  return (
    <View style={{backgroundColor: Colors.White, flex: 1}}>
      <Svg
        style={{alignSelf: 'center'}}
        width="100%"
        height="150"
        viewBox="15 0 360 112"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          scaleX={1.1}
          d="M359.998 -88.9999V75.9809C317.642 91.7253 267.715 101.952 207.381 107.565C127.797 114.968 57.6709 112.27 0 105.583L5.45208e-06 -89L359.998 -88.9999Z"
          fill="#CA005D"
        />
      </Svg>

      <View
        style={{
          width: '90%',
          alignSelf: 'center',
          position: 'absolute',
          top: '5%',
          left: 6,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: '4%',
            marginBottom: '-6%',
          }}>
          {variant === 'default' && (
            <TouchableOpacity onPress={goBack}>
              <Icon name="arrow-left" fill={Colors.Black} size="tiny" />
            </TouchableOpacity>
          )}
          <TextCustom
            style={{marginLeft: 8, width: titleWidth}}
            text={title}
            variation="p"
            color={Colors.White}
            weight="bold"
            size={titleSize ?? 24}
          />
          {variant === 'close' && (
            <TouchableOpacity
              onPress={goBack}
              style={{right: 0, position: 'absolute'}}>
              <Icon name="close" fill={Colors.Black} size="tiny" />
            </TouchableOpacity>
          )}

          <Separator type="large" />
        </View>
      </View>

      {showMenu === 'operations' && (
        <OperationsMenu
          screen="operationsMenu"
          showElementsAs="list"
          onPressRefillBim={onPressRefillBim}
          onPressTransfers={onPressTransfers}
          onPressPayCredits={onPressPayCredits}
        />
      )}

      {showMenu === 'transfers' && (
        <TransfersMenu
          action={onPressOwnAccounts}
          onPressSameBank={onPressSameBank}
          onPressOtherBanks={onPressOtherBanks}
        />
      )}

      <View style={styles.body}>{children}</View>
    </View>
  );
};

const getStyles = () => {
  const stylesBase = StyleSheet.create({
    body: {
      marginHorizontal: '6%',
      backgroundColor: Colors.White,
      flex: 1,
    },
  });
  return stylesBase;
};

export default TransfersTemplate;
