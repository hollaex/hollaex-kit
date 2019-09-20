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

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _LazyRenderBox = require('./LazyRenderBox');

var _LazyRenderBox2 = _interopRequireDefault(_LazyRenderBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

var Dialog = function (_React$Component) {
    (0, _inherits3['default'])(Dialog, _React$Component);

    function Dialog() {
        (0, _classCallCheck3['default'])(this, Dialog);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).apply(this, arguments));

        _this.getDialogElement = function () {
            var props = _this.props;
            var closable = props.closable;
            var prefixCls = props.prefixCls;
            var footer = void 0;
            if (props.footer) {
                footer = _react2['default'].createElement("div", { className: prefixCls + '-footer', ref: function ref(el) {
                        return _this.footerRef = el;
                    } }, props.footer);
            }
            var header = void 0;
            if (props.title) {
                header = _react2['default'].createElement("div", { className: prefixCls + '-header', ref: function ref(el) {
                        return _this.headerRef = el;
                    } }, _react2['default'].createElement("div", { className: prefixCls + '-title' }, props.title));
            }
            var closer = void 0;
            if (closable) {
                closer = _react2['default'].createElement("button", { onClick: _this.close, "aria-label": "Close", className: prefixCls + '-close' }, _react2['default'].createElement("span", { className: prefixCls + '-close-x' }));
            }
            var transitionName = _this.getTransitionName();
            var dialogElement = _react2['default'].createElement(_LazyRenderBox2['default'], { key: "dialog-element", role: "document", ref: function ref(el) {
                    return _this.dialogRef = el;
                }, style: props.style || {}, className: prefixCls + ' ' + (props.className || ''), visible: props.visible }, _react2['default'].createElement("div", { className: prefixCls + '-content' }, closer, header, _react2['default'].createElement("div", { className: prefixCls + '-body', style: props.bodyStyle, ref: function ref(el) {
                    return _this.bodyRef = el;
                } }, props.children), footer));
            return _react2['default'].createElement(_rcAnimate2['default'], { key: "dialog", showProp: "visible", onAppear: _this.onAnimateAppear, onLeave: _this.onAnimateLeave, transitionName: transitionName, component: "", transitionAppear: true }, dialogElement);
        };
        _this.onAnimateAppear = function () {
            document.body.style.overflow = 'hidden';
        };
        _this.onAnimateLeave = function () {
            document.body.style.overflow = '';
            if (_this.wrapRef) {
                _this.wrapRef.style.display = 'none';
            }
            if (_this.props.onAnimateLeave) {
                _this.props.onAnimateLeave();
            }
            if (_this.props.afterClose) {
                _this.props.afterClose();
            }
        };
        _this.close = function (e) {
            if (_this.props.onClose) {
                _this.props.onClose(e);
            }
        };
        _this.onMaskClick = function (e) {
            if (e.target === e.currentTarget) {
                _this.close(e);
            }
        };
        return _this;
    }

    (0, _createClass3['default'])(Dialog, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // fix: react@16 no dismissing animation
            document.body.style.overflow = '';
            if (this.wrapRef) {
                this.wrapRef.style.display = 'none';
            }
        }
    }, {
        key: 'getZIndexStyle',
        value: function getZIndexStyle() {
            var style = {};
            var props = this.props;
            if (props.zIndex !== undefined) {
                style.zIndex = props.zIndex;
            }
            return style;
        }
    }, {
        key: 'getWrapStyle',
        value: function getWrapStyle() {
            var wrapStyle = this.props.wrapStyle || {};
            return (0, _extends3['default'])({}, this.getZIndexStyle(), wrapStyle);
        }
    }, {
        key: 'getMaskStyle',
        value: function getMaskStyle() {
            var maskStyle = this.props.maskStyle || {};
            return (0, _extends3['default'])({}, this.getZIndexStyle(), maskStyle);
        }
    }, {
        key: 'getMaskTransitionName',
        value: function getMaskTransitionName() {
            var props = this.props;
            var transitionName = props.maskTransitionName;
            var animation = props.maskAnimation;
            if (!transitionName && animation) {
                transitionName = props.prefixCls + '-' + animation;
            }
            return transitionName;
        }
    }, {
        key: 'getTransitionName',
        value: function getTransitionName() {
            var props = this.props;
            var transitionName = props.transitionName;
            var animation = props.animation;
            if (!transitionName && animation) {
                transitionName = props.prefixCls + '-' + animation;
            }
            return transitionName;
        }
    }, {
        key: 'getMaskElement',
        value: function getMaskElement() {
            var props = this.props;
            var maskElement = void 0;
            if (props.mask) {
                var maskTransition = this.getMaskTransitionName();
                maskElement = _react2['default'].createElement(_LazyRenderBox2['default'], (0, _extends3['default'])({ style: this.getMaskStyle(), key: "mask-element", className: props.prefixCls + '-mask', hiddenClassName: props.prefixCls + '-mask-hidden', visible: props.visible }, props.maskProps));
                if (maskTransition) {
                    maskElement = _react2['default'].createElement(_rcAnimate2['default'], { key: "mask", showProp: "visible", transitionAppear: true, component: "", transitionName: maskTransition }, maskElement);
                }
            }
            return maskElement;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var props = this.props;
            var prefixCls = props.prefixCls,
                maskClosable = props.maskClosable;

            var style = this.getWrapStyle();
            if (props.visible) {
                style.display = null;
            }
            return _react2['default'].createElement("div", null, this.getMaskElement(), _react2['default'].createElement("div", (0, _extends3['default'])({ className: prefixCls + '-wrap ' + (props.wrapClassName || ''), ref: function ref(el) {
                    return _this2.wrapRef = el;
                }, onClick: maskClosable ? this.onMaskClick : undefined, role: "dialog", "aria-labelledby": props.title, style: style }, props.wrapProps), this.getDialogElement()));
        }
    }]);
    return Dialog;
}(_react2['default'].Component);

exports['default'] = Dialog;

Dialog.defaultProps = {
    afterClose: noop,
    className: '',
    mask: true,
    visible: false,
    closable: true,
    maskClosable: true,
    prefixCls: 'rmc-dialog',
    onClose: noop
};
module.exports = exports['default'];