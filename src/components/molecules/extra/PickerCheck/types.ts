export interface ItemProps {
  title: string;
  value: string;
}

export interface PickerItemProps extends ItemProps {
  border?: boolean;
  selected: boolean;
}

export interface Props {
  seletedItem?: ItemProps & any;
  title: string;
  subtitle: string;
  error?: boolean;
  errorText?: string;
  data?: (ItemProps & any)[];
  onSelect: (selectedItem: ItemProps & any) => void;
}
