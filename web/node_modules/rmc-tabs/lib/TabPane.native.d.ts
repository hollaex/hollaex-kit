import React from 'react';
import { default as RN } from 'react-native';
export interface PropsType {
    key?: string;
    style?: RN.ViewStyle;
    active: boolean;
}
export declare class TabPane extends React.PureComponent<PropsType, {}> {
    render(): JSX.Element;
}
