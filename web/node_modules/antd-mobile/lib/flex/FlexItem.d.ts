import React from 'react';
import { FlexItemPropsType } from './PropsType';
export interface FlexItemProps extends FlexItemPropsType {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
}
export default class FlexItem extends React.Component<FlexItemProps, any> {
    static defaultProps: {
        prefixCls: string;
    };
    render(): JSX.Element;
}
