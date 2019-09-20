import React from 'react';
import { SliderPropsType } from './PropsType';
export interface SliderProps extends SliderPropsType {
    prefixCls?: string;
    marks?: {
        [key: number]: string;
    };
    dots?: boolean;
    included?: boolean;
    maximumTrackStyle?: React.CSSProperties;
    minimumTrackStyle?: React.CSSProperties;
    handleStyle?: React.CSSProperties;
    trackStyle?: React.CSSProperties;
    railStyle?: React.CSSProperties;
}
export default class Slider extends React.Component<SliderProps, any> {
    static defaultProps: {
        prefixCls: string;
    };
    render(): JSX.Element;
}
