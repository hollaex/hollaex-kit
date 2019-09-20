import React from 'react';
import { SegmentedControlPropsType } from './PropsType';
export interface SegmentedControlProps extends SegmentedControlPropsType {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
}
export default class SegmentedControl extends React.Component<SegmentedControlProps, any> {
    static defaultProps: {
        prefixCls: string;
        selectedIndex: number;
        disabled: boolean;
        values: never[];
        onChange(): void;
        onValueChange(): void;
        style: {};
        tintColor: string;
    };
    constructor(props: SegmentedControlProps);
    componentWillReceiveProps(nextProps: SegmentedControlProps): void;
    onClick(e: React.MouseEvent<HTMLDivElement>, index: any, value: any): void;
    renderSegmentItem(idx: number, value: string, selected: boolean): JSX.Element;
    render(): JSX.Element;
}
