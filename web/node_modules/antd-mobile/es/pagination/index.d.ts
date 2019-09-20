import PropTypes from 'prop-types';
import React from 'react';
import { PaginationPropsType, PaginationState } from './PropsType';
export interface PaginationProps extends PaginationPropsType {
    style?: React.CSSProperties;
    prefixCls?: string;
    className?: string;
}
export default class Pagination extends React.Component<PaginationProps, PaginationState> {
    static defaultProps: {
        prefixCls: string;
        mode: string;
        current: number;
        total: number;
        simple: boolean;
        onChange: () => void;
    };
    static contextTypes: {
        antLocale: PropTypes.Requireable<object>;
    };
    constructor(props: PaginationProps);
    componentWillReceiveProps(nextProps: PaginationProps): void;
    onChange(p: number): void;
    render(): JSX.Element;
}
