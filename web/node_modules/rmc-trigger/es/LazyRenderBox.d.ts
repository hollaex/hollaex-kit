import React, { Component } from 'react';
export interface ILazyRenderBoxProps {
    style?: any;
    className?: string;
    hiddenClassName?: string;
    visible?: boolean;
}
declare class LazyRenderBox extends Component<ILazyRenderBoxProps, any> {
    shouldComponentUpdate(nextProps: any): any;
    render(): React.ReactElement<any>;
}
export default LazyRenderBox;
