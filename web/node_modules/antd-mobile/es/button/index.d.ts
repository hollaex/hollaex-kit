import React, { CSSProperties, MouseEventHandler } from 'react';
import { ButtonPropsType } from './PropsType';
export interface ButtonProps extends ButtonPropsType {
    prefixCls?: string;
    className?: string;
    role?: string;
    inline?: boolean;
    icon?: string;
    activeClassName?: string;
    activeStyle?: boolean | CSSProperties;
    style?: React.CSSProperties;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
}
declare class Button extends React.Component<ButtonProps, any> {
    static defaultProps: {
        prefixCls: string;
        size: string;
        inline: boolean;
        disabled: boolean;
        loading: boolean;
        activeStyle: {};
    };
    render(): JSX.Element;
}
export default Button;
