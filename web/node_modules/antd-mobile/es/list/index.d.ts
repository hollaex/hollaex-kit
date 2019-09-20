import React from 'react';
import Item from './ListItem';
import { ListPropsType } from './PropsType';
export interface ListProps extends ListPropsType {
    prefixCls?: string;
    className?: string;
    role?: string;
    style?: React.CSSProperties;
}
export default class List extends React.Component<ListProps, any> {
    static Item: typeof Item;
    static defaultProps: Partial<ListProps>;
    render(): JSX.Element;
}
