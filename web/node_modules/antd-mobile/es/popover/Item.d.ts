import React from 'react';
export interface PopoverItemProps {
    className?: string;
    prefixCls?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    firstItem?: string;
    activeStyle?: React.CSSProperties;
    style?: React.CSSProperties;
}
export default class Item extends React.Component<PopoverItemProps, any> {
    static defaultProps: {
        prefixCls: string;
        disabled: boolean;
    };
    static myName: string;
    render(): JSX.Element;
}
