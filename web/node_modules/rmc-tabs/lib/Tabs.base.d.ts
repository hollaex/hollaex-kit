import React from 'react';
import { PropsType } from './PropsType';
import { Models } from './Models';
export declare class StateType {
    currentTab: number;
}
export declare abstract class Tabs<P extends PropsType = PropsType, S extends StateType = StateType> extends React.PureComponent<P, S> {
    static defaultProps: PropsType;
    protected instanceId: number;
    protected prevCurrentTab: number;
    protected tabCache: {
        [index: number]: React.ReactNode;
    };
    /** compatible for different between react and preact in `setState`. */
    private nextCurrentTab;
    constructor(props: P);
    getTabIndex(props: P): number;
    isTabVertical: (direction?: "horizontal" | "vertical" | undefined) => boolean;
    shouldRenderTab: (idx: number) => boolean;
    componentWillReceiveProps(nextProps: P): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    getOffsetIndex: (current: number, width: number, threshold?: P["distanceToChangeTab"]) => number;
    goToTab(index: number, force?: boolean, newState?: any, props?: P): boolean;
    tabClickGoToTab(index: number): void;
    getTabBarBaseProps(): {
        activeTab: S["currentTab"];
        animated: boolean;
        goToTab: any;
        onTabClick: P["onTabClick"];
        tabBarActiveTextColor: P["tabBarActiveTextColor"];
        tabBarBackgroundColor: P["tabBarBackgroundColor"];
        tabBarInactiveTextColor: P["tabBarInactiveTextColor"];
        tabBarPosition: P["tabBarPosition"];
        tabBarTextStyle: P["tabBarTextStyle"];
        tabBarUnderlineStyle: P["tabBarUnderlineStyle"];
        tabs: P["tabs"];
        instanceId: number;
    };
    renderTabBar(tabBarProps: any, DefaultTabBar: React.ComponentClass): {} | null | undefined;
    getSubElements: () => (defaultPrefix?: string, allPrefix?: string) => {
        [key: string]: React.ReactNode;
    };
    getSubElement(tab: Models.TabData, index: number, subElements: (defaultPrefix: string, allPrefix: string) => {
        [key: string]: any;
    }, defaultPrefix?: string, allPrefix?: string): any;
}
