import * as React from 'react';
import { Models } from './date/DataTypes';
import PropsType from './DatePickerProps';
export interface StateType {
    months: Models.MonthData[];
}
export default abstract class DatePicker extends React.Component<PropsType, StateType> {
    static defaultProps: PropsType;
    visibleMonth: Models.MonthData[];
    abstract genMonthComponent: (data: Models.MonthData) => React.ReactNode;
    constructor(props: PropsType);
    shouldComponentUpdate(nextProps: PropsType, nextState: StateType, nextContext: any): boolean;
    componentWillReceiveProps(nextProps: PropsType): void;
    componentWillMount(): void;
    getMonthDate(date?: Date, addMonth?: number): {
        firstDate: Date;
        lastDate: Date;
    };
    canLoadPrev(): boolean;
    canLoadNext(): boolean;
    getDateWithoutTime: (date?: Date | undefined) => number;
    genWeekData: (firstDate: Date) => Models.CellData[][];
    genMonthData(date?: Date, addMonth?: number): Models.MonthData;
    inDate(date: number, tick: number): boolean;
    selectDateRange: (startDate: Date, endDate?: Date | undefined, clear?: boolean) => void;
    computeVisible: (clientHeight: number, scrollTop: number) => boolean;
    createOnScroll: () => (data: {
        full: number;
        client: number;
        top: number;
    }) => void;
    onCellClick: (day: Models.CellData) => void;
}
