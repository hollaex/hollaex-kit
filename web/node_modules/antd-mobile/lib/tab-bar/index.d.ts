import React from 'react';
import { TabBarItemProps, TabBarProps } from './PropsType';
export declare class Item extends React.Component<TabBarItemProps, any> {
    static defaultProps: TabBarItemProps;
    render(): JSX.Element;
}
export interface AntTabbarProps extends TabBarProps {
    prefixCls?: string;
    className?: string;
    hidden?: boolean;
    placeholder?: React.ReactNode;
    noRenderContent?: boolean;
    prerenderingSiblingsNumber?: number;
}
declare class AntTabBar extends React.Component<AntTabbarProps, any> {
    static defaultProps: AntTabbarProps;
    static Item: typeof Item;
    getTabs: () => {
        badge?: string | number | undefined;
        onPress?: (() => void) | undefined;
        selected?: boolean | undefined;
        icon?: React.ReactElement<any> | {
            uri: string;
        } | undefined;
        selectedIcon?: React.ReactElement<any> | {
            uri: string;
        } | undefined;
        title: string;
        dot?: boolean | undefined;
        prefixCls?: string | undefined;
        style?: React.CSSProperties | undefined;
    }[];
    renderTabBar: () => JSX.Element;
    render(): JSX.Element;
}
export default AntTabBar;
