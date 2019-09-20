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

var Flex = function (_React$Component) {
    _inherits(Flex, _React$Component);

    function Flex() {
        _classCallCheck(this, Flex);

        return _possibleConstructorReturn(this, (Flex.__proto__ || Object.getPrototypeOf(Flex)).apply(this, arguments));
    }

    _createClass(Flex, [{
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
            var wrapCls = classnames(prefixCls, className, (_classnames = {}, _defineProperty(_classnames, prefixCls + '-dir-row', direction === 'row'), _defineProperty(_classnames, prefixCls + '-dir-row-reverse', direction === 'row-reverse'), _defineProperty(_classnames, prefixCls + '-dir-column', direction === 'column'), _defineProperty(_classnames, prefixCls + '-dir-column-reverse', direction === 'column-reverse'), _defineProperty(_classnames, prefixCls + '-nowrap', wrap === 'nowrap'), _defineProperty(_classnames, prefixCls + '-wrap', wrap === 'wrap'), _defineProperty(_classnames, prefixCls + '-wrap-reverse', wrap === 'wrap-reverse'), _defineProperty(_classnames, prefixCls + '-justify-start', justify === 'start'), _defineProperty(_classnames, prefixCls + '-justify-end', justify === 'end'), _defineProperty(_classnames, prefixCls + '-justify-center', justify === 'center'), _defineProperty(_classnames, prefixCls + '-justify-between', justify === 'between'), _defineProperty(_classnames, prefixCls + '-justify-around', justify === 'around'), _defineProperty(_classnames, prefixCls + '-align-start', align === 'start'), _defineProperty(_classnames, prefixCls + '-align-center', align === 'center'), _defineProperty(_classnames, prefixCls + '-align-end', align === 'end'), _defineProperty(_classnames, prefixCls + '-align-baseline', align === 'baseline'), _defineProperty(_classnames, prefixCls + '-align-stretch', align === 'stretch'), _defineProperty(_classnames, prefixCls + '-align-content-start', alignContent === 'start'), _defineProperty(_classnames, prefixCls + '-align-content-end', alignContent === 'end'), _defineProperty(_classnames, prefixCls + '-align-content-center', alignContent === 'center'), _defineProperty(_classnames, prefixCls + '-align-content-between', alignContent === 'between'), _defineProperty(_classnames, prefixCls + '-align-content-around', alignContent === 'around'), _defineProperty(_classnames, prefixCls + '-align-content-stretch', alignContent === 'stretch'), _classnames));
            return React.createElement(
                'div',
                _extends({ className: wrapCls, style: style }, restProps),
                children
            );
        }
    }]);

    return Flex;
}(React.Component);

export default Flex;

Flex.defaultProps = {
    prefixCls: 'am-flexbox',
    align: 'center'
};