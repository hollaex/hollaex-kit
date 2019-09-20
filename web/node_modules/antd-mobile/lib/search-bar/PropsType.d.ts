declare function noop(): void;
export interface SearchBarPropsType {
    defaultValue?: string;
    value?: string;
    placeholder?: string;
    onSubmit?: (value: string) => void;
    onChange?: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onCancel?: (value: string) => void;
    showCancelButton?: boolean;
    cancelText?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    focused?: boolean;
    onClear?: (value: string) => void;
    maxLength?: number;
}
export interface SearchBarState {
    value?: string;
    focus?: boolean;
    focused?: boolean;
}
export declare const defaultProps: {
    prefixCls: string;
    placeholder: string;
    onSubmit: typeof noop;
    onChange: typeof noop;
    onFocus: typeof noop;
    onBlur: typeof noop;
    onClear: typeof noop;
    showCancelButton: boolean;
    disabled: boolean;
};
export {};
