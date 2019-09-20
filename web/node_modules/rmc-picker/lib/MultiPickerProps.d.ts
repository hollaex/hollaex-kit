export interface IPickerCol {
    key?: string;
    props?: any;
}
interface IMultiPickerProps {
    prefixCls?: string;
    selectedValue?: any[];
    className?: string;
    rootNativeProps?: any;
    onValueChange?: (v?: any, i?: number) => void;
    children?: any;
    style?: any;
    onScrollChange?: (v?: any, i?: number) => void;
}
export default IMultiPickerProps;
