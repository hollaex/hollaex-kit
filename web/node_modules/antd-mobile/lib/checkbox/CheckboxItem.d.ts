import React from 'react';
import { CheckboxProps } from './Checkbox';
import { CheckboxItemPropsType } from './PropsType';
export interface CheckboxItemProps extends CheckboxItemPropsType {
    listPrefixCls?: string;
    prefixCls?: string;
    className?: string;
    name?: string;
    wrapLabel?: boolean;
    checkboxProps?: CheckboxProps;
}
export default class CheckboxItem extends React.Component<CheckboxItemProps, any> {
    static defaultProps: {
        prefixCls: string;
        listPrefixCls: string;
        checkboxProps: {};
    };
    render(): JSX.Element;
}
