import React from 'react';
import { SwitchPropsType } from './PropsType';
export interface SwitchProps extends SwitchPropsType {
    prefixCls?: string;
    className?: string;
    platform?: string;
    style?: React.CSSProperties;
}
export default class Switch extends React.Component<SwitchProps, any> {
    static defaultProps: {
        prefixCls: string;
        name: string;
        checked: boolean;
        disabled: boolean;
        onChange(): void;
        platform: string;
        onClick(): void;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick: (e: any) => void;
    render(): JSX.Element;
}
