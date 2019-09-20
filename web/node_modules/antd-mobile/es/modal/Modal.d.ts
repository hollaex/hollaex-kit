import React from 'react';
import { Action, ModalPropsType, CallbackOrActions } from './PropsType';
export declare abstract class ModalComponent<P, S> extends React.Component<P, S> {
    static alert: (title: React.ReactNode, message: React.ReactNode, actions?: Action<React.CSSProperties>[], platform?: string) => {
        close: () => void;
    };
    static prompt: (title: React.ReactNode, message: React.ReactNode, callbackOrActions: CallbackOrActions<React.CSSProperties>, type?: 'default' | 'secure-text' | 'login-password', defaultValue?: string, placeholders?: string[], platform?: string) => {
        close: () => void;
    };
    static operation: (actions?: Action<React.CSSProperties>[], platform?: string) => {
        close: () => void;
    };
}
export interface ModalProps extends ModalPropsType<React.CSSProperties> {
    prefixCls?: string;
    transitionName?: string;
    maskTransitionName?: string;
    className?: string;
    wrapClassName?: string;
    wrapProps?: Partial<React.HTMLProps<HTMLDivElement>>;
    platform?: string;
    style?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
}
export default class Modal extends ModalComponent<ModalProps, any> {
    static defaultProps: {
        prefixCls: string;
        transparent: boolean;
        popup: boolean;
        animationType: string;
        animated: boolean;
        style: {};
        onShow(): void;
        footer: never[];
        closable: boolean;
        operation: boolean;
        platform: string;
    };
    renderFooterButton(button: Action<React.CSSProperties>, prefixCls: string | undefined, i: number): JSX.Element;
    render(): JSX.Element;
}
