import React from 'react'
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native'
import Separator from '@atoms/Separator'
import TextCustom from '@atoms/TextCustom'
import { Colors } from '@theme/colors'
import { ScreenSize, SEPARATOR_BASE } from '@theme/metrics'

interface SuccessTransferTemplateProps {
    title?: string;
    children?: React.ReactNode;
}

const SuccessTransferTemplate = ({title,children}: SuccessTransferTemplateProps) => {
    const styles = getStyles()
    const deviceHeight = Dimensions.get('window').height;

    return (
        <View style={{backgroundColor: Colors.White, flex:1}}>
            <View style={{justifyContent:'center',backgroundColor:Colors.Primary,height:'10%',paddingTop:100}}>
                <ImageBackground resizeMode='contain' style={{height:ScreenSize.height/3,justifyContent:'center'}} source={require('@assets/images/successTransferAvatar.png')}>
                    <View style={{}}>
                        <View style={{
                            flexDirection:'row',
                            alignItems: 'center',
                            marginLeft: '4%',
                        }}>
                            <TextCustom
                                style={{marginLeft: 8,width:deviceHeight >= 720 ? '50%' : '40%'}}
                                text={title}
                                variation='p'
                                color={Colors.White}
                                weight='bold'
                                size={25}
                            />
                            <Separator type='large' />
                        </View>
                    </View>
                </ImageBackground>
            </View>

            <Separator type='large' />
            <Separator type='medium' />

            <View style={styles.body}>
                {children}
            </View>
        </View>
    )
}

const getStyles = () => {
    const stylesBase = StyleSheet.create({
      body: {
        marginBottom: SEPARATOR_BASE * 1.5, 
        marginHorizontal: '6%',
        backgroundColor: Colors.White,
        height: '75%'
      },
    })
    return stylesBase
}

export default SuccessTransferTemplate