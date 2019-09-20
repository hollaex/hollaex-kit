import _defineProperty from 'babel-runtime/helpers/defineProperty';
/* tslint:disable:jsx-no-multiline-js */
import classnames from 'classnames';
import React from 'react';
import Checkbox from '../checkbox';
import List from '../list';
import Radio from '../radio';
export default function SubMenu(props) {
    var onClick = function onClick(dataItem) {
        if (props.onSel) {
            props.onSel(dataItem);
        }
    };
    var subMenuPrefixCls = props.subMenuPrefixCls,
        radioPrefixCls = props.radioPrefixCls,
        subMenuData = props.subMenuData,
        showSelect = props.showSelect,
        selItem = props.selItem,
        multiSelect = props.multiSelect;

    var selected = function selected(dataItem) {
        return showSelect && selItem.length > 0 && selItem.indexOf(dataItem.value) !== -1;
    };
    var ItemComponent = !multiSelect ? Radio : Checkbox;
    return React.createElement(
        List,
        { style: { paddingTop: 0 }, className: subMenuPrefixCls },
        subMenuData.map(function (dataItem, idx) {
            var _classnames;

            return React.createElement(
                List.Item,
                { className: classnames(radioPrefixCls + '-item', (_classnames = {}, _defineProperty(_classnames, subMenuPrefixCls + '-item-selected', selected(dataItem)), _defineProperty(_classnames, subMenuPrefixCls + '-item-disabled', dataItem.disabled), _classnames)), key: idx, extra: React.createElement(ItemComponent, { checked: selected(dataItem), disabled: dataItem.disabled, onChange: function onChange() {
                            return onClick(dataItem);
                        } }) },
                dataItem.label
            );
        })
    );
}