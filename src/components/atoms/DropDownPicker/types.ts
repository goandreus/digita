interface ItemProps {
    title: string;
    subtitle: string;
    value: string;
}

export interface DropDownPickerItemProps extends ItemProps {
    border?: boolean;
    bottom?: number;
}

export interface DropDownPickerProps {
    data: (ItemProps & any)[];
    onSelect: (selectedItem: any) => void;
    pickerButtonData: ItemProps;
}

