import React, { useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'

const Skeleton = ({ children, timing = 800, ...rest }) => {
  const animatedValue = useRef(new Animated.Value(0.5)).current

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: timing,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0.5,
                    duration: timing,
                    useNativeDriver: true
                }),
            ]),
        ).start()
    }, [animatedValue, timing])

    const animatedStyles = {
        opacity: animatedValue.interpolate({
          inputRange: [0.5, 1],
          outputRange: [0.2, 0.8],
        }),
    }

    return (
        <Animated.View style={animatedStyles}>
            <View {...rest} />
            {children}
        </Animated.View>
    )
}

export default Skeleton