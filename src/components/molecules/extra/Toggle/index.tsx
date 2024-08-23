import Icon, {IconName} from '@atoms/Icon';
import Separator from '@atoms/extra/Separator';
import TextCustom from '@atoms/extra/TextCustom';
import {useRoute} from '@react-navigation/native';
import {COLORS, Colors} from '@theme/colors';
import React from 'react';
import {Pressable, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {SIZES} from '@theme/metrics';

interface ToggleProps {
  icon: IconName;
  title: string;
  description: string;
  selected: boolean;
  onToggle: () => void;
  actionName?: string;
}

const Toggle = ({
  icon,
  title,
  description,
  selected,
  onToggle,
  actionName,
}: ToggleProps) => {
  const route = useRoute();

  return (
    <Pressable
      {...{dtActionName: `* ${route.name}-Botón-${actionName || description}`}}
      onPress={onToggle}>
      {({pressed}) => {
        const styles = getStyles(selected, pressed);
        return (
          <>
            <View style={styles.container}>
              <View style={styles.iconWrapper}>
                <Icon name={icon} fill={styles.iconFill} size={SIZES.LG} />
              </View>
              <View style={styles.infoWrapper}>
                <TextCustom
                  variation="h5"
                  lineHeight="tight"
                  weight="normal"
                  style={styles.text}>
                  {title}
                </TextCustom>
                <Separator size={2} />
                <TextCustom
                  variation="p5"
                  lineHeight="tight"
                  weight="normal"
                  style={styles.text}>
                  {description}
                </TextCustom>
              </View>
            </View>
          </>
        );
      }}
    </Pressable>
  );
};

const getStyles = (selected: boolean, pressed: boolean) => {
  const stylesContainer: ViewStyle = {};
  const stylesText: TextStyle = {};
  let iconFill: string;

  switch (selected) {
    case true:
      stylesContainer.backgroundColor = COLORS.Primary.Medium;
      stylesText.color = COLORS.Neutral.Lightest;
      iconFill = COLORS.Neutral.Lightest;
      break;
    case false:
      if (!pressed) {
        stylesContainer.backgroundColor = COLORS.Neutral.Light;
        stylesText.color = COLORS.Neutral.Darkest;
        iconFill = COLORS.Neutral.Darkest;
      } else {
        stylesContainer.backgroundColor = COLORS.Primary.Dark;
        stylesText.color = COLORS.Neutral.Lightest;
        iconFill = COLORS.Neutral.Lightest;
      }
      break;
  }

  const styles = StyleSheet.create({
    container: {
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      paddingHorizontal: 8,
      paddingVertical: 11,
      ...stylesContainer,
    },
    iconWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: SIZES.XS * 5,
      height: SIZES.XS * 5,
    },
    infoWrapper: {
      paddingLeft: 8,
      flex: 1,
      flexDirection: 'column',
    },
    text: {
      ...stylesText,
    },
  });
  return {...styles, iconFill};
};

export default Toggle;
