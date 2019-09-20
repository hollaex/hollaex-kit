import * as React from 'react';
import { ConfigConsumerProps } from '../config-provider';
import { RangePickerValue, RangePickerPresetRange } from './interface';
export interface RangePickerState {
    value?: RangePickerValue;
    showDate?: RangePickerValue;
    open?: boolean;
    hoverValue?: RangePickerValue;
}
declare class RangePicker extends React.Component<any, RangePickerState> {
    static defaultProps: {
        allowClear: boolean;
        showToday: boolean;
        separator: string;
    };
    static getDerivedStateFromProps(nextProps: any, prevState: any): {
        value: any;
    } | {
        showDate: any;
        value: any;
    } | {
        open: any;
        value?: undefined;
    } | {
        open: any;
        value: any;
    } | {
        open: any;
        showDate: any;
        value: any;
    } | null;
    private picker;
    private prefixCls?;
    private tagPrefixCls?;
    constructor(props: any);
    componentDidUpdate(_: any, prevState: RangePickerState): void;
    setValue(value: RangePickerValue, hidePanel?: boolean): void;
    savePicker: (node: HTMLSpanElement) => void;
    clearSelection: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    clearHoverValue: () => void;
    handleChange: (value: RangePickerValue) => void;
    handleOpenChange: (open: boolean) => void;
    handleShowDateChange: (showDate: RangePickerValue) => void;
    handleHoverChange: (hoverValue: any) => void;
    handleRangeMouseLeave: () => void;
    handleCalendarInputSelect: (value: RangePickerValue) => void;
    handleRangeClick: (value: RangePickerPresetRange) => void;
    focus(): void;
    blur(): void;
    renderFooter: () => (JSX.Element | null)[] | null;
    renderRangePicker: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export default RangePicker;
