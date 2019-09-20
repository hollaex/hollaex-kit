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
import RMCInputNumber from 'rmc-input-number';
import Icon from '../icon';

var Stepper = function (_React$Component) {
    _inherits(Stepper, _React$Component);

    function Stepper() {
        _classCallCheck(this, Stepper);

        return _possibleConstructorReturn(this, (Stepper.__proto__ || Object.getPrototypeOf(Stepper)).apply(this, arguments));
    }

    _createClass(Stepper, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _a = this.props,
                className = _a.className,
                showNumber = _a.showNumber,
                restProps = __rest(_a, ["className", "showNumber"]);
            var stepperClass = classnames(className, _defineProperty({}, 'showNumber', !!showNumber));
            return React.createElement(RMCInputNumber, _extends({ upHandler: React.createElement(Icon, { type: 'plus', size: 'xxs' }), downHandler: React.createElement(Icon, { type: 'minus', size: 'xxs' }) }, restProps, { ref: function ref(el) {
                    return _this2.stepperRef = el;
                }, className: stepperClass }));
        }
    }]);

    return Stepper;
}(React.Component);

export default Stepper;

Stepper.defaultProps = {
    prefixCls: 'am-stepper',
    step: 1,
    readOnly: false,
    showNumber: false,
    focusOnUpDown: false
};