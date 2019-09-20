import { Component } from 'react';
export interface IPopupInnerProps {
    prefixCls?: string;
    style?: any;
    className?: string;
    hiddenClassName?: string;
    visible?: boolean;
}
declare class PopupInner extends Component<IPopupInnerProps, any> {
    render(): JSX.Element;
}
export default PopupInner;
