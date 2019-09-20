import React from 'react';
import CardBody from './CardBody';
import CardFooter from './CardFooter';
import CardHeader from './CardHeader';
import { CardPropsType } from './PropsType';
export interface CardProps extends CardPropsType, React.HTMLProps<HTMLDivElement> {
    prefixCls?: string;
}
export default class Card extends React.Component<CardProps, any> {
    static defaultProps: {
        prefixCls: string;
        full: boolean;
    };
    static Header: typeof CardHeader;
    static Body: typeof CardBody;
    static Footer: typeof CardFooter;
    render(): JSX.Element;
}
