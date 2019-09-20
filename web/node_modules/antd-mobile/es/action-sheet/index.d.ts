import React from 'react';
export interface ActionSheetOptions {
    maskClosable?: boolean;
    cancelButtonIndex?: number;
    destructiveButtonIndex?: number;
    title?: React.ReactNode;
    message?: React.ReactNode;
    className?: string;
    transitionName?: string;
    maskTransitionName?: string;
}
export interface ShareOption {
    icon: React.ReactNode;
    title: string;
}
export interface ShareActionSheetWithOptions extends ActionSheetOptions {
    options: ShareOption[] | ShareOption[][];
}
export interface ActionSheetWithOptions extends ActionSheetOptions {
    options: string[];
}
export declare type ActionCallBack = (index: number, rowIndex?: number) => PromiseLike<any> | void;
declare const _default: {
    showActionSheetWithOptions(config: ActionSheetWithOptions, callback?: ActionCallBack): void;
    showShareActionSheetWithOptions(config: ShareActionSheetWithOptions, callback?: ActionCallBack): void;
    close(): void;
};
export default _default;
