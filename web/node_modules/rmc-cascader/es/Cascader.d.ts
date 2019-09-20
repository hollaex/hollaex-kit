import React from 'react';
import { ICascaderProps } from './CascaderTypes';
declare class Cascader extends React.Component<ICascaderProps, any> {
    static defaultProps: {
        cols: number;
        prefixCls: string;
        pickerPrefixCls: string;
        data: never[];
        disabled: boolean;
    };
    state: {
        value: any;
    };
    componentWillReceiveProps(nextProps: any): void;
    onValueChange: (value: any, index: any) => void;
    getValue(d: any, val: any): any;
    getCols(): any;
    render(): JSX.Element;
}
export default Cascader;
