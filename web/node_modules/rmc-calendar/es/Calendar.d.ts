import React from 'react';
import ShortcutPanel from './calendar/ShortcutPanel';
import Header from './calendar/Header';
import { Models } from './date/DataTypes';
import PropsType from './CalendarProps';
export declare type ExtraData = Models.ExtraData;
export { PropsType };
export declare class StateType {
    showTimePicker: boolean;
    timePickerTitle?: string;
    startDate?: Date;
    endDate?: Date;
    disConfirmBtn?: boolean;
    clientHight?: number;
}
export default class Calendar extends React.PureComponent<PropsType, StateType> {
    static DefaultHeader: typeof Header;
    static DefaultShortcut: typeof ShortcutPanel;
    static defaultProps: PropsType;
    constructor(props: PropsType);
    componentWillReceiveProps(nextProps: PropsType): void;
    selectDate: (date: Date, useDateTime?: boolean, oldState?: {
        startDate?: Date | undefined;
        endDate?: Date | undefined;
    }, props?: Readonly<{
        children?: React.ReactNode;
    }> & Readonly<PropsType>) => StateType;
    onSelectedDate: (date: Date) => void;
    onSelectHasDisableDate: (date: Date[]) => void;
    onClose: () => void;
    onCancel: () => void;
    onConfirm: () => void;
    onTimeChange: (date: Date) => void;
    onClear: () => void;
    shortcutSelect: (startDate: Date, endDate: Date, props?: Readonly<{
        children?: React.ReactNode;
    }> & Readonly<PropsType>) => void;
    setClientHeight: (height: number) => void;
    render(): JSX.Element;
}
