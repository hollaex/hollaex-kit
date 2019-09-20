import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
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
import CardBody from './CardBody';
import CardFooter from './CardFooter';
import CardHeader from './CardHeader';

var Card = function (_React$Component) {
    _inherits(Card, _React$Component);

    function Card() {
        _classCallCheck(this, Card);

        return _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).apply(this, arguments));
    }

    _createClass(Card, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                prefixCls = _a.prefixCls,
                full = _a.full,
                className = _a.className,
                resetProps = __rest(_a, ["prefixCls", "full", "className"]);
            var wrapCls = classnames(prefixCls, className, _defineProperty({}, prefixCls + '-full', full));
            return React.createElement('div', _extends({ className: wrapCls }, resetProps));
        }
    }]);

    return Card;
}(React.Component);

export default Card;

Card.defaultProps = {
    prefixCls: 'am-card',
    full: false
};
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;