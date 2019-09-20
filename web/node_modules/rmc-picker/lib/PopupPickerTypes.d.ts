import * as React from 'react';
export interface IPopupPickerProps {
    picker?: any;
    value?: any;
    triggerType?: string;
    WrapComponent?: any;
    dismissText?: string | React.ReactElement<any>;
    okText?: string | React.ReactElement<any>;
    title?: string | React.ReactElement<any>;
    visible?: boolean;
    disabled?: boolean;
    onOk?: (value?: any) => void;
    style?: any;
    onVisibleChange?: (visible: boolean) => void;
    content?: React.ReactElement<any> | string;
    onDismiss?: () => void;
    /** react-native only */
    styles?: any;
    actionTextUnderlayColor?: string;
    actionTextActiveOpacity?: number;
    /** web only */
    wrapStyle?: React.CSSProperties;
    prefixCls?: string;
    className?: string;
    pickerValueProp?: string;
    pickerValueChangeProp?: string;
    transitionName?: string;
    popupTransitionName?: string;
    maskTransitionName?: string;
}
