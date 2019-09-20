/// <reference types="react" />
import React, { Component } from 'react';
export interface IAlignProps {
    childrenProps?: {};
    align: {};
    target: () => void;
    onAlign?: (source: any, align: any) => void;
    monitorBufferTime?: number;
    monitorWindowResize?: boolean;
    disabled?: boolean;
}
declare class Align extends Component<IAlignProps, any> {
    static defaultProps: {
        target: () => Window;
        onAlign: () => void;
        monitorBufferTime: number;
        monitorWindowResize: boolean;
        disabled: boolean;
    };
    resizeHandler: any;
    bufferMonitor: any;
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    componentWillUnmount(): void;
    startMonitorWindowResize(): void;
    stopMonitorWindowResize(): void;
    forceAlign: () => void;
    render(): React.ReactElement<any>;
}
export default Align;
