import React from 'react';
import PropTypes from 'prop-types';
import { SearchBarPropsType, SearchBarState } from './PropsType';
export interface SearchBarProps extends SearchBarPropsType {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
}
export default class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
    static defaultProps: {
        prefixCls: string;
        placeholder: string;
        onSubmit: () => void;
        onChange: () => void;
        onFocus: () => void;
        onBlur: () => void;
        onClear: () => void;
        showCancelButton: boolean;
        disabled: boolean;
    };
    static contextTypes: {
        antLocale: PropTypes.Requireable<object>;
    };
    rightBtnInitMarginleft: string | null;
    firstFocus: boolean;
    blurFromOnClear: boolean;
    onBlurTimeout: number | null;
    inputRef: HTMLInputElement | null;
    private rightBtnRef;
    private syntheticPhContainerRef;
    private syntheticPhRef;
    private inputContainerRef;
    constructor(props: SearchBarProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillReceiveProps(nextProps: SearchBarProps): void;
    componentWillUnmount(): void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
    onClear: () => void;
    doClear: (blurFromOnClear?: boolean) => void;
    onCancel: () => void;
    focus: () => void;
    render(): JSX.Element;
}
