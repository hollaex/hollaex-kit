import React, { CSSProperties } from 'react';
import { BadgePropsTypes } from './PropsType';
export interface BadgeProps extends BadgePropsTypes {
    prefixCls?: string;
    className?: string;
    hot?: boolean;
    style?: CSSProperties;
}
export default class Badge extends React.Component<BadgeProps, any> {
    static defaultProps: {
        prefixCls: string;
        size: string;
        overflowCount: number;
        dot: boolean;
        corner: boolean;
    };
    render(): JSX.Element;
}
