import React from 'react';
import { WhiteSpacePropsType } from './PropsType';
export interface WhiteSpaceProps extends WhiteSpacePropsType {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}
export default class WhiteSpace extends React.Component<WhiteSpaceProps, any> {
    static defaultProps: {
        prefixCls: string;
        size: string;
    };
    render(): JSX.Element;
}
