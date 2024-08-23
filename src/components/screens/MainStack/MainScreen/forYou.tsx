import React from 'react'
import { StatusBar, Text, View } from 'react-native'
import { Colors } from '@theme/colors'
import TextCustom from '@atoms/TextCustom'

const ForyouScreen = () => {
    return (
        <>
        <StatusBar
            barStyle="dark-content"
            backgroundColor={Colors.Transparent}
            translucent={true}
        />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TextCustom
                text='Para ti'
                variation='p'
                color={Colors.Black}
            />
        </View>
        </>
    )
}

export default ForyouScreen