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

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CardBody = require('./CardBody');

var _CardBody2 = _interopRequireDefault(_CardBody);

var _CardFooter = require('./CardFooter');

var _CardFooter2 = _interopRequireDefault(_CardFooter);

var _CardHeader = require('./CardHeader');

var _CardHeader2 = _interopRequireDefault(_CardHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var Card = function (_React$Component) {
    (0, _inherits3['default'])(Card, _React$Component);

    function Card() {
        (0, _classCallCheck3['default'])(this, Card);
        return (0, _possibleConstructorReturn3['default'])(this, (Card.__proto__ || Object.getPrototypeOf(Card)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Card, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                prefixCls = _a.prefixCls,
                full = _a.full,
                className = _a.className,
                resetProps = __rest(_a, ["prefixCls", "full", "className"]);
            var wrapCls = (0, _classnames3['default'])(prefixCls, className, (0, _defineProperty3['default'])({}, prefixCls + '-full', full));
            return _react2['default'].createElement('div', (0, _extends3['default'])({ className: wrapCls }, resetProps));
        }
    }]);
    return Card;
}(_react2['default'].Component);

exports['default'] = Card;

Card.defaultProps = {
    prefixCls: 'am-card',
    full: false
};
Card.Header = _CardHeader2['default'];
Card.Body = _CardBody2['default'];
Card.Footer = _CardFooter2['default'];
module.exports = exports['default'];