import React, { useMemo } from 'react'
import Icon from '@atoms/Icon'
import { Colors } from '@theme/colors'
import SelectDropdown from 'react-native-select-dropdown'
import { View } from 'react-native'
import TextCustom from '@atoms/TextCustom'
import Separator from '@atoms/Separator'
import { getStyles } from './styles'
import { DropDownPickerItemProps, DropDownPickerProps } from './types'
import { Saving } from '@features/userInfo'

const DropDownPickerItem = ({
  title,
  subtitle,
  value,
  border,
  bottom = 0
}: DropDownPickerItemProps) => (
  <View style={{ marginBottom: bottom }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 6 }}>
      <View>
        <TextCustom
          size={18}
          weight="bold"
          text={title?.length >= 17 ? `${title?.slice(0, 20)}...` : title}
          variation="p"
          color="#83786F"
        />
        <Separator type="xx-small" />
        <TextCustom
          size={14}
          weight="bold"
          text={subtitle}
          variation="p"
          color="#83786F"
        />
      </View>
      <View style={{ position: 'absolute', right: 1 }}>
        <TextCustom
          text={value}
          variation="p"
          size={16}
          color="#665F59"
          weight="bold"
        />
      </View>
    </View>
    {border && (
      <Separator
        styleLine={{ marginTop: 6 }}
        type="xx-small"
        showLine
        color="#EFEFEF"
        width={1.5}
      />
    )}
  </View>
)

const DropDownAccount = ({ data, onSelect, operationUId }: DropDownPickerProps) => {

  const acc = useMemo(() => {
    return data.find((d) => d.operationUId === operationUId)
  },[data, operationUId])

  return (
    <SelectDropdown
      data={data}
      onSelect={(e: Saving) => onSelect(e.operationUId)}
      buttonTextAfterSelection={() => ''}
      rowTextForSelection={() => ''}
      buttonStyle={getStyles(data).buttonStyle}
      rowStyle={getStyles(data).rowStyle}
      dropdownStyle={getStyles(data).dropdownStyle}
      renderDropdownIcon={() => (
        <Icon name="chevron-down" size="x-small" fill={Colors.Border} />
      )}
      dropdownOverlayColor="rgba(255,255,255,0)"
      renderCustomizedButtonChild={() => (
        <DropDownPickerItem
          title={acc?.title!}
          value={acc?.value!}
          subtitle={acc?.subtitle!}
        />
      )}
      renderCustomizedRowChild={(e, index) => (
        <DropDownPickerItem
          title={e.title}
          value={e.value}
          subtitle={e.subtitle}
          bottom={20}
          border={index != data.length - 1}
        />
      )}
    />
  )
}
export default DropDownAccount
