'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rmcFeedback = require('rmc-feedback');

var _rmcFeedback2 = _interopRequireDefault(_rmcFeedback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var InputHandler = function (_Component) {
    (0, _inherits3['default'])(InputHandler, _Component);

    function InputHandler() {
        (0, _classCallCheck3['default'])(this, InputHandler);
        return (0, _possibleConstructorReturn3['default'])(this, (InputHandler.__proto__ || Object.getPrototypeOf(InputHandler)).apply(this, arguments));
    }

    (0, _createClass3['default'])(InputHandler, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                prefixCls = _a.prefixCls,
                disabled = _a.disabled,
                otherProps = __rest(_a, ["prefixCls", "disabled"]);
            return _react2['default'].createElement(
                _rmcFeedback2['default'],
                { disabled: disabled, activeClassName: prefixCls + '-handler-active' },
                _react2['default'].createElement('span', otherProps)
            );
        }
    }]);
    return InputHandler;
}(_react.Component);

exports['default'] = InputHandler;
module.exports = exports['default'];