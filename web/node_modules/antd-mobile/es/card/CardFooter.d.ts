import React from 'react';
import { CardFooterPropsType } from './PropsType';
export interface CardFooterProps extends CardFooterPropsType {
    prefixCls?: string;
    className?: string;
}
export default class CardFooter extends React.Component<CardFooterProps, any> {
    static defaultProps: {
        prefixCls: string;
    };
    render(): JSX.Element;
}
