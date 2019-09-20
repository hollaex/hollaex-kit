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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var Flex = function (_React$Component) {
    (0, _inherits3['default'])(Flex, _React$Component);

    function Flex() {
        (0, _classCallCheck3['default'])(this, Flex);
        return (0, _possibleConstructorReturn3['default'])(this, (Flex.__proto__ || Object.getPrototypeOf(Flex)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Flex, [{
        key: 'render',
        value: function render() {
            var _classnames;

            var _a = this.props,
                direction = _a.direction,
                wrap = _a.wrap,
                justify = _a.justify,
                align = _a.align,
                alignContent = _a.alignContent,
                className = _a.className,
                children = _a.children,
                prefixCls = _a.prefixCls,
                style = _a.style,
                restProps = __rest(_a, ["direction", "wrap", "justify", "align", "alignContent", "className", "children", "prefixCls", "style"]);
            var wrapCls = (0, _classnames3['default'])(prefixCls, className, (_classnames = {}, (0, _defineProperty3['default'])(_classnames, prefixCls + '-dir-row', direction === 'row'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-dir-row-reverse', direction === 'row-reverse'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-dir-column', direction === 'column'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-dir-column-reverse', direction === 'column-reverse'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-nowrap', wrap === 'nowrap'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-wrap', wrap === 'wrap'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-wrap-reverse', wrap === 'wrap-reverse'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-justify-start', justify === 'start'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-justify-end', justify === 'end'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-justify-center', justify === 'center'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-justify-between', justify === 'between'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-justify-around', justify === 'around'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-align-start', align === 'start'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-align-center', align === 'center'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-align-end', align === 'end'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-align-baseline', align === 'baseline'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-align-stretch', align === 'stretch'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-align-content-start', alignContent === 'start'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-align-content-end', alignContent === 'end'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-align-content-center', alignContent === 'center'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-align-content-between', alignContent === 'between'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-align-content-around', alignContent === 'around'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-align-content-stretch', alignContent === 'stretch'), _classnames));
            return _react2['default'].createElement(
                'div',
                (0, _extends3['default'])({ className: wrapCls, style: style }, restProps),
                children
            );
        }
    }]);
    return Flex;
}(_react2['default'].Component);

exports['default'] = Flex;

Flex.defaultProps = {
    prefixCls: 'am-flexbox',
    align: 'center'
};
module.exports = exports['default'];