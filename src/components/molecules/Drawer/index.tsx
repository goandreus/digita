import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Pressable} from 'react-native';

import Modal from '../Modal';

interface BottomDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

// const {height} = Dimensions.get('window');
const HEIGHT = 449;

const Drawer = ({isOpen, onClose, children}: BottomDrawerProps) => {
  const translateRef = useRef(new Animated.Value(1));

  useEffect(() => {
    const animation = Animated.timing(translateRef.current, {
      duration: 250,
      useNativeDriver: false,
      toValue: isOpen ? 0 : HEIGHT,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [isOpen]);

  const animatedStyle = {
    translateY: translateRef.current,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View style={styles.container}>
        <Pressable style={{flex: 1}} onPress={onClose} />
        <Animated.View
          style={[styles.bottomDrawer, {transform: [animatedStyle]}]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
    position: 'relative',
  },
  line: {
    height: 1,
    marginTop: 25,
    marginRight: 0,
    marginBottom: 15,
    marginLeft: 0,
    width: '100%',
    backgroundColor: '#D3D3D3',
  },
  bottomDrawer: {
    width: '100%',
    paddingTop: 30,
    paddingHorizontal: 24,
    height: HEIGHT,
    backgroundColor: '#fff',
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    position: 'absolute',
    bottom: 0,
    zIndex: 20,
  },
});
