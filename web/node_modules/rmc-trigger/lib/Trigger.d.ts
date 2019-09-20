import React from 'react';
import ITriggerProps from './PropsType';
declare function noop(): void;
declare function returnEmptyString(): string;
declare function returnDocument(): Document;
export interface IProptypes {
    visible: boolean;
    onTargetClick: () => void;
    onClose: () => void;
}
export default class Trigger extends React.Component<ITriggerProps & IProptypes, any> {
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
    touchOutsideHandler: any;
    popupRef: any;
    _component: any;
    _container: any;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    clearOutsideHandler(): void;
    onDocumentClick: (event: any) => void;
    getPopupDomNode(): any;
    getPopupAlign: () => any;
    getRootDomNode: () => Element;
    getPopupClassNameFromAlign: (align: any) => string;
    saveRef(el: any, visible: any): void;
    getComponent(visible: any): JSX.Element;
    close: () => void;
    onAnimateLeave: () => void;
    removeContainer: () => void;
    getContainer(): any;
    renderDialog(visible: any): void;
    render(): any[] | React.ReactElement<any>;
}
export {};
