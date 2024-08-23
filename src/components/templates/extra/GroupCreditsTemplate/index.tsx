import {
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback, 
  StyleSheet,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BoxView from '@atoms/BoxView';
import {HeaderStack} from '@molecules/extra/HeaderStack';

interface GroupCreditsTemplateProps {
  headerTitle: string;
  title?: string;
  children?: React.ReactNode;
  footerInfo?: React.ReactNode;
  canGoBack: boolean;
  goBack: () => void;
}

const GroupCreditsTemplate = ({
  headerTitle,
  title,
  children,
  canGoBack,
  goBack,
}: GroupCreditsTemplateProps) => {
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 40}}
            >
            <BoxView>
              {children}
            </BoxView>
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

export default GroupCreditsTemplate;

