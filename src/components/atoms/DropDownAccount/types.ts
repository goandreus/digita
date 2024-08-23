import { Saving } from "@features/userInfo";

interface ItemProps {
    title: string;
    subtitle: string;
    value: string;
}

export interface DropDownPickerItemProps extends ItemProps {
    border?: boolean;
    bottom?: number;
}
export type DropDownPickerData = (Saving & { title: string; subtitle: string; value: string })

export interface DropDownPickerProps {
    operationUId: number;
    data:  DropDownPickerData[];
    onSelect: (operationUId: number) => void;
}

