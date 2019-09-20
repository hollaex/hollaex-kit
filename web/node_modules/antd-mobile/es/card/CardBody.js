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

var CardBody = function (_React$Component) {
    _inherits(CardBody, _React$Component);

    function CardBody() {
        _classCallCheck(this, CardBody);

        return _possibleConstructorReturn(this, (CardBody.__proto__ || Object.getPrototypeOf(CardBody)).apply(this, arguments));
    }

    _createClass(CardBody, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                prefixCls = _a.prefixCls,
                className = _a.className,
                restProps = __rest(_a, ["prefixCls", "className"]);
            var wrapCls = classnames(prefixCls + '-body', className);
            return React.createElement('div', _extends({ className: wrapCls }, restProps));
        }
    }]);

    return CardBody;
}(React.Component);

export default CardBody;

CardBody.defaultProps = {
    prefixCls: 'am-card'
};