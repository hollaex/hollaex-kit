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

var _badge = require('../badge');

var _badge2 = _interopRequireDefault(_badge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Tab = function (_React$PureComponent) {
    (0, _inherits3['default'])(Tab, _React$PureComponent);

    function Tab() {
        (0, _classCallCheck3['default'])(this, Tab);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Tab.__proto__ || Object.getPrototypeOf(Tab)).apply(this, arguments));

        _this.renderIcon = function () {
            var _this$props = _this.props,
                dot = _this$props.dot,
                badge = _this$props.badge,
                selected = _this$props.selected,
                selectedIcon = _this$props.selectedIcon,
                icon = _this$props.icon,
                title = _this$props.title,
                prefixCls = _this$props.prefixCls;

            var iconRes = selected ? selectedIcon : icon;
            var iconDom = _react2['default'].isValidElement(iconRes) ? iconRes : _react2['default'].createElement('img', { className: prefixCls + '-image', src: iconRes ? iconRes.uri : iconRes, alt: title });
            if (badge) {
                return _react2['default'].createElement(
                    _badge2['default'],
                    { text: badge, className: prefixCls + '-badge tab-badge' },
                    ' ',
                    iconDom,
                    ' '
                );
            }
            if (dot) {
                return _react2['default'].createElement(
                    _badge2['default'],
                    { dot: true, className: prefixCls + '-badge tab-dot' },
                    iconDom
                );
            }
            return iconDom;
        };
        _this.onClick = function () {
            var onClick = _this.props.onClick;
            if (onClick) {
                onClick();
            }
        };
        return _this;
    }

    (0, _createClass3['default'])(Tab, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                title = _props.title,
                prefixCls = _props.prefixCls,
                selected = _props.selected,
                unselectedTintColor = _props.unselectedTintColor,
                tintColor = _props.tintColor;

            var iconColor = selected ? tintColor : unselectedTintColor;
            return _react2['default'].createElement(
                'div',
                (0, _extends3['default'])({}, this.props.dataAttrs, { onClick: this.onClick, className: '' + prefixCls }),
                _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-icon', style: { color: iconColor } },
                    this.renderIcon()
                ),
                _react2['default'].createElement(
                    'p',
                    { className: prefixCls + '-title', style: { color: selected ? tintColor : unselectedTintColor } },
                    title
                )
            );
        }
    }]);
    return Tab;
}(_react2['default'].PureComponent);

exports['default'] = Tab;
module.exports = exports['default'];