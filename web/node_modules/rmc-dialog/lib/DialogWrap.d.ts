import React from 'react';
import IDialogPropTypes from './IDialogPropTypes';
declare function noop(): void;
export default class DialogWrap extends React.Component<IDialogPropTypes, any> {
    static defaultProps: {
        visible: boolean;
        prefixCls: string;
        onClose: typeof noop;
    };
    _component: any;
    container: any;
    componentDidMount(): void;
    shouldComponentUpdate({ visible }: {
        visible: any;
    }): boolean;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    saveRef: (node: any) => void;
    getComponent: (visible: any) => JSX.Element;
    removeContainer: () => void;
    getContainer: () => any;
    renderDialog(visible: any): void;
    render(): any;
}
export {};
