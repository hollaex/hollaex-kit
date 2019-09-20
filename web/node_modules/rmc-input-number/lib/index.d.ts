/// <reference types="react" />
import React from 'react';
import BaseComponent, { PropsType as BasePropsType, StateType as BaseStateType } from './base';
export interface PropsType extends BasePropsType {
    className?: any;
    focusOnUpDown?: boolean;
    prefixCls?: string;
    tabIndex?: number;
    upHandler?: React.ReactNode;
    downHandler?: React.ReactNode;
    formatter?: (v: any) => void;
}
export interface StateType extends BaseStateType {
}
export default class InputNumber extends BaseComponent<PropsType, StateType> {
    static defaultProps: {
        focusOnUpDown: boolean;
        useTouch: boolean;
        prefixCls: string;
        max: number;
        min: number;
        step: number;
        style: {};
        onChange: () => void;
        onFocus: () => void;
        onBlur: () => void;
        parser: (input: string) => string;
    };
    start: any;
    end: any;
    input: any;
    componentDidMount(): void;
    componentWillUpdate(): void;
    componentDidUpdate(): void;
    setInput: (input: any) => void;
    getRatio(e: any): number;
    getValueFromEvent(e: any): any;
    focus(): void;
    formatWrapper(num: any): any;
    render(): JSX.Element;
}
