import { Component } from 'react';
export interface IPopupProps {
    visible?: boolean;
    style?: any;
    getClassNameFromAlign?: Function;
    onAlign?: Function;
    getRootDomNode?: Function;
    align?: any;
    destroyPopupOnHide?: boolean;
    className?: string;
    prefixCls?: string;
    maskTransitionName?: string | {};
    maskAnimation?: string;
    transitionName?: string | {};
    animation?: string;
    zIndex?: number;
    mask?: boolean;
    onAnimateLeave?: Function;
}
declare class Popup extends Component<IPopupProps, any> {
    savePopupRef: any;
    saveAlignRef: any;
    currentAlignClassName: string | null;
    rootNode: any;
    popupInstance: any;
    constructor(props: any);
    componentDidMount(): void;
    onAlign: (popupDomNode: any, align: any) => void;
    getPopupDomNode(): Element;
    getTarget: () => any;
    getMaskTransitionName(): string | {} | undefined;
    getTransitionName(): string | {} | undefined;
    getClassName(currentAlignClassName: any): string;
    getPopupElement(): JSX.Element;
    getZIndexStyle(): any;
    getMaskElement(): any;
    render(): JSX.Element;
}
export default Popup;
