import * as React from 'react';
import PropsType from './DatePickerProps';
import Component from './DatePicker.base';
import SingleMonth from './date/SingleMonth';
import { Models } from './date/DataTypes';
export { PropsType };
export default class DatePicker extends Component {
    panel: HTMLDivElement;
    transform: string;
    genMonthComponent: (data?: Models.MonthData | undefined) => JSX.Element | undefined;
    computeHeight: (data: Models.MonthData, singleMonth: SingleMonth | null) => void;
    setLayout: (dom: HTMLDivElement) => void;
    setPanel: (dom: HTMLDivElement) => void;
    touchHandler: {
        onTouchStart: (evt: React.TouchEvent<HTMLDivElement>) => void;
        onTouchMove: (evt: React.TouchEvent<HTMLDivElement>) => void;
        onTouchEnd: () => void;
        onTouchCancel: () => void;
        onFinish: () => void;
    };
    setTransform(nodeStyle: CSSStyleDeclaration, value: any): void;
    setTransition(nodeStyle: CSSStyleDeclaration, value: any): void;
    render(): JSX.Element;
}
