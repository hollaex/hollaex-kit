/// <reference types="react" />
import React from 'react';
export interface IDecoratorProps {
    currentSlide: number;
    slideCount: number;
    frameWidth: number | string;
    slideWidth: number | string;
    slidesToScroll: number;
    cellSpacing?: number;
    slidesToShow?: number;
    wrapAround?: boolean;
    nextSlide?: () => void;
    previousSlide: () => void;
    goToSlide?: (index: number) => void;
}
declare const DefaultDecorators: ({
    component: {
        new (props: IDecoratorProps, context?: any): {
            render(): JSX.Element;
            handleClick: (e: any) => void;
            getButtonStyles(disabled: any): {
                border: number;
                background: string;
                color: string;
                padding: number;
                outline: number;
                opacity: number;
                cursor: string;
            };
            setState<K extends string>(f: (prevState: Readonly<any>, props: IDecoratorProps) => Pick<any, K>, callback?: (() => any) | undefined): void;
            setState<K extends string>(state: Pick<any, K>, callback?: (() => any) | undefined): void;
            forceUpdate(callBack?: (() => any) | undefined): void;
            props: Readonly<{
                children?: React.ReactNode;
            }> & Readonly<IDecoratorProps>;
            state: Readonly<any>;
            context: any;
            refs: {
                [key: string]: React.ReactInstance;
            };
        };
    };
    position: string;
} | {
    component: {
        new (props: IDecoratorProps, context?: any): {
            render(): JSX.Element;
            getIndexes(count: any, inc: any): number[];
            getListStyles(): React.CSSProperties;
            getListItemStyles(): React.CSSProperties;
            getButtonStyles(active: any): {
                border: number;
                background: string;
                color: string;
                cursor: string;
                padding: number;
                outline: number;
                fontSize: number;
                opacity: number;
            };
            setState<K extends string>(f: (prevState: Readonly<any>, props: IDecoratorProps) => Pick<any, K>, callback?: (() => any) | undefined): void;
            setState<K extends string>(state: Pick<any, K>, callback?: (() => any) | undefined): void;
            forceUpdate(callBack?: (() => any) | undefined): void;
            props: Readonly<{
                children?: React.ReactNode;
            }> & Readonly<IDecoratorProps>;
            state: Readonly<any>;
            context: any;
            refs: {
                [key: string]: React.ReactInstance;
            };
        };
    };
    position: string;
})[];
export default DefaultDecorators;
