import React from 'react';
import { IGestureStatus } from 'rc-gesture';
import { Models } from './Models';
import { TabBarPropsType } from './PropsType';
export interface PropsType extends TabBarPropsType {
    /** default: rmc-tabs-tab-bar */
    prefixCls?: string;
}
export declare class StateType {
    transform?: string | undefined;
    isMoving?: boolean | undefined;
    showPrev?: boolean | undefined;
    showNext?: boolean | undefined;
}
export declare class DefaultTabBar extends React.PureComponent<PropsType, StateType> {
    static defaultProps: PropsType;
    layout: HTMLDivElement;
    onPan: {
        onPanStart: () => void;
        onPanMove: (status: IGestureStatus) => void;
        onPanEnd: () => void;
        setCurrentOffset: (offset: string | number) => string | number;
    };
    constructor(props: PropsType);
    componentWillReceiveProps(nextProps: PropsType): void;
    getTransformByIndex: (props: PropsType) => {
        transform: string;
        showPrev: boolean;
        showNext: boolean;
    };
    onPress: (index: number) => void;
    isTabBarVertical: (position?: "left" | "right" | "top" | "bottom" | undefined) => boolean;
    renderTab: (t: Models.TabData, i: number, size: number, isTabBarVertical: boolean) => JSX.Element;
    setContentLayout: (div: HTMLDivElement) => void;
    getTabSize: (page: number, tabLength: number) => number;
    render(): JSX.Element;
}
