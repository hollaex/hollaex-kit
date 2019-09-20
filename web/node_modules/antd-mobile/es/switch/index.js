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

var Switch = function (_React$Component) {
    _inherits(Switch, _React$Component);

    function Switch() {
        _classCallCheck(this, Switch);

        var _this = _possibleConstructorReturn(this, (Switch.__proto__ || Object.getPrototypeOf(Switch)).apply(this, arguments));

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

    _createClass(Switch, [{
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
            var wrapCls = classnames(prefixCls, className, _defineProperty({}, prefixCls + '-android', platform === 'android'));
            var fackInputCls = classnames('checkbox', _defineProperty({}, 'checkbox-disabled', disabled));
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
            return React.createElement(
                'label',
                { className: wrapCls },
                React.createElement('input', _extends({ type: 'checkbox', name: name, className: prefixCls + '-checkbox', disabled: disabled, checked: checked, onChange: this.onChange, value: checked ? 'on' : 'off' }, !disabled ? { onClick: this.onClick } : {}, globalProps)),
                React.createElement('div', _extends({ className: fackInputCls, style: style }, disabled ? { onClick: this.onClick } : {}))
            );
        }
    }]);

    return Switch;
}(React.Component);

export default Switch;

Switch.defaultProps = {
    prefixCls: 'am-switch',
    name: '',
    checked: false,
    disabled: false,
    onChange: function onChange() {},

    platform: 'ios',
    onClick: function onClick() {}
};