/// <reference types="react" />
import { Component } from 'react';
export interface PropsType {
    prefixCls: string;
    disabled?: boolean;
    onTouchStart: (e: any) => void;
    onTouchEnd: (e: any) => void;
    role?: string;
    className?: string;
    unselectable?: boolean;
}
export default class InputHandler extends Component<PropsType, {}> {
    render(): JSX.Element;
}
