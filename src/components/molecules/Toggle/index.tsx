import Icon, {IconName} from '@atoms/Icon';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import { useRoute } from '@react-navigation/native';
import {Colors} from '@theme/colors';
import React from 'react';
import {Pressable, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';

interface ToggleProps {
  icon?: IconName;
  title: string;
  description?: string;
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
  actionName
}: ToggleProps) => {
  const route = useRoute();

  return (
    <Pressable {...{dtActionName: `* ${route.name}-Botón-${actionName || description}`}} onPress={onToggle}>
      {({pressed}) => {
        const styles = getStyles(selected, pressed);
        return (
          <>
            <View style={styles.container}>
              {icon !== undefined && (
                <View style={styles.iconWrapper}>
                  <Icon name={icon} fill={styles.iconFill} size="small" />
                </View>
              )}
              <View style={styles.infoWrapper}>
                <TextCustom variation="p" weight="bold" style={styles.text}>
                  {title}
                </TextCustom>
                {description !== undefined && (
                  <>
                    <Separator type="xx-small" />
                    <TextCustom variation="small" style={styles.text}>
                      {description}
                    </TextCustom>
                  </>
                )}
              </View>
              {selected && (
                <View style={styles.selectedWrapper}>
                  <Icon name="check" fill={styles.iconFill} size="tiny" />
                </View>
              )}
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
      stylesContainer.backgroundColor = Colors.Primary;
      stylesText.color = Colors.White;
      iconFill = Colors.White;
      break;
    case false:
      if (!pressed) {
        stylesContainer.backgroundColor = Colors.GrayBackground;
        stylesText.color = Colors.Paragraph;
        iconFill = Colors.Paragraph;
      } else {
        stylesContainer.backgroundColor = Colors.PrimaryHover;
        stylesText.color = Colors.White;
        iconFill = Colors.White;
      }
      break;
  }

  const styles = StyleSheet.create({
    container: {
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      paddingRight: 8,
      paddingVertical: 8,
      ...stylesContainer,
    },
    iconWrapper: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: 8 * 7,
    },
    infoWrapper: {
      paddingLeft: 8,
      flex: 1,
    },
    selectedWrapper: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: 8 * 7,
    },
    text: {
      ...stylesText,
    },
  });
  return {...styles, iconFill};
};

export default Toggle;
