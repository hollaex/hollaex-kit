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
import getDataAttr from '../_util/getDataAttr';
import Checkbox from './Checkbox';

var AgreeItem = function (_React$Component) {
    _inherits(AgreeItem, _React$Component);

    function AgreeItem() {
        _classCallCheck(this, AgreeItem);

        return _possibleConstructorReturn(this, (AgreeItem.__proto__ || Object.getPrototypeOf(AgreeItem)).apply(this, arguments));
    }

    _createClass(AgreeItem, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                style = _a.style,
                restProps = __rest(_a, ["style"]);var prefixCls = restProps.prefixCls,
                className = restProps.className;

            var wrapCls = classnames(prefixCls + '-agree', className);
            return React.createElement(
                'div',
                _extends({}, getDataAttr(restProps), { className: wrapCls, style: style }),
                React.createElement(Checkbox, _extends({}, restProps, { className: prefixCls + '-agree-label' }))
            );
        }
    }]);

    return AgreeItem;
}(React.Component);

export default AgreeItem;

AgreeItem.defaultProps = {
    prefixCls: 'am-checkbox'
};