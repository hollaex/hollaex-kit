import React, { CSSProperties } from 'react';
import { CarouselPropsType } from './PropsType';
export interface CarouselProps extends CarouselPropsType {
    className?: string;
    prefixCls?: string;
    beforeChange?: (from: number, to: number) => void;
    afterChange?: (current: number) => void;
    swipeSpeed?: number;
    easing?: () => void;
    style?: CSSProperties;
    dotStyle?: CSSProperties;
    dotActiveStyle?: CSSProperties;
}
export interface CarouselState {
    selectedIndex?: number;
}
export default class Carousel extends React.Component<CarouselProps, CarouselState> {
    static defaultProps: {
        prefixCls: string;
        dots: boolean;
        arrows: boolean;
        autoplay: boolean;
        infinite: boolean;
        cellAlign: string;
        selectedIndex: number;
        dotStyle: {};
        dotActiveStyle: {};
    };
    constructor(props: CarouselProps);
    onChange: (index: number) => void;
    render(): JSX.Element;
}
