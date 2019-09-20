import * as React from 'react';
export declare type CascaderOneValue = string | number;
export declare type CascaderValue = CascaderOneValue[];
export interface ICascaderDataItem {
    label: React.ReactNode;
    value: CascaderOneValue;
    children?: ICascaderDataItem[];
}
export interface ICascaderProps {
    defaultValue?: CascaderValue;
    value?: CascaderValue;
    onChange?: (value: CascaderValue) => void;
    data: ICascaderDataItem[];
    cols?: number;
    disabled?: boolean;
    rootNativeProps?: {};
    pickerItemStyle?: {};
    indicatorStyle?: {};
    style?: any;
    /** web only */
    prefixCls?: string;
    /** web only */
    pickerPrefixCls?: string;
    /** web only */
    className?: string;
    /** web only */
    onScrollChange?: (value: CascaderValue) => void;
}
