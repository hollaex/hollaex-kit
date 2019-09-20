import React from 'react';
export interface PropsType {
    key?: string;
    className?: string;
    role?: string;
    active: boolean;
    fixX?: boolean;
    fixY?: boolean;
}
export declare class TabPane extends React.PureComponent<PropsType, {}> {
    static defaultProps: {
        fixX: boolean;
        fixY: boolean;
    };
    layout: HTMLDivElement;
    offsetX: number;
    offsetY: number;
    componentWillReceiveProps(nextProps: PropsType & {
        children?: React.ReactNode;
    }): void;
    setLayout: (div: HTMLDivElement) => void;
    render(): JSX.Element;
}
