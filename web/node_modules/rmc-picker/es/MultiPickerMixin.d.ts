import * as React from 'react';
import MultiPickerProps from './MultiPickerProps';
export default function (ComposedComponent: any): {
    new (props?: MultiPickerProps, context?: any): {
        getValue: () => any[];
        onChange: (i: any, v: any, cb: any) => void;
        onValueChange: (i: any, v: any) => void;
        onScrollChange: (i: any, v: any) => void;
        render(): JSX.Element;
        setState<K extends string | number | symbol>(state: any, callback?: () => any): void;
        forceUpdate(callBack?: () => any): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<MultiPickerProps>;
        state: Readonly<any>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentWillMount?(): void;
        componentDidMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<MultiPickerProps>, nextContext: any): void;
        shouldComponentUpdate?(nextProps: Readonly<MultiPickerProps>, nextState: Readonly<any>, nextContext: any): boolean;
        componentWillUpdate?(nextProps: Readonly<MultiPickerProps>, nextState: Readonly<any>, nextContext: any): void;
        componentDidUpdate?(prevProps: Readonly<MultiPickerProps>, prevState: Readonly<any>, prevContext: any): void;
        componentWillUnmount?(): void;
    };
    defaultProps: {
        prefixCls: string;
        onValueChange(): void;
    };
};
