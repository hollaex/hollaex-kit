'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _list = require('../list');

var _list2 = _interopRequireDefault(_list);

var _Checkbox = require('./Checkbox');

var _Checkbox2 = _interopRequireDefault(_Checkbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var ListItem = _list2['default'].Item;
// tslint:disable-next-line:no-empty
function noop() {}

var CheckboxItem = function (_React$Component) {
    (0, _inherits3['default'])(CheckboxItem, _React$Component);

    function CheckboxItem() {
        (0, _classCallCheck3['default'])(this, CheckboxItem);
        return (0, _possibleConstructorReturn3['default'])(this, (CheckboxItem.__proto__ || Object.getPrototypeOf(CheckboxItem)).apply(this, arguments));
    }

    (0, _createClass3['default'])(CheckboxItem, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _a = this.props,
                listPrefixCls = _a.listPrefixCls,
                onChange = _a.onChange,
                disabled = _a.disabled,
                checkboxProps = _a.checkboxProps,
                onClick = _a.onClick,
                restProps = __rest(_a, ["listPrefixCls", "onChange", "disabled", "checkboxProps", "onClick"]);var prefixCls = restProps.prefixCls,
                className = restProps.className,
                children = restProps.children;

            var wrapCls = (0, _classnames3['default'])(prefixCls + '-item', className, (0, _defineProperty3['default'])({}, prefixCls + '-item-disabled', disabled === true));
            // Note: if not omit `onChange`, it will trigger twice on check listitem
            if (!disabled) {
                restProps.onClick = onClick || noop;
            }
            var extraProps = {};
            ['name', 'defaultChecked', 'checked', 'onChange', 'disabled'].forEach(function (i) {
                if (i in _this2.props) {
                    extraProps[i] = _this2.props[i];
                }
            });
            return _react2['default'].createElement(
                ListItem,
                (0, _extends3['default'])({}, restProps, { prefixCls: listPrefixCls, className: wrapCls, thumb: _react2['default'].createElement(_Checkbox2['default'], (0, _extends3['default'])({}, checkboxProps, extraProps)) }),
                children
            );
        }
    }]);
    return CheckboxItem;
}(_react2['default'].Component);

exports['default'] = CheckboxItem;

CheckboxItem.defaultProps = {
    prefixCls: 'am-checkbox',
    listPrefixCls: 'am-list',
    checkboxProps: {}
};
module.exports = exports['default'];