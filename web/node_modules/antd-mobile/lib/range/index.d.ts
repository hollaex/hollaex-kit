import React from 'react';
import { RangePropsType } from './PropsType';
export interface RangeProps extends RangePropsType {
    prefixCls?: string;
    handleStyle?: React.CSSProperties[];
    trackStyle?: React.CSSProperties[];
    railStyle?: React.CSSProperties;
}
export default class Range extends React.Component<RangeProps, any> {
    static defaultProps: {
        prefixCls: string;
    };
    render(): JSX.Element;
}
