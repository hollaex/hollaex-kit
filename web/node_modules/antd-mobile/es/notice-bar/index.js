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
import classnames from 'classnames';
import React from 'react';
import Icon from '../icon';
import Marquee from './Marquee';

var NoticeBar = function (_React$Component) {
    _inherits(NoticeBar, _React$Component);

    function NoticeBar(props) {
        _classCallCheck(this, NoticeBar);

        var _this = _possibleConstructorReturn(this, (NoticeBar.__proto__ || Object.getPrototypeOf(NoticeBar)).call(this, props));

        _this.onClick = function () {
            var _this$props = _this.props,
                mode = _this$props.mode,
                onClick = _this$props.onClick;

            if (onClick) {
                onClick();
            }
            if (mode === 'closable') {
                _this.setState({
                    show: false
                });
            }
        };
        _this.state = {
            show: true
        };
        return _this;
    }

    _createClass(NoticeBar, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                mode = _a.mode,
                icon = _a.icon,
                onClick = _a.onClick,
                children = _a.children,
                className = _a.className,
                prefixCls = _a.prefixCls,
                action = _a.action,
                marqueeProps = _a.marqueeProps,
                restProps = __rest(_a, ["mode", "icon", "onClick", "children", "className", "prefixCls", "action", "marqueeProps"]);
            var extraProps = {};
            var operationDom = null;
            if (mode === 'closable') {
                operationDom = React.createElement(
                    'div',
                    { className: prefixCls + '-operation', onClick: this.onClick, role: 'button', 'aria-label': 'close' },
                    action ? action : React.createElement(Icon, { type: 'cross', size: 'md' })
                );
            } else {
                if (mode === 'link') {
                    operationDom = React.createElement(
                        'div',
                        { className: prefixCls + '-operation', role: 'button', 'aria-label': 'go to detail' },
                        action ? action : React.createElement(Icon, { type: 'right', size: 'md' })
                    );
                }
                extraProps.onClick = onClick;
            }
            var wrapCls = classnames(prefixCls, className);
            return this.state.show ? React.createElement(
                'div',
                _extends({ className: wrapCls }, restProps, extraProps, { role: 'alert' }),
                icon &&
                // tslint:disable-next-line:jsx-no-multiline-js
                React.createElement(
                    'div',
                    { className: prefixCls + '-icon', 'aria-hidden': 'true' },
                    icon
                ),
                React.createElement(
                    'div',
                    { className: prefixCls + '-content' },
                    React.createElement(Marquee, _extends({ prefixCls: prefixCls, text: children }, marqueeProps))
                ),
                operationDom
            ) : null;
        }
    }]);

    return NoticeBar;
}(React.Component);

export default NoticeBar;

NoticeBar.defaultProps = {
    prefixCls: 'am-notice-bar',
    mode: '',
    icon: React.createElement(Icon, { type: 'voice', size: 'xxs' }),
    onClick: function onClick() {}
};