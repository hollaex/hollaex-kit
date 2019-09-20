import React from 'react';
import PropTypes from 'prop-types';
import { DataItem, MenuProps, ValueType } from './PropsType';
export interface StateType {
    value?: ValueType;
    firstLevelSelectValue: string;
    height?: number;
}
export default class Menu extends React.Component<MenuProps, StateType> {
    static defaultProps: {
        prefixCls: string;
        subMenuPrefixCls: string;
        radioPrefixCls: string;
        multiSelectMenuBtnsCls: string;
        MenuSelectContanerPrefixCls: string;
        data: never[];
        level: number;
        onChange: () => void;
        onOk: () => void;
        onCancel: () => void;
        multiSelect: boolean;
    };
    static contextTypes: {
        antLocale: PropTypes.Requireable<object>;
    };
    constructor(props: MenuProps);
    componentWillReceiveProps(nextProps: MenuProps): void;
    componentDidMount(): void;
    onMenuOk: () => void;
    onMenuCancel: () => void;
    getNewFsv(props: MenuProps): string;
    onClickFirstLevelItem: (dataItem: DataItem) => void;
    getSelectValue: (dataItem: DataItem) => any[];
    onClickSubMenuItem: (dataItem: DataItem) => void;
    render(): JSX.Element;
}
