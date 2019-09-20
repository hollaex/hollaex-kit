/// <reference types="react" />
import React, { Component } from 'react';
export interface IStepsProps {
    prefixCls?: string;
    className?: string;
    iconPrefix?: string;
    direction?: string;
    labelPlacement?: string;
    status?: string;
    size?: string;
    progressDot?: boolean | Function;
    style?: any;
    current?: number;
}
export default class Steps extends Component<IStepsProps, any> {
    static defaultProps: {
        prefixCls: string;
        iconPrefix: string;
        direction: string;
        labelPlacement: string;
        current: number;
        status: string;
        size: string;
        progressDot: boolean;
    };
    Item: React.ComponentClass;
    render(): JSX.Element;
}
