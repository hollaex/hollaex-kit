import PropTypes from 'prop-types';
import React from 'react';
import { DatePickerPropsType } from './PropsType';
export interface PropsType extends DatePickerPropsType {
    prefixCls?: string;
    className?: string;
    use12Hours?: boolean;
    pickerPrefixCls?: string;
    popupPrefixCls?: string;
    onOk?: (x: any) => void;
    onVisibleChange?: (visible: boolean) => void;
}
export default class DatePicker extends React.Component<PropsType, any> {
    static defaultProps: {
        mode: string;
        prefixCls: string;
        pickerPrefixCls: string;
        popupPrefixCls: string;
        minuteStep: number;
        use12Hours: boolean;
    };
    static contextTypes: {
        antLocale: PropTypes.Requireable<object>;
    };
    private scrollValue;
    setScrollValue: (v: any) => void;
    onOk: (v: any) => void;
    onVisibleChange: (visible: boolean) => void;
    fixOnOk: (picker: any) => void;
    render(): JSX.Element;
}
