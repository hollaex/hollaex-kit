import React from 'react';
import { Omit } from '../_util/types';
export declare type HTMLTableDataProps = Omit<React.HTMLProps<HTMLTableDataCellElement>, 'onClick'>;
export interface KeyboardItemProps extends HTMLTableDataProps {
    prefixCls?: string;
    tdRef?: React.Ref<HTMLTableDataCellElement>;
    iconOnly?: boolean;
    onClick: (event: React.MouseEvent<HTMLTableDataCellElement>, value: string) => void;
}
export declare class KeyboardItem extends React.Component<KeyboardItemProps, any> {
    static defaultProps: {
        prefixCls: string;
        onClick: () => void;
        disabled: boolean;
    };
    render(): JSX.Element;
}
declare class CustomKeyboard extends React.Component<any, any> {
    static defaultProps: {
        prefixCls: string;
    };
    linkedInput: any;
    antmKeyboard: HTMLDivElement | null;
    confirmDisabled: boolean;
    confirmKeyboardItem: HTMLTableDataCellElement | null;
    onKeyboardClick: (e: React.MouseEvent<HTMLTableDataCellElement>, value: string) => null | undefined;
    renderKeyboardItem: (item: string, index: number) => JSX.Element;
    render(): JSX.Element;
    getAriaAttr(label: string): {
        label: string;
        iconOnly: boolean;
        role?: undefined;
        'aria-label'?: undefined;
    } | {
        role: string;
        'aria-label': string;
        label?: undefined;
        iconOnly?: undefined;
    };
}
export default CustomKeyboard;
