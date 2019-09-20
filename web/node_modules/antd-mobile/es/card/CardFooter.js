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

var CardFooter = function (_React$Component) {
    _inherits(CardFooter, _React$Component);

    function CardFooter() {
        _classCallCheck(this, CardFooter);

        return _possibleConstructorReturn(this, (CardFooter.__proto__ || Object.getPrototypeOf(CardFooter)).apply(this, arguments));
    }

    _createClass(CardFooter, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                prefixCls = _a.prefixCls,
                content = _a.content,
                className = _a.className,
                extra = _a.extra,
                restProps = __rest(_a, ["prefixCls", "content", "className", "extra"]);
            var wrapCls = classnames(prefixCls + '-footer', className);
            return React.createElement(
                'div',
                _extends({ className: wrapCls }, restProps),
                React.createElement(
                    'div',
                    { className: prefixCls + '-footer-content' },
                    content
                ),
                extra && React.createElement(
                    'div',
                    { className: prefixCls + '-footer-extra' },
                    extra
                )
            );
        }
    }]);

    return CardFooter;
}(React.Component);

export default CardFooter;

CardFooter.defaultProps = {
    prefixCls: 'am-card'
};