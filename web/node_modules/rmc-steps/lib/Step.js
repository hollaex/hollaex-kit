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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

function isString(str) {
    return typeof str === 'string';
}

var Step = function (_React$Component) {
    (0, _inherits3['default'])(Step, _React$Component);

    function Step() {
        (0, _classCallCheck3['default'])(this, Step);
        return (0, _possibleConstructorReturn3['default'])(this, (Step.__proto__ || Object.getPrototypeOf(Step)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Step, [{
        key: 'renderIconNode',
        value: function renderIconNode() {
            var _classNames;

            var _props = this.props,
                prefixCls = _props.prefixCls,
                progressDot = _props.progressDot,
                stepNumber = _props.stepNumber,
                status = _props.status,
                title = _props.title,
                description = _props.description,
                icon = _props.icon,
                iconPrefix = _props.iconPrefix;

            var iconNode = void 0;
            var iconClassName = (0, _classnames2['default'])(prefixCls + '-icon', iconPrefix + 'icon', (_classNames = {}, (0, _defineProperty3['default'])(_classNames, iconPrefix + 'icon-' + icon, icon && isString(icon)), (0, _defineProperty3['default'])(_classNames, iconPrefix + 'icon-check', !icon && status === 'finish'), (0, _defineProperty3['default'])(_classNames, iconPrefix + 'icon-cross', !icon && status === 'error'), _classNames));
            var iconDot = _react2['default'].createElement('span', { className: prefixCls + '-icon-dot' });
            // `progressDot` enjoy the highest priority
            if (progressDot) {
                if (typeof progressDot === 'function') {
                    iconNode = _react2['default'].createElement(
                        'span',
                        { className: prefixCls + '-icon' },
                        progressDot(iconDot, { index: stepNumber - 1, status: status, title: title, description: description })
                    );
                } else {
                    iconNode = _react2['default'].createElement(
                        'span',
                        { className: prefixCls + '-icon' },
                        iconDot
                    );
                }
            } else if (icon && !isString(icon)) {
                iconNode = _react2['default'].createElement(
                    'span',
                    { className: prefixCls + '-icon' },
                    icon
                );
            } else if (icon || status === 'finish' || status === 'error') {
                iconNode = _react2['default'].createElement('span', { className: iconClassName });
            } else {
                iconNode = _react2['default'].createElement(
                    'span',
                    { className: prefixCls + '-icon' },
                    stepNumber
                );
            }
            return iconNode;
        }
    }, {
        key: 'render',
        value: function render() {
            var _a = this.props,
                className = _a.className,
                prefixCls = _a.prefixCls,
                style = _a.style,
                itemWidth = _a.itemWidth,
                _a$status = _a.status,
                status = _a$status === undefined ? 'wait' : _a$status,
                iconPrefix = _a.iconPrefix,
                icon = _a.icon,
                wrapperStyle = _a.wrapperStyle,
                adjustMarginRight = _a.adjustMarginRight,
                stepNumber = _a.stepNumber,
                description = _a.description,
                title = _a.title,
                progressDot = _a.progressDot,
                restProps = __rest(_a, ["className", "prefixCls", "style", "itemWidth", "status", "iconPrefix", "icon", "wrapperStyle", "adjustMarginRight", "stepNumber", "description", "title", "progressDot"]);
            var classString = (0, _classnames2['default'])(prefixCls + '-item', prefixCls + '-item-' + status, className, (0, _defineProperty3['default'])({}, prefixCls + '-item-custom', icon));
            var stepItemStyle = (0, _extends3['default'])({}, style);
            if (itemWidth) {
                stepItemStyle.width = itemWidth;
            }
            if (adjustMarginRight) {
                stepItemStyle.marginRight = adjustMarginRight;
            }
            return _react2['default'].createElement(
                'div',
                (0, _extends3['default'])({}, restProps, { className: classString, style: stepItemStyle }),
                _react2['default'].createElement('div', { className: prefixCls + '-item-tail' }),
                _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-item-icon' },
                    this.renderIconNode()
                ),
                _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-item-content' },
                    _react2['default'].createElement(
                        'div',
                        { className: prefixCls + '-item-title' },
                        title
                    ),
                    description && _react2['default'].createElement(
                        'div',
                        { className: prefixCls + '-item-description' },
                        description
                    )
                )
            );
        }
    }]);
    return Step;
}(_react2['default'].Component);

exports['default'] = Step;
module.exports = exports['default'];