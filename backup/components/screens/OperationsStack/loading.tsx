import React, { useEffect } from 'react'
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native'
import Svg, {Path} from 'react-native-svg'
import { Colors } from '@theme/colors'
import AnimatedLottieView from 'lottie-react-native'

const ConfirmLoading = () => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

    return (
    <View style={styles.container}>
        <StatusBar
            barStyle="light-content"
            backgroundColor={Colors.Transparent}
            translucent={true}
        />
        <Svg
        viewBox="0 0 360 757"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <Path
          d="M360 0L359.995 611.5C274.073 701.183 153.26 757 19.446 757C12.9323 757 0 756.606 0 756.606L0.997458 0.000156403L360 0Z"
          fill={Colors.Primary}
        />
      </Svg>
      <View style={styles.containerLogo}>
        <AnimatedLottieView
          style={{width: '50%'}}
          source={require('@assets/images/confirmLoading.json')}
          autoPlay
          loop
        />
      </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.PrimaryHover,
    },
    containerLogo: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
  });

export default ConfirmLoading