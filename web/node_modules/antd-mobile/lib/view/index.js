'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var View = function (_React$Component) {
    (0, _inherits3['default'])(View, _React$Component);

    function View() {
        (0, _classCallCheck3['default'])(this, View);
        return (0, _possibleConstructorReturn3['default'])(this, (View.__proto__ || Object.getPrototypeOf(View)).apply(this, arguments));
    }

    (0, _createClass3['default'])(View, [{
        key: 'render',
        value: function render() {
            var props = (0, _extends3['default'])({}, this.props);
            if (Array.isArray(props.style)) {
                var style = {};
                props.style.forEach(function (s) {
                    style = (0, _extends3['default'])({}, style, s);
                });
                props.style = style;
            }

            var _props$Component = props.Component,
                Component = _props$Component === undefined ? 'div' : _props$Component,
                restProps = __rest(props, ["Component"]);

            return _react2['default'].createElement(Component, restProps);
        }
    }]);
    return View;
}(_react2['default'].Component);

exports['default'] = View;

View.defaultProps = {
    Component: 'div'
};
module.exports = exports['default'];