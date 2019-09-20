import React from 'react';
import { TextAreaItemPropsType } from './PropsType';
import { Omit } from '../_util/types';
export declare type HTMLTextAreaProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'onFocus' | 'onBlur' | 'value' | 'defaultValue' | 'type' | 'title'>;
export interface TextareaItemProps extends TextAreaItemPropsType, HTMLTextAreaProps {
    prefixCls?: string;
    prefixListCls?: string;
}
declare function noop(): void;
export interface TextareaItemState {
    focus?: boolean;
    value?: string;
}
export default class TextareaItem extends React.Component<TextareaItemProps, TextareaItemState> {
    static defaultProps: {
        prefixCls: string;
        prefixListCls: string;
        autoHeight: boolean;
        editable: boolean;
        disabled: boolean;
        placeholder: string;
        clear: boolean;
        rows: number;
        onChange: typeof noop;
        onBlur: typeof noop;
        onFocus: typeof noop;
        onErrorClick: typeof noop;
        error: boolean;
        labelNumber: number;
    };
    textareaRef: any;
    private debounceTimeout;
    constructor(props: TextareaItemProps);
    focus: () => void;
    componentWillReceiveProps(nextProps: TextareaItemProps): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    reAlignHeight: () => void;
    componentWillUnmount(): void;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    onFocus: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    onErrorClick: () => void;
    clearInput: () => void;
    render(): JSX.Element;
}
export {};
