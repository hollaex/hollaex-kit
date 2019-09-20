/// <reference types="react" />
import React from 'react';
export declare type IDecoratorPosition = 'TopLeft' | 'TopCenter' | 'TopRight' | 'CenterLeft' | 'CenterCenter' | 'CenterRight' | 'BottomLeft' | 'BottomCenter' | 'BottomRight';
export interface ICarouselProps {
    className?: string;
    style?: any;
    afterSlide?: (index: number) => void;
    autoplay?: boolean;
    resetAutoplay?: boolean;
    swipeSpeed?: number;
    autoplayInterval?: number;
    beforeSlide?: (currentIndex: number, endIndex: number) => void;
    cellAlign?: 'left' | 'center' | 'right';
    cellSpacing?: number;
    data?: () => void;
    decorators?: any[];
    dragging?: boolean;
    easing?: Function;
    edgeEasing?: Function;
    framePadding?: string;
    frameOverflow?: string;
    initialSlideHeight?: number;
    initialSlideWidth?: number;
    slideIndex?: number;
    slidesToShow?: number;
    slidesToScroll?: number | 'auto';
    slideWidth?: string | number;
    speed?: number;
    swiping?: boolean;
    vertical?: boolean;
    width?: string;
    wrapAround?: boolean;
}
declare class Carousel extends React.Component<ICarouselProps, any> {
    static defaultProps: ICarouselProps;
    touchObject: any;
    autoplayPaused: any;
    clickSafe: boolean;
    autoplayID: any;
    _rafID: any;
    constructor(props: any);
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: any): void;
    componentWillUnmount(): void;
    tweenState(path: any, {easing, duration, delay, beginValue, endValue, onEnd, stackBehavior: configSB}: {
        easing: any;
        duration: any;
        delay: any;
        beginValue: any;
        endValue: any;
        onEnd: any;
        stackBehavior: any;
    }): void;
    getTweeningValue(path: any): any;
    _rafCb: () => void;
    render(): JSX.Element;
    getTouchEvents(): {
        onTouchStart(e: any): void;
        onTouchMove(e: any): void;
        onTouchEnd(e: any): void;
        onTouchCancel(e: any): void;
    } | null;
    getMouseEvents(): {
        onMouseOver(): void;
        onMouseOut(): void;
        onMouseDown(e: any): void;
        onMouseMove(e: any): void;
        onMouseUp(e: any): void;
        onMouseLeave(e: any): void;
    } | null;
    handleMouseOver(): void;
    handleMouseOut(): void;
    handleClick: (e: any) => void;
    handleSwipe(_: any): void;
    swipeDirection(x1: any, x2: any, y1: any, y2: any): 0 | 1 | -1;
    autoplayIterator: () => void;
    startAutoplay(): void;
    resetAutoplay(): void;
    stopAutoplay(): void;
    goToSlide: (index: any) => void;
    nextSlide: () => void;
    previousSlide: () => void;
    animateSlide(easing?: any, duration?: any, endValue?: any, callback?: Function): void;
    getTargetLeft(touchOffset?: any, slide?: any): number;
    bindEvents(): void;
    onResize: () => void;
    onReadyStateChange: () => void;
    unbindEvents(): void;
    formatChildren(children: any): JSX.Element[];
    setInitialDimensions(): void;
    setDimensions(props?: any): void;
    setLeft(): void;
    setExternalData(): void;
    getListStyles(): React.CSSProperties;
    getFrameStyles(): React.CSSProperties;
    getSlideStyles(index: any, positionValue: any): React.CSSProperties;
    getSlideTargetPosition(index: any, positionValue: any): number;
    getSliderStyles(): {
        position: string;
        display: string;
        width: string | undefined;
        height: string;
        boxSizing: string;
        MozBoxSizing: string;
        visibility: string;
    };
    getStyleTagStyles(): string;
    getDecoratorStyles(position: any): {
        position: string;
        top: number;
        left: number;
    } | {
        position: string;
        top: number;
        left: string;
        transform: string;
        WebkitTransform: string;
        msTransform: string;
    } | {
        position: string;
        top: number;
        right: number;
    } | {
        position: string;
        top: string;
        left: number;
        transform: string;
        WebkitTransform: string;
        msTransform: string;
    } | {
        position: string;
        top: string;
        left: string;
        transform: string;
        WebkitTransform: string;
        msTransform: string;
    } | {
        position: string;
        top: string;
        right: number;
        transform: string;
        WebkitTransform: string;
        msTransform: string;
    } | {
        position: string;
        bottom: number;
        left: number;
    } | {
        position: string;
        bottom: number;
        width: string;
        textAlign: string;
    } | {
        position: string;
        bottom: number;
        right: number;
    };
}
export default Carousel;
