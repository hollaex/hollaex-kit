import React from 'react';
import { WingBlankPropsType } from './PropsType';
export interface WingBlankProps extends WingBlankPropsType {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
}
export default class WingBlank extends React.Component<WingBlankProps, any> {
    static defaultProps: {
        prefixCls: string;
        size: string;
    };
    render(): JSX.Element;
}
