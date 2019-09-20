import React from 'react';
import { PickerPropsType } from './PropsType';
export interface AbstractPickerProps extends PickerPropsType {
    pickerPrefixCls?: string;
    popupPrefixCls?: string;
}
export declare function getDefaultProps(): {
    triggerType: string;
    prefixCls: string;
    pickerPrefixCls: string;
    popupPrefixCls: string;
    format: (values: React.ReactNode[]) => string | React.ReactNode[];
    cols: number;
    cascade: boolean;
    title: string;
};
export default abstract class AbstractPicker extends React.Component<AbstractPickerProps, any> {
    protected abstract popupProps: {};
    private scrollValue;
    getSel: () => string | React.ReactNode[] | undefined;
    getPickerCol: () => JSX.Element[];
    onOk: (v: any) => void;
    setScrollValue: (v: any) => void;
    setCasecadeScrollValue: (v: any) => void;
    fixOnOk: (cascader: any) => void;
    onPickerChange: (v: any) => void;
    onVisibleChange: (visible: boolean) => void;
    render(): JSX.Element;
}
