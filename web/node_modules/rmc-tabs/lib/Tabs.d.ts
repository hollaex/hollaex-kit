import React from 'react';
import { IGestureStatus } from 'rc-gesture';
import { PropsType as BasePropsType } from './PropsType';
import { DefaultTabBar } from './DefaultTabBar';
import { Tabs as Component, StateType as BaseStateType } from './Tabs.base';
export interface PropsType extends BasePropsType {
    /** prefix class | default: rmc-tabs */
    prefixCls?: string;
}
export declare class StateType extends BaseStateType {
    contentPos?: string | undefined;
    isMoving?: boolean | undefined;
}
export declare class Tabs extends Component<PropsType, StateType> {
    static DefaultTabBar: typeof DefaultTabBar;
    static defaultProps: PropsType;
    layout: HTMLDivElement;
    onPan: {
        onPanStart: (status: IGestureStatus) => void;
        onPanMove: (status: IGestureStatus) => void;
        onPanEnd: () => void;
        setCurrentOffset: (offset: string | number) => string | number;
    };
    constructor(props: PropsType);
    goToTab(index: number, force?: boolean, usePaged?: boolean | undefined, props?: Readonly<{
        children?: React.ReactNode;
    }> & Readonly<PropsType>): boolean;
    tabClickGoToTab(index: number): void;
    getContentPosByIndex(index: number, isVertical: boolean, useLeft?: boolean): string;
    onSwipe: (status: IGestureStatus) => void;
    setContentLayout: (div: HTMLDivElement) => void;
    renderContent(getSubElements?: (defaultPrefix?: string, allPrefix?: string) => {
        [key: string]: React.ReactNode;
    }): JSX.Element;
    render(): JSX.Element;
}
