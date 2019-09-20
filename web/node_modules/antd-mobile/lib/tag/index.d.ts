import React from 'react';
import { TagPropsType } from './PropsType';
export interface TagProps extends TagPropsType {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
}
export default class Tag extends React.Component<TagProps, any> {
    static defaultProps: {
        prefixCls: string;
        disabled: boolean;
        selected: boolean;
        closable: boolean;
        small: boolean;
        onChange(): void;
        onClose(): void;
        afterClose(): void;
    };
    constructor(props: TagProps);
    componentWillReceiveProps(nextProps: TagProps): void;
    onClick: () => void;
    onTagClose: () => void;
    render(): JSX.Element | null;
}
