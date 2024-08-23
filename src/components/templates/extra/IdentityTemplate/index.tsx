import React from 'react';
import {ColorValue, StatusBar} from 'react-native';
import Steps, {StepsProps} from '@molecules/extra/Steps';
import {COLORS} from '@theme/colors';
import BoxView from '@atoms/BoxView';
import {HeaderStack} from '@molecules/extra/HeaderStack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import {SIZES} from '@theme/metrics';

interface IdentityTemplateProps {
  headerTitle: string;
  title: string;
  stepsProps?: StepsProps;
  barColor?: ColorValue;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  canGoBack: boolean;
  extraTopSpace?: boolean;
  goBack: () => void;
}

const IdentityTemplate = ({
  stepsProps,
  barColor = COLORS.Background.Lightest,
  canGoBack,
  goBack,
  headerTitle,
  title,
  children,
}: IdentityTemplateProps) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor={barColor}
      />
      <BoxView flex={1}>
        <BoxView flex={1} background="background-lightest">
          <HeaderStack
            canGoBack={canGoBack}
            onBack={goBack}
            title={headerTitle}
          />
          {stepsProps !== undefined && (
            <Steps
              max={stepsProps.max}
              current={stepsProps.current}
              started={stepsProps.started}
            />
          )}
          <Separator size={SIZES.XS * 4} />
          <BoxView mx={SIZES.LG}>
            {stepsProps !== undefined && stepsProps.current !== undefined && (
              <>
                <TextCustom
                  color="neutral-dark"
                  variation="h5"
                  weight="normal"
                  lineHeight="tight">
                  Paso {stepsProps.current + 1} de {stepsProps.max}
                </TextCustom>
                <Separator size={SIZES.XS} />
              </>
            )}
            <TextCustom
              color="primary-medium"
              variation="h2"
              weight="normal"
              lineHeight="tight">
              {title}
            </TextCustom>
          </BoxView>
          <Separator size={30} />
          <BoxView mx={SIZES.LG}>{children}</BoxView>
        </BoxView>
      </BoxView>
    </>
  );
};

export default IdentityTemplate;
