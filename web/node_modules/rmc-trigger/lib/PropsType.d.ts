import React from 'react';
export default interface ITriggerProps {
    prefixCls?: string;
    getPopupClassNameFromAlign?: any;
    onPopupVisibleChange?: Function;
    afterPopupVisibleChange?: Function;
    popup: React.ReactNode | Function;
    popupStyle?: any;
    popupClassName?: string;
    popupPlacement?: string;
    builtinPlacements?: any;
    popupTransitionName?: string | {};
    popupAnimation?: any;
    zIndex?: number;
    getPopupContainer?: Function;
    getDocument?: Function;
    destroyPopupOnHide?: boolean;
    mask?: boolean;
    maskClosable?: boolean;
    onPopupAlign?: Function;
    popupAlign?: any;
    popupVisible?: boolean;
    defaultPopupVisible?: boolean;
    maskTransitionName?: string | {};
    maskAnimation?: string;
}
