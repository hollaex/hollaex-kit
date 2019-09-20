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
/* tslint:disable:jsx-no-multiline-js */
import classnames from 'classnames';
import React from 'react';
import Item from './ListItem';

var List = function (_React$Component) {
    _inherits(List, _React$Component);

    function List() {
        _classCallCheck(this, List);

        return _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).apply(this, arguments));
    }

    _createClass(List, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                prefixCls = _a.prefixCls,
                children = _a.children,
                className = _a.className,
                style = _a.style,
                renderHeader = _a.renderHeader,
                renderFooter = _a.renderFooter,
                restProps = __rest(_a, ["prefixCls", "children", "className", "style", "renderHeader", "renderFooter"]);
            var wrapCls = classnames(prefixCls, className);
            return React.createElement(
                'div',
                _extends({ className: wrapCls, style: style }, restProps),
                renderHeader ? React.createElement(
                    'div',
                    { className: prefixCls + '-header' },
                    typeof renderHeader === 'function' ? renderHeader() : renderHeader
                ) : null,
                children ? React.createElement(
                    'div',
                    { className: prefixCls + '-body' },
                    children
                ) : null,
                renderFooter ? React.createElement(
                    'div',
                    { className: prefixCls + '-footer' },
                    typeof renderFooter === 'function' ? renderFooter() : renderFooter
                ) : null
            );
        }
    }]);

    return List;
}(React.Component);

export default List;

List.Item = Item;
List.defaultProps = {
    prefixCls: 'am-list'
};