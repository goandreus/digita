import Icon from '@atoms/Icon';
import Separator from '@atoms/Separator';
import TextCustom from '@atoms/TextCustom';
import {Colors} from '@theme/colors';
import React, {ReactNode} from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useRoute } from '@react-navigation/native';


type stateType = 'neutral' | 'saved';

interface ComplexButtonProps {
  title: string;
  description: string;
  onPress: (e: GestureResponderEvent) => void;
  state?: stateType;
  disabled?: boolean;
}

const ComplexButton = ({
  title,
  description,
  state = 'neutral',
  onPress,
  disabled = false,
}: ComplexButtonProps) => {
  const styles = getStyles({disabled, state});
  const route = useRoute();

  const customOnPress = (e: GestureResponderEvent) => {
    if (disabled) return undefined;
    return onPress(e);
  };

  return (
    <Pressable
      {...disabled ? {dtActionIgnore: true} : {dtActionName: `* ${route.name}-Botón-${title}`}}
      onPress={customOnPress}
      style={styles.container}>
      <View style={styles.textContainer}>
        <TextCustom
          text={title}
          weight="bold"
          variation="p"
          style={styles.title}
        />
        <Separator type="xx-small" />
        {state === 'saved' && (
          <View style={styles.descriptionWrapper}>
            <Icon
              name="check-on"
              size="tiny"
              fill={styles.descriptionIconFill}
              style={styles.descriptionIcon}
            />
            <TextCustom
              text="Enviado"
              variation="p"
              style={styles.description}
            />
          </View>
        )}
        {state === 'neutral' && (
          <TextCustom
            text={description}
            variation="p"
            style={styles.description}
          />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TextCustom
          text={state === 'saved' ? 'Cambiar' : 'Iniciar'}
          weight="bold"
          variation="p"
          style={styles.buttonLabel}
        />
        <Icon name="chevron-right" size="tiny" fill={styles.buttonIconFill} />
      </View>
    </Pressable>
  );
};

const getStyles = ({
  disabled,
  state,
}: {
  disabled: boolean;
  state: stateType;
}) => {
  const container: ViewStyle = {};
  const buttonLabel: TextStyle = {};
  let buttonIconFill: string;
  let descriptionIconFill: string;
  const title: TextStyle = {};
  const description: TextStyle = {};

  if (disabled) {
    title.color = Colors.Disabled;
    description.color = Colors.Disabled;
    buttonLabel.color = Colors.Disabled;
    buttonIconFill = Colors.Disabled;
    descriptionIconFill = Colors.Disabled;
  } else {
    buttonLabel.color = Colors.Primary;
    buttonIconFill = Colors.Primary;
    descriptionIconFill = Colors.GreenCheck;
  }

  switch (state) {
    case 'saved':
      container.borderStyle = 'solid';
      if (disabled) container.borderColor = Colors.Disabled;
      else container.borderColor = Colors.GreenCheck;
      container.borderWidth = 1;
      break;
    case 'neutral':
      container.borderStyle = 'solid';
      if (disabled) container.borderColor = Colors.GrayBackground;
      else container.borderColor = Colors.GrayBackground;
      container.borderWidth = 1;
      break;
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 5,
      padding: 8 * 2 - 1,
      backgroundColor: Colors.GrayBackground,
      ...container,
    },
    textContainer: {
      flex: 1,
    },
    descriptionWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    descriptionIcon: {
      marginRight: 8,
    },
    title: {
      ...title,
    },
    description: {
      ...description,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonLabel: {
      marginRight: 8,
      ...buttonLabel,
    },
  });
  return {...styles, buttonIconFill, descriptionIconFill};
};

export default ComplexButton;
