/// <reference types="react" />
import { DataItem } from './PropsType';
export interface PropsType {
    subMenuPrefixCls?: string;
    radioPrefixCls?: string;
    subMenuData: DataItem[];
    showSelect: boolean;
    onSel: (dataItem: DataItem) => void;
    selItem: DataItem[];
    multiSelect?: boolean;
}
export default function SubMenu(props: PropsType): JSX.Element;
