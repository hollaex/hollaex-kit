import * as React from 'react';
import * as PropTypes from 'prop-types';
import Group from './Group';
import Search from './Search';
import TextArea from './TextArea';
import { ConfigConsumerProps } from '../config-provider';
import Password from './Password';
import { Omit } from '../_util/type';
declare const InputSizes: ["small", "default", "large"];
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    prefixCls?: string;
    size?: (typeof InputSizes)[number];
    onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    allowClear?: boolean;
}
declare class Input extends React.Component<InputProps, any> {
    static Group: typeof Group;
    static Search: typeof Search;
    static TextArea: typeof TextArea;
    static Password: typeof Password;
    static defaultProps: {
        type: string;
    };
    static propTypes: {
        type: PropTypes.Requireable<string>;
        id: PropTypes.Requireable<string>;
        size: PropTypes.Requireable<"small" | "default" | "large">;
        maxLength: PropTypes.Requireable<number>;
        disabled: PropTypes.Requireable<boolean>;
        value: PropTypes.Requireable<any>;
        defaultValue: PropTypes.Requireable<any>;
        className: PropTypes.Requireable<string>;
        addonBefore: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        addonAfter: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        prefixCls: PropTypes.Requireable<string>;
        onPressEnter: PropTypes.Requireable<(...args: any[]) => any>;
        onKeyDown: PropTypes.Requireable<(...args: any[]) => any>;
        onKeyUp: PropTypes.Requireable<(...args: any[]) => any>;
        onFocus: PropTypes.Requireable<(...args: any[]) => any>;
        onBlur: PropTypes.Requireable<(...args: any[]) => any>;
        prefix: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        suffix: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        allowClear: PropTypes.Requireable<boolean>;
    };
    static getDerivedStateFromProps(nextProps: InputProps): {
        value: string | number | string[] | undefined;
    } | null;
    input: HTMLInputElement;
    constructor(props: InputProps);
    componentDidUpdate(): void;
    getSnapshotBeforeUpdate(prevProps: InputProps): null;
    getInputClassName(prefixCls: string): string;
    setValue(value: string, e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement, MouseEvent>, callback?: () => void): void;
    saveInput: (node: HTMLInputElement) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleReset: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    focus(): void;
    blur(): void;
    select(): void;
    renderClearIcon(prefixCls: string): JSX.Element | null;
    renderSuffix(prefixCls: string): JSX.Element | null;
    renderLabeledInput(prefixCls: string, children: React.ReactElement<any>): JSX.Element;
    renderLabeledIcon(prefixCls: string, children: React.ReactElement<any>): JSX.Element;
    renderInput(prefixCls: string): JSX.Element;
    renderComponent: ({ getPrefixCls }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export default Input;
