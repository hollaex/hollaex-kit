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
import TouchFeedback from 'rmc-feedback';

var Item = function (_React$Component) {
    _inherits(Item, _React$Component);

    function Item() {
        _classCallCheck(this, Item);

        return _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).apply(this, arguments));
    }

    _createClass(Item, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                children = _a.children,
                className = _a.className,
                prefixCls = _a.prefixCls,
                icon = _a.icon,
                disabled = _a.disabled,
                firstItem = _a.firstItem,
                activeStyle = _a.activeStyle,
                restProps = __rest(_a, ["children", "className", "prefixCls", "icon", "disabled", "firstItem", "activeStyle"]);
            var cls = classnames(prefixCls + '-item', className, _defineProperty({}, prefixCls + '-item-disabled', disabled));
            var activeClass = prefixCls + '-item-active ';
            if (firstItem) {
                activeClass += prefixCls + '-item-fix-active-arrow';
            }
            return React.createElement(
                TouchFeedback,
                { disabled: disabled, activeClassName: activeClass, activeStyle: activeStyle },
                React.createElement(
                    'div',
                    _extends({ className: cls }, restProps),
                    React.createElement(
                        'div',
                        { className: prefixCls + '-item-container' },
                        icon ?
                        // tslint:disable-next-line:jsx-no-multiline-js
                        React.createElement(
                            'span',
                            { className: prefixCls + '-item-icon', 'aria-hidden': 'true' },
                            icon
                        ) : null,
                        React.createElement(
                            'span',
                            { className: prefixCls + '-item-content' },
                            children
                        )
                    )
                )
            );
        }
    }]);

    return Item;
}(React.Component);

export default Item;

Item.defaultProps = {
    prefixCls: 'am-popover',
    disabled: false
};
Item.myName = 'PopoverItem';