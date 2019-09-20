import React from 'react';
import SwipeoutPropType from './PropTypes';
export declare type SwipeButttonType = {
    backgroundColor?: string;
    color?: string;
    component?: JSX.Element;
    text?: string;
    type?: 'default' | 'delete' | 'primary' | 'secondary';
    underlayColor?: string;
    disabled?: boolean;
    onPress?(): void;
};
declare class Swipeout extends React.Component<SwipeoutPropType, any> {
    static defaultProps: {
        autoClose: boolean;
        disabled: boolean;
        onOpen(): void;
        onClose(): void;
    };
    constructor(props: any);
    renderCustomButton(button: any): {
        text: any;
        onPress: any;
        type: string;
        component: JSX.Element;
        backgroundColor: string;
        color: string;
        disabled: boolean;
    };
    render(): JSX.Element;
}
export default Swipeout;
