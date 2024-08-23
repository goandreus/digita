export interface ItemProps {
  genericText?: string | undefined;
  title: string;
  subtitle: string;
  value: string;
}

export interface PickerItemProps extends ItemProps {
  label?: string;
  border?: boolean;
  bottom?: number;
  icon?: boolean;
  hideSubtitle?: boolean;
  error?: boolean;
  onSelect?: () => void;
}

export interface PickerProps {
  genericText?: string | undefined;
  enabled?: boolean;
  long?: boolean;
  defaultParams?: {
    open: boolean;
    value?: number;
    omitValue?: boolean;
    onChange: () => void;
  };
  data: (ItemProps & any)[];
  onSelect: (selectedItem: any) => void;
  text?: string;
  dataPosition?: number | null;
  statusBarTranslucent?: boolean;
  hideSubtitle?: boolean;
  error?: boolean;
  errorText?: string;
  isNativeDriver?: boolean;
}
