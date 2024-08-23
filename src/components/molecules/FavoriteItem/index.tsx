import React from 'react'
import Icon from '@atoms/Icon'
import TextCustom from '@atoms/TextCustom'
import { Colors } from '@theme/colors'
import { TouchableOpacity, View } from 'react-native'

const FavoriteItem = ({title}: {title: string}) => {
    return (
        <TouchableOpacity style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            paddingVertical:12,
            paddingHorizontal:18,
            borderRadius:12,
            paddingBottom:16,
            borderBottomColor: '#EFEFEF',
            borderBottomWidth:0.8,
        }}>
            <View style={{width:'75%'}}>
                <TextCustom
                    text={title}
                    variation='p'
                    weight='bold'
                    color={Colors.Paragraph}
                    size={18}
                />
            </View>
            <Icon
                name='arrow-right'
                fill='#fff'
                size='tiny'
            />
        </TouchableOpacity>
    )
}

export default FavoriteItem