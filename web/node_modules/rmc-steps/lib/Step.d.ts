/// <reference types="react" />
import React from 'react';
export interface IStepProps {
    className?: string;
    prefixCls?: string;
    style?: any;
    wrapperStyle?: any;
    itemWidth?: number | string;
    status?: string;
    iconPrefix?: string;
    icon?: React.ReactNode;
    adjustMarginRight?: number | string;
    stepNumber?: number;
    description?: any;
    title?: any;
    progressDot?: boolean | Function;
}
export default class Step extends React.Component<IStepProps, any> {
    renderIconNode(): any;
    render(): JSX.Element;
}
