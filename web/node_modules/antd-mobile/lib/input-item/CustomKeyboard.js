'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.KeyboardItem = undefined;

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rmcFeedback = require('rmc-feedback');

var _rmcFeedback2 = _interopRequireDefault(_rmcFeedback);

var _exenv = require('../_util/exenv');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var KeyboardItem = exports.KeyboardItem = function (_React$Component) {
    (0, _inherits3['default'])(KeyboardItem, _React$Component);

    function KeyboardItem() {
        (0, _classCallCheck3['default'])(this, KeyboardItem);
        return (0, _possibleConstructorReturn3['default'])(this, (KeyboardItem.__proto__ || Object.getPrototypeOf(KeyboardItem)).apply(this, arguments));
    }

    (0, _createClass3['default'])(KeyboardItem, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                prefixCls = _a.prefixCls,
                _onClick = _a.onClick,
                className = _a.className,
                disabled = _a.disabled,
                children = _a.children,
                tdRef = _a.tdRef,
                label = _a.label,
                iconOnly = _a.iconOnly,
                restProps = __rest(_a, ["prefixCls", "onClick", "className", "disabled", "children", "tdRef", "label", "iconOnly"]);
            var value = children;
            if (className === 'keyboard-delete') {
                value = 'delete';
            } else if (className === 'keyboard-hide') {
                value = 'hide';
            } else if (className === 'keyboard-confirm') {
                value = 'confirm';
            }
            var wrapCls = (0, _classnames2['default'])(prefixCls + '-item', className);
            return _react2['default'].createElement(
                _rmcFeedback2['default'],
                { activeClassName: prefixCls + '-item-active' },
                _react2['default'].createElement(
                    'td',
                    (0, _extends3['default'])({ ref: tdRef
                        // tslint:disable-next-line:jsx-no-multiline-js
                        , onClick: function onClick(e) {
                            _onClick(e, value);
                        }, className: wrapCls }, restProps),
                    children,
                    iconOnly && _react2['default'].createElement(
                        'i',
                        { className: 'sr-only' },
                        label
                    )
                )
            );
        }
    }]);
    return KeyboardItem;
}(_react2['default'].Component);

KeyboardItem.defaultProps = {
    prefixCls: 'am-number-keyboard',
    onClick: function onClick() {},
    disabled: false
};

var CustomKeyboard = function (_React$Component2) {
    (0, _inherits3['default'])(CustomKeyboard, _React$Component2);

    function CustomKeyboard() {
        (0, _classCallCheck3['default'])(this, CustomKeyboard);

        var _this2 = (0, _possibleConstructorReturn3['default'])(this, (CustomKeyboard.__proto__ || Object.getPrototypeOf(CustomKeyboard)).apply(this, arguments));

        _this2.onKeyboardClick = function (e, value) {
            e.nativeEvent.stopImmediatePropagation();
            if (value === 'confirm' && _this2.confirmDisabled) {
                return null;
            } else {
                if (_this2.linkedInput) {
                    _this2.linkedInput.onKeyboardClick(value);
                }
            }
        };
        _this2.renderKeyboardItem = function (item, index) {
            return _react2['default'].createElement(
                KeyboardItem,
                { onClick: _this2.onKeyboardClick, key: 'item-' + item + '-' + index },
                item
            );
        };
        return _this2;
    }

    (0, _createClass3['default'])(CustomKeyboard, [{
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props = this.props,
                prefixCls = _props.prefixCls,
                confirmLabel = _props.confirmLabel,
                backspaceLabel = _props.backspaceLabel,
                cancelKeyboardLabel = _props.cancelKeyboardLabel,
                wrapProps = _props.wrapProps;

            var wrapperCls = (0, _classnames2['default'])(prefixCls + '-wrapper', prefixCls + '-wrapper-hide');
            return _react2['default'].createElement(
                'div',
                (0, _extends3['default'])({ className: wrapperCls, ref: function ref(el) {
                        return _this3.antmKeyboard = el;
                    } }, wrapProps),
                _react2['default'].createElement(
                    'table',
                    null,
                    _react2['default'].createElement(
                        'tbody',
                        null,
                        _react2['default'].createElement(
                            'tr',
                            null,
                            ['1', '2', '3'].map(function (item, index) {
                                return (
                                    // tslint:disable-next-line:jsx-no-multiline-js
                                    _this3.renderKeyboardItem(item, index)
                                );
                            }),
                            _react2['default'].createElement(KeyboardItem, (0, _extends3['default'])({ className: 'keyboard-delete', rowSpan: 2, onClick: this.onKeyboardClick }, this.getAriaAttr(backspaceLabel)))
                        ),
                        _react2['default'].createElement(
                            'tr',
                            null,
                            ['4', '5', '6'].map(function (item, index) {
                                return (
                                    // tslint:disable-next-line:jsx-no-multiline-js
                                    _this3.renderKeyboardItem(item, index)
                                );
                            })
                        ),
                        _react2['default'].createElement(
                            'tr',
                            null,
                            ['7', '8', '9'].map(function (item, index) {
                                return (
                                    // tslint:disable-next-line:jsx-no-multiline-js
                                    _this3.renderKeyboardItem(item, index)
                                );
                            }),
                            _react2['default'].createElement(
                                KeyboardItem,
                                { className: 'keyboard-confirm', rowSpan: 2, onClick: this.onKeyboardClick, tdRef: function tdRef(el) {
                                        return _this3.confirmKeyboardItem = el;
                                    } },
                                confirmLabel
                            )
                        ),
                        _react2['default'].createElement(
                            'tr',
                            null,
                            ['.', '0'].map(function (item, index) {
                                return (
                                    // tslint:disable-next-line:jsx-no-multiline-js
                                    _this3.renderKeyboardItem(item, index)
                                );
                            }),
                            _react2['default'].createElement(KeyboardItem, (0, _extends3['default'])({ className: 'keyboard-hide', onClick: this.onKeyboardClick }, this.getAriaAttr(cancelKeyboardLabel)))
                        )
                    )
                )
            );
        }
    }, {
        key: 'getAriaAttr',
        value: function getAriaAttr(label) {
            if (_exenv.IS_IOS) {
                return { label: label, iconOnly: true };
            } else {
                return { role: 'button', 'aria-label': label };
            }
        }
    }]);
    return CustomKeyboard;
}(_react2['default'].Component);

CustomKeyboard.defaultProps = {
    prefixCls: 'am-number-keyboard'
};
exports['default'] = CustomKeyboard;