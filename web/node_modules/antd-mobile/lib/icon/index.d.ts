import React from 'react';
import { IconPropsType } from './PropsType';
import { Omit } from '../_util/types';
export declare type SvgProps = Omit<React.HTMLProps<SVGSVGElement>, 'size' | 'type'>;
export interface IconProps extends IconPropsType, SvgProps {
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
    onClick?: React.MouseEventHandler<SVGSVGElement>;
}
export default class Icon extends React.Component<IconProps, any> {
    static defaultProps: {
        size: string;
    };
    componentDidMount(): void;
    render(): JSX.Element;
}
