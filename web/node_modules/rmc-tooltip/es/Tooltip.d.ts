/// <reference types="react" />
import React, { Component } from 'react';
export interface ITooltipProps {
    trigger?: any;
    defaultVisible?: boolean;
    visible?: boolean;
    placement?: string;
    transitionName?: string;
    animation?: any;
    onVisibleChange?: Function;
    afterVisibleChange?: Function;
    overlay: React.ReactNode | Function;
    overlayStyle?: {};
    overlayClassName?: string;
    prefixCls?: string;
    getTooltipContainer?: Function;
    destroyTooltipOnHide?: boolean;
    align?: {};
    arrowContent?: any;
}
declare class Tooltip extends Component<ITooltipProps, any> {
    static defaultProps: {
        prefixCls: string;
        destroyTooltipOnHide: boolean;
        align: {};
        placement: string;
        arrowContent: null;
    };
    trigger: any;
    getPopupElement: () => JSX.Element[];
    getPopupDomNode(): any;
    saveTrigger: (node: any) => void;
    render(): JSX.Element;
}
export default Tooltip;
