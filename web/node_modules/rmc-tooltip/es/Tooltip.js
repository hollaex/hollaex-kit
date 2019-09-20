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
import React, { Component } from 'react';
import Trigger from 'rmc-trigger';
import { placements } from './placements';

var Tooltip = function (_Component) {
    _inherits(Tooltip, _Component);

    function Tooltip() {
        _classCallCheck(this, Tooltip);

        var _this = _possibleConstructorReturn(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).apply(this, arguments));

        _this.getPopupElement = function () {
            var _this$props = _this.props,
                arrowContent = _this$props.arrowContent,
                overlay = _this$props.overlay,
                prefixCls = _this$props.prefixCls;

            return [React.createElement(
                'div',
                { className: prefixCls + '-arrow', key: 'arrow' },
                arrowContent
            ), React.createElement(
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

    _createClass(Tooltip, [{
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
            var extraProps = _extends({}, restProps);
            if ('visible' in this.props) {
                extraProps.popupVisible = this.props.visible;
            }
            return React.createElement(
                Trigger,
                _extends({ popupClassName: overlayClassName, ref: this.saveTrigger, prefixCls: prefixCls, popup: this.getPopupElement, builtinPlacements: placements, popupPlacement: placement, popupAlign: align, getPopupContainer: getTooltipContainer, onPopupVisibleChange: onVisibleChange, afterPopupVisibleChange: afterVisibleChange, popupTransitionName: transitionName, popupAnimation: animation, defaultPopupVisible: defaultVisible, destroyPopupOnHide: destroyTooltipOnHide, popupStyle: overlayStyle }, extraProps),
                children
            );
        }
    }]);

    return Tooltip;
}(Component);

Tooltip.defaultProps = {
    prefixCls: 'rmc-tooltip',
    destroyTooltipOnHide: false,
    align: {},
    placement: 'right',
    arrowContent: null
};
export default Tooltip;