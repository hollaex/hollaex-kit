import React from 'react';
import { Models } from './date/DataTypes';
export interface PropsType {
    locale: Models.Locale;
    prefixCls?: string;
    pickerPrefixCls?: string;
    title?: string;
    defaultValue?: Date;
    value?: Date;
    onValueChange?: (time: Date) => void;
    minDate?: Date;
    maxDate?: Date;
    clientHeight?: number;
}
export interface StateType {
}
export default class TimePicker extends React.PureComponent<PropsType, StateType> {
    static defaultProps: PropsType;
    onDateChange: (date: Date) => void;
    getMinTime(date?: Date): Date | undefined;
    getMaxTime(date?: Date): Date | undefined;
    render(): JSX.Element;
}
