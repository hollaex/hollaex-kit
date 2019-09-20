import React, { CSSProperties } from 'react';
import { CardHeaderPropsType } from './PropsType';
export interface CardHeaderProps extends CardHeaderPropsType {
    prefixCls?: string;
    className?: string;
    style?: CSSProperties;
    thumbStyle?: CSSProperties;
}
export default class CardHeader extends React.Component<CardHeaderProps, any> {
    static defaultProps: {
        prefixCls: string;
        thumbStyle: {};
    };
    render(): JSX.Element;
}
