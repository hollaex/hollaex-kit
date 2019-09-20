import React from 'react';
import { SwipeActionPropsType } from './PropsType';
export interface SwipeActionProps extends SwipeActionPropsType<React.CSSProperties> {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
}
declare class SwipeAction extends React.Component<SwipeActionProps, any> {
    static defaultProps: {
        prefixCls: string;
        autoClose: boolean;
        disabled: boolean;
        left: never[];
        right: never[];
        onOpen(): void;
        onClose(): void;
    };
    render(): JSX.Element;
}
export default SwipeAction;
