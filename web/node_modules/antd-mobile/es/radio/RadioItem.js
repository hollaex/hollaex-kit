import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
import classnames from 'classnames';
import React from 'react';
import List from '../list';
import Radio from './Radio';
var ListItem = List.Item;
function noop() {}

var RadioItem = function (_React$Component) {
    _inherits(RadioItem, _React$Component);

    function RadioItem() {
        _classCallCheck(this, RadioItem);

        return _possibleConstructorReturn(this, (RadioItem.__proto__ || Object.getPrototypeOf(RadioItem)).apply(this, arguments));
    }

    _createClass(RadioItem, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _a = this.props,
                listPrefixCls = _a.listPrefixCls,
                onChange = _a.onChange,
                disabled = _a.disabled,
                radioProps = _a.radioProps,
                onClick = _a.onClick,
                otherProps = __rest(_a, ["listPrefixCls", "onChange", "disabled", "radioProps", "onClick"]);var prefixCls = otherProps.prefixCls,
                className = otherProps.className,
                children = otherProps.children;

            var wrapCls = classnames(prefixCls + '-item', className, _defineProperty({}, prefixCls + '-item-disabled', disabled === true));
            // Note: if not omit `onChange`, it will trigger twice on check listitem
            if (!disabled) {
                otherProps.onClick = onClick || noop;
            }
            var extraProps = {};
            ['name', 'defaultChecked', 'checked', 'onChange', 'disabled'].forEach(function (i) {
                if (i in _this2.props) {
                    extraProps[i] = _this2.props[i];
                }
            });
            return React.createElement(
                ListItem,
                _extends({}, otherProps, { prefixCls: listPrefixCls, className: wrapCls, extra: React.createElement(Radio, _extends({}, radioProps, extraProps)) }),
                children
            );
        }
    }]);

    return RadioItem;
}(React.Component);

export default RadioItem;

RadioItem.defaultProps = {
    prefixCls: 'am-radio',
    listPrefixCls: 'am-list',
    radioProps: {}
};