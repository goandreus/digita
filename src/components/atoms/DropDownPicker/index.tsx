import React from 'react';
import Icon from '@atoms/Icon';
import {Colors} from '@theme/colors';
import SelectDropdown from 'react-native-select-dropdown';
import { View } from 'react-native';
import TextCustom from '@atoms/TextCustom';
import Separator from '@atoms/Separator';
import { getStyles } from './styles';
import { DropDownPickerItemProps, DropDownPickerProps } from './types';

const DropDownPickerItem = ({title,subtitle,value,border,bottom = 0}: DropDownPickerItemProps) => (
    <View style={{marginBottom:bottom}}>
    <View style={{flexDirection:'row',alignItems:'center',padding:6}}>
      <View>
        <TextCustom size={18} weight='bold' text={title?.length >=17 ? `${title?.slice(0,20)}...` : title} variation='p' color='#83786F' />
        <Separator type='xx-small' />
        <TextCustom size={14} weight='bold' text={subtitle} variation='p' color='#83786F' />
      </View>
      <View  style={{position:'absolute', right:1}}>
        <TextCustom text={value} variation='p' size={16} color='#665F59' weight='bold' />
      </View>
    </View>
    {border && <Separator styleLine={{marginTop:6}} type='xx-small' showLine color='#EFEFEF' width={1.5} />}
    </View>
)

const DropDownPicker = ({
    data,
    onSelect,
    pickerButtonData,
}: DropDownPickerProps) => (
    <SelectDropdown
        data={data}
        onSelect={onSelect}
        buttonTextAfterSelection={() => ''}
        rowTextForSelection={() => ''}
        buttonStyle={getStyles(data).buttonStyle}
        rowStyle={getStyles(data).rowStyle}
        dropdownStyle={getStyles(data).dropdownStyle}
        renderDropdownIcon={() => <Icon name='chevron-down' size='x-small' fill={Colors.Border} />}
        dropdownOverlayColor='rgba(255,255,255,0)'
        renderCustomizedButtonChild={() => <DropDownPickerItem title={pickerButtonData.title} subtitle={pickerButtonData.subtitle} value={pickerButtonData.value} />}
        renderCustomizedRowChild={(e,index) => <DropDownPickerItem title={e.title} subtitle={e.subtitle} value={e.value} border={index != data.length - 1} bottom={20} />}
    />
)

export default DropDownPicker