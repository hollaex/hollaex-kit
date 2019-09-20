import React from 'react';
import { IPopupPickerProps } from 'rmc-picker/lib/PopupPickerTypes';
import { ICascaderProps, CascaderValue } from './CascaderTypes';
export interface IPopupCascaderProps extends IPopupPickerProps {
    cascader: React.ReactElement<ICascaderProps>;
    onChange?: (date?: CascaderValue) => void;
}
declare class PopupCascader extends React.Component<IPopupCascaderProps, any> {
    static defaultProps: {
        pickerValueProp: string;
        pickerValueChangeProp: string;
    };
    onOk: (v: any) => void;
    render(): JSX.Element;
}
export default PopupCascader;
