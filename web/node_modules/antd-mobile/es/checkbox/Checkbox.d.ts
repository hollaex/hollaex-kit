import React from 'react';
import { CheckboxPropsType } from './PropsType';
export interface CheckboxProps extends CheckboxPropsType {
    prefixCls?: string;
    className?: string;
    name?: string;
    wrapLabel?: boolean;
    style?: React.CSSProperties;
}
export default class Checkbox extends React.Component<CheckboxProps, any> {
    static CheckboxItem: any;
    static AgreeItem: any;
    static defaultProps: {
        prefixCls: string;
        wrapLabel: boolean;
    };
    render(): JSX.Element;
}
