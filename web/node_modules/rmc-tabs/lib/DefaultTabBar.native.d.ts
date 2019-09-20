import React from 'react';
import { default as RN, Animated, ScrollView } from 'react-native';
import { TabBarPropsType } from './PropsType';
import { Models } from './Models';
import defaultStyles from './Styles.native';
export interface PropsType extends TabBarPropsType {
    scrollValue?: any;
    styles?: typeof defaultStyles;
    tabStyle?: RN.ViewStyle;
    tabsContainerStyle?: RN.ViewStyle;
    /** default: false */
    dynamicTabUnderlineWidth?: boolean;
    keyboardShouldPersistTaps?: boolean;
}
export interface StateType {
    _leftTabUnderline: Animated.Value;
    _widthTabUnderline: Animated.Value;
    _containerWidth: number;
    _tabContainerWidth: number;
}
export declare class DefaultTabBar extends React.PureComponent<PropsType, StateType> {
    static defaultProps: PropsType;
    _tabsMeasurements: any[];
    _tabContainerMeasurements: any;
    _containerMeasurements: any;
    _scrollView: ScrollView;
    constructor(props: PropsType);
    componentDidMount(): void;
    updateView: (offset: any) => void;
    necessarilyMeasurementsCompleted(position: number, isLastTab: boolean): any;
    updateTabPanel(position: number, pageOffset: number): void;
    updateTabUnderline(position: number, pageOffset: number, tabCount: number): void;
    onPress: (index: number) => void;
    renderTab(tab: Models.TabData, index: number, width: number, onLayoutHandler: any): JSX.Element;
    measureTab: (page: number, event: any) => void;
    render(): JSX.Element;
    onTabContainerLayout: (e: RN.LayoutChangeEvent) => void;
    onContainerLayout: (e: RN.LayoutChangeEvent) => void;
}
