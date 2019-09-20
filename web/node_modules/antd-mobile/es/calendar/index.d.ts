import PropTypes from 'prop-types';
import React from 'react';
import { CalendarProps } from './PropsType';
export default class Calendar extends React.Component<CalendarProps, any> {
    static defaultProps: {
        prefixCls: string;
        timePickerPrefixCls: string;
        timePickerPickerPrefixCls: string;
    };
    static contextTypes: {
        antLocale: PropTypes.Requireable<object>;
    };
    render(): JSX.Element;
}
