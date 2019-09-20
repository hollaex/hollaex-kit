import React from 'react';
import { InputEventHandler } from './PropsType';
import { Omit } from '../_util/types';
export declare type HTMLInputProps = Omit<React.HTMLProps<HTMLInputElement>, 'onFocus' | 'onBlur'>;
export interface InputProps extends HTMLInputProps {
    onFocus?: InputEventHandler;
    onBlur?: InputEventHandler;
}
declare class Input extends React.Component<InputProps, any> {
    inputRef: HTMLInputElement | null;
    onInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    onInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    focus: () => void;
    render(): JSX.Element;
}
export default Input;
