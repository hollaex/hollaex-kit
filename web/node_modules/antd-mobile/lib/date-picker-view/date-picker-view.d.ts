import PropTypes from 'prop-types';
import React from 'react';
import { DatePickerProps } from './PropsType';
export default class DatePickerView extends React.Component<DatePickerProps, any> {
    static defaultProps: {
        mode: string;
        extra: string;
        prefixCls: string;
        pickerPrefixCls: string;
        minuteStep: number;
        use12Hours: boolean;
    };
    static contextTypes: {
        antLocale: PropTypes.Requireable<object>;
    };
    render(): JSX.Element;
}
