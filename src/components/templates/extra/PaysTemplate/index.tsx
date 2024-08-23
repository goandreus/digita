import {
  View,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback, 
  StyleSheet,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BoxView from '@atoms/BoxView';
import TextCustom from '@atoms/extra/TextCustom';
import {SIZES} from '@theme/metrics';
import Separator from '@atoms/extra/Separator';
import {HeaderStack} from '@molecules/extra/HeaderStack';

interface PaysTemplateProps {
  headerTitle: string;
  title: string;
  children?: React.ReactNode;
  footerInfo?: React.ReactNode;
  canGoBack: boolean;
  goBack: () => void;
}

const PaysTemplate = ({
  headerTitle,
  title,
  children,
  canGoBack,
  footerInfo,
  goBack,
}: PaysTemplateProps) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles();

  return (
    <>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="white"
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BoxView flex={1} background="background-lightest" style={{marginTop: insets.top}}>
          <BoxView style={styles.headerBorder} mt={2}>
            <HeaderStack
              canGoBack={canGoBack}
              onBack={goBack}
              title={headerTitle}
              noInsets={true}
            />
          </BoxView>
          <Separator size={SIZES.XS * 5} />
          <BoxView mx={24}>
            <TextCustom
              color="primary-medium"
              variation="h2"
              weight="normal"
              lineHeight="tight">
              {title}
            </TextCustom>
          </BoxView>
          <Separator size={30} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{paddingHorizontal: 24, marginBottom: 40}}
            >
            <View>
              {children}
            </View>
            <View>
              {footerInfo}
            </View>
          </ScrollView>
        </BoxView>
      </TouchableWithoutFeedback>

    </>
  );
};

const getStyles = () => {
  const styles = StyleSheet.create({
    headerBorder: {
      borderColor: "rgba(0,0,0,0.01)",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 12,
    }
  });

  return styles;
};

export default PaysTemplate;

