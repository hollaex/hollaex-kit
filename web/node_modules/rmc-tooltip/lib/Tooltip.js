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

var _rmcTrigger = require('rmc-trigger');

var _rmcTrigger2 = _interopRequireDefault(_rmcTrigger);

var _placements = require('./placements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var Tooltip = function (_Component) {
    (0, _inherits3['default'])(Tooltip, _Component);

    function Tooltip() {
        (0, _classCallCheck3['default'])(this, Tooltip);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).apply(this, arguments));

        _this.getPopupElement = function () {
            var _this$props = _this.props,
                arrowContent = _this$props.arrowContent,
                overlay = _this$props.overlay,
                prefixCls = _this$props.prefixCls;

            return [_react2['default'].createElement(
                'div',
                { className: prefixCls + '-arrow', key: 'arrow' },
                arrowContent
            ), _react2['default'].createElement(
                'div',
                { className: prefixCls + '-inner', key: 'content' },
                typeof overlay === 'function' ? overlay() : overlay
            )];
        };
        _this.saveTrigger = function (node) {
            _this.trigger = node;
        };
        return _this;
    }

    (0, _createClass3['default'])(Tooltip, [{
        key: 'getPopupDomNode',
        value: function getPopupDomNode() {
            return this.trigger.triggerRef.getPopupDomNode();
        }
    }, {
        key: 'render',
        value: function render() {
            var _a = this.props,
                overlayClassName = _a.overlayClassName,
                overlayStyle = _a.overlayStyle,
                prefixCls = _a.prefixCls,
                children = _a.children,
                onVisibleChange = _a.onVisibleChange,
                afterVisibleChange = _a.afterVisibleChange,
                transitionName = _a.transitionName,
                animation = _a.animation,
                placement = _a.placement,
                align = _a.align,
                destroyTooltipOnHide = _a.destroyTooltipOnHide,
                defaultVisible = _a.defaultVisible,
                getTooltipContainer = _a.getTooltipContainer,
                restProps = __rest(_a, ["overlayClassName", "overlayStyle", "prefixCls", "children", "onVisibleChange", "afterVisibleChange", "transitionName", "animation", "placement", "align", "destroyTooltipOnHide", "defaultVisible", "getTooltipContainer"]);
            var extraProps = (0, _extends3['default'])({}, restProps);
            if ('visible' in this.props) {
                extraProps.popupVisible = this.props.visible;
            }
            return _react2['default'].createElement(
                _rmcTrigger2['default'],
                (0, _extends3['default'])({ popupClassName: overlayClassName, ref: this.saveTrigger, prefixCls: prefixCls, popup: this.getPopupElement, builtinPlacements: _placements.placements, popupPlacement: placement, popupAlign: align, getPopupContainer: getTooltipContainer, onPopupVisibleChange: onVisibleChange, afterPopupVisibleChange: afterVisibleChange, popupTransitionName: transitionName, popupAnimation: animation, defaultPopupVisible: defaultVisible, destroyPopupOnHide: destroyTooltipOnHide, popupStyle: overlayStyle }, extraProps),
                children
            );
        }
    }]);
    return Tooltip;
}(_react.Component);

Tooltip.defaultProps = {
    prefixCls: 'rmc-tooltip',
    destroyTooltipOnHide: false,
    align: {},
    placement: 'right',
    arrowContent: null
};
exports['default'] = Tooltip;
module.exports = exports['default'];