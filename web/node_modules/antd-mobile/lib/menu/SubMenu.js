'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports['default'] = SubMenu;

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _list = require('../list');

var _list2 = _interopRequireDefault(_list);

var _radio = require('../radio');

var _radio2 = _interopRequireDefault(_radio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function SubMenu(props) {
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
    var ItemComponent = !multiSelect ? _radio2['default'] : _checkbox2['default'];
    return _react2['default'].createElement(
        _list2['default'],
        { style: { paddingTop: 0 }, className: subMenuPrefixCls },
        subMenuData.map(function (dataItem, idx) {
            var _classnames;

            return _react2['default'].createElement(
                _list2['default'].Item,
                { className: (0, _classnames3['default'])(radioPrefixCls + '-item', (_classnames = {}, (0, _defineProperty3['default'])(_classnames, subMenuPrefixCls + '-item-selected', selected(dataItem)), (0, _defineProperty3['default'])(_classnames, subMenuPrefixCls + '-item-disabled', dataItem.disabled), _classnames)), key: idx, extra: _react2['default'].createElement(ItemComponent, { checked: selected(dataItem), disabled: dataItem.disabled, onChange: function onChange() {
                            return onClick(dataItem);
                        } }) },
                dataItem.label
            );
        })
    );
} /* tslint:disable:jsx-no-multiline-js */
module.exports = exports['default'];