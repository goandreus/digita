import React, {useEffect, useState} from 'react';
import {Pressable, View, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';

interface RadioButtonProps {
  active?: boolean;
  disabled?: boolean;
  onChange?: (active: boolean) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  active = false,
  disabled = false,
  onChange,
}) => {
  const [isActive, setIsActive] = useState<boolean>(active);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  const handlePress = () => {
    setIsActive(!isActive);
    if (onChange) {
      onChange(!isActive);
    }
  };

  return (
    <Pressable
      onPress={() => {
        if (!disabled) {
          handlePress();
        }
      }}
      style={({pressed}) => [
        styles.container,
        isActive && styles.active,
        pressed && styles.pressed,
      ]}>
      <View>
        {isActive && (
          <Svg width="11" height="8" viewBox="0 0 11 8" fill="none">
            <Path
              d="M4.2016 5.57895L1.73935 3.19653C1.41544 2.88311 0.899959 2.88763 0.581587 3.20667C0.260187 3.52874 0.260183 4.05021 0.581578 4.37229L3.84768 7.64533C4.04302 7.84109 4.36018 7.84109 4.55553 7.64533L10.4076 1.78104C10.735 1.45296 10.735 0.921774 10.4076 0.593698C10.0802 0.265612 9.54896 0.264514 9.2202 0.591244L4.2016 5.57895Z"
              fill="#fff"
            />
          </Svg>
        )}
      </View>
    </Pressable>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  container: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#697385',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#CA005D',
    borderColor: '#CA005D',
  },
  pressed: {
    transform: [{scale: 0.95}],
    opacity: 0.8,
  },
});
