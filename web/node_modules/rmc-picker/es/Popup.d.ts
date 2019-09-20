import * as React from 'react';
declare const _default: {
    new (props: any): {
        picker: any;
        componentWillReceiveProps(nextProps: any): void;
        onPickerChange: (pickerValue: any) => void;
        saveRef: (picker: any) => void;
        setVisibleState(visible: any): void;
        fireVisibleChange(visible: any): void;
        getRender(): any;
        onTriggerClick: (e: any) => void;
        onOk: () => void;
        getContent: () => string | React.ReactElement<any> | React.SFCElement<{
            [x: string]: any;
            ref: (picker: any) => void;
        }>;
        onDismiss: () => void;
        hide: () => void;
        render(): any;
        setState<K extends string | number | symbol>(state: any, callback?: () => any): void;
        forceUpdate(callBack?: () => any): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<import("./PopupPickerTypes").IPopupPickerProps>;
        state: Readonly<any>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentWillMount?(): void;
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<import("./PopupPickerTypes").IPopupPickerProps>, nextState: Readonly<any>, nextContext: any): boolean;
        componentWillUpdate?(nextProps: Readonly<import("./PopupPickerTypes").IPopupPickerProps>, nextState: Readonly<any>, nextContext: any): void;
        componentDidUpdate?(prevProps: Readonly<import("./PopupPickerTypes").IPopupPickerProps>, prevState: Readonly<any>, prevContext: any): void;
        componentWillUnmount?(): void;
    };
    defaultProps: any;
};
export default _default;
