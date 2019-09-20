import React from 'react';
import { ProgressPropsType } from './PropsType';
export interface ProgressProps extends ProgressPropsType {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    barStyle?: React.CSSProperties;
}
export default class Progress extends React.Component<ProgressProps, any> {
    static defaultProps: {
        prefixCls: string;
        percent: number;
        position: string;
        unfilled: boolean;
        appearTransition: boolean;
    };
    barRef: HTMLDivElement | null;
    private noAppearTransition;
    componentWillReceiveProps(): void;
    componentDidMount(): void;
    render(): JSX.Element;
}
