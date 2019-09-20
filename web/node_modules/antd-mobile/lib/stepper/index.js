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

var _rmcInputNumber = require('rmc-input-number');

var _rmcInputNumber2 = _interopRequireDefault(_rmcInputNumber);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var Stepper = function (_React$Component) {
    (0, _inherits3['default'])(Stepper, _React$Component);

    function Stepper() {
        (0, _classCallCheck3['default'])(this, Stepper);
        return (0, _possibleConstructorReturn3['default'])(this, (Stepper.__proto__ || Object.getPrototypeOf(Stepper)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Stepper, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _a = this.props,
                className = _a.className,
                showNumber = _a.showNumber,
                restProps = __rest(_a, ["className", "showNumber"]);
            var stepperClass = (0, _classnames3['default'])(className, (0, _defineProperty3['default'])({}, 'showNumber', !!showNumber));
            return _react2['default'].createElement(_rmcInputNumber2['default'], (0, _extends3['default'])({ upHandler: _react2['default'].createElement(_icon2['default'], { type: 'plus', size: 'xxs' }), downHandler: _react2['default'].createElement(_icon2['default'], { type: 'minus', size: 'xxs' }) }, restProps, { ref: function ref(el) {
                    return _this2.stepperRef = el;
                }, className: stepperClass }));
        }
    }]);
    return Stepper;
}(_react2['default'].Component);

exports['default'] = Stepper;

Stepper.defaultProps = {
    prefixCls: 'am-stepper',
    step: 1,
    readOnly: false,
    showNumber: false,
    focusOnUpDown: false
};
module.exports = exports['default'];