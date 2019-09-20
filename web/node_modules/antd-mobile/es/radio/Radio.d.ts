import React from 'react';
import { RadioPropsType } from './PropsType';
export interface RadioProps extends RadioPropsType {
    prefixCls?: string;
    listPrefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
}
export default class Radio extends React.Component<RadioProps, any> {
    static RadioItem: any;
    static defaultProps: {
        prefixCls: string;
        wrapLabel: boolean;
    };
    render(): JSX.Element;
}
