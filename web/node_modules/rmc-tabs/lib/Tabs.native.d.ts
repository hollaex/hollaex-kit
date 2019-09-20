import React from 'react';
import { default as RN, Animated, ScrollView } from 'react-native';
import { PropsType as BasePropsType } from './PropsType';
import { Tabs as Component, StateType as BaseStateType } from './Tabs.base';
import { DefaultTabBar } from './DefaultTabBar';
import Styles from './Styles.native';
export interface PropsType extends BasePropsType {
    children?: any;
    style?: RN.ViewStyle;
    styles?: typeof Styles;
    keyboardShouldPersistTaps?: boolean;
}
export interface StateType extends BaseStateType {
    scrollX: Animated.Value;
    scrollValue: Animated.Value;
    containerWidth: number;
}
export declare class Tabs extends Component<PropsType, StateType> {
    static DefaultTabBar: typeof DefaultTabBar;
    static defaultProps: PropsType;
    AnimatedScrollView: ScrollView;
    scrollView: {
        _component: ScrollView;
    };
    constructor(props: PropsType);
    componentDidMount(): void;
    onScroll: (evt?: RN.NativeSyntheticEvent<RN.NativeScrollEvent> | undefined) => void;
    setScrollView: (sv: any) => void;
    renderContent: (getSubElements?: (defaultPrefix?: string, allPrefix?: string) => {
        [key: string]: React.ReactNode;
    }) => JSX.Element;
    onMomentumScrollEnd: (e: RN.NativeSyntheticEvent<RN.NativeScrollEvent>) => void;
    goToTab(index: number, force?: boolean, animated?: boolean | undefined): boolean;
    handleLayout: (e: RN.LayoutChangeEvent) => void;
    scrollTo: (index: number, animated?: boolean) => void;
    render(): JSX.Element;
}
