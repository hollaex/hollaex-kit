import _extends from 'babel-runtime/helpers/extends';
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

var FlexItem = function (_React$Component) {
    _inherits(FlexItem, _React$Component);

    function FlexItem() {
        _classCallCheck(this, FlexItem);

        return _possibleConstructorReturn(this, (FlexItem.__proto__ || Object.getPrototypeOf(FlexItem)).apply(this, arguments));
    }

    _createClass(FlexItem, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                children = _a.children,
                className = _a.className,
                prefixCls = _a.prefixCls,
                style = _a.style,
                restProps = __rest(_a, ["children", "className", "prefixCls", "style"]);
            var wrapCls = classnames(prefixCls + '-item', className);
            return React.createElement(
                'div',
                _extends({ className: wrapCls, style: style }, restProps),
                children
            );
        }
    }]);

    return FlexItem;
}(React.Component);

export default FlexItem;

FlexItem.defaultProps = {
    prefixCls: 'am-flexbox'
};