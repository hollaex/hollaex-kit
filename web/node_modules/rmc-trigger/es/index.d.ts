import React from 'react';
import ITriggerProps from './PropsType';
declare function noop(): void;
declare function returnEmptyString(): string;
declare function returnDocument(): Document;
declare class TriggerWrap extends React.Component<ITriggerProps, any> {
    static displayName: string;
    static defaultProps: {
        prefixCls: string;
        getPopupClassNameFromAlign: typeof returnEmptyString;
        getDocument: typeof returnDocument;
        onPopupVisibleChange: typeof noop;
        afterPopupVisibleChange: typeof noop;
        onPopupAlign: typeof noop;
        popupClassName: string;
        popupStyle: {};
        destroyPopupOnHide: boolean;
        popupAlign: {};
        defaultPopupVisible: boolean;
        mask: boolean;
        maskClosable: boolean;
    };
    triggerRef: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    setPopupVisible(visible: any): void;
    onTargetClick: () => void;
    onClose: () => void;
    render(): JSX.Element;
}
export default TriggerWrap;
