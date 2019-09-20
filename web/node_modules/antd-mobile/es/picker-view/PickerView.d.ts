import React from 'react';
import { PickerData } from '../picker/PropsType';
export interface IPickerView {
    prefixCls?: string;
    pickerPrefixCls?: string;
    cols?: number;
    cascade?: boolean;
    value?: any[];
    data?: PickerData[] | PickerData[][];
    onChange?: (value?: any) => void;
    onScrollChange?: (value?: any) => void;
    indicatorStyle?: any;
    itemStyle?: any;
}
export default class PickerView extends React.Component<IPickerView, any> {
    static defaultProps: {
        prefixCls: string;
        pickerPrefixCls: string;
        cols: number;
        cascade: boolean;
        value: never[];
        onChange(): void;
    };
    getCol: () => JSX.Element[];
    render(): JSX.Element;
}
