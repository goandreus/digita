import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {StyleSheet} from 'react-native';
import Icon from '@atoms/Icon';
import {Colors} from '@theme/colors';
import {FontSizes, FontTypes} from '@theme/fonts';

export interface SelectItem {
  label: string;
  value: string;
}

interface SelectProps {
  isOpen?: boolean;
  onClose?: () => void;
  value: string | null;
  items: SelectItem[];
  haveError?: boolean;
  disabled?: boolean;
  onSelect: (value: string | null) => void;
}

const Select = ({
  value,
  items,
  isOpen,
  onClose,
  haveError = false,
  onSelect,
  disabled,
}: SelectProps) => {
  const [open, setOpen] = useState(false);

  return (
    // @ts-ignore
    <DropDownPicker
      value={value}
      open={typeof isOpen === 'boolean' ? isOpen : open}
      onSelectItem={item => onSelect(item.value ?? null)}
      items={items}
      loading={true}
      disabled={disabled}
      showTickIcon={false}
      itemSeparator={true}
      setOpen={onClose ?? setOpen}
      listMode="SCROLLVIEW"
      placeholder="---"
      ArrowUpIconComponent={() => (
        <Icon name="arrow-down" size="tiny" fill={Colors.Border} />
      )}
      ArrowDownIconComponent={() => (
        <Icon name="arrow-down" size="tiny" fill={Colors.Border} />
      )}
      style={getStyles(haveError).container}
      textStyle={getStyles(haveError).text}
      dropDownContainerStyle={getStyles(haveError).dropDownContainer}
      itemSeparatorStyle={getStyles(haveError).separator}
    />
  );
};

const getStyles = (haveError: boolean) => {
  let borderColor: string;

  switch (haveError) {
    case true:
      borderColor = Colors.Primary;
      break;
    case false:
      borderColor = Colors.Border;
      break;
  }

  const stylesBase = StyleSheet.create({
    separator: {
      marginLeft: 8,
      marginRight: 8,
      backgroundColor: Colors.Border,
    },
    container: {
      borderWidth: 1.5,
      borderColor: borderColor,
      paddingVertical: 8,
      paddingHorizontal: 8,
      height: 8 * 6 + 3,
    },
    dropDownContainer: {
      borderColor: Colors.Border,
    },
    text: {
      fontFamily: FontTypes.AmorSansProBold,
      fontSize: FontSizes.Paragraph,
      color: Colors.Paragraph,
    },
  });

  return stylesBase;
};

export default Select;
