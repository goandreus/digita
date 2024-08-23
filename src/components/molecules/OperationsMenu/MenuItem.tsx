import TextCustom from '@atoms/extra/TextCustom';
import { COLORS } from '@theme/colors';
import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Props { 
    label: string;
    icon: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>
}


const MenuItem = (props: Props) => {

    return (
        <TouchableOpacity
            disabled={props.disabled}
            onPress={(e) => {
                if(props.onPress !== undefined)props.onPress();
            }}
            style={[
                {
                    flexDirection: 'column',
                    alignItems: 'center',
                }, 
                props.style
            ]}>
            <View style={{ marginBottom: 6 }}>
                <View style={{
                    backgroundColor: props.disabled ? "#C4C4C4" : COLORS.Primary.Medium,
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {props.icon}
                </View>
            </View>
            <TextCustom
                text={props.label}
                variation='h6'
                weight="normal"
                style={{ color: "#83786F", textAlign:'center' }}
            />
        </TouchableOpacity>
    );

}

export default MenuItem;