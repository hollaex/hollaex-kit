import React from 'react';
export declare type InputEventHandler = (value?: string) => void;
export interface InputItemPropsType {
    moneyKeyboardAlign?: string;
    moneyKeyboardWrapProps?: object;
    type?: 'text' | 'bankCard' | 'phone' | 'password' | 'number' | 'digit' | 'money';
    editable?: boolean;
    disabled?: boolean;
    name?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    clear?: boolean;
    maxLength?: number;
    extra?: React.ReactNode;
    error?: boolean;
    labelNumber?: number;
    labelPosition?: 'left' | 'top';
    textAlign?: 'left' | 'center';
    updatePlaceholder?: boolean;
    locale?: object;
    onChange?: (value: string) => void;
    onFocus?: InputEventHandler;
    onBlur?: InputEventHandler;
    onVirtualKeyboardConfirm?: InputEventHandler;
}
