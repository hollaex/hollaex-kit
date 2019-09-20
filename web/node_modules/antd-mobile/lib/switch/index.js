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

var _classnames3 = require('classnames');

var _classnames4 = _interopRequireDefault(_classnames3);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var Switch = function (_React$Component) {
    (0, _inherits3['default'])(Switch, _React$Component);

    function Switch() {
        (0, _classCallCheck3['default'])(this, Switch);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Switch.__proto__ || Object.getPrototypeOf(Switch)).apply(this, arguments));

        _this.onChange = function (e) {
            var checked = e.target.checked;
            if (_this.props.onChange) {
                _this.props.onChange(checked);
            }
        };
        _this.onClick = function (e) {
            if (_this.props.onClick) {
                var val = void 0;
                // tslint:disable-next-line:prefer-conditional-expression
                if (e && e.target && e.target.checked !== undefined) {
                    val = e.target.checked;
                } else {
                    val = _this.props.checked;
                }
                _this.props.onClick(val);
            }
        };
        return _this;
    }

    (0, _createClass3['default'])(Switch, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                prefixCls = _a.prefixCls,
                name = _a.name,
                checked = _a.checked,
                disabled = _a.disabled,
                className = _a.className,
                platform = _a.platform,
                color = _a.color,
                restProps = __rest(_a, ["prefixCls", "name", "checked", "disabled", "className", "platform", "color"]);
            var wrapCls = (0, _classnames4['default'])(prefixCls, className, (0, _defineProperty3['default'])({}, prefixCls + '-android', platform === 'android'));
            var fackInputCls = (0, _classnames4['default'])('checkbox', (0, _defineProperty3['default'])({}, 'checkbox-disabled', disabled));
            var globalProps = Object.keys(restProps).reduce(function (prev, key) {
                if (key.substr(0, 5) === 'aria-' || key.substr(0, 5) === 'data-' || key === 'role') {
                    prev[key] = restProps[key];
                }
                return prev;
            }, {});
            var style = this.props.style || {};
            if (color && checked) {
                style.backgroundColor = color;
            }
            return _react2['default'].createElement(
                'label',
                { className: wrapCls },
                _react2['default'].createElement('input', (0, _extends3['default'])({ type: 'checkbox', name: name, className: prefixCls + '-checkbox', disabled: disabled, checked: checked, onChange: this.onChange, value: checked ? 'on' : 'off' }, !disabled ? { onClick: this.onClick } : {}, globalProps)),
                _react2['default'].createElement('div', (0, _extends3['default'])({ className: fackInputCls, style: style }, disabled ? { onClick: this.onClick } : {}))
            );
        }
    }]);
    return Switch;
}(_react2['default'].Component);

exports['default'] = Switch;

Switch.defaultProps = {
    prefixCls: 'am-switch',
    name: '',
    checked: false,
    disabled: false,
    onChange: function onChange() {},

    platform: 'ios',
    onClick: function onClick() {}
};
module.exports = exports['default'];