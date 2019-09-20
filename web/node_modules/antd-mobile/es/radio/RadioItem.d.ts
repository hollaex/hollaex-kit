import React from 'react';
import { RadioItemPropsType } from './PropsType';
export interface RadioItemProps extends RadioItemPropsType {
    prefixCls?: string;
    listPrefixCls?: string;
    className?: string;
}
export default class RadioItem extends React.Component<RadioItemProps, any> {
    static defaultProps: {
        prefixCls: string;
        listPrefixCls: string;
        radioProps: {};
    };
    render(): JSX.Element;
}
