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

var Item = function (_React$Component) {
    (0, _inherits3['default'])(Item, _React$Component);

    function Item() {
        (0, _classCallCheck3['default'])(this, Item);
        return (0, _possibleConstructorReturn3['default'])(this, (Item.__proto__ || Object.getPrototypeOf(Item)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Item, [{
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
            var cls = (0, _classnames3['default'])(prefixCls + '-item', className, (0, _defineProperty3['default'])({}, prefixCls + '-item-disabled', disabled));
            var activeClass = prefixCls + '-item-active ';
            if (firstItem) {
                activeClass += prefixCls + '-item-fix-active-arrow';
            }
            return _react2['default'].createElement(
                _rmcFeedback2['default'],
                { disabled: disabled, activeClassName: activeClass, activeStyle: activeStyle },
                _react2['default'].createElement(
                    'div',
                    (0, _extends3['default'])({ className: cls }, restProps),
                    _react2['default'].createElement(
                        'div',
                        { className: prefixCls + '-item-container' },
                        icon ?
                        // tslint:disable-next-line:jsx-no-multiline-js
                        _react2['default'].createElement(
                            'span',
                            { className: prefixCls + '-item-icon', 'aria-hidden': 'true' },
                            icon
                        ) : null,
                        _react2['default'].createElement(
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
}(_react2['default'].Component);

exports['default'] = Item;

Item.defaultProps = {
    prefixCls: 'am-popover',
    disabled: false
};
Item.myName = 'PopoverItem';
module.exports = exports['default'];