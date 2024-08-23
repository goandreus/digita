import Icon, { SvgIconName } from '@atoms/Icon';
import TextCustom from '@atoms/extra/TextCustom';
import { COLORS } from '@theme/colors';
import { SIZES } from '@theme/metrics';
import React from 'react'
import { Pressable, View } from 'react-native';

interface Props {
    label: string;
    iconName: SvgIconName;
    onPress?: () => void;
}

const MenuItem = (props: Props) => {

    return (
        <Pressable
            onPress={props.onPress}
            style={{
                paddingHorizontal: SIZES.XS * 2,
            }}>
            <View style={{
                borderBottomColor: "#EFEFEF",
                borderBottomWidth: 1,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
            }}>
                <Icon iconName={props.iconName} size={20} color={COLORS.Primary.Medium} />
                <TextCustom
                    onPress={props.onPress}
                    variation='p4'
                    weight='bold'
                    style={{
                        color: '#665F59',
                        marginLeft: SIZES.XS * 2,
                        marginRight: SIZES.XS * 2,
                    }}>
                    {props.label}
                </TextCustom>
                <View style={{
                    marginLeft: 'auto',
                }}>
                    <Icon iconName='icon_chevron_right' size={24} color="#665F59" />
                </View>
            </View>
        </Pressable>
    );
}

export default MenuItem;