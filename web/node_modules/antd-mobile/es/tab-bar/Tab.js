import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import Badge from '../badge';

var Tab = function (_React$PureComponent) {
    _inherits(Tab, _React$PureComponent);

    function Tab() {
        _classCallCheck(this, Tab);

        var _this = _possibleConstructorReturn(this, (Tab.__proto__ || Object.getPrototypeOf(Tab)).apply(this, arguments));

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
            var iconDom = React.isValidElement(iconRes) ? iconRes : React.createElement('img', { className: prefixCls + '-image', src: iconRes ? iconRes.uri : iconRes, alt: title });
            if (badge) {
                return React.createElement(
                    Badge,
                    { text: badge, className: prefixCls + '-badge tab-badge' },
                    ' ',
                    iconDom,
                    ' '
                );
            }
            if (dot) {
                return React.createElement(
                    Badge,
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

    _createClass(Tab, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                title = _props.title,
                prefixCls = _props.prefixCls,
                selected = _props.selected,
                unselectedTintColor = _props.unselectedTintColor,
                tintColor = _props.tintColor;

            var iconColor = selected ? tintColor : unselectedTintColor;
            return React.createElement(
                'div',
                _extends({}, this.props.dataAttrs, { onClick: this.onClick, className: '' + prefixCls }),
                React.createElement(
                    'div',
                    { className: prefixCls + '-icon', style: { color: iconColor } },
                    this.renderIcon()
                ),
                React.createElement(
                    'p',
                    { className: prefixCls + '-title', style: { color: selected ? tintColor : unselectedTintColor } },
                    title
                )
            );
        }
    }]);

    return Tab;
}(React.PureComponent);

export default Tab;