import React, { MouseEventHandler } from 'react';
import { BriefProps as BriefBasePropsType, ListItemPropsType as ListItemBasePropsType } from './PropsType';
export interface ListItemProps extends ListItemBasePropsType {
    prefixCls?: string;
    className?: string;
    role?: string;
    style?: React.CSSProperties;
    onClick?: MouseEventHandler<HTMLDivElement>;
}
export interface BriefProps extends BriefBasePropsType {
    prefixCls?: string;
    className?: string;
    role?: string;
}
export declare class Brief extends React.Component<BriefProps, any> {
    render(): JSX.Element;
}
declare class ListItem extends React.Component<ListItemProps, any> {
    static defaultProps: Partial<ListItemProps>;
    static Brief: typeof Brief;
    debounceTimeout: any;
    constructor(props: ListItemProps);
    componentWillUnmount(): void;
    onClick: (ev: React.MouseEvent<HTMLDivElement>) => void;
    render(): JSX.Element;
}
export default ListItem;
