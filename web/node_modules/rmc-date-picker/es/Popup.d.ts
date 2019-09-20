import React from 'react';
import IDatePickerProps from './IDatePickerProps';
import { IPopupPickerProps } from 'rmc-picker/lib/PopupPickerTypes';
export interface IPopupDatePickerProps extends IPopupPickerProps {
    datePicker: React.ReactElement<IDatePickerProps>;
    onChange?: (date?: any) => void;
    date?: any;
}
declare class PopupDatePicker extends React.Component<IPopupDatePickerProps, any> {
    static defaultProps: {
        pickerValueProp: string;
        pickerValueChangeProp: string;
    };
    onOk: (v: any) => void;
    render(): JSX.Element;
}
export default PopupDatePicker;
