import React from 'react';
import { StepsPropsType } from './PropsType';
export interface StepsProps extends StepsPropsType {
    prefixCls?: string;
    iconPrefix?: string;
    direction?: string;
    labelPlacement?: string;
    status?: string;
}
export default class Steps extends React.Component<StepsProps, any> {
    static Step: any;
    static defaultProps: {
        prefixCls: string;
        iconPrefix: string;
        labelPlacement: string;
        direction: string;
        current: number;
    };
    stepRefs: any[];
    stepsRef: any;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
}
