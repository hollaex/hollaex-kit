import React from 'react';
import { CheckboxPropsType } from './PropsType';
export interface AgreeItemPropsType extends CheckboxPropsType {
    prefixCls?: string;
    className?: string;
    name?: string;
    wrapLabel?: boolean;
    style?: React.CSSProperties;
}
export default class AgreeItem extends React.Component<AgreeItemPropsType, any> {
    static defaultProps: {
        prefixCls: string;
    };
    render(): JSX.Element;
}
