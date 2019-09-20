import React from 'react';
import { TabIcon } from './PropsType';
export interface TabProps {
    dot?: boolean;
    badge?: string | number;
    selected?: boolean;
    selectedIcon?: TabIcon;
    icon?: TabIcon;
    title?: string;
    prefixCls: string;
    onClick?: () => void;
    unselectedTintColor?: string;
    tintColor?: string;
    dataAttrs?: {
        [key: string]: string;
    };
}
declare class Tab extends React.PureComponent<TabProps, any> {
    renderIcon: () => JSX.Element;
    onClick: () => void;
    render(): JSX.Element;
}
export default Tab;
