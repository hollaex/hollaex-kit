import React from 'react';
import { DefaultTabBar as RMCDefaultTabBar, TabBarPropsType } from 'rmc-tabs';
import TabsProps from './PropsType';
export declare class DefaultTabBar extends RMCDefaultTabBar {
    static defaultProps: any;
}
export default class Tabs extends React.PureComponent<TabsProps, {}> {
    static DefaultTabBar: typeof DefaultTabBar;
    static defaultProps: {
        prefixCls: string;
    };
    renderTabBar: (props: TabBarPropsType) => JSX.Element;
    render(): JSX.Element;
}
