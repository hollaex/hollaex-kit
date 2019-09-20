import React from 'react';
import Item from './Item';
import { PopoverPropsType } from './PropsType';
export interface PopOverPropsType extends PopoverPropsType {
    prefixCls?: string;
    visible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    placement?: 'left' | 'right' | 'top' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
    mask?: boolean;
}
export default class Popover extends React.Component<PopOverPropsType, any> {
    static defaultProps: {
        prefixCls: string;
        placement: string;
        align: {
            overflow: {
                adjustY: number;
                adjustX: number;
            };
        };
        trigger: string[];
    };
    static Item: typeof Item;
    render(): JSX.Element;
}
