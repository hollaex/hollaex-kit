'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ModalComponent = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classnames3 = require('classnames');

var _classnames4 = _interopRequireDefault(_classnames3);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rmcDialog = require('rmc-dialog');

var _rmcDialog2 = _interopRequireDefault(_rmcDialog);

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

var ModalComponent = exports.ModalComponent = function (_React$Component) {
    (0, _inherits3['default'])(ModalComponent, _React$Component);

    function ModalComponent() {
        (0, _classCallCheck3['default'])(this, ModalComponent);
        return (0, _possibleConstructorReturn3['default'])(this, (ModalComponent.__proto__ || Object.getPrototypeOf(ModalComponent)).apply(this, arguments));
    }

    return ModalComponent;
}(_react2['default'].Component);

var Modal = function (_ModalComponent) {
    (0, _inherits3['default'])(Modal, _ModalComponent);

    function Modal() {
        (0, _classCallCheck3['default'])(this, Modal);
        return (0, _possibleConstructorReturn3['default'])(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Modal, [{
        key: 'renderFooterButton',
        value: function renderFooterButton(button, prefixCls, i) {
            var buttonStyle = {};
            if (button.style) {
                buttonStyle = button.style;
                if (typeof buttonStyle === 'string') {
                    var styleMap = {
                        cancel: {},
                        'default': {},
                        destructive: { color: 'red' }
                    };
                    buttonStyle = styleMap[buttonStyle] || {};
                }
            }
            var onClickFn = function onClickFn(e) {
                e.preventDefault();
                if (button.onPress) {
                    button.onPress();
                }
            };
            return _react2['default'].createElement(
                _rmcFeedback2['default'],
                { activeClassName: prefixCls + '-button-active', key: i },
                _react2['default'].createElement(
                    'a',
                    { className: prefixCls + '-button', role: 'button', style: buttonStyle, onClick: onClickFn },
                    button.text || 'Button'
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this,
                _classnames2;

            var _a = this.props,
                prefixCls = _a.prefixCls,
                className = _a.className,
                wrapClassName = _a.wrapClassName,
                transitionName = _a.transitionName,
                maskTransitionName = _a.maskTransitionName,
                style = _a.style,
                platform = _a.platform,
                _a$footer = _a.footer,
                footer = _a$footer === undefined ? [] : _a$footer,
                operation = _a.operation,
                animated = _a.animated,
                transparent = _a.transparent,
                popup = _a.popup,
                animationType = _a.animationType,
                restProps = __rest(_a, ["prefixCls", "className", "wrapClassName", "transitionName", "maskTransitionName", "style", "platform", "footer", "operation", "animated", "transparent", "popup", "animationType"]);
            var btnGroupClass = (0, _classnames4['default'])(prefixCls + '-button-group-' + (footer.length === 2 && !operation ? 'h' : 'v'), prefixCls + '-button-group-' + (operation ? 'operation' : 'normal'));
            var footerDom = footer.length ? _react2['default'].createElement(
                'div',
                { className: btnGroupClass, role: 'group' },
                footer.map(function (button, i) {
                    return (
                        // tslint:disable-next-line:jsx-no-multiline-js
                        _this3.renderFooterButton(button, prefixCls, i)
                    );
                })
            ) : null;
            var transName = void 0;
            var maskTransName = void 0;
            if (animated) {
                // tslint:disable-next-line:prefer-conditional-expression
                if (transparent) {
                    transName = maskTransName = 'am-fade';
                } else {
                    transName = maskTransName = 'am-slide-up';
                }
                if (popup) {
                    transName = animationType === 'slide-up' ? 'am-slide-up' : 'am-slide-down';
                    maskTransName = 'am-fade';
                }
            }
            var wrapCls = (0, _classnames4['default'])(wrapClassName, (0, _defineProperty3['default'])({}, prefixCls + '-wrap-popup', popup));
            var cls = (0, _classnames4['default'])(className, (_classnames2 = {}, (0, _defineProperty3['default'])(_classnames2, prefixCls + '-transparent', transparent), (0, _defineProperty3['default'])(_classnames2, prefixCls + '-popup', popup), (0, _defineProperty3['default'])(_classnames2, prefixCls + '-popup-' + animationType, popup && animationType), (0, _defineProperty3['default'])(_classnames2, prefixCls + '-android', platform === 'android'), _classnames2));
            return _react2['default'].createElement(_rmcDialog2['default'], (0, _extends3['default'])({}, restProps, { prefixCls: prefixCls, className: cls, wrapClassName: wrapCls, transitionName: transitionName || transName, maskTransitionName: maskTransitionName || maskTransName, style: style, footer: footerDom }));
        }
    }]);
    return Modal;
}(ModalComponent);

exports['default'] = Modal;

Modal.defaultProps = {
    prefixCls: 'am-modal',
    transparent: false,
    popup: false,
    animationType: 'slide-down',
    animated: true,
    style: {},
    onShow: function onShow() {},

    footer: [],
    closable: false,
    operation: false,
    platform: 'ios'
};