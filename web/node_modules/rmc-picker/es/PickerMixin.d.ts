import * as React from 'react';
import { IPickerProps } from './PickerTypes';
export interface IItemProps {
    className?: string;
    value: any;
    children?: React.ReactNode;
}
export default function (ComposedComponent: any): {
    new (props?: IPickerProps, context?: any): {
        select: (value: any, itemHeight: any, scrollTo: any) => void;
        selectByIndex(index: any, itemHeight: any, zscrollTo: any): void;
        computeChildIndex(top: any, itemHeight: any, childrenLength: any): number;
        doScrollingComplete: (top: any, itemHeight: any, fireValueChange: any) => void;
        render(): JSX.Element;
        setState<K extends string | number | symbol>(state: any, callback?: () => any): void;
        forceUpdate(callBack?: () => any): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<IPickerProps>;
        state: Readonly<any>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentWillMount?(): void;
        componentDidMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<IPickerProps>, nextContext: any): void;
        shouldComponentUpdate?(nextProps: Readonly<IPickerProps>, nextState: Readonly<any>, nextContext: any): boolean;
        componentWillUpdate?(nextProps: Readonly<IPickerProps>, nextState: Readonly<any>, nextContext: any): void;
        componentDidUpdate?(prevProps: Readonly<IPickerProps>, prevState: Readonly<any>, prevContext: any): void;
        componentWillUnmount?(): void;
    };
    Item: (_props: IItemProps) => any;
};
